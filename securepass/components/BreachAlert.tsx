'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ShieldOff, Loader2, CheckCircle } from 'lucide-react'
import { styled } from '@/styles/stitches.config'

// ── Styled ────────────────────────────────────────────────────────────────────

const Alert = styled(motion.div, {
  borderRadius: '$lg',
  p: '$4',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '$3',
  border: '1px solid',
  variants: {
    variant: {
      breached: {
        background: '$dangerDim',
        borderColor: '$dangerBorder',
      },
      safe: {
        background: '$successDim',
        borderColor: '$successBorder',
      },
      loading: {
        background: 'rgba(255,255,255,0.04)',
        borderColor: '$border',
      },
    },
  },
})

const IconWrap = styled('div', {
  flexShrink: 0,
  mt: '1px',
})

const Content = styled('div', {
  flex: 1,
})

const AlertTitle = styled('div', {
  fontWeight: '$semibold',
  fontSize: '$sm',
  mb: '$1',
  variants: {
    variant: {
      breached: { color: '$danger' },
      safe:     { color: '$success' },
      loading:  { color: '$textSecondary' },
    },
  },
})

const AlertBody = styled('div', {
  fontSize: '$sm',
  lineHeight: '$relaxed',
  variants: {
    variant: {
      breached: { color: 'rgba(248,113,113,0.8)' },
      safe:     { color: 'rgba(52,211,153,0.8)' },
      loading:  { color: '$textMuted' },
    },
  },
})

const CountBadge = styled('span', {
  fontFamily: '$mono',
  fontWeight: '$bold',
  fontSize: '$base',
})

const SpinWrap = styled(motion.div, {
  display: 'inline-flex',
})

// ── Component ─────────────────────────────────────────────────────────────────

interface BreachAlertProps {
  status: 'idle' | 'loading' | 'breached' | 'safe'
  breach_count?: number
}

export function BreachAlert({ status, breach_count = 0 }: BreachAlertProps) {
  return (
    <AnimatePresence mode="wait">
      {status === 'loading' && (
        <Alert
          key="loading"
          variant="loading"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <IconWrap>
            <SpinWrap
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Loader2 size={18} color="var(--colors-textMuted)" />
            </SpinWrap>
          </IconWrap>
          <Content>
            <AlertTitle variant="loading">Checking Breach Database</AlertTitle>
            <AlertBody variant="loading">
              Querying HaveIBeenPwned via k-Anonymity model…
            </AlertBody>
          </Content>
        </Alert>
      )}

      {status === 'breached' && (
        <Alert
          key="breached"
          variant="breached"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <IconWrap>
            <ShieldOff size={18} color="var(--colors-danger)" />
          </IconWrap>
          <Content>
            <AlertTitle variant="breached">
              ⚠️ Password Found in Data Breaches
            </AlertTitle>
            <AlertBody variant="breached">
              This password has been exposed in{' '}
              <CountBadge>
                {breach_count.toLocaleString()}
              </CountBadge>{' '}
              known data breach
              {breach_count === 1 ? '' : 'es'}. Using it puts your accounts at
              immediate risk. Do <strong>NOT</strong> use this password.
            </AlertBody>
          </Content>
        </Alert>
      )}

      {status === 'safe' && (
        <Alert
          key="safe"
          variant="safe"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <IconWrap>
            <CheckCircle size={18} color="var(--colors-success)" />
          </IconWrap>
          <Content>
            <AlertTitle variant="safe">Not Found in Breach Databases</AlertTitle>
            <AlertBody variant="safe">
              Good news — this password has not appeared in any known data
              breaches. This does not guarantee complete security, but it's a
              positive signal.
            </AlertBody>
          </Content>
        </Alert>
      )}
    </AnimatePresence>
  )
}
