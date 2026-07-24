import {
  Step,
  Steps,
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
} from '@open-slide/core';

import lockupDark from '@assets/LOCKUP_HORIZONTAL_2D_DARK.svg';

export const design: DesignSystem = {
  palette: {
    bg: '#F7F8FB',
    text: '#10294F',
    accent: '#F5C518',
  },
  fonts: {
    display: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    body: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
  },
  typeScale: {
    hero: 104,
    body: 34,
  },
  radius: 4,
};

const colors = {
  navy: '#0A1E3F',
  navyPanel: '#16325C',
  navyPanelBorder: '#2C4A78',
  navyText: '#FFFFFF',
  navyBody: '#C6D2E4',
  navyMuted: '#8FA3C0',
  accent: '#F5C518',
  accentWarm: '#FFC72C',
  accentTint: '#FDF3D2',
  body: '#33415C',
  muted: '#6B7686',
  cardBg: '#FFFFFF',
  cardBorder: '#DDE3ED',
  passBg: '#E9F4EE',
  passBorder: '#1F7A55',
  passText: '#14563B',
  riskBg: '#FBEEEC',
  riskBorder: '#A32B2B',
  riskText: '#7E2320',
};

const PAD = 110;

const lightPage = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box' as const,
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  padding: PAD,
  position: 'relative' as const,
  fontFamily: 'var(--osd-font-body)',
  display: 'flex' as const,
  flexDirection: 'column' as const,
};

const darkPage = {
  ...lightPage,
  background: colors.navy,
  color: colors.navyText,
};

const Styles = () => (
  <style>{`
    @keyframes avivaFadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .avivaFadeUp { opacity: 0; animation: avivaFadeUp 0.55s cubic-bezier(.2,.7,.2,1) both; }
    @media (prefers-reduced-motion: reduce) {
      .avivaFadeUp { animation: none; opacity: 1; }
    }
  `}</style>
);

const FadeUp = ({
  delay = 0,
  children,
  style,
}: {
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div className="avivaFadeUp" style={{ animationDelay: `${delay}s`, ...style }}>
    {children}
  </div>
);

const Body = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    {children}
  </div>
);

const Eyebrow = ({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: onDark ? colors.navyMuted : colors.muted,
      marginBottom: 14,
    }}
  >
    {children}
  </div>
);

const Title = ({
  children,
  size = 60,
  onDark = false,
}: {
  children: React.ReactNode;
  size?: number;
  onDark?: boolean;
}) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1.14,
      letterSpacing: '-0.02em',
      margin: 0,
      maxWidth: 1560,
      color: onDark ? colors.navyText : 'var(--osd-text)',
    }}
  >
    {children}
  </h1>
);

const HeroTitle = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 700,
      lineHeight: 1.06,
      letterSpacing: '-0.03em',
      margin: 0,
      color: colors.navyText,
    }}
  >
    {children}
  </h1>
);

const AccentRule = ({ width = 200 }: { width?: number }) => (
  <div style={{ width, height: 8, background: 'var(--osd-accent)' }} />
);

const Lead = ({
  children,
  onDark = false,
  width = 1460,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  width?: number;
}) => (
  <p
    style={{
      margin: 0,
      fontSize: 'var(--osd-size-body)',
      lineHeight: 1.5,
      color: onDark ? colors.navyBody : colors.body,
      maxWidth: width,
    }}
  >
    {children}
  </p>
);

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      boxSizing: 'border-box',
      background: colors.cardBg,
      borderLeft: `8px solid ${colors.accent}`,
      borderRadius: 'var(--osd-radius)',
      padding: '26px 32px',
      fontSize: 32,
      fontWeight: 600,
      lineHeight: 1.4,
      color: 'var(--osd-text)',
      maxWidth: 1660,
    }}
  >
    {children}
  </div>
);

const Card = ({
  label,
  heading,
  body,
  accent = false,
}: {
  label: string;
  heading: string;
  body: string;
  accent?: boolean;
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      boxSizing: 'border-box',
      background: colors.cardBg,
      border: `2px solid ${accent ? colors.accent : colors.cardBorder}`,
      borderRadius: 'var(--osd-radius)',
      padding: '28px 28px 30px',
    }}
  >
    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: colors.muted,
        marginBottom: 12,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.16, marginBottom: 12 }}>
      {heading}
    </div>
    <div style={{ fontSize: 24, lineHeight: 1.45, color: colors.body }}>{body}</div>
  </div>
);

