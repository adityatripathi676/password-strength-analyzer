/**
 * Password Analyzer — Core Logic
 * Scores passwords from 0–100, estimates crack time, detects patterns,
 * and returns actionable improvement suggestions.
 *
 * Security note: Passwords are processed in-memory only. Never logged or stored.
 */

import { calcEntropy, calcPoolSize } from './entropyCalculator'

// ── Types ─────────────────────────────────────────────────────────────────────

export type StrengthLabel =
  | 'Very Weak'
  | 'Weak'
  | 'Moderate'
  | 'Strong'
  | 'Very Strong'

export interface AnalysisResult {
  score: number              // 0–100
  strength: StrengthLabel
  entropy: number            // bits
  crack_time_estimate: string
  suggestions: string[]
  details: {
    length: number
    hasUppercase: boolean
    hasLowercase: boolean
    hasDigits: boolean
    hasSymbols: boolean
    hasRepeated: boolean
    hasSequential: boolean
    hasKeyboardPattern: boolean
    hasCommonWord: boolean
    poolSize: number
    uniqueCharRatio: number
  }
}

// ── Common password fragments (top leaked patterns) ───────────────────────────
const COMMON_FRAGMENTS = [
  'password', '123456', 'qwerty', 'abc123', 'letmein', 'monkey',
  'dragon', 'master', 'sunshine', 'princess', 'welcome', 'shadow',
  'superman', 'football', 'baseball', 'charlie', 'donald', 'iloveyou',
  'login', 'hello', '654321', 'lovely', 'starwars', 'whatever',
  'qazwsx', 'trustno1', 'admin', 'pass', 'test', 'user',
]

// ── Keyboard row patterns ─────────────────────────────────────────────────────
const KEYBOARD_ROWS = [
  'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
  '1234567890', 'qwerty', 'asdfg', 'zxcvb',
]

// ── Pattern detection helpers ─────────────────────────────────────────────────

function hasRepeatedChars(pw: string): boolean {
  return /(.)\1{2,}/.test(pw)
}

function hasSequentialChars(pw: string): boolean {
  const lower = pw.toLowerCase()
  for (let i = 0; i < lower.length - 2; i++) {
    const a = lower.charCodeAt(i)
    const b = lower.charCodeAt(i + 1)
    const c = lower.charCodeAt(i + 2)
    if (a + 1 === b && b + 1 === c) return true
    if (a - 1 === b && b - 1 === c) return true
  }
  return false
}

function hasKeyboardPattern(pw: string): boolean {
  const lower = pw.toLowerCase()
  return KEYBOARD_ROWS.some((row) => {
    for (let len = 4; len <= row.length; len++) {
      for (let i = 0; i <= row.length - len; i++) {
        if (lower.includes(row.slice(i, i + len))) return true
      }
    }
    return false
  })
}

function hasCommonFragment(pw: string): boolean {
  const lower = pw.toLowerCase()
  // Also check l33tspeak variants
  const decoded = lower
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
    .replace(/4/g, 'a').replace(/5/g, 's').replace(/@/g, 'a')
    .replace(/\$/g, 's').replace(/7/g, 't')
  return COMMON_FRAGMENTS.some(
    (frag) => lower.includes(frag) || decoded.includes(frag)
  )
}

function uniqueCharRatio(pw: string): number {
  return pw.length === 0 ? 0 : new Set(pw).size / pw.length
}

// ── Crack time estimation ─────────────────────────────────────────────────────

// Modern GPU offline attack speed (bcrypt-equivalent: ~10B/s)
const GUESSES_PER_SECOND = 10_000_000_000

export function estimateCrackTime(entropy: number): string {
  if (entropy <= 0) return 'Instantly'

  // Average time = 2^(entropy-1) / speed
  const seconds = Math.pow(2, Math.min(entropy - 1, 256)) / GUESSES_PER_SECOND

  if (seconds < 0.001)          return 'Instantly'
  if (seconds < 1)              return `${(seconds * 1000).toFixed(0)} milliseconds`
  if (seconds < 60)             return `${seconds.toFixed(1)} seconds`
  if (seconds < 3_600)          return `${(seconds / 60).toFixed(0)} minutes`
  if (seconds < 86_400)         return `${(seconds / 3_600).toFixed(0)} hours`
  if (seconds < 2_592_000)      return `${(seconds / 86_400).toFixed(0)} days`
  if (seconds < 31_536_000)     return `${(seconds / 2_592_000).toFixed(0)} months`
  if (seconds < 3_153_600_000)  return `${(seconds / 31_536_000).toFixed(0)} years`
  if (seconds < 3.15e13)        return `${(seconds / 3_153_600_000).toFixed(0)} centuries`
  return 'Longer than the age of the universe'
}

// ── Score calculation ─────────────────────────────────────────────────────────

