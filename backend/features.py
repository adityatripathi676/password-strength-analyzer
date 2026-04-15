"""
Feature Extraction Pipeline for Password Strength Analysis
Extracts numerical features from raw password strings for ML inference.
"""

import re
import math
import string
from typing import List, Dict

# Common keyboard row patterns
KEYBOARD_ROWS = [
    "qwertyuiop", "asdfghjkl", "zxcvbnm",
    "1234567890", "qwerty", "azerty"
]

# Common leaked password fragments (top patterns)
COMMON_PATTERNS = [
    "password", "123456", "qwerty", "abc123", "letmein",
    "monkey", "dragon", "master", "sunshine", "princess",
    "welcome", "shadow", "superman", "michael", "football",
    "charlie", "donald", "passw0rd", "iloveyou", "admin",
    "login", "hello", "starwars", "654321", "lovely"
]

# L33tspeak mappings
LEET_MAP = {'0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's'}


def calc_entropy(password: str) -> float:
    """Shannon entropy in bits per character."""
    if not password:
        return 0.0
    freq = {}
    for ch in password:
        freq[ch] = freq.get(ch, 0) + 1
    n = len(password)
    entropy = -sum((c / n) * math.log2(c / n) for c in freq.values())
    # Total bits
    return round(entropy * n, 4)


def char_diversity_score(password: str) -> int:
    """Returns a 0-4 score based on character class diversity."""
    score = 0
    if re.search(r'[a-z]', password):
        score += 1
    if re.search(r'[A-Z]', password):
        score += 1
    if re.search(r'\d', password):
        score += 1
    if re.search(r'[^a-zA-Z0-9]', password):
        score += 1
    return score


def count_sequential_chars(password: str) -> int:
    """Count runs of sequential characters (abc, 123, etc.)."""
    count = 0
    p = password.lower()
    for i in range(len(p) - 2):
        a, b, c = ord(p[i]), ord(p[i + 1]), ord(p[i + 2])
        if a + 1 == b and b + 1 == c:
            count += 1
        elif a - 1 == b and b - 1 == c:
            count += 1  # reverse sequential
    return count


def count_repeated_chars(password: str) -> int:
    """Count run-length compression savings (aaa → 3 chars saved)."""
    count = 0
    i = 0
    while i < len(password):
        j = i
        while j < len(password) and password[j] == password[i]:
            j += 1
        run = j - i
        if run >= 3:
            count += run - 1  # characters wasted by repetition
        i = j
    return count


def count_keyboard_patterns(password: str) -> int:
    """Count how many keyboard-row substrings appear."""
    count = 0
    p = password.lower()
    for row in KEYBOARD_ROWS:
        for length in range(4, len(row) + 1):
            for i in range(len(row) - length + 1):
                chunk = row[i: i + length]
                if chunk in p:
                    count += 1
    return count


def leet_substituted_value(password: str) -> int:
    """1 if password looks like a leet-substituted common word."""
    decoded = password.lower()
    for k, v in LEET_MAP.items():
        decoded = decoded.replace(k, v)
    for pattern in COMMON_PATTERNS:
        if pattern in decoded:
            return 1
    return 0


def contains_common_pattern(password: str) -> int:
    """1 if password directly contains a common weak pattern."""
    p = password.lower()
    for pattern in COMMON_PATTERNS:
        if pattern in p:
            return 1
    return 0


def unique_char_ratio(password: str) -> float:
    """Ratio of unique characters to total length."""
    if not password:
        return 0.0
    return round(len(set(password)) / len(password), 4)


def extract_features(password: str) -> List[float]:
    """
    Main feature extraction function.
    Returns a fixed-length feature vector (12 features).
    """
    length = len(password)
    entropy = calc_entropy(password)
    diversity = char_diversity_score(password)
    sequential = count_sequential_chars(password)
    repeated = count_repeated_chars(password)
    keyboard = count_keyboard_patterns(password)
    leet = leet_substituted_value(password)
    common = contains_common_pattern(password)
    unique_ratio = unique_char_ratio(password)

    # Derived features
    has_upper = int(bool(re.search(r'[A-Z]', password)))
    has_digit = int(bool(re.search(r'\d', password)))
    has_special = int(bool(re.search(r'[^a-zA-Z0-9]', password)))

    return [
        length,          # 0: length
        entropy,         # 1: shannon entropy
        diversity,       # 2: char class score (0-4)
        sequential,      # 3: sequential char runs
        repeated,        # 4: repeated char waste
        keyboard,        # 5: keyboard row patterns
        leet,            # 6: leet-substituted common word
        common,          # 7: raw common pattern match
        unique_ratio,    # 8: unique char ratio
        has_upper,       # 9: has uppercase
        has_digit,       # 10: has digit
        has_special,     # 11: has special char
    ]


FEATURE_NAMES = [
    "length", "entropy", "char_diversity", "sequential_chars",
    "repeated_chars", "keyboard_patterns", "leet_pattern",
    "common_pattern", "unique_ratio", "has_upper", "has_digit", "has_special"
]


def get_feature_dict(password: str) -> Dict[str, float]:
    """Returns features as a labeled dictionary for debugging/explainability."""
    values = extract_features(password)
    return dict(zip(FEATURE_NAMES, values))