const DarkCard = ({
  label,
  heading,
  body,
}: {
  label: string;
  heading: string;
  body: string;
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      boxSizing: 'border-box',
      background: colors.navyPanel,
      border: `2px solid ${colors.navyPanelBorder}`,
      borderRadius: 'var(--osd-radius)',
      padding: '28px 28px 30px',
    }}
  >
    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: colors.accent,
        marginBottom: 12,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.16, marginBottom: 12 }}>
      {heading}
    </div>
    <div style={{ fontSize: 24, lineHeight: 1.45, color: colors.navyBody }}>{body}</div>
  </div>
);

const Arrow = ({ onDark = false }: { onDark?: boolean }) => (
  <span
    style={{
      flexShrink: 0,
      width: 56,
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 34,
      lineHeight: 1,
      color: onDark ? colors.navyMuted : colors.muted,
    }}
  >
    →
  </span>
);

const FlowCard = ({
  step,
  label,
  body,
  tone = 'neutral',
}: {
  step: string;
  label: string;
  body: string;
  tone?: 'neutral' | 'accent' | 'pass';
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      boxSizing: 'border-box',
      background:
        tone === 'pass' ? colors.passBg : tone === 'accent' ? colors.accentTint : colors.cardBg,
      border: `2px solid ${
        tone === 'pass' ? colors.passBorder : tone === 'accent' ? colors.accent : colors.cardBorder
      }`,
      borderRadius: 'var(--osd-radius)',
      padding: '24px 24px 26px',
    }}
  >
    <div
      style={{
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: tone === 'pass' ? colors.passText : colors.muted,
        marginBottom: 10,
      }}
    >
      {step}
    </div>
    <div
      style={{
        fontSize: 30,
        fontWeight: 700,
        lineHeight: 1.16,
        marginBottom: 10,
        color: tone === 'pass' ? colors.passText : 'var(--osd-text)',
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: colors.body }}>{body}</div>
  </div>
);

const Chip = ({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) => (
  <span
    style={{
      display: 'inline-block',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      fontSize: 22,
      fontWeight: 600,
      lineHeight: 1.2,
      padding: '10px 18px',
      borderRadius: 999,
      background: accent ? colors.accentTint : colors.cardBg,
      border: `2px solid ${accent ? colors.accent : colors.cardBorder}`,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </span>
);

const DarkChip = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: 'inline-block',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.2,
      padding: '12px 22px',
      borderRadius: 999,
      background: colors.navyPanel,
      border: `2px solid ${colors.navyPanelBorder}`,
      color: colors.navyText,
    }}
  >
    {children}
  </span>
);

const ActRow = ({
  act,
  heading,
  body,
}: {
  act: string;
  heading: string;
  body: string;
}) => (
  <div
    style={{
      boxSizing: 'border-box',
      background: colors.cardBg,
      border: `2px solid ${colors.cardBorder}`,
      borderRadius: 'var(--osd-radius)',
      padding: '22px 30px',
      display: 'flex',
      alignItems: 'baseline',
      gap: 28,
    }}
  >
    <span
      style={{
        flexShrink: 0,
        width: 130,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: colors.muted,
      }}
    >
      {act}
    </span>
    <span style={{ flexShrink: 0, width: 470, fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>
      {heading}
    </span>
    <span style={{ flex: 1, minWidth: 0, fontSize: 24, lineHeight: 1.4, color: colors.body }}>
      {body}
    </span>
  </div>
);

const StackRow = ({
  label,
  stack,
  verdict,
  verdictNote,
}: {
  label: string;
  stack: string;
  verdict: string;
  verdictNote: string;
}) => (
  <div style={{ display: 'flex', alignItems: 'stretch', gap: 24 }}>
    <div
      style={{
        flex: 1,
        minWidth: 0,
        boxSizing: 'border-box',
        background: colors.cardBg,
        border: `2px solid ${colors.cardBorder}`,
        borderRadius: 'var(--osd-radius)',
        padding: '22px 28px 24px',
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: colors.muted,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>{stack}</div>
    </div>
    <div
      style={{
        flexShrink: 0,
        width: 520,
        boxSizing: 'border-box',
        background: colors.passBg,
        border: `2px solid ${colors.passBorder}`,
        borderRadius: 'var(--osd-radius)',
        padding: '22px 28px 24px',
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: colors.passText }}>
        {verdict}
      </div>
      <div style={{ fontSize: 21, lineHeight: 1.35, color: colors.passText, marginTop: 6 }}>
        {verdictNote}
      </div>
    </div>
  </div>
);

const Disclaimer = () => (
  <div
    style={{
      boxSizing: 'border-box',
      background: colors.cardBg,
      border: `2px solid ${colors.cardBorder}`,
      borderRadius: 'var(--osd-radius)',
      padding: '20px 28px',
      maxWidth: 1700,
    }}
  >
    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: colors.muted,
        marginBottom: 8,
      }}
    >
      Confidential · Synthetic demo build
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: colors.body }}>
      Every service, record and screen in this demo is synthetic. No Aviva code, data or branding is
      used, and this material is not affiliated with or endorsed by Aviva plc.
    </div>
  </div>
);

