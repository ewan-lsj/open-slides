import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import lockupDark from '@assets/LOCKUP_HORIZONTAL_2D_DARK.svg';
import cursorLight from '@assets/cursor_light.svg';
import cursorDark from '@assets/cursor_dark.svg';

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
  tile: '#FFFFFF',
  border: '#E3E2DD',
  dark: '#14120B',
  darkText: '#EDECEC',
  darkMuted: '#969592',
  paleOrange: '#FFF0E9',
  green: '#1F7A55',
};

const fill = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  position: 'relative',
  fontFamily: 'var(--osd-font-body)',
} as const;

const Styles = () => (
  <style>{`
    @keyframes migrationBrandFadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .migrationBrandFadeUp {
      opacity: 0;
      animation: migrationBrandFadeUp 0.6s cubic-bezier(.2,.7,.2,1) both;
    }
    @media (prefers-reduced-motion: reduce) {
      .migrationBrandFadeUp { animation: none; opacity: 1; }
    }
  `}</style>
);

const FadeUp = ({
  delay = 0,
  fill: shouldFill = false,
  children,
  style,
}: {
  delay?: number;
  fill?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    className="migrationBrandFadeUp"
    style={{ animationDelay: `${delay}s`, ...(shouldFill ? { height: '100%' } : {}), ...style }}
  >
    {children}
  </div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
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

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontSize: 64,
      fontWeight: 700,
      lineHeight: 1.15,
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

const HeroTitle = ({
  children,
  color = colors.darkText,
}: {
  children: React.ReactNode;
  color?: string;
}) => (
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

const CursorLogo = ({ onDark = false }: { onDark?: boolean }) => (
  <img
    src={onDark ? cursorDark : cursorLight}
    alt="Cursor"
    style={{ position: 'absolute', top: 48, right: 48, height: 44, width: 'auto' }}
  />
);

const TitleLockup = () => (
  <img
    src={lockupDark}
    alt="Cursor"
    style={{ position: 'absolute', top: 48, left: 110, height: 124, width: 'auto', zIndex: 1 }}
  />
);

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

const Footer = ({
  partnerName = 'Migration pathway',
  dark = false,
}: {
  partnerName?: string;
  dark?: boolean;
}) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 110,
        right: 110,
        bottom: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontSize: 22,
        color: dark ? colors.darkMuted : colors.muted,
      }}
    >
      <span style={{ color: dark ? colors.darkText : 'var(--osd-text)' }}>{partnerName}</span>
      <span>
        {current} / {total}
      </span>
    </div>
  );
};

const ContentPage = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      ...fill,
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      padding: 110,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Styles />
    <CursorLogo />
    {children}
    <Footer />
  </div>
);

const Tile = ({
  title,
  children,
  accent = 'var(--osd-accent)',
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) => (
  <div
    style={{
      background: colors.tile,
      border: `1px solid ${colors.border}`,
      borderRadius: 'var(--osd-radius)',
      boxShadow: '0 2px 4px rgba(20,18,11,0.05), 0 6px 16px rgba(20,18,11,0.07)',
      padding: '24px 28px',
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ width: 56, height: 6, background: accent, marginBottom: 14 }} />
    <div
      style={{
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: colors.muted,
        marginBottom: 14,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const TileHeading = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: 'var(--osd-text)', marginBottom: 12 }}>
    {children}
  </div>
);

const TileCopy = ({ children }: { children: React.ReactNode }) => (
  <p style={{ margin: 0, fontSize: 27, lineHeight: 1.42, color: colors.body }}>{children}</p>
);

const NumberBadge = ({ value }: { value: string }) => (
  <div
    style={{
      width: 62,
      height: 62,
      flexShrink: 0,
      display: 'grid',
      placeItems: 'center',
      background: 'var(--osd-accent)',
      color: '#FFFFFF',
      fontSize: 26,
      fontWeight: 700,
      borderRadius: 'var(--osd-radius)',
    }}
  >
    {value}
  </div>
);

const FlowStep = ({
  number,
  title,
  detail,
  active = false,
}: {
  number: string;
  title: string;
  detail: string;
  active?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      padding: '22px 24px',
      background: active ? colors.paleOrange : colors.tile,
      border: `1px solid ${active ? '#F7B89A' : colors.border}`,
      boxShadow: '0 2px 10px rgba(20,18,11,0.05)',
      minHeight: 112,
      boxSizing: 'border-box',
    }}
  >
    <NumberBadge value={number} />
    <div>
      <div style={{ fontSize: 29, fontWeight: 700, lineHeight: 1.2, color: 'var(--osd-text)' }}>{title}</div>
      <div style={{ fontSize: 24, lineHeight: 1.35, color: colors.secondary, marginTop: 6 }}>{detail}</div>
    </div>
  </div>
);

