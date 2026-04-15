# Password Strength Analyzer — AI Powered
# Full project README

## 🛡️ PassGuard AI

An end-to-end AI/ML-powered password strength analyzer with a modern dark UI, FastAPI backend, JWT authentication, and an ensemble machine learning model (Random Forest + Gradient Boosting).

---

## 📁 Project Structure

```
password-strength-analyzer/
├── backend/
│   ├── main.py           ← FastAPI app (auth + analyze endpoints)
│   ├── features.py       ← Feature extraction pipeline (12 features)
│   ├── model.py          ← ML inference + AI suggestion generator
│   ├── auth.py           ← JWT auth, login/register, token blacklist
│   ├── train_model.py    ← Training script (RF + GB ensemble)
│   └── requirements.txt
├── frontend/
│   ├── index.html        ← Login / Register page
│   ├── dashboard.html    ← Analyzer dashboard
│   └── style.css         ← Full design system
└── start.ps1             ← One-click launcher (Windows)
```

---

## 🚀 Quick Start

### Option 1 — PowerShell Script (recommended)
```powershell
cd password-strength-analyzer
.\start.ps1
```

### Option 2 — Manual
```bash
cd backend
pip install -r requirements.txt
python train_model.py          # Train the model (run once)
uvicorn main:app --reload --port 8000
```

Then open `frontend/index.html` in your browser.

---

## 🧠 AI/ML System

### Feature Extraction (12 features)
| Feature | Description |
|---|---|
| `length` | Raw password length |
| `entropy` | Shannon entropy (bits) |
| `char_diversity` | Number of character classes used (0–4) |
| `sequential_chars` | Count of sequential character runs (abc/123) |
| `repeated_chars` | Characters wasted by repetition (aaa…) |
| `keyboard_patterns` | Keyboard-row pattern matches (qwerty, asdf…) |
| `leet_pattern` | Leet-speak decoded common word match |
| `common_pattern` | Direct common password fragment match |
| `unique_ratio` | Unique chars ÷ total length |
| `has_upper` | Has uppercase letter (0/1) |
| `has_digit` | Has digit (0/1) |
| `has_special` | Has special character (0/1) |

### Model Architecture
- **Ensemble**: `VotingClassifier(RandomForest + GradientBoosting)`
- **Classes**: Very Weak / Weak / Moderate / Strong / Very Strong
- **Training data**: 15,000 synthetic passwords (3,000 per class)
- **Accuracy**: ~97%+ cross-validated

---

## 🔐 Security Features
- **JWT authentication** (custom HS256 implementation)
- **Token blacklisting** on logout
- **Backward navigation prevention** after logout
- **Rate limiting**: 30 requests/60s per IP
- **Input validation** via Pydantic
- **Protected routes** — all analysis requires valid JWT

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| POST | `/api/auth/logout` | ✅ | Invalidate token |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/analyze` | ✅ | Analyze password |
| GET | `/api/health` | ❌ | Health check |

### Analyze Response
```json
{
  "score": 78.5,
  "strength": "Strong",
  "confidence": 91.2,
  "suggestions": [
    "⚡ Special characters exponentially increase password strength.",
    "📏 14+ characters dramatically increase crack time."
  ],
  "class_probabilities": {
    "Very Weak": 0.1, "Weak": 1.2,
    "Moderate": 7.5, "Strong": 91.2, "Very Strong": 0.0
  }
}
```