const CoverLockup = () => (
  <img src={lockupDark} alt="Cursor" style={{ height: 64, width: 'auto' }} />
);

const Cover: Page = () => (
  <div style={{ ...darkPage, justifyContent: 'center' }}>
    <Styles />
    <FadeUp>
      <div style={{ marginBottom: 56 }}>
        <CoverLockup />
      </div>
      <Eyebrow onDark>Aviva PMI migration · demo storyboard</Eyebrow>
      <HeroTitle>
        Legacy .NET to .NET 8,
        <br />
        live in Cursor.
      </HeroTitle>
      <div style={{ margin: '40px 0 36px' }}>
        <AccentRule width={240} />
      </div>
      <Lead onDark width={1380}>
        A private-medical-insurance service migrated in front of you — comprehension, tests,
        migration, review, security and documentation in one session.
      </Lead>
    </FadeUp>
    <div
      style={{
        position: 'absolute',
        left: PAD,
        bottom: 64,
        fontSize: 20,
        letterSpacing: '0.06em',
        color: colors.navyMuted,
      }}
    >
      Confidential · Synthetic demo build · Not affiliated with or endorsed by Aviva plc
    </div>
  </div>
);

const Context: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>The context</Eyebrow>
      <Title>You are already running this migration.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 36 }}>
        <Lead>
          Nothing here asks you to change direction. The programme, the target framework and the
          appetite for AI assistance are already in place.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="The estate"
            heading="4.x, with a SOAP tail"
            body="C# on .NET Framework 4.x, ASP.NET MVC 5, WCF/SOAP services, EF6 over SQL Server."
          />
          <Card
            label="In flight"
            heading="4.x → .NET 6, funded"
            body="A live migration programme. .NET 8 is the sensible landing zone from here in 2026."
          />
          <Card
            label="Appetite"
            heading="Copilot at 1,750 users"
            body="And the flagship Bamboo policy system already moved to Azure. AI assistance is not a new argument here."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          So the question is not whether to modernise. It is how much faster the programme you are
          already funding can move.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const Problem: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>The problem</Eyebrow>
      <Title>Migration is priced in dev-years, not sprints.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 36 }}>
        <Lead>
          Writing the new endpoint is the cheap part. Three other costs set the pace of every legacy
          slice, and they are the ones that overrun.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Cost one"
            heading="Comprehension"
            body="Nobody left on the team wrote the WCF service. Reading it back is weeks of archaeology."
          />
          <Card
            label="Cost two"
            heading="Proof"
            body="Behaviour parity is asserted in a PR description far more often than it is demonstrated."
          />
          <Card
            label="Cost three"
            heading="Paper trail"
            body="A regulated, phased programme needs evidence, and writing it up competes with delivery."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          Today we take all three at once: read it, prove it, document it — in the same session as
          the change.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const Agenda: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>The arc</Eyebrow>
      <Title>What you will watch us do.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.12} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ActRow
            act="Act 0"
            heading="Set the ground rules"
            body="A synthetic stand-in for your stack, plus a validated OpenAPI spec for the PMI service."
          />
          <ActRow
            act="Act 1"
            heading="Make legacy legible"
            body="Cursor explains the WCF/SOAP and EF6 code, including the rules buried inside it."
          />
          <ActRow
            act="Act 2"
            heading="Migrate one real slice"
            body="GET /ncd through four SDLC scenes: ticket to PR, code review, security, documentation."
          />
          <ActRow
            act="Act 3"
            heading="Show the payoff"
            body="A modern PMI web app with a live toggle between the legacy and .NET 8 backends."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.22} style={{ marginTop: 36 }}>
        <Kicker>One slice, end to end. Judge the method on it, not on the slideware.</Kicker>
      </FadeUp>
    </Body>
  </div>
);

