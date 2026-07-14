import type { CSSProperties, ReactNode } from 'react';
import {
  type DesignSystem,
  type Page,
  type SlideMeta,
} from '@open-slide/core';
import cursorLight from '@assets/cursor_light.svg';
import cursorDark from '@assets/cursor_dark.svg';
import nabLogo from './assets/NAB.AX_BIG.D-bf6dac59.png';

export const design: DesignSystem = {
  palette: { bg: '#F7F7F4', text: '#26251E', accent: '#F54E00' },
  fonts: {
    display: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    body: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
  },
  typeScale: { hero: 96, body: 34 },
  radius: 4,
};

const colors = {
  muted: '#9B9A92',
  secondary: '#5C5B54',
  body: '#3E3D36',
  border: '#E3E2DD',
  tile: '#FFFFFF',
  dark: '#14120B',
  darkText: '#EDECEC',
  darkMuted: '#969592',
  soft: '#F0EFEB',
  paleOrange: '#FFF1EA',
  green: '#2F7D5B',
  greenBg: '#EAF3EE',
  greenBorder: '#B9D5C6',
} as const;

const SHADOW = '0 2px 4px rgba(20,18,11,0.05), 0 6px 16px rgba(20,18,11,0.07)';

const root = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  position: 'relative',
  fontFamily: 'var(--osd-font-body)',
} as const;

const lightPage = {
  ...root,
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  padding: 110,
  display: 'flex',
  flexDirection: 'column',
} as const;

const CursorLogo = ({ onDark = false }: { onDark?: boolean }) => (
  <img
    src={onDark ? cursorDark : cursorLight}
    alt="Cursor"
    style={{ position: 'absolute', top: 48, right: 48, height: 44, width: 'auto' }}
  />
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: colors.muted,
      marginBottom: 16,
      fontFamily: 'var(--osd-font-display)',
    }}
  >
    {children}
  </div>
);

const Title = ({ children }: { children: ReactNode }) => (
  <h1
    style={{
      fontSize: 56,
      fontWeight: 700,
      lineHeight: 1.12,
      letterSpacing: '-0.02em',
      margin: 0,
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-display)',
      maxWidth: 1500,
    }}
  >
    {children}
  </h1>
);

const HeroTitle = ({ children, color = colors.darkText }: { children: ReactNode; color?: string }) => (
  <h1
    style={{
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: '-0.03em',
      margin: 0,
      color,
      fontFamily: 'var(--osd-font-display)',
      maxWidth: 1420,
    }}
  >
    {children}
  </h1>
);

const Narration = ({ children }: { children: ReactNode }) => (
  <p
    style={{
      margin: '20px 0 0',
      fontSize: 30,
      lineHeight: 1.4,
      color: colors.secondary,
      maxWidth: 1400,
    }}
  >
    {children}
  </p>
);

