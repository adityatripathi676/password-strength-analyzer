'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, Copy, Check, RefreshCw } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'
import { styled } from '@/styles/stitches.config'

// ── Styled components ─────────────────────────────────────────────────────────

const Card = styled('div', {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$xl',
  p: '$6',
})

const SectionHeading = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  mb: '$6',
})

const Title = styled('h3', {
  fontSize: '$base',
  fontWeight: '$semibold',
  color: '$textPrimary',
})

const Sub = styled('p', {
  fontSize: '$xs',
  color: '$textMuted',
  mt: '$1',
})

// Output field
const OutputRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  mb: '$6',
})

const PasswordOutput = styled('div', {
  flex: 1,
  background: '$bgInput',
  border: '1px solid $border',
  borderRadius: '$lg',
  px: '$5',
  py: '$4',
  fontFamily: '$mono',
  fontSize: '$base',
  color: '$textPrimary',
  letterSpacing: '0.06em',
  minHeight: '52px',
  display: 'flex',
  alignItems: 'center',
  wordBreak: 'break-all',
})

const EmptyOutput = styled('span', {
  color: '$textMuted',
  fontFamily: '$sans',
  letterSpacing: 'normal',
  fontSize: '$sm',
})

const IconBtn = styled('button', {
  flexShrink: 0,
  size: '44px',
  borderRadius: '$lg',
  border: '1px solid $border',
  background: '$bgInput',
  color: '$textMuted',
  cursor: 'pointer',
  transition: '$fast',
  flexCenter: true,
  '&:hover': {
    borderColor: '$cyanBorder',
    color: '$cyan400',
    background: '$cyanDim',
  },
})

// Controls
const Controls = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$5',
})

const ControlRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$4',
})

const ControlLabel = styled('label', {
  fontSize: '$sm',
  color: '$textSecondary',
  cursor: 'pointer',
  userSelect: 'none',
})

const LengthRow = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

const LengthLabel = styled('div', {
  flexBetween: true,
})

const LengthValue = styled('span', {
  fontFamily: '$mono',
  fontSize: '$sm',
  fontWeight: '$semibold',
  color: '$cyan400',
  background: '$cyanDim',
  border: '1px solid $cyanBorder',
  px: '$3',
  py: '$1',
  borderRadius: '$full',
})

// Radix slider styles
const SliderRoot = styled(Slider.Root, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  width: '100%',
  height: '20px',
})

const SliderTrack = styled(Slider.Track, {
  background: 'rgba(255,255,255,0.1)',
  position: 'relative',
  flexGrow: 1,
  borderRadius: '$full',
  height: '4px',
})

const SliderRange = styled(Slider.Range, {
  position: 'absolute',
  background: 'linear-gradient(90deg, $cyan500, $purple500)',
  borderRadius: '$full',
  height: '100%',
})

const SliderThumb = styled(Slider.Thumb, {
  display: 'block',
  size: '18px',
  background: '$textPrimary',
  borderRadius: '$full',
  border: '2px solid $cyan500',
  cursor: 'pointer',
  transition: '$fast',
  '&:hover': {
    boxShadow: '0 0 0 6px $cyanGlow',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 6px $cyanGlow',
  },
})

// Switch styles
const SwitchRoot = styled(Switch.Root, {
  width: '36px',
  height: '20px',
  borderRadius: '$full',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid $border',
  cursor: 'pointer',
  transition: '$fast',
  flexShrink: 0,
  '&[data-state="checked"]': {
    background: '$cyan500',
    borderColor: '$cyan500',
    boxShadow: '0 0 12px rgba(6,182,212,0.4)',
  },
})

const SwitchThumb = styled(Switch.Thumb, {
  display: 'block',
  size: '14px',
  background: 'white',
  borderRadius: '$full',
  transform: 'translateX(2px)',
  transition: 'transform 0.2s',
  '&[data-state="checked"]': {
    transform: 'translateX(18px)',
  },
})

// Generate button
const GenerateBtn = styled('button', {
  width: '100%',
  mt: '$6',
  py: '$4',
  borderRadius: '$lg',
  background: 'linear-gradient(135deg, $cyan500, $purple500)',
  color: '$textPrimary',
  fontFamily: '$sans',
  fontWeight: '$semibold',
  fontSize: '$sm',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  transition: '$fast',
  boxShadow: '0 4px 20px rgba(34,211,238,0.2)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 28px rgba(34,211,238,0.35)',
  },
  '&:active': { transform: 'translateY(0)' },
})

