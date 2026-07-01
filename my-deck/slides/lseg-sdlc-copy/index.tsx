import {
  Step,
  Steps,
  useSlidePageNumber,
  type DesignSystem,
  type Page,
  type SlideMeta,
} from '@open-slide/core';

import cursorLight from '@assets/cursor_light.svg';
import cursorDark from '@assets/cursor_dark.svg';
import titleSlideBg from '@assets/title_slide.svg';
import lockupDark from '@assets/LOCKUP_HORIZONTAL_2D_DARK.svg';
import lsegLogo from './assets/LSEG-LOGO-WHITE.webp';

export const design: DesignSystem = {
  palette: {
    bg: '#F7F7F4',
    text: '#26251E',
    accent: '#F54E00',
  },
  fonts: {
    display: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    body: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
  },
  typeScale: {
    hero: 96,
    body: 34,
  },
  radius: 4,
};

const palette = {
  bg: '#F7F7F4',
  bgDark: '#14120B',
  text: '#26251E',
  textSecondary: '#5C5B54',
  textBody: '#3E3D36',
  muted: '#9B9A92',
  accent: '#F54E00',
  cardBg: '#FFFFFF',
  cardBorder: '#E3E2DD',
  cardShadow: '0 2px 4px rgba(20, 18, 11, 0.05), 0 6px 16px rgba(20, 18, 11, 0.07)',
  card01: '#F0EFEB',
  divider: '#D9D9D9',
  textDark: '#EDECEC',
  textDarkMuted: '#969592',
};

const font = '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';
const PAD = 110;

const styles = `
  @keyframes brandFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .brandFadeUp { opacity: 0; animation: brandFadeUp 0.6s cubic-bezier(.2,.7,.2,1) both; }
  @media (prefers-reduced-motion: reduce) {
    .brandFadeUp { animation: none; opacity: 1; }
  }
`;

const Styles = () => <style>{styles}</style>;

const FadeUp = ({
  delay = 0,
  fill = false,
  children,
  style,
}: {
  delay?: number;
  fill?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    className="brandFadeUp"
    style={{ animationDelay: `${delay}s`, ...(fill ? { height: '100%' } : null), ...style }}
  >
    {children}
  </div>
);

const lightPage = {
  width: '100%',
  height: '100%',
  background: palette.bg,
  color: palette.text,
  padding: PAD,
  position: 'relative' as const,
  fontFamily: font,
  overflow: 'hidden',
  display: 'flex' as const,
  flexDirection: 'column' as const,
};

const Body = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingBottom: 56,
    }}
  >
    {children}
  </div>
);

const CursorLogo = ({ onDark = false }: { onDark?: boolean }) => (
  <img
    src={onDark ? cursorDark : cursorLight}
    alt="Cursor"
    style={{ position: 'absolute', top: 48, right: 48, height: 44, width: 'auto' }}
  />
);

const Footer = ({ dark = false }: { dark?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: PAD,
        right: PAD,
        bottom: 56,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        fontSize: 22,
        color: dark ? palette.textDarkMuted : palette.muted,
      }}
    >
      <span>
        {current} / {total}
      </span>
    </div>
  );
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: palette.muted,
      marginBottom: 12,
    }}
  >
    {children}
  </div>
);

const HeroTitle = ({
  children,
  color = palette.textDark,
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <h1
    style={{
      fontSize: 96,
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: '-0.03em',
      margin: 0,
      color,
    }}
  >
    {children}
  </h1>
);

const Title = ({ children, size = 64 }: { children: React.ReactNode; size?: number }) => (
  <h1
    style={{
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1.12,
      letterSpacing: '-0.02em',
      margin: 0,
      color: palette.text,
    }}
  >
    {children}
  </h1>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: palette.muted,
      marginBottom: 18,
    }}
  >
    {children}
  </div>
);

const SquareBullet = ({ children, size = 32 }: { children: React.ReactNode; size?: number }) => (
  <li
    style={{
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start',
      fontSize: size,
      lineHeight: 1.4,
      color: palette.textBody,
      marginBottom: 18,
      listStyle: 'none',
    }}
  >
    <span style={{ width: 10, height: 10, marginTop: size * 0.36, flexShrink: 0, background: palette.accent }} />
    <span>{children}</span>
  </li>
);

// ─── Flow primitives ────────────────────────────────────────────────────────

const Arrow = ({ color = '#C9C8C1', top }: { color?: string; top?: number }) => (
  <div
    style={{
      flexShrink: 0,
      fontSize: 30,
      lineHeight: 1,
      color,
      padding: '0 4px',
      alignSelf: top === undefined ? 'center' : 'flex-start',
      marginTop: top,
    }}
  >
    →
  </div>
);