const Arrow = () => (
  <div style={{ display: 'grid', placeItems: 'center', color: 'var(--osd-accent)', fontSize: 42, fontWeight: 700 }}>
    →
  </div>
);

const CheckRow = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', fontSize: 31, lineHeight: 1.4, color: colors.body }}>
    <span style={{ color: colors.green, fontSize: 34, fontWeight: 700, lineHeight: 1.2 }}>✓</span>
    <span>{children}</span>
  </div>
);

const PlanningCurve = () => (
  <div
    data-pptx-raster
    style={{
      height: 470,
      background: colors.tile,
      border: `1px solid ${colors.border}`,
      boxShadow: '0 2px 4px rgba(20,18,11,0.05), 0 6px 16px rgba(20,18,11,0.07)',
      padding: '22px 30px 18px',
      boxSizing: 'border-box',
    }}
  >
    <svg
      viewBox="0 0 1600 420"
      role="img"
      aria-label="An upward curve showing that larger codebases require more planning and more separate tasks"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
    >
      <line x1="120" y1="350" x2="1510" y2="350" stroke={colors.border} strokeWidth="3" />
      <line x1="120" y1="350" x2="120" y2="44" stroke={colors.border} strokeWidth="3" />

      <text x="815" y="408" textAnchor="middle" fontSize="25" fontWeight="700" fill={colors.secondary}>
        CODEBASE SIZE &amp; COMPLEXITY →
      </text>
      <text
        x="28"
        y="198"
        textAnchor="middle"
        fontSize="25"
        fontWeight="700"
        fill={colors.secondary}
        transform="rotate(-90 28 198)"
      >
        PLANNING + SEPARATE TASKS →
      </text>

      <path
        d="M 150 328 C 430 318, 690 276, 900 212 C 1120 145, 1288 82, 1480 52"
        fill="none"
        stroke={design.palette.accent}
        strokeWidth="12"
        strokeLinecap="round"
      />

      <line x1="390" y1="350" x2="390" y2="306" stroke={colors.muted} strokeWidth="2" strokeDasharray="7 8" />
      <circle cx="390" cy="306" r="13" fill={design.palette.accent} />
      <text x="390" y="272" textAnchor="middle" fontSize="25" fontWeight="700" fill={design.palette.text}>
        Small
      </text>
      <text x="390" y="298" textAnchor="middle" fontSize="21" fill={colors.secondary}>
        one focused plan
      </text>

      <line x1="900" y1="350" x2="900" y2="212" stroke={colors.muted} strokeWidth="2" strokeDasharray="7 8" />
      <circle cx="900" cy="212" r="13" fill={design.palette.accent} />
      <text x="900" y="172" textAnchor="middle" fontSize="25" fontWeight="700" fill={design.palette.text}>
        Growing
      </text>
      <text x="900" y="198" textAnchor="middle" fontSize="21" fill={colors.secondary}>
        split into workstreams
      </text>

      <line x1="1370" y1="350" x2="1370" y2="78" stroke={colors.muted} strokeWidth="2" strokeDasharray="7 8" />
      <circle cx="1370" cy="78" r="13" fill={design.palette.accent} />
      <text x="1348" y="122" textAnchor="end" fontSize="25" fontWeight="700" fill={design.palette.text}>
        Large
      </text>
      <text x="1348" y="148" textAnchor="end" fontSize="21" fill={colors.secondary}>
        many bounded tasks
      </text>
    </svg>
  </div>
);