// ── Password generation logic ─────────────────────────────────────────────────

function generatePassword(opts: {
  length: number
  upper: boolean
  digits: boolean
  symbols: boolean
  noAmbiguous: boolean
}): string {
  const LOWER = opts.noAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz'
  const UPPER = opts.noAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const DIGITS = opts.noAmbiguous ? '23456789' : '0123456789'
  const SYMBOLS = '!@#$%^&*()-_+=[]{}|;:,.<>?'

  let pool = LOWER
  const required: string[] = []

  if (opts.upper)   { pool += UPPER;   required.push(randomFrom(UPPER)) }
  if (opts.digits)  { pool += DIGITS;  required.push(randomFrom(DIGITS)) }
  if (opts.symbols) { pool += SYMBOLS; required.push(randomFrom(SYMBOLS)) }

  // Fill remaining length
  const remaining = opts.length - required.length
  const random = Array.from({ length: Math.max(0, remaining) }, () => randomFrom(pool))

  // Shuffle the combined array
  const all = [...required, ...random]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }

  return all.join('')
}

function randomFrom(s: string): string {
  return s[Math.floor(Math.random() * s.length)]
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PasswordGeneratorProps {
  onUsePassword?: (pw: string) => void
}

export function PasswordGenerator({ onUsePassword }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16)
  const [upper, setUpper] = useState(true)
  const [digits, setDigits] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [noAmbiguous, setNoAmbiguous] = useState(false)
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    const pw = generatePassword({ length, upper, digits, symbols, noAmbiguous })
    setGenerated(pw)
    setCopied(false)
  }, [length, upper, digits, symbols, noAmbiguous])

  const copyToClipboard = useCallback(async () => {
    if (!generated) return
    await navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [generated])

  return (
    <Card>
      <SectionHeading>
        <Shuffle size={18} color="var(--colors-purple400)" />
        <div>
          <Title>Password Generator</Title>
          <Sub>Cryptographically random passwords</Sub>
        </div>
      </SectionHeading>

      {/* Output */}
      <OutputRow>
        <PasswordOutput>
          {generated ? (
            <motion.span
              key={generated}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {generated}
            </motion.span>
          ) : (
            <EmptyOutput>Click generate to create a password</EmptyOutput>
          )}
        </PasswordOutput>
        <IconBtn onClick={copyToClipboard} title="Copy to clipboard" type="button">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </IconBtn>
        {onUsePassword && generated && (
          <IconBtn onClick={() => onUsePassword(generated)} title="Use this password" type="button">
            <RefreshCw size={16} />
          </IconBtn>
        )}
      </OutputRow>

      {/* Controls */}
      <Controls>
        {/* Length */}
        <LengthRow>
          <LengthLabel>
            <ControlLabel>Length</ControlLabel>
            <LengthValue>{length} chars</LengthValue>
          </LengthLabel>
          <SliderRoot
            value={[length]}
            min={8}
            max={64}
            step={1}
            onValueChange={([v]) => setLength(v)}
            aria-label="Password length"
          >
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb />
          </SliderRoot>
        </LengthRow>

        {/* Toggles */}
        {[
          { label: 'Uppercase letters (A–Z)', id: 'upper', val: upper, set: setUpper },
          { label: 'Numbers (0–9)', id: 'digits', val: digits, set: setDigits },
          { label: 'Symbols (!@#$…)', id: 'symbols', val: symbols, set: setSymbols },
          { label: 'Avoid ambiguous characters', id: 'ambiguous', val: noAmbiguous, set: setNoAmbiguous },
        ].map(({ label, id, val, set }) => (
          <ControlRow key={id}>
            <ControlLabel htmlFor={id}>{label}</ControlLabel>
            <SwitchRoot id={id} checked={val} onCheckedChange={set}>
              <SwitchThumb />
            </SwitchRoot>
          </ControlRow>
        ))}
      </Controls>

      <GenerateBtn onClick={generate} type="button">
        <Shuffle size={16} />
        Generate Password
      </GenerateBtn>
    </Card>
  )
}
