'use client'

import { useState, useCallback, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, ShieldCheck, Lock, CheckCircle2, XCircle, Minus } from 'lucide-react'
import Link from 'next/link'
import { styled, applyGlobalStyles } from '@/styles/stitches.config'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { PasswordInput } from '@/components/PasswordInput'
import { StrengthMeter } from '@/components/StrengthMeter'
import { EntropyDisplay } from '@/components/EntropyDisplay'
import { BreachAlert } from '@/components/BreachAlert'
import { SuggestionsPanel } from '@/components/SuggestionsPanel'
import { PasswordGenerator } from '@/components/PasswordGenerator'
import type { AnalysisResult } from '@/lib/passwordAnalyzer'

applyGlobalStyles()

// ── Types ─────────────────────────────────────────────────────────────────────

type BreachStatus = 'idle' | 'loading' | 'breached' | 'safe'

// ── Styled components ─────────────────────────────────────────────────────────

const Page = styled('div', {
  minHeight: '100vh',
  background: '$bgBase',
})

const BgDecor = styled('div', {
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
})

const BgBlob = styled('div', {
  position: 'absolute',
  borderRadius: '$full',
  filter: 'blur(100px)',
  opacity: 0.07,
})

const GridOverlay = styled('div', {
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)
  `,
  backgroundSize: '60px 60px',
})

const Main = styled('main', {
  position: 'relative',
  zIndex: 1,
  pt: '$24',
  pb: '$20',
  px: '$6',
  maxWidth: '$content',
  mx: 'auto',
})

// Breadcrumb
const Breadcrumb = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  mb: '$8',
})

const BreadcrumbBack = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  fontSize: '$sm',
  color: '$textMuted',
  textDecoration: 'none',
  transition: '$fast',
  '&:hover': { color: '$textSecondary' },
})

const BreadcrumbSep = styled('span', {
  color: '$textMuted',
  fontSize: '$xs',
})

const BreadcrumbCurrent = styled('span', {
  fontSize: '$sm',
  color: '$cyan400',
  fontWeight: '$medium',
})

// Page header
const PageHeader = styled('div', {
  mb: '$10',
})

const PageTitle = styled('h1', {
  fontSize: '$3xl',
  fontWeight: '$extrabold',
  letterSpacing: '-0.02em',
  color: '$textPrimary',
  mb: '$2',
  '@md': { fontSize: '$4xl' },
})

const PageSub = styled('p', {
  fontSize: '$base',
  color: '$textMuted',
  lineHeight: '$relaxed',
})

// Main layout
const AnalyzerLayout = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$6',
  '@lg': { gridTemplateColumns: '1fr 360px' },
})

// Primary card (left)
const PrimaryCard = styled('div', {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$xl',
  p: '$6',
  backdropFilter: 'blur(16px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
})

const CardDivider = styled('div', {
  height: '1px',
  background: '$borderSubtle',
  mx: '-$6',
})

// Analyze button
const AnalyzeBtn = styled('button', {
  width: '100%',
  py: '$4',
  borderRadius: '$lg',
  fontFamily: '$sans',
  fontWeight: '$semibold',
  fontSize: '$base',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  transition: '$fast',
  background: 'linear-gradient(135deg, $cyan500, $purple500)',
  color: '$textPrimary',
  boxShadow: '0 4px 20px rgba(34,211,238,0.2)',
  '&:hover:not(:disabled)': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 28px rgba(34,211,238,0.35)',
  },
  '&:active:not(:disabled)': { transform: 'translateY(0)' },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
})

// Details checkbox grid
const DetailsGrid = styled(motion.div, {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '$3',
  '@sm': { gridTemplateColumns: 'repeat(3, 1fr)' },
})

const DetailItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  p: '$3',
  borderRadius: '$md',
  background: '$bgInput',
  fontSize: '$sm',
  variants: {
    ok: {
      true:  { color: '$success' },
      false: { color: '$danger' },
      null:  { color: '$textMuted' },
    },
  },
})

// Sidebar (right)
const Sidebar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
})

// Section label inside card
const CardSectionLabel = styled('div', {
  fontSize: '$xs',
  fontWeight: '$semibold',
  color: '$textMuted',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
})

// Loading spinner
const Spinner = styled(motion.div, {
  size: '18px',
  border: '2px solid rgba(255,255,255,0.2)',
  borderTop: '2px solid white',
  borderRadius: '$full',
})

// ── Component ─────────────────────────────────────────────────────────────────

export default function AnalyzerPage() {
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [breachStatus, setBreachStatus] = useState<BreachStatus>('idle')
  const [breachCount, setBreachCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Live strength (quick heuristic, no API call)
  const liveStrength = getLiveStrength(password)

  const handleAnalyze = useCallback(async () => {
    if (!password || isPending) return
    setError(null)
    setBreachStatus('idle')
    setResult(null)

    startTransition(() => {})

    // Run analysis and breach check in parallel
    const [analysisRes, breachRes] = await Promise.allSettled([
      fetch('/api/analyze-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      }),
      (async () => {
        setBreachStatus('loading')
        const r = await fetch('/api/breach-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        })
        return r
      })(),
    ])

    // Handle analysis result
    if (analysisRes.status === 'fulfilled') {
      const r = analysisRes.value
      if (r.ok) {
        const data = (await r.json()) as AnalysisResult
        setResult(data)
      } else {
        const err = await r.json()
        setError((err as { error?: string }).error ?? 'Analysis failed.')
      }
    } else {
      setError('Could not reach the analysis server.')
    }

    // Handle breach result
    if (breachRes.status === 'fulfilled') {
      const r = breachRes.value
      if (r.ok) {
        const data = (await r.json()) as { breached: boolean; breach_count: number }
        setBreachCount(data.breach_count)
        setBreachStatus(data.breached ? 'breached' : 'safe')
      } else {
        setBreachStatus('idle')
      }
    } else {
      setBreachStatus('idle')
    }
  }, [password, isPending])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && password) handleAnalyze()
    },
    [password, handleAnalyze]
  )

  const DETAIL_CHECKS = result
    ? [
        { label: '8+ chars',    ok: result.details.length >= 8 },
        { label: '12+ chars',   ok: result.details.length >= 12 },
        { label: 'Uppercase',   ok: result.details.hasUppercase },
        { label: 'Lowercase',   ok: result.details.hasLowercase },
        { label: 'Digits',      ok: result.details.hasDigits },
        { label: 'Symbols',     ok: result.details.hasSymbols },
        { label: 'No repeats',  ok: !result.details.hasRepeated },
        { label: 'No sequence', ok: !result.details.hasSequential },
        { label: 'Not common',  ok: !result.details.hasCommonWord },
      ]
    : []

  return (
    <Page>
      <BgDecor>
        <GridOverlay />
        <BgBlob style={{
          width: '500px', height: '500px',
          top: '-100px', right: '-100px',
          background: 'radial-gradient(circle, #8b5cf6, #a78bfa)',
        }} />
        <BgBlob style={{
          width: '400px', height: '400px',
          bottom: '0px', left: '-50px',
          background: 'radial-gradient(circle, #22d3ee, transparent)',
        }} />
      </BgDecor>

      <Navbar />

      <Main>
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbBack href="/">
            <ArrowLeft size={14} />
            Home
          </BreadcrumbBack>
          <BreadcrumbSep>/</BreadcrumbSep>
          <BreadcrumbCurrent>Analyzer</BreadcrumbCurrent>
        </Breadcrumb>

        {/* Header */}
        <PageHeader>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PageTitle>Password Strength Analyzer</PageTitle>
            <PageSub>
              Enterprise-grade analysis · Breach detection · Crack time estimation
            </PageSub>
          </motion.div>
        </PageHeader>

        <AnalyzerLayout>
          {/* ── Primary card ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PrimaryCard>
              {/* Input */}
              <div onKeyDown={handleKeyDown as unknown as React.KeyboardEventHandler}>
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  label="Password to Analyze"
                  id="analyzer-input"
                />
              </div>

              {/* Live strength meter */}
              <StrengthMeter
                strength={result?.strength ?? liveStrength}
                score={result?.score ?? liveScore(password)}
              />

              {/* Analyze button */}
              <AnalyzeBtn
                onClick={handleAnalyze}
                disabled={!password || isPending}
                type="button"
              >
                {isPending ? (
                  <>
                    <Spinner
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Analyze Password
                  </>
                )}
              </AnalyzeBtn>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: 'var(--colors-dangerDim)',
                      border: '1px solid var(--colors-dangerBorder)',
                      fontSize: '14px',
                      color: 'var(--colors-danger)',
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <CardDivider />

              {/* Entropy metrics */}
              <div>
                <CardSectionLabel style={{ marginBottom: '16px' }}>
                  <ShieldCheck size={14} />
                  Security Metrics
                </CardSectionLabel>
                <EntropyDisplay
                  entropy={result?.entropy ?? null}
                  crack_time={result?.crack_time_estimate ?? null}
                  score={result?.score ?? null}
                  pool_size={result?.details.poolSize ?? null}
                />
              </div>

              {/* Breach status */}
              <AnimatePresence>
                {breachStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardDivider style={{ marginBottom: '24px' }} />
                    <CardSectionLabel style={{ marginBottom: '16px' }}>
                      <Lock size={14} />
                      Breach Detection
                    </CardSectionLabel>
                    <BreachAlert status={breachStatus} breach_count={breachCount} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Character details */}
              <AnimatePresence>
                {result && DETAIL_CHECKS.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardDivider style={{ marginBottom: '24px' }} />
                    <CardSectionLabel style={{ marginBottom: '16px' }}>
                      Character Checklist
                    </CardSectionLabel>
                    <DetailsGrid
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.04 }}
                    >
                      {DETAIL_CHECKS.map(({ label, ok }) => (
                        <DetailItem key={label} ok={ok as never}>
                          {ok ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {label}
                        </DetailItem>
                      ))}
                    </DetailsGrid>
                  </motion.div>
                )}
              </AnimatePresence>
            </PrimaryCard>
          </motion.div>

          {/* ── Sidebar ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sidebar>
              <SuggestionsPanel
                suggestions={result?.suggestions ?? []}
                strength={result?.strength}
              />
              <PasswordGenerator
                onUsePassword={(pw) => {
                  setPassword(pw)
                  setResult(null)
                  setBreachStatus('idle')
                }}
              />
            </Sidebar>
          </motion.div>
        </AnalyzerLayout>

        {/* Privacy note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '32px', padding: '16px 20px', borderRadius: '10px',
            background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.15)',
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '13px', color: 'var(--colors-textMuted)',
          }}
        >
          <Lock size={14} color="var(--colors-cyan400)" style={{ flexShrink: 0 }} />
          <span>
            <strong style={{ color: 'var(--colors-cyan400)' }}>Privacy guaranteed:</strong>{' '}
            Passwords are processed in-memory only. Never logged, transmitted in plaintext, or stored.
            Breach checks use SHA-1 k-Anonymity — only 5 hash characters are sent to HIBP.
          </span>
        </motion.div>
      </Main>

      <Footer />
    </Page>
  )
}

// ── Quick heuristics for live (pre-API) strength display ──────────────────────

import type { StrengthLabel } from '@/lib/passwordAnalyzer'

function getLiveStrength(pw: string): StrengthLabel | null {
  if (!pw) return null
  const s = liveScore(pw)
  if (s < 20) return 'Very Weak'
  if (s < 40) return 'Weak'
  if (s < 60) return 'Moderate'
  if (s < 80) return 'Strong'
  return 'Very Strong'
}

function liveScore(pw: string): number {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8)  s += 20
  if (pw.length >= 12) s += 15
  if (pw.length >= 16) s += 10
  if (/[A-Z]/.test(pw)) s += 15
  if (/\d/.test(pw))    s += 15
  if (/[^a-zA-Z0-9]/.test(pw)) s += 20
  if (new Set(pw).size / pw.length > 0.6) s += 5
  return Math.min(100, s)
}