export function analyzePassword(password: string): AnalysisResult {
  if (!password) {
    return {
      score: 0,
      strength: 'Very Weak',
      entropy: 0,
      crack_time_estimate: 'Instantly',
      suggestions: ['Enter a password to analyze.'],
      details: {
        length: 0, hasUppercase: false, hasLowercase: false, hasDigits: false,
        hasSymbols: false, hasRepeated: false, hasSequential: false,
        hasKeyboardPattern: false, hasCommonWord: false, poolSize: 0, uniqueCharRatio: 0,
      },
    }
  }

  // ── Collect character properties ─────────────────────────────────────
  const len = password.length
  const hasUpper    = /[A-Z]/.test(password)
  const hasLower    = /[a-z]/.test(password)
  const hasDigits   = /\d/.test(password)
  const hasSymbols  = /[^a-zA-Z0-9]/.test(password)
  const repeated    = hasRepeatedChars(password)
  const sequential  = hasSequentialChars(password)
  const kbPattern   = hasKeyboardPattern(password)
  const commonWord  = hasCommonFragment(password)
  const ucratio     = uniqueCharRatio(password)
  const pool        = calcPoolSize(password)
  const entropy     = calcEntropy(password)

  // ── Base score from entropy ────────────────────────────────────────
  // Map 0–128 bits → 0–100 score, capped
  let score = Math.min(100, (entropy / 100) * 100)

  // ── Length bonuses ────────────────────────────────────────────────
  if (len >= 8)  score += 5
  if (len >= 12) score += 8
  if (len >= 16) score += 10
  if (len >= 20) score += 7

  // ── Character variety bonuses ─────────────────────────────────────
  if (hasUpper)   score += 6
  if (hasLower)   score += 4
  if (hasDigits)  score += 6
  if (hasSymbols) score += 10

  // ── Unique character ratio bonus ──────────────────────────────────
  if (ucratio >= 0.7) score += 5
  if (ucratio >= 0.9) score += 5

  // ── Pattern penalties ─────────────────────────────────────────────
  if (commonWord)  score -= 35
  if (repeated)    score -= 12
  if (sequential)  score -= 10
  if (kbPattern)   score -= 15

  // ── Length penalty for very short passwords ───────────────────────
  if (len < 6)  score = Math.min(score, 15)
  if (len < 4)  score = Math.min(score, 5)

  // Clamp
  score = Math.max(0, Math.min(100, Math.round(score)))

  // ── Strength label ─────────────────────────────────────────────────
  const strength: StrengthLabel =
    score < 20  ? 'Very Weak' :
    score < 40  ? 'Weak'      :
    score < 60  ? 'Moderate'  :
    score < 80  ? 'Strong'    :
                  'Very Strong'

  // ── Suggestions ────────────────────────────────────────────────────
  const suggestions: string[] = []

  if (commonWord) {
    suggestions.push(
      '❌ This password matches known breached patterns — avoid it entirely.'
    )
  }
  if (kbPattern) {
    suggestions.push(
      '⌨️ Keyboard walk patterns (like "qwerty") are trivially guessable by attackers.'
    )
  }
  if (repeated) {
    suggestions.push('🔁 Avoid repeating the same character consecutively (e.g., "aaa").')
  }
  if (sequential) {
    suggestions.push('🔢 Sequential sequences like "abc" or "123" drastically reduce entropy.')
  }
  if (len < 12) {
    suggestions.push(
      `📏 Increase length to at least 12 characters (currently ${len}). Length is the #1 security factor.`
    )
  }
  if (!hasUpper) {
    suggestions.push('🔠 Add uppercase letters to broaden the character search space.')
  }
  if (!hasDigits) {
    suggestions.push('🔢 Include digits (0–9) to increase pool size.')
  }
  if (!hasSymbols) {
    suggestions.push(
      '⚡ Adding symbols (!, @, #, $) can multiply the keyspace by 32×.'
    )
  }
  if (ucratio < 0.5) {
    suggestions.push('🎲 Too many repeated characters — use more unique characters.')
  }

  if (score >= 80 && suggestions.length === 0) {
    suggestions.push('✅ Excellent password! High entropy, no detectable patterns.')
  } else if (score >= 60 && suggestions.length <= 1) {
    suggestions.push(
      '💡 Good start — consider upgrading to a passphrase for maximum memorability.'
    )
  }

  return {
    score,
    strength,
    entropy: Math.round(entropy * 10) / 10,
    crack_time_estimate: estimateCrackTime(entropy),
    suggestions: suggestions.slice(0, 5),
    details: {
      length: len,
      hasUppercase: hasUpper,
      hasLowercase: hasLower,
      hasDigits,
      hasSymbols,
      hasRepeated: repeated,
      hasSequential: sequential,
      hasKeyboardPattern: kbPattern,
      hasCommonWord: commonWord,
      poolSize: pool,
      uniqueCharRatio: Math.round(ucratio * 100) / 100,
    },
  }
}