const Cover: Page = () => (
  <div
    style={{
      ...fill,
      background: colors.dark,
      color: '#FFFFFF',
      padding: 110,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    }}
  >
    <Styles />
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
    <TitleLockup />
    <FadeUp style={{ position: 'relative', zIndex: 1, marginTop: 190 }}>
      <HeroTitle color="#FFFFFF">Plan the migration.<br />Then implement with evidence.</HeroTitle>
      <p style={{ margin: '28px 0 0', fontSize: 42, fontWeight: 500, lineHeight: 1.3, color: '#FFFFFF', maxWidth: 1250 }}>
        A characterization-first pathway from Python API to Java
      </p>
    </FadeUp>
    <Footer partnerName="Cursor" dark />
  </div>
);

const ContextFirst: Page = () => (
  <ContentPage>
    <FadeUp>
      <Eyebrow>01 · Operating principle</Eyebrow>
      <Title>Contextual understanding is part of implementation</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', alignItems: 'center', gap: 24 }}>
        <FadeUp delay={0.08} fill>
          <Tile title="Understand">
            <TileHeading>Observe the system as it exists</TileHeading>
            <TileCopy>Requirements, API docs, source behavior, comments, bug tickets, and service conventions.</TileCopy>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.14}><Arrow /></FadeUp>
        <FadeUp delay={0.2} fill>
          <Tile title="Implement">
            <TileHeading>Build against verified behavior</TileHeading>
            <TileCopy>Tests and plans become the specification; code follows only after evidence is captured.</TileCopy>
          </Tile>
        </FadeUp>
      </div>
      <FadeUp delay={0.28}>
        <div style={{ marginTop: 28, padding: '22px 28px', borderLeft: '6px solid var(--osd-accent)', background: colors.paleOrange, fontSize: 30, lineHeight: 1.35, color: colors.body }}>
          Migration is not a translation exercise. It is a controlled reconstruction of behavior.
        </div>
      </FadeUp>
    </Body>
  </ContentPage>
);

const Workflow: Page = () => (
  <ContentPage>
    <FadeUp>
      <Eyebrow>02 · Workflow</Eyebrow>
      <Title>Move from one master plan to focused delivery plans</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 1fr 72px 1fr', alignItems: 'center' }}>
        <FadeUp delay={0.08}><FlowStep number="1" title="Master plan" detail="Plan mode · save to workspace · do not execute" active /></FadeUp>
        <FadeUp delay={0.14}><Arrow /></FadeUp>
        <FadeUp delay={0.2}><FlowStep number="2" title="Section plan" detail="Plan mode + migration skill for each workstream" /></FadeUp>
        <FadeUp delay={0.26}><Arrow /></FadeUp>
        <FadeUp delay={0.32}><FlowStep number="3" title="Implementation" detail="Build only from an approved, test-backed plan" /></FadeUp>
      </div>
      <FadeUp delay={0.38}>
        <p style={{ margin: '34px 0 0', fontSize: 30, color: colors.secondary, lineHeight: 1.4, textAlign: 'center' }}>
          The master plan governs scope. Section plans turn that context into executable, reviewable work.
        </p>
      </FadeUp>
    </Body>
  </ContentPage>
);

