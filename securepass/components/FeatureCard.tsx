'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { styled } from '@/styles/stitches.config'

// ── Styled components ─────────────────────────────────────────────────────────

const Card = styled(motion.div, {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$xl',
  p: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  cursor: 'default',
  transition: '$normal',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    background:
      'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34,211,238,0.04), transparent 40%)',
  },
  '&:hover': {
    borderColor: 'rgba(255,255,255,0.12)',
    boxShadow: '$card',
    '&::before': { opacity: 1 },
  },
})

const IconBox = styled('div', {
  size: '44px',
  borderRadius: '$lg',
  flexCenter: true,
  position: 'relative',
})

const IconGlow = styled('div', {
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  opacity: 0.5,
  filter: 'blur(8px)',
})

const CardTitle = styled('h3', {
  fontSize: '$base',
  fontWeight: '$semibold',
  color: '$textPrimary',
  lineHeight: '$tight',
})

const CardDesc = styled('p', {
  fontSize: '$sm',
  color: '$textMuted',
  lineHeight: '$relaxed',
})

const FeatureBadge = styled('div', {
  alignSelf: 'flex-start',
  fontSize: '$2xs',
  fontWeight: '$semibold',
  px: '$2',
  py: '3px',
  borderRadius: '$full',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
})

// ── Component ─────────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
  accentColor?: string
  index?: number
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
  accentColor = '#22d3ee',
  index = 0,
}: FeatureCardProps) {
  const dimColor = accentColor + '20'
  const borderColor = accentColor + '35'

  return (
    <Card
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <IconBox style={{ background: dimColor, border: `1px solid ${borderColor}` }}>
        <IconGlow style={{ background: accentColor }} />
        <Icon size={20} color={accentColor} style={{ position: 'relative', zIndex: 1 }} />
      </IconBox>

      <div>
        <CardTitle>{title}</CardTitle>
        {badge && (
          <FeatureBadge
            style={{
              background: dimColor,
              color: accentColor,
              border: `1px solid ${borderColor}`,
              marginTop: '8px',
            }}
          >
            {badge}
          </FeatureBadge>
        )}
      </div>

      <CardDesc>{description}</CardDesc>
    </Card>
  )
}
