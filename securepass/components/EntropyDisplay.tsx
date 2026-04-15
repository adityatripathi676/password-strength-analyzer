'use client'

import { motion } from 'framer-motion'
import { Activity, Clock, Database, Hash } from 'lucide-react'
import { styled } from '@/styles/stitches.config'
import { entropyRating } from '@/lib/entropyCalculator'

// ── Styled components ─────────────────────────────────────────────────────────

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '$3',
  '@sm': { gridTemplateColumns: 'repeat(4, 1fr)' },
})

const StatCard = styled(motion.div, {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',
  p: '$4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  transition: '$normal',
  '&:hover': {
    borderColor: 'rgba(255,255,255,0.12)',
    background: '$bgCardHover',
  },
})

const StatIcon = styled('div', {
  size: '32px',
  borderRadius: '$md',
  flexCenter: true,
  mb: '$1',
})

const StatValue = styled('div', {
  fontFamily: '$mono',
  fontWeight: '$bold',
  fontSize: '$xl',
  color: '$textPrimary',
  lineHeight: '$tight',
})

const StatLabel = styled('div', {
  fontSize: '$xs',
  color: '$textMuted',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontWeight: '$medium',
})

const StatSub = styled('div', {
  fontSize: '$xs',
  color: '$textMuted',
  mt: '$1',
})

const SkeletonValue = styled('div', {
  height: '28px',
  width: '70%',
  borderRadius: '$sm',
  background: 'rgba(255,255,255,0.06)',
})

// ── Component ─────────────────────────────────────────────────────────────────

interface EntropyDisplayProps {
  entropy: number | null
  crack_time: string | null
  score: number | null
  pool_size: number | null
}

export function EntropyDisplay({
  entropy,
  crack_time,
  score,
  pool_size,
}: EntropyDisplayProps) {
  const hasData = entropy !== null

  const stats = [
    {
      icon: Activity,
      iconBg: 'rgba(34,211,238,0.15)',
      iconColor: '#22d3ee',
      label: 'Entropy',
      value: hasData ? `${entropy!.toFixed(1)}b` : null,
      sub: hasData ? entropyRating(entropy!) : '—',
    },
    {
      icon: Clock,
      iconBg: 'rgba(251,191,36,0.15)',
      iconColor: '#fbbf24',
      label: 'Crack Time',
      value: hasData ? formatCrackTime(crack_time!) : null,
      sub: hasData ? 'at 10B guesses/sec' : '—',
    },
    {
      icon: Hash,
      iconBg: 'rgba(167,139,250,0.15)',
      iconColor: '#a78bfa',
      label: 'Security Score',
      value: hasData ? `${score!}/100` : null,
      sub: hasData ? scoreGrade(score!) : '—',
    },
    {
      icon: Database,
      iconBg: 'rgba(52,211,153,0.15)',
      iconColor: '#34d399',
      label: 'Char Pool',
      value: hasData ? `${pool_size}` : null,
      sub: hasData ? `${pool_size} possible chars` : '—',
    },
  ]

  return (
    <Grid>
      {stats.map((stat, i) => (
        <StatCard
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <StatIcon style={{ background: stat.iconBg }}>
            <stat.icon size={16} color={stat.iconColor} />
          </StatIcon>
          <StatLabel>{stat.label}</StatLabel>
          {stat.value !== null ? (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <StatValue>{stat.value}</StatValue>
            </motion.div>
          ) : (
            <SkeletonValue />
          )}
          <StatSub>{stat.sub}</StatSub>
        </StatCard>
      ))}
    </Grid>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCrackTime(raw: string): string {
  // Shorten very long strings for the card
  if (raw.length > 18) return raw.split(' ').slice(0, 2).join(' ')
  return raw
}

function scoreGrade(score: number): string {
  if (score < 20) return 'F — Critical'
  if (score < 40) return 'D — Poor'
  if (score < 60) return 'C — Fair'
  if (score < 80) return 'B — Good'
  return 'A — Excellent'
}