const ClassicBox = ({ label }: { label: string }) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      background: palette.card01,
      border: `1px solid ${palette.cardBorder}`,
      borderRadius: design.radius,
      padding: '20px 10px',
      textAlign: 'center',
      fontSize: 26,
      fontWeight: 600,
      color: palette.textSecondary,
    }}
  >
    {label}
  </div>
);

const PhaseBox = ({
  num,
  label,
  sub,
  active = false,
  small = false,
}: {
  num: string;
  label: string;
  sub?: string;
  active?: boolean;
  small?: boolean;
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      background: active ? palette.accent : palette.cardBg,
      border: `1px solid ${active ? palette.accent : palette.cardBorder}`,
      boxShadow: active
        ? '0 6px 18px rgba(245, 78, 0, 0.28)'
        : palette.cardShadow,
      borderRadius: design.radius,
      padding: small ? '18px 18px' : '24px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: active ? 'rgba(255,255,255,0.78)' : palette.muted,
      }}
    >
      {num}
    </div>
    <div
      style={{
        fontSize: small ? 30 : 34,
        fontWeight: 700,
        color: active ? '#FFFFFF' : palette.text,
      }}
    >
      {label}
    </div>
    {sub && (
      <div
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: active ? 'rgba(255,255,255,0.9)' : palette.muted,
        }}
      >
        {sub}
      </div>
    )}
  </div>
);

const PhaseStrip = ({ active }: { active: number }) => (
  <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
    <PhaseBox num="01" label="Define" sub="Plan + Design" active={active === 0} small />
    <Arrow color={palette.muted} />
    <PhaseBox num="02" label="Build" sub="Write" active={active === 1} small />
    <Arrow color={palette.muted} />
    <PhaseBox num="03" label="Validate" sub="Review + Test" active={active === 2} small />
    <Arrow color={palette.muted} />
    <PhaseBox num="04" label="Release" sub="Deploy" active={active === 3} small />
  </div>
);

const FeatureChip = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: 'inline-block',
      fontSize: 18,
      fontWeight: 600,
      lineHeight: 1.2,
      color: palette.text,
      background: 'rgba(245, 78, 0, 0.08)',
      border: '1px solid rgba(245, 78, 0, 0.28)',
      borderRadius: 999,
      padding: '7px 14px',
    }}
  >
    {children}
  </span>
);

const AutoPhase = ({
  num,
  label,
  note,
  children,
}: {
  num: string;
  label: string;
  note: string;
  children: React.ReactNode;
}) => (
  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div
      style={{
        background: palette.accent,
        border: `1px solid ${palette.accent}`,
        boxShadow: '0 6px 18px rgba(245, 78, 0, 0.28)',
        borderRadius: design.radius,
        padding: '22px 20px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.78)' }}>
        {num}
      </div>
      <div style={{ fontSize: 34, fontWeight: 700, color: '#FFFFFF' }}>{label}</div>
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.38, color: palette.textSecondary, paddingLeft: 2 }}>{note}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingLeft: 2 }}>{children}</div>
  </div>
);

// ─── Zoom-page scaffold ───────────────────────────────────────────────────────

const StepPage = ({
  eyebrow,
  title,
  active,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  active: number;
  intro: string;
  children: React.ReactNode;
}) => (
  <div style={lightPage}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Title>{title}</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1}>
        <PhaseStrip active={active} />
      </FadeUp>
      <FadeUp delay={0.2}>
        <p style={{ margin: '48px 0 28px', fontSize: 34, lineHeight: 1.4, color: palette.textSecondary, maxWidth: 1500 }}>
          {intro}
        </p>
      </FadeUp>
      <FadeUp delay={0.3}>
        <ul style={{ margin: 0, padding: 0 }}>{children}</ul>
      </FadeUp>
    </Body>
    <Footer />
  </div>
);

// ─── Pages ────────────────────────────────────────────────────────────────────

const Cover: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: palette.bgDark,
      color: '#FFFFFF',
      padding: PAD,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: font,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    }}
  >
    <img
      src={titleSlideBg}
      alt=""
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
    />
    <Styles />
    <FadeUp
      style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 32 }}>
        <img src={lockupDark} alt="Cursor" style={{ height: 76, width: 'auto' }} />
        <div style={{ width: 1, height: 60, background: 'rgba(255, 255, 255, 0.35)' }} />
        <img src={lsegLogo} alt="LSEG" style={{ height: 76, width: 'auto' }} />
      </div>
      <HeroTitle color="#FFFFFF">Rethinking the SDLC</HeroTitle>
    </FadeUp>
    <Footer dark />
  </div>
);