// Thin Cursor hook — one line, not a full capability card.
const CursorHook = ({ feature }: { feature: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
    <div style={{ width: 5, height: 26, background: 'var(--osd-accent)', borderRadius: 2, flexShrink: 0 }} />
    <div style={{ fontSize: 24, lineHeight: 1.3, color: colors.secondary }}>
      With Cursor — <span style={{ fontWeight: 700, color: 'var(--osd-text)' }}>{feature}</span>
    </div>
  </div>
);

const Node = ({
  label,
  detail,
  accent = false,
  dark = false,
  style,
}: {
  label: ReactNode;
  detail?: string;
  accent?: boolean;
  dark?: boolean;
  style?: CSSProperties;
}) => (
  <div
    style={{
      boxSizing: 'border-box',
      background: dark ? colors.dark : colors.tile,
      color: dark ? colors.darkText : 'var(--osd-text)',
      border: `${accent ? 2 : 1}px solid ${accent ? 'var(--osd-accent)' : colors.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: '22px 26px',
      ...style,
    }}
  >
    <div
      style={{
        fontSize: 28,
        fontWeight: 750,
        lineHeight: 1.15,
        color: accent ? 'var(--osd-accent)' : dark ? colors.darkText : 'var(--osd-text)',
      }}
    >
      {label}
    </div>
    {detail ? (
      <div style={{ fontSize: 22, lineHeight: 1.3, color: dark ? colors.darkMuted : colors.secondary, marginTop: 8 }}>
        {detail}
      </div>
    ) : null}
  </div>
);

const Arrow = () => (
  <div
    style={{
      width: 56,
      flexShrink: 0,
      alignSelf: 'center',
      textAlign: 'center',
      color: 'var(--osd-accent)',
      fontSize: 36,
      fontWeight: 700,
    }}
  >
    →
  </div>
);

const FlowNode = ({ label, detail, accent = false }: { label: string; detail: string; accent?: boolean }) => (
  <div
    style={{
      flex: 1,
      boxSizing: 'border-box',
      background: colors.tile,
      border: `1px solid ${colors.border}`,
      borderTop: `6px solid ${accent ? 'var(--osd-accent)' : colors.muted}`,
      borderRadius: 'var(--osd-radius)',
      padding: '26px 28px',
      minHeight: 160,
    }}
  >
    <div style={{ fontSize: 28, fontWeight: 750, lineHeight: 1.15 }}>{label}</div>
    <div style={{ fontSize: 22, color: colors.secondary, lineHeight: 1.35, marginTop: 10 }}>{detail}</div>
  </div>
);

const CodeChip = ({ label }: { label: string }) => (
  <span
    style={{
      padding: '12px 22px',
      background: colors.dark,
      color: colors.darkText,
      borderRadius: 'var(--osd-radius)',
      fontSize: 24,
      fontWeight: 700,
      fontFamily: '"SF Mono", "Menlo", monospace',
      letterSpacing: '0.02em',
    }}
  >
    {label}
  </span>
);

const CodeSep = () => (
  <span style={{ color: 'var(--osd-accent)', fontSize: 28, fontWeight: 700, padding: '0 6px' }}>→</span>
);

const RepoCard = ({ name, task }: { name: string; task: string }) => (
  <div
    style={{
      background: colors.tile,
      border: `1px solid ${colors.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: '22px 28px',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontSize: 26, fontWeight: 750 }}>{name}</span>
      <span style={{ fontSize: 17, color: colors.green, fontWeight: 700, letterSpacing: '0.08em' }}>RUNNING</span>
    </div>
    <div style={{ fontSize: 22, color: colors.secondary, lineHeight: 1.3 }}>{task}</div>
  </div>
);

const StairTile = ({
  label,
  detail,
  height,
}: {
  label: string;
  detail: string;
  height: number;
}) => (
  <div
    style={{
      flex: 1,
      height,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      background: colors.tile,
      border: '2px solid var(--osd-accent)',
      borderRadius: 'var(--osd-radius)',
      padding: '24px 26px',
    }}
  >
    <div style={{ fontSize: 30, fontWeight: 750, color: 'var(--osd-accent)' }}>{label}</div>
    <div style={{ fontSize: 22, color: colors.secondary, marginTop: 8, lineHeight: 1.3 }}>{detail}</div>
  </div>
);

const StatTile = ({ big, label, note }: { big: string; label: string; note: string }) => (
  <div
    style={{
      background: colors.tile,
      border: `1px solid ${colors.border}`,
      boxShadow: SHADOW,
      borderRadius: 'var(--osd-radius)',
      padding: '32px 34px',
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ width: 56, height: 6, background: 'var(--osd-accent)', marginBottom: 20 }} />
    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: colors.muted,
        marginBottom: 16,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 52, fontWeight: 750, color: 'var(--osd-accent)', lineHeight: 1.08, letterSpacing: '-0.02em' }}>
      {big}
    </div>
    <div style={{ fontSize: 24, color: colors.secondary, marginTop: 18, lineHeight: 1.35 }}>{note}</div>
  </div>
);

const SixRBox = ({ label, detail }: { label: string; detail: string }) => (
  <div
    style={{
      height: '100%',
      padding: '28px 30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxSizing: 'border-box',
      background: colors.tile,
      border: '1px solid var(--osd-accent)',
      borderTop: '6px solid var(--osd-accent)',
      borderRadius: 'var(--osd-radius)',
    }}
  >
    <div
      style={{
        fontSize: 34,
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        color: 'var(--osd-accent)',
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 24, lineHeight: 1.35, color: colors.secondary, marginTop: 14 }}>{detail}</div>
  </div>
);

type StageId = 'understand' | 'evidence' | 'plan' | 'execute' | 'prove' | 'scale';

const StageChip = ({ label, active }: { label: string; active?: boolean }) => (
  <div
    style={{
      flexShrink: 0,
      padding: '10px 22px',
      borderRadius: 'var(--osd-radius)',
      fontSize: 19,
      fontWeight: 750,
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      background: active ? 'var(--osd-accent)' : colors.tile,
      color: active ? '#FFFFFF' : colors.muted,
      border: `2px solid ${active ? 'var(--osd-accent)' : colors.border}`,
    }}
  >
    {label}
  </div>
);

const Gate = () => (
  <div
    aria-hidden
    style={{ flexShrink: 0, color: colors.muted, fontSize: 15, letterSpacing: '-0.05em', padding: '0 2px' }}
  >
    ◇
  </div>
);

const StageMap = ({ active }: { active: StageId }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
    <div
      style={{
        flexShrink: 0,
        padding: '10px 20px',
        borderRadius: 'var(--osd-radius)',
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        color: colors.muted,
        background: colors.soft,
        border: `2px solid ${colors.border}`,
      }}
    >
      Entry
    </div>
    <Gate />
    <StageChip label="Understand" active={active === 'understand'} />
    <Gate />
    <StageChip label="Evidence" active={active === 'evidence'} />
    <Gate />
    <StageChip label="Plan" active={active === 'plan'} />
    <Gate />
    <StageChip label="Execute" active={active === 'execute'} />
    <Gate />
    <StageChip label="Prove" active={active === 'prove'} />
    <Gate />
    <StageChip label="Scale" active={active === 'scale'} />
  </div>
);

