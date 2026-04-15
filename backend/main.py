"""
FastAPI Main Application
Password Strength Analyzer — AI-Powered Backend
"""

import time
import threading
from collections import defaultdict
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator

from auth import register_user, login_user, logout_token, get_current_user
from model import predict, load_model

# ── Lifespan (startup/shutdown) ───────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        load_model()
        print("[✓] ML model pre-loaded successfully.")
    except FileNotFoundError:
        print("[!] WARNING: Model file not found. Run train_model.py first.")
    yield

# ── App Init ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Password Strength Analyzer API",
    description="AI/ML-powered password strength evaluation with JWT auth",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Rate Limiter ──────────────────────────────────────────────────────────────
_rate_store: dict = defaultdict(list)
_rate_lock = threading.Lock()

RATE_LIMIT = 30         # requests
RATE_WINDOW = 60        # seconds


def rate_limit(request: Request):
    ip = request.client.host
    now = time.time()
    with _rate_lock:
        timestamps = _rate_store[ip]
        _rate_store[ip] = [t for t in timestamps if now - t < RATE_WINDOW]
        if len(_rate_store[ip]) >= RATE_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Max {RATE_LIMIT} requests per {RATE_WINDOW}s."
            )
        _rate_store[ip].append(now)


# ── Pydantic Schemas ──────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v):
        v = v.strip()
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters.")
        if len(v) > 50:
            raise ValueError("Username must be under 50 characters.")
        return v

    @field_validator("password")
    @classmethod
    def password_valid(cls, v):
        if len(v) < 6:
            raise ValueError("Account password must be at least 6 characters.")
        return v


class LoginRequest(BaseModel):
    username: str
    password: str


class AnalyzeRequest(BaseModel):
    password: str

    @field_validator("password")
    @classmethod
    def password_not_empty(cls, v):
        if not v:
            raise ValueError("Password cannot be empty.")
        if len(v) > 512:
            raise ValueError("Password too long (max 512 chars).")
        return v


# ── Auth Endpoints ────────────────────────────────────────────────────────────

@app.post("/api/auth/register", summary="Register a new user")
def register(body: RegisterRequest, request: Request, _: None = Depends(rate_limit)):
    success = register_user(body.username, body.password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken."
        )
    return {"message": "Account created successfully. Please log in."}


@app.post("/api/auth/login", summary="Login and receive JWT")
def login(body: LoginRequest, request: Request, _: None = Depends(rate_limit)):
    token = login_user(body.username, body.password)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password."
        )
    return {"access_token": token, "token_type": "bearer"}


@app.post("/api/auth/logout", summary="Invalidate current token")
def logout(request: Request, current_user: str = Depends(get_current_user)):
    # Extract raw token from Authorization header
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "").strip()
    logout_token(token)
    return {"message": "Logged out successfully."}


@app.get("/api/auth/me", summary="Get current user info")
def me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}


# ── Password Analysis Endpoint ────────────────────────────────────────────────

@app.post("/api/analyze", summary="Analyze password strength via ML")
def analyze_password(
    body: AnalyzeRequest,
    request: Request,
    current_user: str = Depends(get_current_user),
    _: None = Depends(rate_limit),
):
    try:
        result = predict(body.password)
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML model is not loaded. Contact the administrator."
        )
    return {
        "score": result["score"],
        "strength": result["strength"],
        "confidence": result["confidence"],
        "suggestions": result["suggestions"],
        "class_probabilities": result["class_probabilities"],
        "features": result["features"],
        "analyzed_by": current_user,
    }


# ── Public Health Check ───────────────────────────────────────────────────────

@app.get("/api/health", summary="Health check")
def health():
    try:
        load_model()
        model_status = "ready"
    except Exception:
        model_status = "not loaded"
    return {"status": "ok", "model": model_status}


# ── Error Handlers ────────────────────────────────────────────────────────────

@app.exception_handler(422)
async def validation_exception_handler(request: Request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": str(exc)},
    )