const HonestFraming: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 0 · Honest framing</Eyebrow>
      <Title>We built a faithful stand-in, not a guess.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          Your code is private and should stay that way. So we reconstructed the shape of it from
          public sources, wrote the PMI contract down as OpenAPI, and labelled every assumption.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Sourced"
            heading="The stack and the direction"
            body="Framework 4.x, MVC 5, WCF, EF6, SQL Server; the .NET 6 programme; Bamboo on Azure; Copilot at 1,750 users."
          />
          <Card
            label="Inferred"
            heading="The PMI domain detail"
            body="Endpoints, no-claims-discount rules and table names — reconstructed, validated against the spec, and marked as inferred in the repo."
            accent
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 32 }}>
        <Disclaimer />
      </FadeUp>
    </Body>
  </div>
);

const Comprehension: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 1 · Legacy comprehension</Eyebrow>
      <Title>Legacy becomes legible in seconds, not weeks.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          We open the crustiest file in the service — a WCF operation with EF6 queries and a decade
          of policy rules inlined — and ask Cursor what it actually promises.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Answer 01"
            heading="The contract"
            body="The SOAP operation, its message shapes, its status and fault behaviour."
          />
          <Card
            label="Answer 02"
            heading="The data path"
            body="Which EF6 queries run, against which tables, and where the query is hand-built."
          />
          <Card
            label="Answer 03"
            heading="The hidden rules"
            body="The no-claims-discount logic living in the service layer, including the edge cases."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          The expensive part of legacy is not writing new code. It is knowing what the old code
          promised.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const ActTwoDivider: Page = () => (
  <div style={{ ...darkPage, justifyContent: 'center' }}>
    <Styles />
    <FadeUp>
      <Eyebrow onDark>Act 2 · The enterprise SDLC</Eyebrow>
      <Title size={96} onDark>
        One slice. Four gates.
      </Title>
      <div style={{ margin: '36px 0 34px' }}>
        <AccentRule width={180} />
      </div>
      <Lead onDark width={1420}>
        GET /ncd, from Jira ticket to Confluence record — through the four gates your programme
        already runs, with nothing skipped to make the demo look quick.
      </Lead>
    </FadeUp>
    <FadeUp delay={0.16} style={{ marginTop: 48 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <DarkChip>01 · Ticket to PR</DarkChip>
        <DarkChip>02 · Code review</DarkChip>
        <DarkChip>03 · Security</DarkChip>
        <DarkChip>04 · Documentation</DarkChip>
      </div>
    </FadeUp>
  </div>
);

const SceneOne: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 2 · Scene 1 — Jira to code to PR</Eyebrow>
      <Title>A ticket becomes a merged .NET 8 slice.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          AVH-207: migrate GET /ncd off WCF and EF6. Cursor reads the ticket, then works the slice in
          the order a careful engineer would — tests before surgery.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <FlowCard
            step="Step 01"
            label="Read the ticket"
            body="AVH-207 and the /ncd slice, with the OpenAPI contract as the source of truth."
          />
          <Arrow />
          <FlowCard
            step="Step 02"
            label="Tests on legacy"
            body="Characterisation tests generated from the spec, run against the legacy endpoint — green."
            tone="pass"
          />
          <Arrow />
          <FlowCard
            step="Step 03"
            label="Migrate the slice"
            body="WCF and EF6 to .NET 8 Minimal API and EF Core, across every file the change touches."
            tone="accent"
          />
          <Arrow />
          <FlowCard
            step="Step 04"
            label="Same tests, modern"
            body="The identical suite re-run against the new endpoint — green, then a PR with the evidence."
            tone="pass"
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          Parity is not a sentence in the PR description. It is the same suite, run twice.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const SceneTwo: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 2 · Scene 2 — agentic code review</Eyebrow>
      <Title>Your migration rules do the first review.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          The standards live in the repository as Cursor Skills, so the review enforces Aviva rules
          rather than generic advice — and it runs before a human spends attention.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="The rules, in the repo"
            heading="Contract parity, no behaviour drift"
            body="Every response field matches the spec. Every legacy branch is accounted for or explicitly retired, with a reason."
          />
          <Card
            label="What it caught"
            heading="A dropped protected-NCD cap"
            body="The maximum-discount cap on protected no-claims discount did not survive the rewrite. Flagged, explained, fixed."
            accent
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          This is the class of defect that reaches production. A wiki page would not have caught it.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const SceneThree: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 2 · Scene 3 — security review</Eyebrow>
      <Title>Migration is when you retire inherited risk.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          We run the security gate inside the same loop as the change, using the scanners you already
          own rather than a tool you would have to buy.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="The gate"
            heading="Your scanners, in the loop"
            body="SonarQube and Checkmarx, with Semgrep, CodeQL and Trivy as the open-source fallback."
          />
          <Card
            label="The find"
            heading="Inherited SQL injection"
            body="A concatenated query in the legacy no-claims-discount lookup, carried forward untouched."
            accent
          />
          <Card
            label="The fix"
            heading="Parameterised, re-scanned"
            body="Rewritten through EF Core, scanned clean, and written up in the pull request."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          The flaw came with the legacy code. Migrating the slice is what finally surfaced it.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const SceneFour: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 2 · Scene 4 — impact and documentation</Eyebrow>
      <Title>The migration audit trail writes itself.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          A phased migration in a regulated business lives or dies on evidence. So the last step of
          the change is the record of the change.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <FlowCard
            step="Step 01"
            label="Assess impact"
            body="Shared modules touched, and which legacy callers still depend on the old operation."
          />
          <Arrow />
          <FlowCard
            step="Step 02"
            label="Business summary"
            body="What changed for a PMI policy, what did not, and what a customer would notice."
          />
          <Arrow />
          <FlowCard
            step="Step 03"
            label="Verify against AVH-207"
            body="Every acceptance criterion checked against what the change actually does."
          />
          <Arrow />
          <FlowCard
            step="Step 04"
            label="Publish to Confluence"
            body="A migration record on the page where your programme already keeps them."
            tone="accent"
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          Documentation stops being the thing that slips when the sprint gets tight.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const Spine: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>The claim that matters</Eyebrow>
      <Title>Same contract. Same tests. Green before and after.</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 32 }}>
        <div
          style={{
            boxSizing: 'border-box',
            background: colors.cardBg,
            borderLeft: `8px solid ${colors.accent}`,
            borderRadius: 'var(--osd-radius)',
            padding: '24px 32px 26px',
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: colors.muted,
              marginBottom: 10,
            }}
          >
            The contract · OpenAPI · GET /ncd
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: colors.body, maxWidth: 1520 }}>
            Request shape, response shape, status codes and fault semantics — written down and
            validated before a single line moves.
          </div>
        </div>
        <Steps>
          <Step>
            <StackRow
              label="Before"
              stack=".NET Framework 4.x · WCF/SOAP · EF6 · SQL Server"
              verdict="Suite green"
              verdictNote="Characterisation tests generated from the contract, run on legacy."
            />
          </Step>
          <Step>
            <div
              style={{
                textAlign: 'center',
                fontSize: 26,
                fontWeight: 600,
                color: 'var(--osd-text)',
                padding: '6px 0',
              }}
            >
              ↓ &nbsp;Migrate the /ncd slice — new stack, untouched contract
            </div>
          </Step>
          <Step>
            <StackRow
              label="After"
              stack=".NET 8 · ASP.NET Core Minimal API · EF Core · SQL Server"
              verdict="Suite green"
              verdictNote="The identical tests, unmodified, run on the modern endpoint."
            />
          </Step>
          <Step>
            <Kicker>Behaviour-preserving, proven rather than asserted. That is the whole spine.</Kicker>
          </Step>
        </Steps>
      </div>
    </Body>
  </div>
);