const Transformation: Page = () => (
  <div style={lightPage}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>The idea</Eyebrow>
      <Title>How AI influences the SDLC</Title>
    </FadeUp>
    <Body>
      <Steps>
        <div>
          <SectionLabel>The standard SDLC</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
            <ClassicBox label="Plan" />
            <Arrow />
            <ClassicBox label="Design" />
            <Arrow />
            <ClassicBox label="Write" />
            <Arrow />
            <ClassicBox label="Review" />
            <Arrow />
            <ClassicBox label="Test" />
            <Arrow />
            <ClassicBox label="Deploy" />
          </div>
        </div>
        <Step>
          <div
            style={{
              margin: '40px 0 28px',
              fontSize: 26,
              fontWeight: 500,
              color: palette.accent,
              textAlign: 'center',
            }}
          >
            Cursor can transform this to
            <div style={{ fontSize: 30, marginTop: 6 }}>↓</div>
          </div>
          <PhaseStrip active={-1} />
        </Step>
      </Steps>
    </Body>
    <Footer />
  </div>
);

const Define: Page = () => (
  <StepPage
    eyebrow="Step 01 · Merges plan + design"
    title="Define"
    active={0}
    intro="Turn an idea or a ticket into a clear, agreed plan — without leaving the editor."
  >
    <SquareBullet>Draft specs and break down work in a chat grounded in the real codebase</SquareBullet>
    <SquareBullet>Explore approaches and trade-offs with the whole repo as context</SquareBullet>
    <SquareBullet>Land on a plan the agent can then execute step by step</SquareBullet>
  </StepPage>
);

const Build: Page = () => (
  <StepPage
    eyebrow="Step 02 · Formerly write"
    title="Build"
    active={1}
    intro="Go from plan to working code, with the agent doing the heavy lifting."
  >
    <SquareBullet>Implement features across files directly from the agreed plan</SquareBullet>
    <SquareBullet>Govern changes with rules and hooks that enforce your standards</SquareBullet>
    <SquareBullet>Package repeatable workflows as skills the agent can invoke on demand</SquareBullet>
    <SquareBullet>Keep each change scoped and reviewable as you go</SquareBullet>
  </StepPage>
);

const Validate: Page = () => (
  <StepPage
    eyebrow="Step 03 · Merges review + test"
    title="Validate"
    active={2}
    intro="Review and testing happen together, inside the same loop as the change."
  >
    <SquareBullet>Get an automated first-pass review on every change</SquareBullet>
    <SquareBullet>Generate and run tests to prove the change behaves</SquareBullet>
    <SquareBullet>Catch issues before a human reviewer ever opens the PR</SquareBullet>
  </StepPage>
);

const Release: Page = () => (
  <StepPage
    eyebrow="Step 04 · Formerly deploy"
    title="Release"
    active={3}
    intro="Ship with confidence — the last mile is short when everything before it is clean."
  >
    <SquareBullet>Open a well-described PR with the context a reviewer needs</SquareBullet>
    <SquareBullet>Wire the agent into CI/CD and deployment checks</SquareBullet>
    <SquareBullet>Move from merged to deployed with the same tooling</SquareBullet>
  </StepPage>
);

const Automated: Page = () => (
  <div style={lightPage}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>Bring it together</Eyebrow>
      <Title>One automated pipeline</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          <AutoPhase num="01" label="Define" note="Specs and plans drafted from a ticket">
            <FeatureChip>Ask mode</FeatureChip>
            <FeatureChip>Plan mode</FeatureChip>
            <FeatureChip>Jira integration</FeatureChip>
          </AutoPhase>
          <Arrow color={palette.accent} top={37} />
          <AutoPhase num="02" label="Build" note="Agent writes and iterates on the code">
            <FeatureChip>Agent mode</FeatureChip>
            <FeatureChip>Plugins and integrations</FeatureChip>
            <FeatureChip>Skills, rules & hooks</FeatureChip>
          </AutoPhase>
          <Arrow color={palette.accent} top={37} />
          <AutoPhase num="03" label="Validate" note="Automated review and tests run in-loop">
            <FeatureChip>Bugbot</FeatureChip>
            <FeatureChip>Test generation</FeatureChip>
            <FeatureChip>Desktop artifacts</FeatureChip>
          </AutoPhase>
          <Arrow color={palette.accent} top={37} />
          <AutoPhase num="04" label="Release" note="PR opened, checks pass, change ships">
            <FeatureChip>Cursor Review</FeatureChip>
            <FeatureChip>SDK embedding</FeatureChip>
            <FeatureChip>Source control integration</FeatureChip>
          </AutoPhase>
        </div>
      </FadeUp>
      <FadeUp delay={0.3}>
        <p style={{ margin: '44px 0 0', fontSize: 34, lineHeight: 1.45, color: palette.textSecondary, maxWidth: 1560 }}>
          Agents carry context from ticket to production — each phase hands off to the next
          automatically, with a human in the loop exactly where it matters.
        </p>
      </FadeUp>
    </Body>
    <Footer />
  </div>
);

