"""
JWT Authentication Module
Handles user registration, login, token creation, and verification.
"""

import os
import time
import hashlib
import hmac
import json
import base64
from typing import Optional, Dict
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# ── Config ───────────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get("JWT_SECRET", "PSA-super-secret-key-change-in-production-32bytes")
ALGORITHM = "HS256"
TOKEN_EXPIRY_SECONDS = 3600  # 1 hour

# In-memory user store (production: use a real DB)
_users: Dict[str, str] = {}  # username → hashed_password

# Invalidated / logged-out tokens
_blacklist: set = set()

security = HTTPBearer()


# ── Helpers ───────────────────────────────────────────────────────────────────

def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _b64url_decode(s: str) -> bytes:
    padding = 4 - len(s) % 4
    return base64.urlsafe_b64decode(s + "=" * padding)


def _hash_password(password: str) -> str:
    """SHA-256 password hash with a constant-time comparison."""
    return hashlib.sha256(password.encode()).hexdigest()


# ── JWT ───────────────────────────────────────────────────────────────────────

def _create_jwt(payload: dict) -> str:
    header = _b64url_encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    body = _b64url_encode(json.dumps(payload).encode())
    signature_data = f"{header}.{body}".encode()
    sig = hmac.new(SECRET_KEY.encode(), signature_data, hashlib.sha256).digest()
    return f"{header}.{body}.{_b64url_encode(sig)}"


def _decode_jwt(token: str) -> Optional[dict]:
    """Returns payload dict or None if invalid/expired."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header, body, sig = parts
        expected_sig_data = f"{header}.{body}".encode()
        expected_sig = hmac.new(SECRET_KEY.encode(), expected_sig_data, hashlib.sha256).digest()
        received_sig = _b64url_decode(sig)
        if not hmac.compare_digest(expected_sig, received_sig):
            return None
        payload = json.loads(_b64url_decode(body))
        if payload.get("exp", 0) < time.time():
            return None  # expired
        return payload
    except Exception:
        return None


# ── Public API ────────────────────────────────────────────────────────────────

def register_user(username: str, password: str) -> bool:
    """Returns True on success, False if username already taken."""
    if username in _users:
        return False
    _users[username] = _hash_password(password)
    return True


def login_user(username: str, password: str) -> Optional[str]:
    """Returns JWT token on success, None on failure."""
    stored = _users.get(username)
    if not stored:
        return None
    if not hmac.compare_digest(stored, _hash_password(password)):
        return None
    payload = {
        "sub": username,
        "iat": int(time.time()),
        "exp": int(time.time()) + TOKEN_EXPIRY_SECONDS,
    }
    return _create_jwt(payload)


def logout_token(token: str):
    """Add token to blacklist so it can't be reused."""
    _blacklist.add(token)


def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """FastAPI dependency: validate Bearer token and return username."""
    token = credentials.credentials
    if token in _blacklist:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been invalidated. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = _decode_jwt(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload["sub"]
