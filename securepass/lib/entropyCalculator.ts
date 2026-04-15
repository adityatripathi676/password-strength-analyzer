/**
 * Entropy Calculator
 * Computes Shannon entropy and character-pool-based theoretical entropy
 * for password analysis.
 */

/** Size of each character class pool */
export const CHAR_POOLS = {
  lowercase: 26,
  uppercase: 26,
  digits: 10,
  symbols: 32,   // printable ASCII symbols
  space: 1,
} as const

/**
 * Calculate the character pool size based on what characters the password uses.
 */
export function calcPoolSize(password: string): number {
  let pool = 0
  if (/[a-z]/.test(password)) pool += CHAR_POOLS.lowercase
  if (/[A-Z]/.test(password)) pool += CHAR_POOLS.uppercase
  if (/\d/.test(password))    pool += CHAR_POOLS.digits
  if (/[^a-zA-Z0-9]/.test(password)) pool += CHAR_POOLS.symbols
  return pool || 1
}

/**
 * Classic Shannon entropy per character (information-theoretic)
 * H = -Σ p(c) × log2(p(c))
 */
export function shannonEntropy(password: string): number {
  if (!password) return 0
  const freq: Record<string, number> = {}
  for (const ch of password) freq[ch] = (freq[ch] ?? 0) + 1
  const n = password.length
  return -Object.values(freq).reduce((sum, count) => {
    const p = count / n
    return sum + p * Math.log2(p)
  }, 0)
}

/**
 * Pool-based entropy: length × log2(poolSize)
 * Represents the theoretical maximum password space size in bits.
 */
export function poolEntropy(password: string): number {
  const poolSize = calcPoolSize(password)
  return password.length * Math.log2(poolSize)
}

/**
 * Combined entropy score — weighted average of both approaches.
 * Pool entropy captures complexity potential; Shannon captures actual randomness.
 */
export function calcEntropy(password: string): number {
  if (!password) return 0
  const pool = poolEntropy(password)
  const shannon = shannonEntropy(password) * password.length
  // Weighted: 60% pool-based (theoretical), 40% Shannon (actual distribution)
  return Math.round((pool * 0.6 + shannon * 0.4) * 100) / 100
}

/**
 * Human-readable entropy rating based on bit strength.
 */
export function entropyRating(bits: number): string {
  if (bits < 28)  return 'Negligible'
  if (bits < 36)  return 'Very Low'
  if (bits < 50)  return 'Low'
  if (bits < 64)  return 'Fair'
  if (bits < 80)  return 'Good'
  if (bits < 100) return 'Strong'
  return 'Very Strong'
}