const PersonIcon = ({ size = 44, color = palette.accent }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <circle cx="12" cy="8" r="4.2" />
    <path d="M4 20.5c0-4 3.6-7 8-7s8 3 8 7v.5H4z" />
  </svg>
);

const MiniPhase = ({ label, sub }: { label: string; sub?: string }) => (
  <div
    style={{
      width: '100%',
      background: palette.cardBg,
      border: `1px solid ${palette.cardBorder}`,
      boxShadow: palette.cardShadow,
      borderRadius: design.radius,
      padding: '14px 12px',
      textAlign: 'center',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ fontSize: 26, fontWeight: 700, color: palette.text }}>{label}</div>
    {sub && <div style={{ fontSize: 16, fontWeight: 500, color: palette.muted, marginTop: 2 }}>{sub}</div>}
  </div>
);

const StageCol = ({ role, label, sub }: { role: string; label: string; sub: string }) => (
  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
    <PersonIcon size={44} />
    <div style={{ fontSize: 20, fontWeight: 600, color: palette.text }}>{role}</div>
    <MiniPhase label={label} sub={sub} />
  </div>
);

const StageArrow = () => (
  <span
    style={{
      flexShrink: 0,
      alignSelf: 'flex-end',
      fontSize: 28,
      lineHeight: 1,
      color: palette.muted,
      padding: '0 6px',
      marginBottom: 26,
    }}
  >
    →
  </span>
);

const AvatarDot = ({ first = false }: { first?: boolean }) => (
  <div
    style={{
      width: 42,
      height: 42,
      borderRadius: '50%',
      background: '#FFFFFF',
      border: `2px solid ${palette.accent}`,
      marginLeft: first ? 0 : -12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 5px rgba(20, 18, 11, 0.18)',
    }}
  >
    <PersonIcon size={22} color={palette.accent} />
  </div>
);

const PodBadge = () => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 16,
      background: palette.accent,
      borderRadius: 999,
      padding: '12px 26px',
      boxShadow: '0 8px 22px rgba(245, 78, 0, 0.34)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <AvatarDot first />
      <AvatarDot />
      <AvatarDot />
      <AvatarDot />
    </div>
    <span style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 700, whiteSpace: 'nowrap' }}>
      One pod · Product · Eng · Design · QA
    </span>
  </div>
);

const WorkingModel: Page = () => (
  <div style={lightPage}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>Working model</Eyebrow>
      <Title>Re-placed, not replaced</Title>
    </FadeUp>
    <Body>
      <Steps>
        <FadeUp delay={0.1}>
          <SectionLabel>Today — a specialist per stage</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0 }}>
            <StageCol role="Product" label="Define" sub="Plan + Design" />
            <StageArrow />
            <StageCol role="Engineer" label="Build" sub="Write" />
            <StageArrow />
            <StageCol role="QA" label="Validate" sub="Review + Test" />
            <StageArrow />
            <StageCol role="Ops" label="Release" sub="Deploy" />
          </div>
        </FadeUp>

        <Step>
          <div style={{ textAlign: 'center', margin: '24px 0 20px', color: palette.accent, fontSize: 30, fontWeight: 700 }}>
            ↓
          </div>
          <SectionLabel>With Cursor — one pod over the whole lifecycle</SectionLabel>
          <div style={{ position: 'relative', marginTop: 48 }}>
            <div style={{ position: 'absolute', top: -33, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
              <PodBadge />
            </div>
            <div
              style={{
                border: `2px solid ${palette.accent}`,
                borderRadius: 16,
                background: 'rgba(245, 78, 0, 0.04)',
                padding: '54px 24px 24px',
              }}
            >
              <PhaseStrip active={-1} />
            </div>
          </div>
        </Step>
      </Steps>
    </Body>
    <Footer />
  </div>
);

const Closing: Page = () => (
  <div style={{ ...lightPage, background: palette.bgDark, color: palette.textDark, justifyContent: 'center' }}>
    <Styles />
    <CursorLogo onDark />
    <FadeUp>
      <HeroTitle>Thank you</HeroTitle>
      <p style={{ margin: '24px 0 0', fontSize: 48, fontWeight: 500, lineHeight: 1.2, color: palette.textDarkMuted }}>
        LSEG × Cursor
      </p>
    </FadeUp>
    <Footer dark />
  </div>
);

export const meta: SlideMeta = {
  title: 'Rethinking the SDLC (copy)',
  theme: 'cursor-brand',
  createdAt: '2026-07-01T04:48:46.153Z',
};

export default [
  Cover,
  Transformation,
  Define,
  Build,
  Validate,
  Release,
  Automated,
  WorkingModel,
  Closing,
] satisfies Page[];
