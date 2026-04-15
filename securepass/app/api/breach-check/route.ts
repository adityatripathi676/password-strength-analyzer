/**
 * API Route: POST /api/breach-check
 *
 * Uses HIBP k-Anonymity model — only a 5-char SHA-1 prefix is sent to HIBP.
 * The full password hash comparison is done server-side.
 * Password is NEVER sent to any external service in plaintext.
 */

import { NextRequest, NextResponse } from 'next/server'
import { checkPasswordBreach } from '@/lib/breachChecker'

// ── Rate limiter (separate from analyze endpoint) ────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 30) return false
  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  // ── Rate limiting ────────────────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded.' },
      { status: 429 }
    )
  }

  // ── Parse & validate ─────────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('password' in body) ||
    typeof (body as Record<string, unknown>).password !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Request must include a "password" string field.' },
      { status: 400 }
    )
  }

  const password = (body as { password: string }).password

  if (!password || password.length > 512) {
    return NextResponse.json(
      { error: 'Password must be between 1 and 512 characters.' },
      { status: 400 }
    )
  }

  // ── Check breach ─────────────────────────────────────────────────────
  try {
    const result = await checkPasswordBreach(password)
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    // HIBP might be temporarily unavailable — fail gracefully
    console.error('[breach-check] HIBP API error:', error)
    return NextResponse.json(
      {
        breached: false,
        breach_count: 0,
        error: 'Breach database temporarily unavailable.',
      },
      { status: 200 } // Return 200 so the UI doesn't crash
    )
  }
}
