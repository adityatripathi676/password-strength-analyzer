'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Shield, Github, Menu, X, ChevronRight, Zap } from 'lucide-react'
import { styled } from '@/styles/stitches.config'

// ── Styled components ─────────────────────────────────────────────────────────

const Nav = styled('nav', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: '$sticky',
  transition: '$normal',
  variants: {
    scrolled: {
      true: {
        background: 'rgba(7, 8, 15, 0.90)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid $border',
      },
      false: {
        background: 'transparent',
        backdropFilter: 'none',
      },
    },
  },
})

const NavInner = styled('div', {
  maxWidth: '$content',
  mx: 'auto',
  px: '$6',
  height: '64px',
  flexBetween: true,
  gap: '$4',
})

const LogoWrap = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  textDecoration: 'none',
})

const LogoIcon = styled('div', {
  size: '34px',
  borderRadius: '$md',
  background: 'linear-gradient(135deg, $cyan400, $purple500)',
  flexCenter: true,
  boxShadow: '0 0 20px rgba(34,211,238,0.3)',
  flexShrink: 0,
})

const LogoText = styled('span', {
  fontFamily: '$sans',
  fontWeight: '$bold',
  fontSize: '$lg',
  background: 'linear-gradient(90deg, $cyan400, $purple400)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.02em',
})

const NavLinks = styled('div', {
  display: 'none',
  alignItems: 'center',
  gap: '$1',
  '@md': { display: 'flex' },
})

const NavLink = styled(Link, {
  px: '$4',
  py: '$2',
  borderRadius: '$md',
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$textSecondary',
  transition: '$fast',
  textDecoration: 'none',
  '&:hover': {
    color: '$textPrimary',
    background: 'rgba(255,255,255,0.06)',
  },
})

const NavActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
})

const GithubLink = styled('a', {
  color: '$textMuted',
  display: 'flex',
  alignItems: 'center',
  transition: '$fast',
  '&:hover': { color: '$textSecondary' },
})

const CtaButton = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  px: '$5',
  py: '$2',
  borderRadius: '$full',
  fontSize: '$sm',
  fontWeight: '$semibold',
  textDecoration: 'none',
  background: 'linear-gradient(135deg, $cyan500, $purple500)',
  color: '$textPrimary',
  transition: '$fast',
  boxShadow: '0 0 20px rgba(34,211,238,0.2)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 0 30px rgba(34,211,238,0.35)',
  },
})

const MobileMenuBtn = styled('button', {
  display: 'flex',
  '@md': { display: 'none' },
  background: 'none',
  border: 'none',
  color: '$textSecondary',
  cursor: 'pointer',
  p: '$2',
})

const MobileMenu = styled(motion.div, {
  position: 'fixed',
  top: '64px',
  left: 0,
  right: 0,
  background: 'rgba(7, 8, 15, 0.98)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid $border',
  p: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  zIndex: '$sticky',
})

const MobileLink = styled(Link, {
  px: '$4',
  py: '$3',
  borderRadius: '$md',
  fontSize: '$base',
  fontWeight: '$medium',
  color: '$textSecondary',
  transition: '$fast',
  textDecoration: 'none',
  '&:hover': {
    color: '$textPrimary',
    background: 'rgba(255,255,255,0.06)',
  },
})

// ── Component ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Features',  href: '#features' },
  { label: 'Analyzer',  href: '/analyzer' },
  { label: 'Security',  href: '#security' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Nav scrolled={scrolled}>
        <NavInner>
          {/* Logo */}
          <LogoWrap href="/">
            <LogoIcon>
              <Shield size={18} color="white" />
            </LogoIcon>
            <LogoText>SecurePass</LogoText>
          </LogoWrap>

          {/* Desktop nav */}
          <NavLinks>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </NavLinks>

          {/* Actions */}
          <NavActions>
            <GithubLink
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github size={20} />
            </GithubLink>
            <CtaButton href="/analyzer">
              <Zap size={14} />
              Try Analyzer
            </CtaButton>
            <MobileMenuBtn
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </MobileMenuBtn>
          </NavActions>
        </NavInner>
      </Nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {NAV_ITEMS.map((item) => (
              <MobileLink
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </MobileLink>
            ))}
            <MobileLink
              href="https://github.com"
              onClick={() => setMobileOpen(false)}
            >
              GitHub <ChevronRight size={14} style={{ display: 'inline' }} />
            </MobileLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  )
}
