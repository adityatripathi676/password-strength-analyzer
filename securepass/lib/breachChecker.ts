/**
 * Breach Checker — HaveIBeenPwned k-Anonymity Integration
 *
 * Security model:
 * 1. SHA-1 hash the password locally
 * 2. Send only the first 5 hex chars to HIBP (k-Anonymity prefix)
 * 3. Compare returned suffixes client-side
 * 4. Password never leaves the system in plaintext
 *
 * HIBP API: https://haveibeenpwned.com/API/v3
 */

export interface BreachResult {
  breached: boolean
  breach_count: number
}

/**
 * SHA-1 hash using the Web Crypto API (available in Node.js 15+ and all browsers).
 */
async function sha1(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

/**
 * Check a password against the HIBP Pwned Passwords API.
 * Uses k-anonymity: only the first 5 characters of the SHA-1 hash are sent.
 *
 * @throws {Error} if the HIBP API is unreachable
 */
export async function checkPasswordBreach(password: string): Promise<BreachResult> {
  if (!password) return { breached: false, breach_count: 0 }

  const hash = await sha1(password)
  const prefix = hash.slice(0, 5)
  const suffix = hash.slice(5)

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`,
    {
      headers: {
        'Add-Padding': 'true',       // prevents traffic analysis
        'User-Agent': 'SecurePass-Analyzer/1.0',
      },
      // 5 second timeout
      signal: AbortSignal.timeout(5000),
    }
  )

  if (!response.ok) {
    throw new Error(`HIBP API responded with status ${response.status}`)
  }

  const text = await response.text()

  // Each line: "HASHSUFFIX:COUNT"
  for (const line of text.split('\r\n')) {
    const [lineSuffix, countStr] = line.split(':')
    if (lineSuffix?.trim() === suffix) {
      const count = parseInt(countStr ?? '0', 10)
      return { breached: true, breach_count: count }
    }
  }

  return { breached: false, breach_count: 0 }
}