// Chapter scaffold: stage map + title + one-line Cursor hook + diagram.
// Capability cards and long how/why copy were removed — they crowded every chapter.
const ChapterPage = ({
  active,
  chapter,
  title,
  narration,
  feature,
  children,
}: {
  active: StageId;
  chapter: string;
  title: string;
  narration: string;
  feature: string;
  children: ReactNode;
}) => (
  <div style={lightPage}>
    <CursorLogo />
    <StageMap active={active} />
    <div style={{ marginTop: 28 }}>
      <Eyebrow>{chapter}</Eyebrow>
      <Title>{title}</Title>
      <Narration>{narration}</Narration>
      <CursorHook feature={feature} />
    </div>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {children}
    </div>
  </div>
);

// NAB customer story — black pages that land after each chapter.
const nabPage = {
  ...root,
  background: '#000000',
  color: '#FFFFFF',
  padding: '72px 110px 72px',
  display: 'flex',
  flexDirection: 'column',
} as const;

const NabMark = () => (
  <img
    src={nabLogo}
    alt="National Australia Bank"
    style={{ height: 110, width: 'auto', display: 'block' }}
  />
);

const nabPanel = '#2E2E2E';
const nabBorder = '#5C5C5C';

const NabBox = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      boxSizing: 'border-box',
      background: nabPanel,
      border: `2px solid ${nabBorder}`,
      borderRadius: 'var(--osd-radius)',
      padding: '28px 28px',
      fontSize: 24,
      lineHeight: 1.4,
      color: '#D6D6D6',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

const NabBoxes = ({ columns = 2, children }: { columns?: 2 | 3; children: ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridAutoRows: '1fr',
      gap: 20,
      flex: 1,
      minHeight: 0,
    }}
  >
    {children}
  </div>
);

const NabGold = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      boxSizing: 'border-box',
      background: nabPanel,
      border: `2px solid ${nabBorder}`,
      borderRadius: 'var(--osd-radius)',
      padding: '22px 28px',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#E4002B',
        marginBottom: 10,
      }}
    >
      Story gold
    </div>
    <div style={{ fontSize: 28, lineHeight: 1.35, fontWeight: 500, color: '#FFFFFF' }}>{children}</div>
  </div>
);

const NabStoryPage = ({
  chapter,
  title,
  children,
}: {
  chapter: string;
  title: string;
  children: ReactNode;
}) => (
  <div style={nabPage}>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexShrink: 0 }}>
      <NabMark />
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#8A8A8A',
          paddingBottom: 10,
        }}
      >
        Customer story
      </div>
    </div>

    <div style={{ marginTop: 28, flexShrink: 0 }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#8A8A8A',
          marginBottom: 10,
        }}
      >
        {chapter}
      </div>
      <h1
        style={{
          fontSize: 46,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: '-0.02em',
          margin: 0,
          color: '#FFFFFF',
          fontFamily: 'var(--osd-font-display)',
          maxWidth: 1500,
        }}
      >
        {title}
      </h1>
    </div>

    <div
      style={{
        marginTop: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        flex: 1,
        minHeight: 0,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#E4002B',
          flexShrink: 0,
        }}
      >
        What NAB did
      </div>
      {children}
    </div>
  </div>
);

const Cover: Page = () => (
  <div
    style={{
      ...root,
      background: colors.dark,
      color: colors.darkText,
      padding: 110,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <CursorLogo onDark />
    <div
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 720,
        height: 500,
        background:
          'linear-gradient(135deg, rgba(245,78,0,0) 5%, rgba(245,78,0,0.12) 55%, rgba(245,78,0,0.34) 100%)',
        clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 0 100%)',
      }}
    />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Eyebrow>Storyboard</Eyebrow>
      <HeroTitle color="#FFFFFF">The legacy modernization story</HeroTitle>
      <p style={{ margin: '32px 0 0', fontSize: 42, fontWeight: 500, lineHeight: 1.3, color: colors.darkMuted, maxWidth: 1200 }}>
        From an estate no one understands to a repeatable operating model.
      </p>
    </div>
  </div>
);

const Stakes: Page = () => (
  <div style={lightPage}>
    <CursorLogo />
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ maxWidth: 1500 }}>
        <Eyebrow>Act I · The stakes</Eyebrow>
        <div style={{ width: 88, height: 8, background: 'var(--osd-accent)', marginBottom: 36 }} />
        <h1
          style={{
            margin: 0,
            fontSize: 72,
            lineHeight: 1.14,
            letterSpacing: '-0.035em',
            fontWeight: 700,
            fontFamily: 'var(--osd-font-display)',
          }}
        >
          Left unattended, an estate no longer knows who owns it, who uses it, or how it really works.
        </h1>
        <Narration>
          You cannot modernize what you cannot see. The story starts with truth — not transformation.
        </Narration>
      </div>
    </div>
  </div>
);

