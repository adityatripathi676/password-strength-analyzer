"""
Model Inference Layer
Loads the pre-trained model and provides prediction + confidence scoring.
"""

import os
import pickle
import threading
import numpy as np
from typing import Dict, Any, List

from features import extract_features, get_feature_dict

_model_lock = threading.Lock()
_model = None  # singleton

LABELS = {
    0: "Very Weak",
    1: "Weak",
    2: "Moderate",
    3: "Strong",
    4: "Very Strong",
}

MODEL_PATH = os.path.join(os.path.dirname(__file__), "password_model.pkl")


def load_model():
    """Load model from disk into memory (singleton)."""
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:
                if not os.path.exists(MODEL_PATH):
                    raise FileNotFoundError(
                        "Model file not found. Run: python train_model.py"
                    )
                with open(MODEL_PATH, "rb") as f:
                    _model = pickle.load(f)
    return _model


def _generate_suggestions(password: str, features: Dict, predicted_class: int) -> List[str]:
    """Produce AI-based context-aware suggestions from feature analysis."""
    suggestions = []

    length = features["length"]
    entropy = features["entropy"]
    diversity = features["char_diversity"]
    sequential = features["sequential_chars"]
    repeated = features["repeated_chars"]
    keyboard = features["keyboard_patterns"]
    leet = features["leet_pattern"]
    common = features["common_pattern"]
    unique_ratio = features["unique_ratio"]
    has_upper = features["has_upper"]
    has_digit = features["has_digit"]
    has_special = features["has_special"]

    # Critical issues first
    if common:
        suggestions.append(
            "⚠️ This resembles a commonly leaked password structure — avoid it entirely."
        )
    if leet:
        suggestions.append(
            "🔤 Leet-speak substitutions (e.g., '@' for 'a') are well-known to attackers and offer minimal protection."
        )
    if keyboard:
        suggestions.append(
            "⌨️ Your password contains predictable keyboard patterns (e.g., 'qwerty', 'asdf') that are easily guessed."
        )
    if sequential >= 2:
        suggestions.append(
            f"🔢 Found {sequential} sequential character run(s) (like 'abc' or '123') — these significantly reduce entropy."
        )
    if repeated >= 2:
        suggestions.append(
            f"🔁 Repeated characters waste {repeated} character slot(s) and make brute-forcing easier."
        )

    # Structural weaknesses
    if length < 8:
        suggestions.append(
            f"📏 Your password is only {length} characters — use at least 12 to resist brute-force attacks."
        )
    elif length < 12:
        suggestions.append(
            f"📏 Length is decent ({length} chars) but 14+ characters dramatically increases crack time."
        )

    if diversity < 2:
        suggestions.append(
            "🧩 Use a mix of uppercase, lowercase, digits, and special characters to broaden the character space."
        )
    elif diversity == 2:
        suggestions.append(
            "🧩 You're using only 2 character classes — adding symbols or numbers will improve strength."
        )

    if not has_upper:
        suggestions.append("🔠 Add at least one uppercase letter to increase character diversity.")
    if not has_digit:
        suggestions.append("🔢 Include numbers to expand the possible character space.")
    if not has_special:
        suggestions.append(
            "⚡ Special characters (!, @, #, $) exponentially increase password strength."
        )

    if unique_ratio < 0.5:
        suggestions.append(
            f"🎲 Only {int(unique_ratio * 100)}% of your characters are unique — entropy is low. Use more varied characters."
        )

    if entropy < 20:
        suggestions.append(
            f"📊 Shannon entropy is very low ({entropy:.1f} bits) — this password would fall quickly to dictionary attacks."
        )
    elif entropy < 40:
        suggestions.append(
            f"📊 Entropy is moderate ({entropy:.1f} bits) — consider making the password longer and more random."
        )

    # Positive feedback for high-strength passwords
    if predicted_class >= 3 and not suggestions:
        suggestions.append("✅ Excellent password! High entropy, diverse characters, and no common patterns detected.")
    elif predicted_class >= 3 and length >= 14:
        suggestions.insert(0, "✅ Good structure overall — address the minor issues above to reach maximum strength.")

    # Cap to 5 most relevant suggestions
    return suggestions[:5]


def predict(password: str) -> Dict[str, Any]:
    """
    Run password through the ML pipeline.
    Returns: score, strength, confidence, suggestions, features
    """
    model = load_model()
    features = get_feature_dict(password)
    X = np.array([extract_features(password)], dtype=float)

    predicted_class = int(model.predict(X)[0])
    probabilities = model.predict_proba(X)[0]

    # Weighted score 0–100 using class probability mass
    score = sum(i * p for i, p in enumerate(probabilities)) / 4 * 100
    confidence = float(probabilities[predicted_class]) * 100

    suggestions = _generate_suggestions(password, features, predicted_class)

    return {
        "score": round(score, 1),
        "strength": LABELS[predicted_class],
        "confidence": round(confidence, 1),
        "suggestions": suggestions,
        "class_probabilities": {
            LABELS[i]: round(float(p) * 100, 1)
            for i, p in enumerate(probabilities)
        },
        "features": features,
    }