const MasterPlan: Page = () => (
  <ContentPage>
    <FadeUp>
      <Eyebrow>03 · Master plan</Eyebrow>
      <Title>Create the map before choosing the route</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridAutoRows: '1fr', gap: 18 }}>
        <FadeUp delay={0.08} fill>
          <Tile title="Inventory">
            <TileHeading>What moves?</TileHeading>
            <TileCopy>Endpoints, dependencies, data contracts, owners, and sequence constraints.</TileCopy>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.14} fill>
          <Tile title="Risk">
            <TileHeading>What could diverge?</TileHeading>
            <TileCopy>Behavioral quirks, known defects, compatibility needs, and rollout hazards.</TileCopy>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.2} fill>
          <Tile title="Pathway">
            <TileHeading>How will work flow?</TileHeading>
            <TileCopy>Workstreams, proof-of-concept scope, quality gates, and migration order.</TileCopy>
          </Tile>
        </FadeUp>
      </div>
      <FadeUp delay={0.28}>
        <div style={{ marginTop: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 28px', background: colors.tile, border: `1px solid ${colors.border}` }}>
          <span style={{ fontSize: 29, fontWeight: 700 }}>Save the plan to the workspace</span>
          <span style={{ fontSize: 25, color: 'var(--osd-accent)', fontWeight: 700 }}>CONTEXT, NOT EXECUTION</span>
        </div>
      </FadeUp>
    </Body>
  </ContentPage>
);

const SkillInputs: Page = () => (
  <ContentPage>
    <FadeUp>
      <Eyebrow>04 · Migration skill</Eyebrow>
      <Title>Give every section plan the same trusted context</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 28, alignItems: 'stretch' }}>
        <FadeUp delay={0.08} fill>
          <div style={{ height: '100%', background: colors.dark, color: colors.darkText, padding: 34, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 22, color: colors.darkMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>Plan-mode prompt</div>
            <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 29, lineHeight: 1.55 }}>
              @migration-master-plan.md<br />
              /python-to-java-migration<br />
              Plan this endpoint group.
            </div>
          </div>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 18 }}>
          <FadeUp delay={0.14} fill><Tile title="Requirements"><TileCopy>Existing intent, contracts, and target scope.</TileCopy></Tile></FadeUp>
          <FadeUp delay={0.2} fill><Tile title="Known bugs"><TileCopy>Jira issues and defects in the Python version.</TileCopy></Tile></FadeUp>
          <FadeUp delay={0.26} fill><Tile title="API docs"><TileCopy>Add external docs when the repository lacks them.</TileCopy></Tile></FadeUp>
          <FadeUp delay={0.32} fill><Tile title="Code reality"><TileCopy>Comments, edge cases, errors, and hidden behavior.</TileCopy></Tile></FadeUp>
        </div>
      </div>
    </Body>
  </ContentPage>
);

const Characterization: Page = () => (
  <ContentPage>
    <FadeUp>
      <Eyebrow>05 · Characterization first</Eyebrow>
      <Title>Capture what Python does — including its quirks</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr 80px 1fr', alignItems: 'center' }}>
        <FadeUp delay={0.08}><FlowStep number="A" title="Observe" detail="Edge cases, errors, comments, and undocumented behavior" /></FadeUp>
        <FadeUp delay={0.14}><Arrow /></FadeUp>
        <FadeUp delay={0.2}><FlowStep number="B" title="Encode" detail="Write characterization tests against the existing API" active /></FadeUp>
        <FadeUp delay={0.26}><Arrow /></FadeUp>
        <FadeUp delay={0.32}><FlowStep number="C" title="Confirm" detail="Run on Python; every non-excluded test must pass" /></FadeUp>
      </div>
      <FadeUp delay={0.4}>
        <div style={{ marginTop: 32, padding: '24px 30px', background: colors.paleOrange, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 22, alignItems: 'center' }}>
          <div style={{ fontSize: 42, fontWeight: 700, color: 'var(--osd-accent)' }}>!</div>
          <div style={{ fontSize: 29, lineHeight: 1.35, color: colors.body }}>
            Known Python defects become explicit exclusions — documented, traceable, and never silently copied.
          </div>
        </div>
      </FadeUp>
    </Body>
  </ContentPage>
);

const TddPlan: Page = () => (
  <ContentPage>
    <FadeUp>
      <Eyebrow>06 · Test-driven planning</Eyebrow>
      <Title>Use tests to write the migration plan</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 1fr 70px 1fr', alignItems: 'center' }}>
        <FadeUp delay={0.08} fill>
          <Tile title="Tasks">
            <TileHeading>Define development work</TileHeading>
            <TileCopy>Small units with clear behavior and dependencies.</TileCopy>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.14}><Arrow /></FadeUp>
        <FadeUp delay={0.2} fill>
          <Tile title="Tests">
            <TileHeading>Specify success first</TileHeading>
            <TileCopy>Tests describe each task before implementation begins.</TileCopy>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.26}><Arrow /></FadeUp>
        <FadeUp delay={0.32} fill>
          <Tile title="Plan">
            <TileHeading>Write from evidence</TileHeading>
            <TileCopy>Implementation steps follow the test structure and quality gates.</TileCopy>
          </Tile>
        </FadeUp>
      </div>
      <FadeUp delay={0.4}>
        <div style={{ marginTop: 30, textAlign: 'center', fontSize: 32, fontWeight: 700, color: 'var(--osd-accent)' }}>
          Characterize → task → test → plan → implement
        </div>
      </FadeUp>
    </Body>
  </ContentPage>
);

