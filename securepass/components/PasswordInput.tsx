'use client'

import { useState, useRef, useCallback } from 'react'
import { Eye, EyeOff, X, Lock } from 'lucide-react'
import { styled } from '@/styles/stitches.config'

// ── Styled components ─────────────────────────────────────────────────────────

const Wrapper = styled('div', {
  position: 'relative',
})

const Label = styled('label', {
  display: 'block',
  fontSize: '$xs',
  fontWeight: '$semibold',
  color: '$textMuted',
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
  mb: '$2',
})

const InputContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  background: '$bgInput',
  border: '1px solid $border',
  borderRadius: '$lg',
  transition: '$normal',
  '&:focus-within': {
    borderColor: '$cyanBorder',
    background: '$bgInputFocus',
    boxShadow: '0 0 0 3px $cyanGlow',
  },
  variants: {
    hasValue: {
      true: { borderColor: 'rgba(255,255,255,0.12)' },
    },
  },
})

const LockIcon = styled('div', {
  pl: '$4',
  pr: '$2',
  color: '$textMuted',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
})

const Input = styled('input', {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  fontFamily: '$mono',
  fontSize: '$base',
  color: '$textPrimary',
  py: '$4',
  pr: '$2',
  letterSpacing: '0.06em',
  width: '100%',
  '&::placeholder': {
    color: '$textMuted',
    fontFamily: '$sans',
    letterSpacing: 'normal',
    fontSize: '$sm',
  },
})

const ActionButton = styled('button', {
  flexShrink: 0,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '$textMuted',
  p: '$3',
  borderRadius: '$md',
  transition: '$fast',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': { color: '$textSecondary', background: 'rgba(255,255,255,0.05)' },
})

const CharCount = styled('div', {
  position: 'absolute',
  bottom: '-$7',
  right: 0,
  fontSize: '$xs',
  color: '$textMuted',
  variants: {
    warn: {
      true: { color: '$warning' },
    },
  },
})

// ── Component ─────────────────────────────────────────────────────────────────

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  maxLength?: number
  id?: string
}

export function PasswordInput({
  value,
  onChange,
  placeholder = 'Enter password to analyze…',
  label = 'Password',
  disabled = false,
  maxLength = 512,
  id = 'password-input',
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = useCallback(() => {
    onChange('')
    inputRef.current?.focus()
  }, [onChange])

  const handleToggleVisible = useCallback(() => {
    setVisible((v) => !v)
    // Keep cursor at end after type toggle
    setTimeout(() => {
      const el = inputRef.current
      if (el) {
        const len = el.value.length
        el.setSelectionRange(len, len)
        el.focus()
      }
    }, 0)
  }, [])

  return (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputContainer hasValue={value.length > 0}>
        <LockIcon>
          <Lock size={16} />
        </LockIcon>

        <Input
          ref={inputRef}
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"  /* prevent LastPass interference */
        />

        {/* Clear button */}
        {value && (
          <ActionButton onClick={handleClear} aria-label="Clear password" type="button">
            <X size={16} />
          </ActionButton>
        )}

        {/* Show/hide toggle */}
        <ActionButton
          onClick={handleToggleVisible}
          aria-label={visible ? 'Hide password' : 'Show password'}
          type="button"
          style={{ marginRight: '4px' }}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </ActionButton>
      </InputContainer>

      {/* Character count */}
      {value.length > 0 && (
        <CharCount warn={value.length > maxLength * 0.9}>
          {value.length}/{maxLength}
        </CharCount>
      )}
    </Wrapper>
  )
}
