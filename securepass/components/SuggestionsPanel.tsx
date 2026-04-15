'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, CheckCircle } from 'lucide-react'
import { styled } from '@/styles/stitches.config'

// ── Styled components ─────────────────────────────────────────────────────────

const Panel = styled('div', {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',
  overflow: 'hidden',
})

const PanelHeader = styled('div', {
  px: '$5',
  py: '$4',
  borderBottom: '1px solid $borderSubtle',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
})

const PanelTitle = styled('div', {
  fontSize: '$sm',
  fontWeight: '$semibold',
  color: '$textSecondary',
  flex: 1,
})

const CountBadge = styled('div', {
  fontSize: '$xs',
  fontWeight: '$semibold',
  color: '$cyan400',
  background: '$cyanDim',
  border: '1px solid $cyanBorder',
  px: '$2',
  py: '2px',
  borderRadius: '$full',
})

const List = styled('ul', {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
})

const ListItem = styled(motion.li, {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '$3',
  px: '$5',
  py: '$4',
  borderBottom: '1px solid $borderSubtle',
  fontSize: '$sm',
  color: '$textSecondary',
  lineHeight: '$relaxed',
  '&:last-child': { borderBottom: 'none' },
  '&:hover': {
    background: 'rgba(255,255,255,0.02)',
  },
})

const BulletIcon = styled('div', {
  flexShrink: 0,
  mt: '2px',
})

const EmptyState = styled('div', {
  px: '$5',
  py: '$8',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$3',
  color: '$textMuted',
  fontSize: '$sm',
  textAlign: 'center',
})

// ── Component ─────────────────────────────────────────────────────────────────

interface SuggestionsPanelProps {
  suggestions: string[]
  strength?: string | null
}

export function SuggestionsPanel({ suggestions, strength }: SuggestionsPanelProps) {
  const hasAllGood = suggestions.some(
    (s) => s.includes('✅') || s.includes('Excellent')
  )

  return (
    <Panel>
      <PanelHeader>
        <Lightbulb size={15} color="var(--colors-cyan400)" />
        <PanelTitle>Recommendations</PanelTitle>
        {suggestions.length > 0 && (
          <CountBadge>{suggestions.length}</CountBadge>
        )}
      </PanelHeader>

      {suggestions.length === 0 ? (
        <EmptyState>
          <Lightbulb size={28} color="var(--colors-textMuted)" />
          <p>Run analysis to see personalized security recommendations.</p>
        </EmptyState>
      ) : (
        <List>
          <AnimatePresence initial={false}>
            {suggestions.map((suggestion, i) => (
              <ListItem
                key={suggestion}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.05 }}
              >
                <BulletIcon>
                  {hasAllGood && suggestion.includes('✅') ? (
                    <CheckCircle size={15} color="var(--colors-success)" />
                  ) : (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background:
                          suggestion.includes('❌') || suggestion.includes('⚠️')
                            ? 'var(--colors-danger)'
                            : 'var(--colors-cyan400)',
                        marginTop: '6px',
                      }}
                    />
                  )}
                </BulletIcon>
                <span>{suggestion}</span>
              </ListItem>
            ))}
          </AnimatePresence>
        </List>
      )}
    </Panel>
  )
}
