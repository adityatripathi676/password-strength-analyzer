'use client'

import Link from 'next/link'
import { Shield, Github, Twitter, ExternalLink } from 'lucide-react'
import { styled } from '@/styles/stitches.config'

const FooterWrap = styled('footer', {
  borderTop: '1px solid $borderSubtle',
  background: 'linear-gradient(to top, rgba(34,211,238,0.03), transparent)',
  mt: '$24',
})

const FooterInner = styled('div', {
  maxWidth: '$content',
  mx: 'auto',
  px: '$6',
  py: '$16',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$12',
  '@md': { gridTemplateColumns: '2fr 1fr 1fr 1fr' },
})

const Brand = styled('div', {})

const BrandRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  mb: '$4',
})

const BrandIcon = styled('div', {
  size: '32px',
  borderRadius: '$md',
  background: 'linear-gradient(135deg, $cyan400, $purple500)',
  flexCenter: true,
})

const BrandName = styled('span', {
  fontWeight: '$bold',
  fontSize: '$base',
  background: 'linear-gradient(90deg, $cyan400, $purple400)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
})

const BrandDesc = styled('p', {
  fontSize: '$sm',
  color: '$textMuted',
  lineHeight: '$relaxed',
  maxWidth: '240px',
  mb: '$6',
})

const SocialRow = styled('div', {
  display: 'flex',
  gap: '$3',
})

const SocialLink = styled('a', {
  size: '34px',
  borderRadius: '$md',
  border: '1px solid $border',
  background: '$bgInput',
  flexCenter: true,
  color: '$textMuted',
  transition: '$fast',
  textDecoration: 'none',
  '&:hover': {
    color: '$textSecondary',
    borderColor: '$cyanBorder',
    background: '$cyanDim',
  },
})

const FooterSection = styled('div', {})

const SectionTitle = styled('div', {
  fontSize: '$xs',
  fontWeight: '$semibold',
  color: '$textMuted',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  mb: '$4',
})

const FooterLinks = styled('ul', {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

const FooterLink = styled(Link, {
  fontSize: '$sm',
  color: '$textMuted',
  textDecoration: 'none',
  transition: '$fast',
  display: 'flex',
  alignItems: 'center',
  gap: '$1',
  '&:hover': { color: '$cyan400' },
})

const FooterBottom = styled('div', {
  maxWidth: '$content',
  mx: 'auto',
  px: '$6',
  py: '$6',
  borderTop: '1px solid $borderSubtle',
  flexBetween: true,
  flexDirection: 'column',
  gap: '$2',
  '@sm': { flexDirection: 'row' },
})

const Copyright = styled('p', {
  fontSize: '$xs',
  color: '$textMuted',
})

const SecurityNote = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  fontSize: '$xs',
  color: '$textMuted',
})

const GreenDot = styled('div', {
  size: '6px',
  borderRadius: '$full',
  background: '$success',
  boxShadow: '0 0 6px $success',
})

// ── Footer sections ─────────────────────────────────────────────────────────

const PRODUCT_LINKS = [
  { label: 'Analyzer',   href: '/analyzer' },
  { label: 'Features',   href: '#features' },
  { label: 'Security',   href: '#security' },
]

const RESOURCE_LINKS = [
  { label: 'Documentation', href: '#' },
  { label: 'API Reference',  href: '#' },
  { label: 'GitHub',         href: 'https://github.com', external: true },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Security',       href: '#' },
  { label: 'Terms of Use',   href: '#' },
]

export function Footer() {
  return (
    <FooterWrap>
      <FooterInner>
        {/* Brand */}
        <Brand>
          <BrandRow>
            <BrandIcon>
              <Shield size={16} color="white" />
            </BrandIcon>
            <BrandName>SecurePass</BrandName>
          </BrandRow>
          <BrandDesc>
            Enterprise-grade password intelligence powered by advanced entropy
            analysis and real-world breach intelligence.
          </BrandDesc>
          <SocialRow>
            <SocialLink href="https://github.com" target="_blank" aria-label="GitHub">
              <Github size={16} />
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" aria-label="Twitter">
              <Twitter size={16} />
            </SocialLink>
          </SocialRow>
        </Brand>

        {/* Product */}
        <FooterSection>
          <SectionTitle>Product</SectionTitle>
          <FooterLinks>
            {PRODUCT_LINKS.map((l) => (
              <li key={l.href}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </FooterLinks>
        </FooterSection>

        {/* Resources */}
        <FooterSection>
          <SectionTitle>Resources</SectionTitle>
          <FooterLinks>
            {RESOURCE_LINKS.map((l) => (
              <li key={l.label}>
                <FooterLink href={l.href} {...(l.external ? { target: '_blank' } : {})}>
                  {l.label}
                  {l.external && <ExternalLink size={11} />}
                </FooterLink>
              </li>
            ))}
          </FooterLinks>
        </FooterSection>

        {/* Legal */}
        <FooterSection>
          <SectionTitle>Legal</SectionTitle>
          <FooterLinks>
            {LEGAL_LINKS.map((l) => (
              <li key={l.label}>
                <FooterLink href={l.href}>{l.label}</FooterLink>
              </li>
            ))}
          </FooterLinks>
        </FooterSection>
      </FooterInner>

      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} SecurePass Analyzer. Built for security professionals.
        </Copyright>
        <SecurityNote>
          <GreenDot />
          Passwords processed in-memory only. Never stored or transmitted.
        </SecurityNote>
      </FooterBottom>
    </FooterWrap>
  )
}
