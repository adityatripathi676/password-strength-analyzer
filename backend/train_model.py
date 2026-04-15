"""
Model Training Script
Generates synthetic training data reflecting real-world password strength distributions
and trains a Random Forest + Gradient Boosting ensemble.
Run once: python train_model.py
"""

import os
import pickle
import random
import string
import numpy as np
from features import extract_features

# ── reproducibility ──────────────────────────────────────────────────────────
random.seed(42)
np.random.seed(42)

# ── synthetic data generators ─────────────────────────────────────────────────

VERY_WEAK_SAMPLES = [
    "password", "123456", "qwerty", "password1", "abc123", "letmein",
    "monkey", "dragon", "master", "sunshine", "123", "1234", "passw",
    "pass", "admin", "login", "hello", "test", "root", "user",
]

WEAK_SAMPLES = [
    "password12", "qwerty123", "michael123", "superman1", "football1",
    "charlie99", "shadow123", "welcome1", "iloveyou1", "starwars1",
    "batman1", "princess9", "jessica1", "ashley11", "michael9",
]


def gen_very_weak(n: int):
    samples = []
    for _ in range(n):
        base = random.choice(VERY_WEAK_SAMPLES)
        suffix = str(random.randint(0, 99)) if random.random() > 0.5 else ""
        samples.append(base + suffix)
    return samples


def gen_weak(n: int):
    samples = []
    for _ in range(n):
        if random.random() < 0.5:
            base = random.choice(WEAK_SAMPLES)
            samples.append(base)
        else:
            # short lowercase + small number
            length = random.randint(5, 8)
            word = ''.join(random.choices(string.ascii_lowercase, k=length))
            samples.append(word + str(random.randint(1, 999)))
    return samples


def gen_moderate(n: int):
    samples = []
    for _ in range(n):
        length = random.randint(8, 11)
        chars = (
            random.choices(string.ascii_lowercase, k=random.randint(4, 6)) +
            random.choices(string.ascii_uppercase, k=random.randint(1, 2)) +
            random.choices(string.digits, k=random.randint(1, 2))
        )
        random.shuffle(chars)
        samples.append(''.join(chars[:length]))
    return samples


def gen_strong(n: int):
    samples = []
    for _ in range(n):
        length = random.randint(12, 16)
        chars = (
            random.choices(string.ascii_lowercase, k=random.randint(4, 6)) +
            random.choices(string.ascii_uppercase, k=random.randint(3, 4)) +
            random.choices(string.digits, k=random.randint(2, 3)) +
            random.choices("!@#$%^&*()_+-=[]{}|;:,.<>?", k=random.randint(2, 3))
        )
        random.shuffle(chars)
        samples.append(''.join(chars[:length]))
    return samples


def gen_very_strong(n: int):
    samples = []
    for _ in range(n):
        length = random.randint(18, 32)
        pool = string.ascii_letters + string.digits + "!@#$%^&*()_+-=[]{}|;:,.<>?"
        samples.append(''.join(random.choices(pool, k=length)))
    return samples


# ── assemble dataset ──────────────────────────────────────────────────────────

def build_dataset(per_class: int = 2000):
    """
    Class labels:
      0 = Very Weak
      1 = Weak
      2 = Moderate
      3 = Strong
      4 = Very Strong
    """
    generators = [gen_very_weak, gen_weak, gen_moderate, gen_strong, gen_very_strong]
    X, y = [], []
    for label, gen in enumerate(generators):
        passwords = gen(per_class)
        for pw in passwords:
            feats = extract_features(pw)
            X.append(feats)
            y.append(label)
    return np.array(X, dtype=float), np.array(y, dtype=int)


# ── training ──────────────────────────────────────────────────────────────────

def train():
    from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
    from sklearn.preprocessing import StandardScaler
    from sklearn.pipeline import Pipeline
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.metrics import classification_report

    print("[*] Generating synthetic training data …")
    X, y = build_dataset(per_class=3000)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42, stratify=y
    )

    rf = RandomForestClassifier(
        n_estimators=200, max_depth=None, min_samples_split=2,
        random_state=42, n_jobs=-1, class_weight="balanced"
    )
    gb = GradientBoostingClassifier(
        n_estimators=150, learning_rate=0.1, max_depth=5,
        random_state=42, subsample=0.8
    )

    ensemble = VotingClassifier(
        estimators=[("rf", rf), ("gb", gb)],
        voting="soft",
        weights=[1, 1.5]   # weight GB slightly higher for accuracy
    )

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model", ensemble)
    ])

    print("[*] Training ensemble (Random Forest + Gradient Boosting) …")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    print("\n[+] Classification Report:")
    print(classification_report(y_test, y_pred,
          target_names=["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"]))

    cv_scores = cross_val_score(pipeline, X, y, cv=5, scoring="accuracy")
    print(f"[+] CV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    # save model
    model_path = os.path.join(os.path.dirname(__file__), "password_model.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(pipeline, f)
    print(f"\n[✓] Model saved → {model_path}")


if __name__ == "__main__":
    train()