const Rules: Page = () => (
  <ContentPage>
    <FadeUp>
      <Eyebrow>07 · Standards</Eyebrow>
      <Title>Turn recurring decisions into repository rules</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <FadeUp delay={0.08} fill>
          <Tile title="Discover">
            <TileHeading>Contrast Python and Java endpoints</TileHeading>
            <TileCopy>Use Cursor to expose differences in naming, errors, validation, layering, and test style.</TileCopy>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.16} fill>
          <Tile title="Codify">
            <TileHeading>Create migration rules</TileHeading>
            <TileCopy>Use /create-rule to enforce the agreed patterns across every implementation.</TileCopy>
          </Tile>
        </FadeUp>
      </div>
      <FadeUp delay={0.24}>
        <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, padding: '24px 28px', background: colors.tile, border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 54, fontWeight: 700, color: 'var(--osd-accent)', lineHeight: 1 }}>↻</div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Improve the system as patterns emerge</div>
            <div style={{ fontSize: 27, lineHeight: 1.4, color: colors.secondary }}>When an issue repeats, update the rule once — future changes inherit the fix automatically.</div>
          </div>
        </div>
      </FadeUp>
    </Body>
  </ContentPage>
);

const Subagents: Page = () => (
  <ContentPage>
    <FadeUp>
      <Eyebrow>08 · Scale with isolation</Eyebrow>
      <Title>The larger the codebase, the more the plan must decompose</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1}>
        <PlanningCurve />
      </FadeUp>
      <FadeUp delay={0.2}>
        <p style={{ margin: '22px 0 0', fontSize: 28, lineHeight: 1.4, color: colors.secondary, textAlign: 'center' }}>
          Keep each task bounded enough for one agent to hold the relevant context and verify its result.
        </p>
      </FadeUp>
    </Body>
  </ContentPage>
);

const ProofOfConcept: Page = () => (
  <ContentPage>
    <FadeUp>
      <Eyebrow>09 · Prove, learn, then scale</Eyebrow>
      <Title>Migrate one small endpoint before the whole API</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 34, alignItems: 'center' }}>
        <FadeUp delay={0.08}>
          <div style={{ background: colors.dark, color: colors.darkText, padding: 42 }}>
            <div style={{ fontSize: 82, fontWeight: 700, color: 'var(--osd-accent)', lineHeight: 1 }}>1</div>
            <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.25, marginTop: 16 }}>Small, isolated function or endpoint</div>
            <div style={{ fontSize: 27, lineHeight: 1.45, color: colors.darkMuted, marginTop: 16 }}>Enough complexity to test the method; small enough to change cheaply.</div>
          </div>
        </FadeUp>
        <FadeUp delay={0.16}>
          <div style={{ display: 'grid', gap: 18 }}>
            <CheckRow>Characterization tests pass on the Python API.</CheckRow>
            <CheckRow>The migration skill produces an actionable plan.</CheckRow>
            <CheckRow>Rules prevent known implementation drift.</CheckRow>
            <CheckRow>Java behavior matches every accepted test.</CheckRow>
          </div>
        </FadeUp>
      </div>
      <FadeUp delay={0.26}>
        <div style={{ marginTop: 30, padding: '20px 26px', background: colors.paleOrange, fontSize: 28, fontWeight: 700, textAlign: 'center', color: colors.body }}>
          Fix the process while change is cheap. Scale only after the gate is green.
        </div>
      </FadeUp>
    </Body>
  </ContentPage>
);

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: EASE_IN,
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: 'API migration pathway',
  theme: 'cursor-brand',
  createdAt: '2026-07-01T13:40:55.214Z',
};

export default [
  Cover,
  ContextFirst,
  Workflow,
  MasterPlan,
  SkillInputs,
  Characterization,
  TddPlan,
  Rules,
  Subagents,
  ProofOfConcept,
] satisfies Page[];