const UiPayoff: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 3 · The payoff</Eyebrow>
      <Title>One UI. Two engines. Flip it live.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          A modern quote-to-claim PMI app sits on top of both backends. We switch the engine on
          screen, mid-journey, and the answers do not move.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Chip>Legacy .NET · WCF · EF6</Chip>
          <span style={{ fontSize: 34, color: colors.muted }}>⇄</span>
          <Chip accent>.NET 8 · Minimal API · EF Core</Chip>
          <span style={{ fontSize: 24, color: colors.muted }}>one toggle, same front end</span>
        </div>
      </FadeUp>
      <FadeUp delay={0.24} style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Journey 01"
            heading="Quote"
            body="Same premium, same no-claims discount applied, on either engine."
          />
          <Card
            label="Journey 02"
            heading="Buy"
            body="Same policy written, same reference issued, same validation errors."
          />
          <Card
            label="Journey 03"
            heading="Claim"
            body="Same claim accepted, same discount recalculated afterwards."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.3} style={{ marginTop: 36 }}>
        <Kicker>
          Then we hand the next slice to a Cloud Agent, which opens the follow-on PR while we keep
          talking.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const Differentiation: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Where this sits</Eyebrow>
      <Title>Copilot finishes your line. Cursor finishes the migration.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          This is not a swap. 1,750 engineers already have autocomplete, and it earns its keep. The
          migration work needs something with a longer attention span.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Autocomplete"
            heading="Helps inside the file"
            body="Completes the next line, suggests the next method, keeps a developer in flow. Scoped to what is on screen."
          />
          <Card
            label="Migration teammate"
            heading="Owns the whole slice"
            body="Takes a WCF service to .NET 8 across files, writes the tests that prove parity, reviews against your rules, and documents the result."
            accent
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          The step up is not better suggestions. It is a unit of work you can hand over and audit.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const WhyItLands: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Why it lands here</Eyebrow>
      <Title>This fits the programme you are already running.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 36 }}>
        <Lead>
          No rip and replace, no new platform to justify, no change of destination. The same
          migration, moving faster, with more evidence behind it.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Economics"
            heading="Accelerates funded work"
            body="It attacks the comprehension and proof costs that make legacy slices overrun."
          />
          <Card
            label="Control"
            heading="Guardrails you author"
            body="Your migration rules, your scanners, your review gates — enforced in the loop, not in a wiki."
          />
          <Card
            label="Assurance"
            heading="Evidence as a by-product"
            body="Contract tests, security findings and a written record for every slice you move."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          Worth saying plainly: the agent still needs a reviewer, and the guardrails are the work.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const NextStep: Page = () => (
  <div style={darkPage}>
    <Styles />
    <FadeUp>
      <Eyebrow onDark>Next step</Eyebrow>
      <Title size={76} onDark>
        One real slice. One controlled POC.
      </Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 36 }}>
        <Lead onDark width={1500}>
          Everything you have just watched ran on a stand-in. The only test that counts is the same
          method on your estate, inside your controls.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <DarkCard
            label="Step 01"
            heading="Pick the slice"
            body="One WCF endpoint with a real contract and real callers. Awkward is better than tidy."
          />
          <DarkCard
            label="Step 02"
            heading="Set the guardrails"
            body="Your migration rules as repo-local skills, your scanners wired into the loop."
          />
          <DarkCard
            label="Step 03"
            heading="Measure the delta"
            body="Time to merge and evidence produced, against your current baseline. Your numbers."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <AccentRule width={120} />
          <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.3, color: colors.navyText }}>
            Legacy in, modern out, contract-proven identical — on your code, not our demo.
          </div>
        </div>
      </FadeUp>
    </Body>
  </div>
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

