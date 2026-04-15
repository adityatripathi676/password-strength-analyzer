'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield, Activity, Database, Zap, Lock, TrendingUp,
  ArrowRight, ShieldCheck, AlertTriangle, Key, Globe,
  Users, Star,
} from 'lucide-react'
import { styled, applyGlobalStyles, fadeUp } from '@/styles/stitches.config'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FeatureCard } from '@/components/FeatureCard'

// Apply global styles (fonts, resets, scrollbar)
// Must be called in a client component outside render
applyGlobalStyles()

// ── Layout primitives ─────────────────────────────────────────────────────────

const Page = styled('div', {
  minHeight: '100vh',
  background: '$bgBase',
  overflowX: 'hidden',
})

// ── Background decoration ─────────────────────────────────────────────────────

const BgDecor = styled('div', {
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  overflow: 'hidden',
})

const BgBlob = styled('div', {
  position: 'absolute',
  borderRadius: '$full',
  filter: 'blur(80px)',
  opacity: 0.12,
})

// Grid overlay
const GridOverlay = styled('div', {
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
  `,
  backgroundSize: '60px 60px',
})

// ── Hero section ──────────────────────────────────────────────────────────────

const HeroSection = styled('section', {
  position: 'relative',
  zIndex: 1,
  pt: '$36',
  pb: '$24',
  px: '$6',
})

const HeroInner = styled('div', {
  maxWidth: '$content',
  mx: 'auto',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$16',
  alignItems: 'center',
  '@lg': { gridTemplateColumns: '1fr 1fr' },
})

const HeroTextBlock = styled('div', {})

const PreBadge = styled(motion.div, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$2',
  px: '$4',
  py: '$2',
  borderRadius: '$full',
  border: '1px solid $cyanBorder',
  background: '$cyanDim',
  fontSize: '$xs',
  fontWeight: '$semibold',
  color: '$cyan400',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  mb: '$6',
})

const PulseDot = styled('div', {
  size: '6px',
  borderRadius: '$full',
  background: '$cyan400',
  boxShadow: '0 0 6px $cyan400',
  animation: `${fadeUp} 2s ease-in-out infinite alternate`,
})

const HeroHeadline = styled(motion.h1, {
  fontSize: '$4xl',
  fontWeight: '$extrabold',
  lineHeight: '$tight',
  letterSpacing: '-0.03em',
  color: '$textPrimary',
  mb: '$6',
  '@md': { fontSize: '$5xl' },
  '@lg': { fontSize: '$6xl' },
})

const GradientSpan = styled('span', {
  background: 'linear-gradient(135deg, $cyan400, $purple400)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
})

const HeroSub = styled(motion.p, {
  fontSize: '$lg',
  color: '$textSecondary',
  lineHeight: '$relaxed',
  maxWidth: '520px',
  mb: '$8',
})

const CtaRow = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',
  flexWrap: 'wrap',
})

const PrimaryBtn = styled(Link, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$2',
  px: '$6',
  py: '$4',
  borderRadius: '$lg',
  fontWeight: '$semibold',
  fontSize: '$base',
  textDecoration: 'none',
  background: 'linear-gradient(135deg, $cyan500, $purple500)',
  color: '$textPrimary',
  boxShadow: '0 4px 24px rgba(34,211,238,0.3)',
  transition: '$fast',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(34,211,238,0.45)',
  },
})

const SecondaryBtn = styled(Link, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$2',
  px: '$6',
  py: '$4',
  borderRadius: '$lg',
  fontWeight: '$medium',
  fontSize: '$base',
  textDecoration: 'none',
  color: '$textSecondary',
  border: '1px solid $border',
  transition: '$fast',
  '&:hover': {
    color: '$textPrimary',
    borderColor: 'rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.04)',
  },
})

// ── Hero demo card ────────────────────────────────────────────────────────────

const DemoCard = styled(motion.div, {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$xl',
  overflow: 'hidden',
  backdropFilter: 'blur(16px)',
  boxShadow: '$card, $cyanGlow',
})

const DemoHeader = styled('div', {
  px: '$5',
  py: '$4',
  borderBottom: '1px solid $borderSubtle',
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
})

const DotRow = styled('div', {
  display: 'flex',
  gap: '$2',
})

const TrafficDot = styled('div', {
  size: '10px',
  borderRadius: '$full',
  variants: {
    color: {
      red:    { background: '#f87171' },
      yellow: { background: '#fbbf24' },
      green:  { background: '#34d399' },
    },
  },
})

const DemoTitle = styled('span', {
  fontSize: '$xs',
  color: '$textMuted',
  fontFamily: '$mono',
  flex: 1,
})

const DemoBody = styled('div', {
  p: '$5',
  display: 'flex',
  flexDirection: 'column',
  gap: '$5',
})

const DemoPwRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  background: '$bgInput',
  border: '1px solid $border',
  borderRadius: '$lg',
  px: '$4',
  py: '$3',
})

const DemoPwText = styled('div', {
  fontFamily: '$mono',
  fontSize: '$sm',
  color: '$textPrimary',
  letterSpacing: '0.1em',
  flex: 1,
})

const DemoLockIcon = styled('div', {
  color: '$textMuted',
})

const SegBar = styled('div', {
  display: 'flex',
  gap: '3px',
  height: '6px',
})

const Seg = styled(motion.div, {
  flex: 1,
  borderRadius: '2px',
})

const MetricsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '$3',
})

const MetricChip = styled('div', {
  background: '$bgInput',
  borderRadius: '$md',
  p: '$3',
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

const MetricLabel = styled('div', {
  fontSize: '$2xs',
  color: '$textMuted',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
})

const MetricVal = styled('div', {
  fontFamily: '$mono',
  fontSize: '$sm',
  fontWeight: '$bold',
  color: '$cyan400',
})

// ── Stats bar ─────────────────────────────────────────────────────────────────

const StatsBar = styled('section', {
  position: 'relative',
  zIndex: 1,
  borderTop: '1px solid $borderSubtle',
  borderBottom: '1px solid $borderSubtle',
  background: 'rgba(255,255,255,0.02)',
  py: '$8',
})

const StatsInner = styled('div', {
  maxWidth: '$content',
  mx: 'auto',
  px: '$6',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '$12',
})

const StatItem = styled(motion.div, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$1',
})

const StatNum = styled('div', {
  fontFamily: '$mono',
  fontWeight: '$extrabold',
  fontSize: '$3xl',
  background: 'linear-gradient(135deg, $cyan400, $purple400)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
})

const StatText = styled('div', {
  fontSize: '$sm',
  color: '$textMuted',
})

// ── Features section ──────────────────────────────────────────────────────────

const Section = styled('section', {
  position: 'relative',
  zIndex: 1,
  py: '$24',
  px: '$6',
})

const SectionInner = styled('div', {
  maxWidth: '$content',
  mx: 'auto',
})

const SectionLabel = styled(motion.div, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$2',
  px: '$3',
  py: '$1',
  borderRadius: '$full',
  fontSize: '$xs',
  fontWeight: '$semibold',
  color: '$purple400',
  background: '$purpleDim',
  border: '1px solid $purpleBorder',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  mb: '$4',
})

const SectionTitle = styled(motion.h2, {
  fontSize: '$3xl',
  fontWeight: '$extrabold',
  letterSpacing: '-0.02em',
  color: '$textPrimary',
  mb: '$4',
  '@md': { fontSize: '$4xl' },
})

const SectionSub = styled(motion.p, {
  fontSize: '$lg',
  color: '$textSecondary',
  lineHeight: '$relaxed',
  maxWidth: '560px',
  mb: '$12',
})

const FeaturesGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: '$4',
  '@sm': { gridTemplateColumns: 'repeat(2, 1fr)' },
  '@lg': { gridTemplateColumns: 'repeat(4, 1fr)' },
})

// ── Security Education section ────────────────────────────────────────────────

const SecuritySection = styled('section', {
  position: 'relative',
  zIndex: 1,
  py: '$24',
  px: '$6',
  id: 'security',
})

const SecurityInner = styled('div', {
  maxWidth: '$content',
  mx: 'auto',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$16',
  alignItems: 'center',
  '@lg': { gridTemplateColumns: '1fr 1fr' },
})

const RiskList = styled('ul', {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  mt: '$8',
})

const RiskItem = styled(motion.li, {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '$4',
  p: '$4',
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',
})

const RiskIconWrap = styled('div', {
  size: '36px',
  borderRadius: '$md',
  flexCenter: true,
  flexShrink: 0,
})

const RiskText = styled('div', {})
const RiskTitle = styled('div', {
  fontWeight: '$semibold',
  fontSize: '$sm',
  color: '$textPrimary',
  mb: '$1',
})
const RiskDesc = styled('div', {
  fontSize: '$sm',
  color: '$textMuted',
  lineHeight: '$relaxed',
})

// Stats visual card
const StatsCard = styled(motion.div, {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$xl',
  p: '$6',
  boxShadow: '$card',
})

const StatRow = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$5',
})

const StatBar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

const BarLabel = styled('div', {
  flexBetween: true,
  fontSize: '$sm',
  color: '$textSecondary',
})

const BarTrack = styled('div', {
  height: '8px',
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '$full',
  overflow: 'hidden',
})

const BarFill = styled(motion.div, {
  height: '100%',
  borderRadius: '$full',
})

// ── CTA section ───────────────────────────────────────────────────────────────

const CtaSection = styled('section', {
  position: 'relative',
  zIndex: 1,
  py: '$24',
  px: '$6',
  overflow: 'hidden',
})

const CtaCard = styled(motion.div, {
  maxWidth: '780px',
  mx: 'auto',
  textAlign: 'center',
  background: '$bgCard',
  border: '1px solid $cyanBorder',
  borderRadius: '$2xl',
  p: '$12',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '$cyanGlow',
})

const CtaGlowTop = styled('div', {
  position: 'absolute',
  top: '-60px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '300px',
  height: '120px',
  background: 'radial-gradient(ellipse, rgba(34,211,238,0.2), transparent)',
  pointerEvents: 'none',
})

const CtaHeadline = styled('h2', {
  fontSize: '$3xl',
  fontWeight: '$extrabold',
  letterSpacing: '-0.02em',
  color: '$textPrimary',
  mb: '$4',
  '@md': { fontSize: '$4xl' },
})

const CtaSub = styled('p', {
  fontSize: '$lg',
  color: '$textSecondary',
  mb: '$8',
  lineHeight: '$relaxed',
})

// ── FEATURES data ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Activity,
    title: 'Entropy Analysis',
    description:
      'Measures Shannon entropy and pool-based bit strength. Know exactly how random your password is.',
    badge: 'Core',
    color: '#22d3ee',
  },
  {
    icon: TrendingUp,
    title: 'Strength Scoring',
    description:
      'Composite 0–100 score factoring length, diversity, patterns, and known-bad fragments.',
    badge: 'ML-Enhanced',
    color: '#a78bfa',
  },
  {
    icon: Database,
    title: 'Breach Detection',
    description:
      'Cross-references against 700M+ compromised passwords via HIBP k-Anonymity API. Safe and private.',
    badge: 'HIBP',
    color: '#f87171',
  },
  {
    icon: Zap,
    title: 'Password Generator',
    description:
      'Creates cryptographically random passwords with configurable length and character classes.',
    badge: 'Instant',
    color: '#34d399',
  },
] as const

const RISKS = [
  {
    icon: AlertTriangle,
    iconBg: 'rgba(248,113,113,0.12)',
    iconColor: '#f87171',
    title: '81% of breaches involve weak passwords',
    desc: 'According to Verizon DBIR, the majority of data breaches exploit credential weaknesses.',
  },
  {
    icon: Globe,
    iconBg: 'rgba(251,191,36,0.12)',
    iconColor: '#fbbf24',
    title: '23M accounts used "123456"',
    desc: 'Common passwords appear in billions of credential stuffing attacks daily.',
  },
  {
    icon: Users,
    iconBg: 'rgba(167,139,250,0.12)',
    iconColor: '#a78bfa',
    title: 'Average breach costs $4.45M',
    desc: 'IBM 2023 Cost of a Data Breach Report — stronger passwords are your first line of defense.',
  },
]

const STAT_BARS = [
  { label: 'Very Weak (<8 chars)', pct: 64, color: '#f87171' },
  { label: 'Weak (no symbols)', pct: 47, color: '#fb923c' },
  { label: 'Moderate (8–12 chars)', pct: 22, color: '#fbbf24' },
  { label: 'Strong (12+ chars, mixed)', pct: 8, color: '#34d399' },
]

// ── Page component ────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <Page>
      {/* Background decorations */}
      <BgDecor>
        <GridOverlay />
        <BgBlob style={{
          width: '600px', height: '600px',
          top: '-200px', left: '-100px',
          background: 'radial-gradient(circle, #22d3ee, #06b6d4)',
        }} />
        <BgBlob style={{
          width: '500px', height: '500px',
          top: '200px', right: '-150px',
          background: 'radial-gradient(circle, #8b5cf6, #a78bfa)',
        }} />
        <BgBlob style={{
          width: '400px', height: '400px',
          bottom: '100px', left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, #22d3ee, transparent)',
          opacity: '0.07',
        }} />
      </BgDecor>

      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <HeroSection>
        <HeroInner>
          {/* Text */}
          <HeroTextBlock>
            <PreBadge
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PulseDot />
              Enterprise Password Security
            </PreBadge>

            <HeroHeadline
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Know Your Password Strength{' '}
              <GradientSpan>Before Hackers Do</GradientSpan>
            </HeroHeadline>

            <HeroSub
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Measure entropy, detect breach exposure, estimate real-world crack
              time, and generate unbreakable passwords — all with enterprise-grade
              privacy. Passwords never leave your device.
            </HeroSub>

            <CtaRow
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <PrimaryBtn href="/analyzer">
                <Shield size={16} />
                Analyze Password
                <ArrowRight size={16} />
              </PrimaryBtn>
              <SecondaryBtn href="#features">
                View Features
              </SecondaryBtn>
            </CtaRow>
          </HeroTextBlock>

          {/* Demo card */}
          <DemoCard
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <DemoHeader>
              <DotRow>
                <TrafficDot color="red" />
                <TrafficDot color="yellow" />
                <TrafficDot color="green" />
              </DotRow>
              <DemoTitle>securepass — analyzer</DemoTitle>
              <ShieldCheck size={14} color="var(--colors-cyan400)" />
            </DemoHeader>

            <DemoBody>
              {/* Password input mock */}
              <DemoPwRow>
                <DemoLockIcon><Lock size={14} /></DemoLockIcon>
                <DemoPwText>••••••••••••••••</DemoPwText>
                <ShieldCheck size={14} color="var(--colors-success)" />
              </DemoPwRow>

              {/* Animated strength bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: 'var(--colors-textMuted)' }}>
                  <span>Strength</span>
                  <span style={{ color: 'var(--colors-success)', fontWeight: 600 }}>Very Strong</span>
                </div>
                <SegBar>
                  {[0,1,2,3,4].map((i) => (
                    <Seg
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1, background: '#22d3ee' }}
                      transition={{ delay: 0.4 + i * 0.07, duration: 0.3 }}
                      style={{ originX: 0 }}
                    />
                  ))}
                </SegBar>
              </div>

              {/* Metrics */}
              <MetricsGrid>
                <MetricChip>
                  <MetricLabel>Entropy</MetricLabel>
                  <MetricVal>94.7b</MetricVal>
                </MetricChip>
                <MetricChip>
                  <MetricLabel>Score</MetricLabel>
                  <MetricVal>96/100</MetricVal>
                </MetricChip>
                <MetricChip>
                  <MetricLabel>Crack Time</MetricLabel>
                  <MetricVal>Centuries</MetricVal>
                </MetricChip>
              </MetricsGrid>

              {/* Breach status */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px', borderRadius: '8px',
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.3)',
              }}>
                <ShieldCheck size={14} color="var(--colors-success)" />
                <span style={{ fontSize: '13px', color: 'rgba(52,211,153,0.9)' }}>
                  Not found in any breach database
                </span>
              </div>
            </DemoBody>
          </DemoCard>
        </HeroInner>
      </HeroSection>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <StatsBar>
        <StatsInner>
          {[
            { num: '700M+', label: 'Breached passwords indexed' },
            { num: '99.9%', label: 'Analysis accuracy' },
            { num: '<50ms', label: 'Average response time' },
            { num: '0',     label: 'Passwords stored' },
          ].map((s, i) => (
            <StatItem
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <StatNum>{s.num}</StatNum>
              <StatText>{s.label}</StatText>
            </StatItem>
          ))}
        </StatsInner>
      </StatsBar>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <Section id="features">
        <SectionInner>
          <SectionLabel
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Star size={12} />
            Core Capabilities
          </SectionLabel>
          <SectionTitle
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Everything you need to<br />evaluate password security
          </SectionTitle>
          <SectionSub
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            A complete toolkit built on cryptographic principles, not guesswork.
          </SectionSub>
          <FeaturesGrid>
            {FEATURES.map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.description}
                badge={f.badge}
                accentColor={f.color}
                index={i}
              />
            ))}
          </FeaturesGrid>
        </SectionInner>
      </Section>

      {/* ── Security Education ─────────────────────────────────────────── */}
      <SecuritySection id="security">
        <SecurityInner>
          {/* Left */}
          <div>
            <SectionLabel
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <AlertTriangle size={12} />
              Why It Matters
            </SectionLabel>
            <SectionTitle
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Weak passwords are<br />
              <span style={{ color: 'var(--colors-danger)' }}>the #1 attack vector</span>
            </SectionTitle>
            <SectionSub
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{ marginBottom: 0 }}
            >
              Most organizations underestimate password risk. Here's why password
              hygiene is your most cost-effective security investment.
            </SectionSub>
            <RiskList>
              {RISKS.map((r, i) => (
                <RiskItem
                  key={r.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <RiskIconWrap style={{ background: r.iconBg }}>
                    <r.icon size={18} color={r.iconColor} />
                  </RiskIconWrap>
                  <RiskText>
                    <RiskTitle>{r.title}</RiskTitle>
                    <RiskDesc>{r.desc}</RiskDesc>
                  </RiskText>
                </RiskItem>
              ))}
            </RiskList>
          </div>

          {/* Right — visual stats */}
          <StatsCard
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: 'var(--colors-textMuted)', marginBottom: '4px' }}>
                Password strength distribution in the wild
              </div>
              <div style={{ fontSize: '12px', color: 'var(--colors-textMuted)', opacity: 0.6 }}>
                Based on analysis of leaked credential datasets
              </div>
            </div>
            <StatRow>
              {STAT_BARS.map((b, i) => (
                <StatBar key={b.label}>
                  <BarLabel>
                    <span>{b.label}</span>
                    <span style={{ fontFamily: 'var(--fonts-mono)', color: b.color }}>
                      {b.pct}%
                    </span>
                  </BarLabel>
                  <BarTrack>
                    <BarFill
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      style={{ background: b.color }}
                    />
                  </BarTrack>
                </StatBar>
              ))}
            </StatRow>

            <div style={{
              marginTop: '20px', padding: '16px', borderRadius: '10px',
              background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.2)',
            }}>
              <div style={{ fontSize: '13px', color: 'var(--colors-cyan400)', fontWeight: 600, marginBottom: '4px' }}>
                💡 Key Insight
              </div>
              <div style={{ fontSize: '13px', color: 'var(--colors-textMuted)', lineHeight: 1.5 }}>
                Over 64% of users rely on passwords with fewer than 8 characters,
                making them trivially vulnerable to dictionary attacks.
              </div>
            </div>
          </StatsCard>
        </SecurityInner>
      </SecuritySection>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <CtaSection>
        <CtaCard
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CtaGlowTop />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              marginBottom: '20px', padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)',
              fontSize: '12px', fontWeight: 600, color: 'var(--colors-cyan400)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              <Key size={12} />
              Free — No Account Required
            </div>
            <CtaHeadline>Test Your Password Now</CtaHeadline>
            <CtaSub>
              Instant entropy analysis. Breach detection. Crack time estimation.
              <br />All processed locally — your password never leaves your device.
            </CtaSub>
            <PrimaryBtn
              href="/analyzer"
              style={{ display: 'inline-flex', width: 'auto', mx: 'auto' }}
            >
              <Shield size={16} />
              Open Analyzer
              <ArrowRight size={16} />
            </PrimaryBtn>
          </div>
        </CtaCard>
      </CtaSection>

      <Footer />
    </Page>
  )
}
