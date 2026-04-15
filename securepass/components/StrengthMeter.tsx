'use client'

import { motion } from 'framer-motion'
import { styled } from '@/styles/stitches.config'
import type { StrengthLabel } from '@/lib/passwordAnalyzer'

// ── Strength definitions ──────────────────────────────────────────────────────

const STRENGTH_CONFIG: Record<
  StrengthLabel,
  { pct: number; color: string; trackColor: string; glow: string; segments: number }
> = {
  'Very Weak': {
    pct: 12,
    color: '#f87171',
    trackColor: 'rgba(248,113,113,0.2)',
    glow: '0 0 16px rgba(248,113,113,0.4)',
    segments: 1,
  },
  Weak: {
    pct: 33,
    color: '#fb923c',
    trackColor: 'rgba(251,146,60,0.2)',
    glow: '0 0 16px rgba(251,146,60,0.4)',
    segments: 2,
  },
  Moderate: {
    pct: 55,
    color: '#fbbf24',
    trackColor: 'rgba(251,191,36,0.2)',
    glow: '0 0 16px rgba(251,191,36,0.4)',
    segments: 3,
  },
  Strong: {
    pct: 78,
    color: '#34d399',
    trackColor: 'rgba(52,211,153,0.2)',
    glow: '0 0 16px rgba(52,211,153,0.4)',
    segments: 4,
  },
  'Very Strong': {
    pct: 100,
    color: '#22d3ee',
    trackColor: 'rgba(34,211,238,0.2)',
    glow: '0 0 20px rgba(34,211,238,0.5)',
    segments: 5,
  },
}

// ── Styled components ─────────────────────────────────────────────────────────

const Wrapper = styled('div', {})

const Header = styled('div', {
  flexBetween: true,
  mb: '$3',
})

const LabelWrap = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
})

const StrengthBadge = styled(motion.span, {
  fontSize: '$xs',
  fontWeight: '$semibold',
  px: '$3',
  py: '$1',
  borderRadius: '$full',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
})

const ScoreText = styled('span', {
  fontFamily: '$mono',
  fontSize: '$sm',
  color: '$textMuted',
})

// Segmented bar
const BarTrack = styled('div', {
  display: 'flex',
  gap: '4px',
  height: '8px',
  borderRadius: '$full',
  overflow: 'hidden',
})

const BarSegment = styled(motion.div, {
  flex: 1,
  borderRadius: '3px',
  background: 'rgba(255,255,255,0.07)',
})

const SectionLabel = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  mt: '$2',
  fontSize: '$xs',
  color: '$textMuted',
})

// Idle state label
const IdleText = styled('div', {
  fontSize: '$sm',
  color: '$textMuted',
  fontStyle: 'italic',
})

// ── Component ─────────────────────────────────────────────────────────────────

interface StrengthMeterProps {
  strength: StrengthLabel | null
  score: number
}

const TOTAL_SEGMENTS = 5

export function StrengthMeter({ strength, score }: StrengthMeterProps) {
  if (!strength) {
    return (
      <Wrapper>
        <BarTrack>
          {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
            <BarSegment key={i} />
          ))}
        </BarTrack>
        <SectionLabel>
          <IdleText>Enter a password to see strength</IdleText>
          <span>0 / 100</span>
        </SectionLabel>
      </Wrapper>
    )
  }

  const config = STRENGTH_CONFIG[strength]
  const filledSegments = config.segments

  return (
    <Wrapper>
      <Header>
        <LabelWrap>
          <StrengthBadge
            key={strength}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: config.trackColor,
              color: config.color,
              border: `1px solid ${config.color}40`,
              boxShadow: config.glow,
            }}
          >
            {strength}
          </StrengthBadge>
        </LabelWrap>
        <ScoreText>{score} / 100</ScoreText>
      </Header>

      {/* 5 segment bar */}
      <BarTrack>
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
          <BarSegment
            key={i}
            initial={{ opacity: 0.15 }}
            animate={{
              opacity: i < filledSegments ? 1 : 0.12,
              background:
                i < filledSegments ? config.color : 'rgba(255,255,255,0.07)',
              boxShadow: i < filledSegments ? config.glow : 'none',
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.06,
              ease: 'easeOut',
            }}
          />
        ))}
      </BarTrack>

      <SectionLabel>
        <span style={{ color: config.color }}>
          {strength === 'Very Weak' && 'Immediately crackable'}
          {strength === 'Weak' && 'Crackable within hours'}
          {strength === 'Moderate' && 'Moderate resistance'}
          {strength === 'Strong' && 'Good resistance'}
          {strength === 'Very Strong' && 'Excellent security'}
        </span>
        <span>{score} / 100</span>
      </SectionLabel>
    </Wrapper>
  )
}