export const notes: (string | undefined)[] = [
  'Frame the session in one breath: this is a working migration, not a capability deck. We take one real PMI slice from WCF and EF6 to .NET 8 in front of you, and we prove the behaviour did not change. Say up front that the codebase is synthetic — we get to that on slide five, and it is a feature, not an apology.',
  'Establish that we did our homework and that we are not selling a change of direction. Framework 4.x with an MVC 5 front end, a WCF/SOAP tail and EF6 over SQL Server; a live 4.x to .NET 6 programme; Bamboo already on Azure; Copilot already at 1,750 users. The message: you have chosen the destination and paid for the ticket. We are here about pace.',
  'Name the real cost drivers, because they are the ones the audience argues about internally. Comprehension is weeks of archaeology on code whose authors have left. Proof is usually asserted rather than demonstrated. The paper trail slips whenever delivery is tight. If someone pushes back that coding is the bottleneck, ask them what the last migration retrospective actually blamed.',
  'Set expectations for the next twenty minutes so nobody is waiting for a slide that never comes. Four acts, one slice, and a payoff you can see on screen. Tell them the interesting part is Act 2 and invite them to interrupt during it.',
  'This is the trust slide — do not rush it. Their code is private and should stay private, so we rebuilt the shape of it from public sources and wrote the PMI contract down as OpenAPI. Everything sourced is labelled sourced; everything inferred is labelled inferred, in the repo, not just in the talk. If the domain detail is wrong, that is useful feedback, not an embarrassment.',
  'The point is time-to-understanding, not magic. Open the worst file, ask what it promises, and read back the SOAP contract, the EF6 query path and the NCD rules hiding in the service layer. Expect a challenge on whether it can be trusted — the honest answer is that this is a first draft for a human to check, and it beats starting from a blank page.',
  'Pivot slide — use it to reset attention before the longest stretch of the demo. Say plainly that we are not going to skip gates to make this look fast: the same slice passes build, review, security and documentation. If their SDLC has a fifth gate we have not shown, ask what it is now, while it is cheap to answer.',
  'The core demo. Emphasise the order: tests first, against the legacy endpoint, generated from the contract. Only then the migration. Then the same suite again on .NET 8. If a test fails after migration, that is the mechanism working, so do not hide it if it happens live.',
  'Make the point that the review is theirs, not ours. The migration rules live in the repository as skills, so the agent enforces Aviva standards. The dropped protected-NCD cap is the kind of defect that survives human review and lands in production. Note the trade-off honestly: the rules are work to author, and they are the highest-leverage work in the programme.',
  'Reframe security from blocker to opportunity. The concatenated query came with the legacy code; the migration is what surfaced it. Use whichever scanners they already own — SonarQube and Checkmarx here, Semgrep, CodeQL and Trivy if they prefer open source. The agent fixes and re-scans; a security engineer still signs it off.',
  'This is the slide that matters to risk and audit, not to engineers. Impact against shared modules and remaining legacy callers, an explanation in business language, verification against AVH-207, then published where the programme already keeps its records. For a phased migration under regulatory scrutiny, the record is not overhead — it is the licence to proceed.',
  'Slow down here. This is the single most credible claim in the deck, so let the build land: contract, green on legacy, migrate, green on modern. Say the words "proven, not asserted". If they take one thing away, it should be this spine — everything else is speed on top of it.',
  'The payoff for anyone in the room who does not read C#. Same front end, two engines, switched live mid-journey with identical results. Then start a Cloud Agent on the next slice to show this is not a one-at-a-time party trick. Keep it short; the credibility was earned two slides ago.',
  'Handle the Copilot question before it is asked, and do not disparage it — 1,750 engineers use it and it earns its keep inside the file. The distinction is scope: completing a line versus owning a slice across files with tests, review and documentation. Frame it as the step up from autocomplete to a teammate you can hand a ticket to.',
  'Bring it back to their programme in their language: economics, control, assurance. Then say the uncomfortable part out loud — the agent still needs a reviewer, and authoring the guardrails is real work. Leaders trust the pitch that names its own failure modes.',
  'Ask for something small and specific: one awkward WCF endpoint with real callers, guardrails authored with their engineers, and a measured delta against their own baseline. No platform commitment, no estate-wide promise. Close on the line: legacy in, modern out, contract-proven identical — on their code, not our demo.',
];

export const meta: SlideMeta = {
  title: 'Aviva PMI Migration — Legacy .NET to .NET 8, live in Cursor',
  createdAt: '2026-07-24T16:14:10.372Z',
};

export default [
  Cover,
  Context,
  Problem,
  Agenda,
  HonestFraming,
  Comprehension,
  ActTwoDivider,
  SceneOne,
  SceneTwo,
  SceneThree,
  SceneFour,
  Spine,
  UiPayoff,
  Differentiation,
  WhyItLands,
  NextStep,
] satisfies Page[];