const Frame: Page = () => (
  <div style={lightPage}>
    <CursorLogo />
    <div>
      <Eyebrow>The frame</Eyebrow>
      <Title>Every application needs a decision</Title>
      <Narration>
        The 6 R&apos;s are the lens, not the work. Every system earns a disposition — backed by analysis and evidence.
      </Narration>
    </div>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 200px)',
          gap: 22,
        }}
      >
        <SixRBox label="Retire" detail="Surface dead code and orphaned apps." />
        <SixRBox label="Retain" detail="Map vulnerability and dependency risk." />
        <SixRBox label="Rehost" detail="Move fast — then document for brownfield." />
        <SixRBox label="Replatform" detail="Upgrade runtimes at estate scale." />
        <SixRBox label="Repurchase" detail="Evidence for buy-vs-build." />
        <SixRBox label="Refactor" detail="Transform language and architecture." />
      </div>
    </div>
  </div>
);

const Understand: Page = () => (
  <ChapterPage
    active="understand"
    chapter="Chapter 1 · Understand"
    title="Reveal the system before changing it"
    narration="Turn interviews and stale spreadsheets into a live, queryable topology — validated against the running system."
    feature="Codebase understanding & semantic search"
  >
    <div style={{ position: 'relative', width: '100%', height: 420 }}>
      <svg
        width="100%"
        height="420"
        viewBox="0 0 1700 420"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <line x1="850" y1="140" x2="180" y2="70" stroke={colors.border} strokeWidth="3" />
        <line x1="850" y1="140" x2="1520" y2="70" stroke={colors.border} strokeWidth="3" />
        <line x1="850" y1="140" x2="180" y2="350" stroke={colors.border} strokeWidth="3" />
        <line x1="850" y1="140" x2="1520" y2="350" stroke={colors.border} strokeWidth="3" />
        <line x1="850" y1="220" x2="850" y2="248" stroke={colors.green} strokeWidth="3" />
        <polygon points="840,246 860,246 850,262" fill={colors.green} />
      </svg>
      <Node
        label="Entry points"
        detail="Requests, jobs, events."
        style={{ position: 'absolute', left: 0, top: 10, width: 360, height: 110 }}
      />
      <Node
        label="Dependencies"
        detail="Services, data, owners."
        style={{ position: 'absolute', left: 1340, top: 10, width: 360, height: 110 }}
      />
      <Node
        label="Runtime paths"
        detail="What calls what, in order."
        style={{ position: 'absolute', left: 0, top: 300, width: 360, height: 110 }}
      />
      <Node
        label="Local conventions"
        detail="Patterns new code must respect."
        style={{ position: 'absolute', left: 1340, top: 300, width: 360, height: 110 }}
      />
      <Node
        label="Migration boundary"
        detail="One legacy capability at a time."
        accent
        style={{
          position: 'absolute',
          left: 560,
          top: 70,
          width: 580,
          height: 150,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 500,
          top: 268,
          width: 700,
          height: 120,
          boxSizing: 'border-box',
          background: colors.greenBg,
          border: `2px solid ${colors.greenBorder}`,
          borderRadius: 'var(--osd-radius)',
          padding: '22px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 750, lineHeight: 1.15, color: colors.green }}>✓ Data validation</div>
        <div style={{ fontSize: 22, lineHeight: 1.3, color: colors.secondary, marginTop: 8 }}>
          Sources cross-checked against the observed system — stale data flagged, not trusted.
        </div>
      </div>
    </div>
  </ChapterPage>
);

const Evidence: Page = () => (
  <ChapterPage
    active="evidence"
    chapter="Chapter 2 · Evidence"
    title="Make existing behaviour into proof"
    narration="Characterization tests capture what the system actually does — quirks included. Known defects stay explicit."
    feature="Agent-generated characterization tests"
  >
    <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 56px 1.5fr', gap: 0, alignItems: 'center' }}>
      <Node
        label="Observed system"
        detail="Every quirk, edge, and error — as it runs today."
        dark
        style={{ height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '36px 34px' }}
      />
      <Arrow />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Node label="✓ Normal paths" detail="Expected inputs and outputs." accent style={{ minHeight: 140 }} />
        <Node label="✓ Edge cases" detail="Boundaries and unusual states." accent style={{ minHeight: 140 }} />
        <Node label="✓ Error behaviour" detail="Failures callers depend on." accent style={{ minHeight: 140 }} />
        <Node label="Known issues" detail="Documented — never silently copied." style={{ minHeight: 140 }} />
      </div>
    </div>
  </ChapterPage>
);

const PlanLane = ({ label, children }: { label: string; children: ReactNode }) => (
  <div
    style={{
      boxSizing: 'border-box',
      background: colors.tile,
      border: `1px solid ${colors.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: '18px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      minHeight: 148,
      height: '100%',
    }}
  >
    <div
      style={{
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: colors.muted,
      }}
    >
      {label}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minHeight: 0 }}>{children}</div>
  </div>
);

const PlanCard = ({ title, detail }: { title: string; detail: string }) => (
  <div
    style={{
      flex: 1,
      height: '100%',
      boxSizing: 'border-box',
      background: colors.soft,
      border: `1px solid ${colors.border}`,
      borderRadius: 'var(--osd-radius)',
      padding: '14px 18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ fontSize: 26, fontWeight: 750, lineHeight: 1.15 }}>{title}</div>
    <div style={{ fontSize: 20, color: colors.secondary, lineHeight: 1.3, marginTop: 6 }}>{detail}</div>
  </div>
);

const PlanStem = ({ height = 22 }: { height?: number }) => (
  <div style={{ width: 2, height, background: colors.border, flexShrink: 0 }} />
);

const Plan: Page = () => (
  <ChapterPage
    active="plan"
    chapter="Chapter 3 · Plan"
    title="Design before you build"
    narration="A treatment strategy governs scope. Section plans turn it into executable work — with a gateway at every boundary."
    feature="Plan Mode"
  >
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Node
        label="Treatment strategy"
        detail="Scope, risk, pathway, and quality gates."
        accent
        style={{
          width: 720,
          height: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      />
      <PlanStem />
      <div
        style={{
          width: 640,
          height: 52,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          background: colors.paleOrange,
          border: '1.5px solid var(--osd-accent)',
          borderRadius: 'var(--osd-radius)',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 750, color: 'var(--osd-accent)' }}>◇ Gateway</span>
        <span style={{ fontSize: 22, color: colors.secondary }}>entry / exit criteria · fail fast</span>
      </div>
      <PlanStem height={18} />
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 28,
          height: 36,
          flexShrink: 0,
        }}
      >
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              right: -15,
              height: 2,
              background: colors.border,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              width: 2,
              bottom: 0,
              marginLeft: -1,
              background: colors.border,
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: -15,
              width: 2,
              height: 14,
              background: colors.border,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: -15,
              right: '50%',
              height: 2,
              background: colors.border,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              width: 2,
              bottom: 0,
              marginLeft: -1,
              background: colors.border,
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 28,
          alignItems: 'stretch',
        }}
      >
        <PlanLane label="Sequential">
          <PlanCard title="Section plan A" detail="Scoped, test-backed tasks." />
          <div
            style={{
              flexShrink: 0,
              color: 'var(--osd-accent)',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            →
          </div>
          <PlanCard title="Section plan B" detail="Runs after A — sequential." />
        </PlanLane>
        <div
          style={{
            boxSizing: 'border-box',
            background: colors.tile,
            border: `1px solid ${colors.border}`,
            borderRadius: 'var(--osd-radius)',
            padding: '18px 22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 8,
            minHeight: 148,
            height: '100%',
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.muted,
            }}
          >
            Parallel
          </div>
          <div style={{ fontSize: 26, fontWeight: 750, lineHeight: 1.15 }}>Section plan C</div>
          <div style={{ fontSize: 20, color: colors.secondary, lineHeight: 1.3 }}>
            Runs in parallel.
          </div>
        </div>
      </div>
    </div>
  </ChapterPage>
);

const Execute: Page = () => (
  <ChapterPage
    active="execute"
    chapter="Chapter 4 · Execute"
    title="Implement with the method built in"
    narration="Capture the approach once as Skills and Rules — then run it at scale with isolated agents across repositories."
    feature="Rules, Skills & background agents"
  >
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px 1fr', gap: 36, alignItems: 'center' }}>
      <div style={{ display: 'grid', gap: 22 }}>
        <RepoCard name="service-a" task="Dependency + runtime upgrade" />
        <RepoCard name="service-b" task="Compatibility shim + tests" />
        <RepoCard name="service-c" task="Config and client migration" />
      </div>
      <div
        style={{
          background: colors.dark,
          color: colors.darkText,
          borderRadius: 'var(--osd-radius)',
          padding: '44px 40px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: 20, color: colors.darkMuted, letterSpacing: '0.12em', fontWeight: 700 }}>
          CURSOR HARNESS
        </div>
        <div style={{ marginTop: 32, display: 'grid', gap: 28, fontSize: 28, color: '#C9C7C1' }}>
          <div>Scout — patterns</div>
          <div>Build — against tests</div>
          <div>Review — evidence</div>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 22 }}>
        <Node
          label="Parallel PRs"
          detail="Consistent implementation, independent validation."
          accent
          style={{ minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        />
        <Node
          label="Estate pattern"
          detail="Repeat the harness across every affected app."
          accent
          style={{ minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        />
      </div>
    </div>
  </ChapterPage>
);

const Prove: Page = () => (
  <ChapterPage
    active="prove"
    chapter="Chapter 5 · Prove"
    title="Verify against the same contract"
    narration="Same behavioural contract, verified end to end — from approved architecture through to sign-off evidence."
    feature="Bugbot & Cursor Review"
  >
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
      <FlowNode label="Approved contract" detail="Architecture, conventions, controls." />
      <Arrow />
      <FlowNode label="Shift-left build" detail="Codified controls apply as code is written." accent />
      <Arrow />
      <FlowNode label="Independent review" detail="Bugbot and reviewer check the diff." accent />
      <Arrow />
      <FlowNode label="Evidence pack" detail="Tests, traceability, sign-off." />
    </div>
  </ChapterPage>
);

// Split from Prove — compliance was buried under the pipeline.
const Compliance: Page = () => (
  <div style={lightPage}>
    <CursorLogo />
    <StageMap active="prove" />
    <div style={{ marginTop: 28 }}>
      <Eyebrow>Chapter 5 · Prove</Eyebrow>
      <Title>Compliant by construction</Title>
      <Narration>
        Controls are injected as code is written — point-in-time, scoped per org, team, or repo. Not audited by
        committee after the fact.
      </Narration>
      <CursorHook feature="Codified controls in the loop" />
    </div>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <CodeChip label="build" />
        <CodeSep />
        <CodeChip label="apply" />
        <CodeSep />
        <CodeChip label="diff" />
        <CodeSep />
        <CodeChip label="accept" />
      </div>
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          boxSizing: 'border-box',
          background: colors.tile,
          border: '2px solid var(--osd-accent)',
          borderRadius: 'var(--osd-radius)',
          padding: '28px 36px',
          fontSize: 32,
          lineHeight: 1.4,
          color: colors.body,
        }}
      >
        A generic tool can build something that runs — but has no context of the target environment. Cursor produces
        output fit for where it will operate.
      </div>
    </div>
  </div>
);

const Scale: Page = () => (
  <ChapterPage
    active="scale"
    chapter="Chapter 6 · Scale"
    title="Turn one proven slice into a system"
    narration="Each completed slice improves the shared Skills and Rules — so the next team starts with more context."
    feature="Reusable Skills & Rules"
  >
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, height: 380 }}>
      <StairTile label="Slice 01" detail="First cut — method proven." height={180} />
      <StairTile label="Slice 02" detail="Faster — defaults inherited." height={250} />
      <StairTile label="Slice 03" detail="Faster still — patterns reused." height={310} />
      <div
        style={{
          flex: 1.15,
          height: 380,
          boxSizing: 'border-box',
          background: colors.paleOrange,
          border: '2px solid var(--osd-accent)',
          borderRadius: 'var(--osd-radius)',
          padding: '32px 34px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--osd-accent)' }}>
            The choice
          </div>
          <div style={{ fontSize: 34, fontWeight: 750, marginTop: 14, lineHeight: 1.2 }}>
            Meet the standard — or push toward class-leading.
          </div>
        </div>
        <div style={{ fontSize: 24, color: colors.secondary, lineHeight: 1.35 }}>
          Capability compounds. Each slice raises the floor for the next.
        </div>
      </div>
    </div>
  </ChapterPage>
);

const NabUnderstand: Page = () => (
  <NabStoryPage chapter="Chapter 1 · Understand" title="Reveal the system before changing it">
    <NabBoxes>
      <NabBox>
        Built NABCEL — an enterprise context layer that clones bank repos into every engineer&apos;s environment so the
        agent works from what exists, not tribal knowledge.
      </NabBox>
      <NabBox>
        Extracted every platform asset into queryable markdown: applications inside it, owners, and lifecycle status.
      </NabBox>
      <NabBox>
        Made the estate navigable by identifier — name a service, find it via app id, then traverse everything tied to
        it.
      </NabBox>
      <NabBox>
        Reverse-documented a system end to end overnight — a 130-page &quot;how it works, and the why&quot; reference.
      </NabBox>
    </NabBoxes>
    <NabGold>
      &quot;It knows about who owns it, where it lives, all of that. Mention a service by name, it finds it via the app id,
      then goes out and finds other things tied to it.&quot;
    </NabGold>
  </NabStoryPage>
);

const NabEvidence: Page = () => (
  <NabStoryPage chapter="Chapter 2 · Evidence" title="Make existing behaviour into proof">
    <NabBoxes columns={3}>
      <NabBox>
        Pulled the bank&apos;s testing frameworks into reference context so generated code follows existing conventions.
      </NabBox>
      <NabBox>
        Working with QA on Playwright and Snyk via MCP — testers get the same agent leverage as engineers.
      </NabBox>
      <NabBox>
        On legacy refactors like BizCalc, Ask Mode characterized current behaviour before any change was planned.
      </NabBox>
    </NabBoxes>
    <NabGold>
      The principal engineer used Ask Mode to understand the legacy Silverlight system first — so the rebuild
      reproduced real behaviour rather than guesses.
    </NabGold>
  </NabStoryPage>
);

const NabPlan: Page = () => (
  <NabStoryPage chapter="Chapter 3 · Plan" title="Design before you build">
    <NabBoxes>
      <NabBox>
        Built a <span style={{ color: '#FFFFFF', fontWeight: 700 }}>nab plan</span> command as a template router —
        matching intent to the right treatment template before Cursor shipped Plan Mode.
      </NabBox>
      <NabBox>
        Templates cover every SDLC phase — from business analyst work through to build, not just coding.
      </NabBox>
      <NabBox>
        Confirms the chosen template with three candidates, then loads plan-creation rules as guardrails.
      </NabBox>
      <NabBox>
        Output is a plan with a dependency graph — an agent assigned to each task, shaped one question at a time.
      </NabBox>
    </NabBoxes>
    <NabGold>
      &quot;The plan command is the guard rails around the workflow that the template runs within. The templates output a
      plan with a dependency graph and assign an agent to each of the tasks.&quot;
    </NabGold>
  </NabStoryPage>
);

const NabExecute: Page = () => (
  <NabStoryPage chapter="Chapter 4 · Execute" title="Implement with the method built in">
    <NabBoxes>
      <NabBox>
        Codified the approach once as templates, persona agents, skills and rules — then ran it across the estate.
      </NabBox>
      <NabBox>
        One index of sub-tasks, each assigned to an agent, executed in parallel where there are no dependencies.
      </NabBox>
      <NabBox>
        Same harness estate-wide — about 50 contributors and a couple hundred PRs into the shared system.
      </NabBox>
      <NabBox>
        Downstream of planning it is &quot;just normal agents and skills&quot; — each agent carries its own skills.
      </NabBox>
    </NabBoxes>
    <NabGold>
      &quot;One index, N sub tasks, each with an assigned agent, spun up in parallel where they have no dependencies, one
      report at the end.&quot;
    </NabGold>
  </NabStoryPage>
);

const NabExecuteProof: Page = () => (
  <div style={nabPage}>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexShrink: 0 }}>
      <NabMark />
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#8A8A8A',
          paddingBottom: 10,
        }}
      >
        Customer story
      </div>
    </div>
    <div style={{ marginTop: 28, flexShrink: 0 }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#8A8A8A',
          marginBottom: 10,
        }}
      >
        Chapter 4 · Execute
      </div>
      <h1
        style={{
          fontSize: 46,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: '-0.02em',
          margin: 0,
          color: '#FFFFFF',
          fontFamily: 'var(--osd-font-display)',
          maxWidth: 1500,
        }}
      >
        Proof points from the estate
      </h1>
    </div>
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 24,
        marginTop: 32,
      }}
    >
      <div
        style={{
          border: `2px solid ${nabBorder}`,
          borderRadius: 'var(--osd-radius)',
          padding: '32px 30px',
          background: nabPanel,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 20,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E4002B' }}>
            BizCalc
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.15, color: '#FFFFFF', marginTop: 18 }}>
            ~2 months solo
          </div>
          <div style={{ fontSize: 22, color: '#A3A3A3', lineHeight: 1.35, marginTop: 12 }}>
            vs original plan of 10 engineers over 6 months
          </div>
        </div>
        <div style={{ fontSize: 22, lineHeight: 1.4, color: '#D6D6D6' }}>
          Silverlight + .NET → Java + React. NAB publicly cites 3× faster.
        </div>
      </div>
      <div
        style={{
          border: `2px solid ${nabBorder}`,
          borderRadius: 'var(--osd-radius)',
          padding: '32px 30px',
          background: nabPanel,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 20,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E4002B' }}>
            Core banking
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.15, color: '#FFFFFF', marginTop: 18 }}>
            Running at 3×
          </div>
          <div style={{ fontSize: 22, color: '#A3A3A3', lineHeight: 1.35, marginTop: 12 }}>
            Assembly → modern core banking migration
          </div>
        </div>
        <div style={{ fontSize: 22, lineHeight: 1.4, color: '#D6D6D6' }}>
          Same method applied to a live migration program — pace holds at 3×.
        </div>
      </div>
      <div
        style={{
          border: `2px solid ${nabBorder}`,
          borderRadius: 'var(--osd-radius)',
          padding: '32px 30px',
          background: nabPanel,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 20,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E4002B' }}>
            Merchant payments
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.15, color: '#FFFFFF', marginTop: 18 }}>
            3 weeks
          </div>
          <div style={{ fontSize: 22, color: '#A3A3A3', lineHeight: 1.35, marginTop: 12 }}>
            against a 4-month Kotlin / Android scope
          </div>
        </div>
        <div style={{ fontSize: 22, lineHeight: 1.4, color: '#D6D6D6' }}>
          Delivered by engineers with no prior Android experience.
        </div>
      </div>
    </div>
  </div>
);

const NabProve: Page = () => (
  <NabStoryPage chapter="Chapter 5 · Prove" title="Verify against the same contract">
    <NabBoxes columns={3}>
      <NabBox>
        Mandatory second pass — every artifact the build agent produces gets two other agents to verify and suggest
        fixes.
      </NabBox>
      <NabBox>
        Execution state doubles as audit log and task queue: what each sub-agent did, when, and which artifacts it
        created.
      </NabBox>
      <NabBox>
        Approved Bugbot and Cursor Review POCs (May 2026) for independent, shift-left review of the diff.
      </NabBox>
    </NabBoxes>
    <NabGold>
      &quot;It gets two other agents to come through and verify it and suggest fixes. On the way through you have an
      execution state, an audit log and a task queue.&quot;
    </NabGold>
  </NabStoryPage>
);

const NabCompliance: Page = () => (
  <NabStoryPage chapter="Chapter 5 · Prove" title="Compliant by construction">
    <NabBoxes>
      <NabBox>
        Security control review templates with a prescriptive flow — required document, owner, fixed fields, standard
        output every time.
      </NabBox>
      <NabBox>
        Compliance as scaffolding — a skill to spin up local MCP servers that are compliant by default.
      </NabBox>
      <NabBox>
        Kong MCP gateway for remotely hosted MCPs after shadow servers caused incidents. OAuth to ServiceNow proven in
        non-prod.
      </NabBox>
      <NabBox>
        Curated contributions — extensions land via PRs checked for correct structure before merge.
      </NabBox>
    </NabBoxes>
    <NabGold>
      &quot;People were spinning up MCP servers all over the place and we had incidents. Now anything remotely hosted goes
      behind the Kong MCP gateway.&quot;
    </NabGold>
  </NabStoryPage>
);

const NabScale: Page = () => (
  <NabStoryPage chapter="Chapter 6 · Scale" title="Turn one proven slice into a system">
    <NabBoxes>
      <NabBox>
        NABCEL started in the POC to help evaluators — then became the bank-wide standard (~50 contributors, hundreds of
        PRs).
      </NabBox>
      <NabBox>
        Federated the method: extensions per persona or domain, each with a named curator owning distillations.
      </NabBox>
      <NabBox>
        Self-improving — distillations refresh on the delta since last pull, moving toward automated PRs.
      </NabBox>
      <NabBox>
        Light version for non-technical users (zip of distillations, no git) — same guidance, lower floor.
      </NabBox>
    </NabBoxes>
    <NabGold>
      &quot;It turned into NABCEL from the POC stage. Context libraries were popping up reinventing the same thing, so we
      brought them back in. Now it&apos;s about 50 contributors and a couple hundred PRs.&quot;
    </NabGold>
  </NabStoryPage>
);

const Payoff: Page = () => (
  <div style={lightPage}>
    <CursorLogo />
    <div>
      <Eyebrow>Act III · The payoff</Eyebrow>
      <Title>Control translated into capacity</Title>
      <Narration>
        When modernization becomes an operating capability, the estate moves at the speed of evidence.
      </Narration>
    </div>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, height: 420 }}>
        <StatTile
          big="Months → weeks"
          label="Delivery"
          note="Multi-year programs delivered in single-digit weeks."
        />
        <StatTile
          big="Avoided"
          label="End-of-life risk"
          note="Exposure handled before it becomes a crisis."
        />
        <StatTile
          big="Capability"
          label="Operating model"
          note="Federated enablement — not a one-off project."
        />
      </div>
    </div>
  </div>
);

const Governance: Page = () => (
  <div style={lightPage}>
    <CursorLogo />
    <div>
      <Eyebrow>Held to the end</Eyebrow>
      <Title>Protect the environment without narrowing the outcome</Title>
      <Narration>
        Governance and security are real — and deliberately last, so stakeholders hear the benefit first.
      </Narration>
    </div>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Node
          label="Data handling"
          detail="What leaves, what persists, what never does."
          style={{ minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        />
        <Node
          label="Environment"
          detail="Controls around identity, access, and execution."
          style={{ minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        />
        <Node
          label="Isolation"
          detail="Deployment options aligned to risk posture."
          style={{ minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        />
        <Node
          label="Model neutrality"
          detail="Choice without redesigning the operating layer."
          style={{ minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        />
      </div>
    </div>
  </div>
);

const Closing: Page = () => (
  <div
    style={{
      ...root,
      background: colors.dark,
      color: colors.darkText,
      padding: 110,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <CursorLogo onDark />
    <div>
      <Eyebrow>End of story</Eyebrow>
      <HeroTitle color="#FFFFFF">Understand. Prove. Scale.</HeroTitle>
      <p style={{ margin: '36px 0 0', fontSize: 38, fontWeight: 500, lineHeight: 1.4, color: colors.darkMuted, maxWidth: 1280 }}>
        Face the estate. Prove the method on one slice. Turn that proof into a capability the whole organization can run.
      </p>
      <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 0 }}>
        <div style={{ fontSize: 32, fontWeight: 700 }}>Understand</div>
        <div style={{ width: 80, textAlign: 'center', color: 'var(--osd-accent)', fontSize: 40 }}>→</div>
        <div style={{ fontSize: 32, fontWeight: 700 }}>Prove</div>
        <div style={{ width: 80, textAlign: 'center', color: 'var(--osd-accent)', fontSize: 40 }}>→</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)' }}>Scale</div>
      </div>
    </div>
  </div>
);

export const meta: SlideMeta = {
  title: 'Modernization storyboard (copy)',
  theme: 'cursor-brand',
  createdAt: '2026-07-07T10:00:57.463Z',
};

export default [
  Cover,
  Stakes,
  Frame,
  Understand,
  NabUnderstand,
  Evidence,
  NabEvidence,
  Plan,
  NabPlan,
  Execute,
  NabExecute,
  NabExecuteProof,
  Prove,
  NabProve,
  Compliance,
  NabCompliance,
  Scale,
  NabScale,
  Payoff,
  Governance,
  Closing,
] satisfies Page[];
