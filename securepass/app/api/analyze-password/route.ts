/**
 * API Route: POST /api/analyze-password
 *
 * Accepts a password, runs the full analysis, and returns structured results.
 * Rate-limited to 60 requests/minute per IP.
 * Password is NEVER logged or persisted.
 */

import { NextRequest, NextResponse } from 'next/server'
import { analyzePassword } from '@/lib/passwordAnalyzer'

// ── Simple in-memory rate limiter ─────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (limit.count >= 60) return false
  limit.count++
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
      { error: 'Rate limit exceeded. Please wait before retrying.' },
      { status: 429 }
    )
  }

  // ── Parse & validate body ─────────────────────────────────────────────
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

  if (password.length > 512) {
    return NextResponse.json(
      { error: 'Password exceeds maximum length of 512 characters.' },
      { status: 400 }
    )
  }

  // ── Analyze ───────────────────────────────────────────────────────────
  const result = analyzePassword(password)

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
