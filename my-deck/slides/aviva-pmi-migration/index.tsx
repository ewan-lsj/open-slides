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
        Making your .NET migration
        <br />
        cheaper to finish.
      </HeroTitle>
      <div style={{ margin: '40px 0 36px' }}>
        <AccentRule width={240} />
      </div>
      <Lead onDark width={1380}>
        We take one private-medical-insurance endpoint off WCF and EF6 today, prove nothing changed
        for the customer, and leave the audit trail behind. All of it live.
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
      <Title>You are already paying for this migration.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 36 }}>
        <Lead>
          Nothing in this deck asks you to change direction or buy a platform. The destination is
          set, the budget is committed, and your engineers already work with AI. The variable left is
          how long the programme takes.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="The estate"
            heading="4.x, with a SOAP tail"
            body="C# on .NET Framework 4.x, ASP.NET MVC 5, WCF/SOAP services, EF6 over SQL Server. Every one of those is a slice someone has to move."
          />
          <Card
            label="In flight"
            heading="4.x → .NET 6, funded"
            body="The programme exists and has a budget line against it. .NET 8 is the sensible place to land from here."
          />
          <Card
            label="Appetite"
            heading="Copilot at 1,750 users"
            body="Bamboo is on Azure and Copilot went out at scale. Nobody here needs persuading that AI belongs in the toolchain."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          So the question is not whether. It is how many quarters this takes, and what you can put in
          front of a regulator at the end of it.
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
      <Title>The overrun is never in the new code.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 36 }}>
        <Lead>
          Writing the .NET 8 endpoint is a day's work. The quarter goes on everything around it:
          working out what the old code promised, proving the new one behaves identically, and
          getting it written up so assurance will sign it off.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Where the time goes"
            heading="Weeks of archaeology"
            body="Nobody left on the team wrote the WCF service, so every slice starts with reading it back."
          />
          <Card
            label="Where the risk sits"
            heading="Parity nobody can prove"
            body="Behaviour parity usually gets asserted in a pull request rather than demonstrated by a test."
          />
          <Card
            label="Where audit bites"
            heading="Evidence written late"
            body="A phased programme needs a record per slice, and that write-up always loses to delivery pressure."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          Those three are what we go after today. The new code is the easy bit, so it gets the least
          airtime.
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
      <Title>Here is the running order, and what each part is for.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.12} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ActRow
            act="Act 0"
            heading="Show our working"
            body="A synthetic stand-in for your stack, plus the PMI contract written down as OpenAPI."
          />
          <ActRow
            act="Act 1"
            heading="Read the legacy back"
            body="Cursor explains the WCF and EF6 code, including the policy rules nobody documented."
          />
          <ActRow
            act="Act 2"
            heading="Move one real slice"
            body="GET /ncd through your four gates: delivery, code review, security, and the write-up."
          />
          <ActRow
            act="Act 3"
            heading="Show the customer view"
            body="The same PMI app running on either backend, switched live, with identical results."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.22} style={{ marginTop: 36 }}>
        <Kicker>One slice, all the way through. Judge us on that rather than on the slides.</Kicker>
      </FadeUp>
    </Body>
  </div>
);

const HonestFraming: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 0 · Honest framing</Eyebrow>
      <Title>We did not ask for your code, and we do not need it.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          Getting a copy of a live policy system out of the building for a vendor demo would be a bad
          idea, and your security team would be right to refuse. So we rebuilt the shape of it from
          public sources instead, and wrote the PMI contract down as OpenAPI.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Sourced"
            heading="The stack and direction"
            body="Framework 4.x, MVC 5, WCF, EF6, SQL Server, the .NET 6 programme, Bamboo on Azure, Copilot at 1,750 users."
          />
          <Card
            label="Inferred"
            heading="The PMI detail"
            body="Endpoints, no-claims-discount rules and table names. Reconstructed, checked against the spec, and flagged as inferred in the repo."
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
      <Title>Understanding the old code stops being a two-week job.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          We open the worst file in the service, a WCF operation with EF6 queries and years of policy
          rules inlined, and ask what it actually promises. You get the answer in the meeting.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Answer 01"
            heading="The contract"
            body="The SOAP operation, its message shapes, and how it behaves when things go wrong."
          />
          <Card
            label="Answer 02"
            heading="The data path"
            body="Which EF6 queries run, against which tables, and where a query is still hand-built."
          />
          <Card
            label="Answer 03"
            heading="The hidden rules"
            body="The no-claims-discount logic sitting in the service layer, edge cases included. That is the part that bites."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          This is where migration time actually goes, and it is the cheapest place to buy some back.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const ActTwoDivider: Page = () => (
  <div style={{ ...darkPage, justifyContent: 'center' }}>
    <Styles />
    <FadeUp>
      <Eyebrow onDark>Act 2 · Your SDLC, end to end</Eyebrow>
      <Title size={96} onDark>
        The part assurance cares about
      </Title>
      <div style={{ margin: '36px 0 34px' }}>
        <AccentRule width={180} />
      </div>
      <Lead onDark width={1420}>
        One endpoint, GET /ncd, taken from a Jira ticket to a Confluence record. We do not skip a gate
        to make the demo look quick.
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
      <Eyebrow>Act 2 · Scene 1 · Jira to code to PR</Eyebrow>
      <Title>The slice moves in one sitting, with proof attached.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          AVH-207 says take GET /ncd off WCF and EF6. Watch the order Cursor works in, because the
          order is what makes the result defensible later.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <FlowCard
            step="Step 01"
            label="Read the ticket"
            body="AVH-207 and the /ncd slice, with the OpenAPI contract treated as the source of truth."
          />
          <Arrow />
          <FlowCard
            step="Step 02"
            label="Tests on legacy"
            body="Characterisation tests written from the spec and run against the old endpoint first. All green."
            tone="pass"
          />
          <Arrow />
          <FlowCard
            step="Step 03"
            label="Migrate the slice"
            body="WCF and EF6 become .NET 8 Minimal API and EF Core, across every file the change touches."
            tone="accent"
          />
          <Arrow />
          <FlowCard
            step="Step 04"
            label="Same tests, modern"
            body="The identical suite re-run on the new endpoint. Green again, then a PR carrying both runs."
            tone="pass"
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          Nobody has to take parity on trust. It is the same suite, run twice, and the PR shows both.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const SceneTwo: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 2 · Scene 2 · Code review</Eyebrow>
      <Title>The rules stop depending on who reviews the PR.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          Your migration standards live in the repository, so the first review happens before a human
          opens the pull request. On this slice it caught something expensive.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="The rules, in the repo"
            heading="Contract parity, no drift"
            body="Every response field matches the spec. Every legacy branch is either carried over or retired on purpose, with a reason."
          />
          <Card
            label="What it caught"
            heading="A dropped discount cap"
            body="The maximum cap on protected no-claims discount did not survive the rewrite. Flagged, explained and fixed before review."
            accent
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          That is the kind of defect that gets past people and turns into customer remediation.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const SceneThree: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 2 · Scene 3 · Security</Eyebrow>
      <Title>You can take real vulnerabilities off the books.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          The security gate runs in the same loop as the change, using scanners you already own and
          pay for. On this slice it found something that predates the migration.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="The gate"
            heading="Your scanners, in the loop"
            body="SonarQube and Checkmarx here, with Semgrep, CodeQL and Trivy if you would rather stay open source."
          />
          <Card
            label="The find"
            heading="Inherited SQL injection"
            body="A concatenated query in the old no-claims-discount lookup, carried forward with nobody noticing."
            accent
          />
          <Card
            label="The fix"
            heading="Parameterised, re-scanned"
            body="Rewritten through EF Core, scanned clean, and written up in the pull request for sign-off."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          The flaw was already in the estate. Moving the slice is what put it in front of someone.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const SceneFour: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>Act 2 · Scene 4 · Impact and documentation</Eyebrow>
      <Title>The write-up stops being a separate job.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          A phased migration in a regulated business runs on evidence. If the record is a separate
          task it slips, so we make it the last step of the change itself.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <FlowCard
            step="Step 01"
            label="Assess impact"
            body="Which shared modules the change touches, and which legacy callers still need the old operation."
          />
          <Arrow />
          <FlowCard
            step="Step 02"
            label="Business summary"
            body="What changed for a PMI policy, what did not, and whether a customer would notice."
          />
          <Arrow />
          <FlowCard
            step="Step 03"
            label="Verify against AVH-207"
            body="Each acceptance criterion checked against what the code actually does now."
          />
          <Arrow />
          <FlowCard
            step="Step 04"
            label="Publish to Confluence"
            body="Filed on the page your programme already uses, so nobody has to go hunting for it."
            tone="accent"
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          When someone asks how you know the behaviour held, this is the answer, slice by slice.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const Spine: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>The claim to hold us to</Eyebrow>
      <Title>Nothing changed for the customer, and we can prove it.</Title>
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
            Request shape, response shape, status codes and fault behaviour, all written down and
            validated before a single line moves.
          </div>
        </div>
        <Steps>
          <Step>
            <StackRow
              label="Before"
              stack=".NET Framework 4.x · WCF/SOAP · EF6 · SQL Server"
              verdict="Suite green"
              verdictNote="Characterisation tests built from the contract, run against the legacy endpoint."
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
              ↓ &nbsp;Migrate the /ncd slice. New stack, contract untouched.
            </div>
          </Step>
          <Step>
            <StackRow
              label="After"
              stack=".NET 8 · ASP.NET Core Minimal API · EF Core · SQL Server"
              verdict="Suite green"
              verdictNote="The same tests, unmodified, run against the .NET 8 endpoint."
            />
          </Step>
          <Step>
            <Kicker>
              If you take one thing from today, take this. Parity is something we can show you, slice
              by slice, in the pipeline.
            </Kicker>
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
      <Eyebrow>Act 3 · What it looks like from outside</Eyebrow>
      <Title>The front end does not care which engine is running.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          The same PMI app runs on either backend. We switch it on screen halfway through a journey
          and the numbers stay put, which is also your rollback story.
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
            body="Same premium, same no-claims discount applied, whichever engine answers."
          />
          <Card
            label="Journey 02"
            heading="Buy"
            body="Same policy written, same reference issued, same validation errors."
          />
          <Card
            label="Journey 03"
            heading="Claim"
            body="Same claim accepted, and the discount recalculated the same way afterwards."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.3} style={{ marginTop: 36 }}>
        <Kicker>
          Then we hand the next slice to a Cloud Agent and let it open the follow-on PR while we carry
          on talking.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const Differentiation: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>How this sits next to Copilot</Eyebrow>
      <Title>Autocomplete was never going to move a WCF service.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 32 }}>
        <Lead>
          Keep Copilot. It earns its keep inside the file and your engineers like it. Migration is a
          different unit of work, and it needs something that can hold a whole slice at once.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Autocomplete"
            heading="Works inside the file"
            body="Completes the next line, suggests the next method, keeps a developer moving. Scoped to what is on screen."
          />
          <Card
            label="Agent"
            heading="Takes the whole slice"
            body="Moves a WCF service to .NET 8 across files, writes the tests that prove parity, reviews it against your rules, files the record."
            accent
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          The difference that matters to you is scope: work you can delegate, then audit afterwards.
        </Kicker>
      </FadeUp>
    </Body>
  </div>
);

const WhyItLands: Page = () => (
  <div style={lightPage}>
    <Styles />
    <FadeUp>
      <Eyebrow>What it changes for you</Eyebrow>
      <Title>None of this needs a new platform decision.</Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 36 }}>
        <Lead>
          There is no rip and replace here, and no new runtime to defend at architecture review. The
          programme you approved stays exactly as it is. It just moves quicker, and leaves more
          evidence behind it.
        </Lead>
      </FadeUp>
      <FadeUp delay={0.18} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 28 }}>
          <Card
            label="Cost"
            heading="Attacks the overrun"
            body="It goes after the reading and the proving, which is where legacy slices lose their schedule."
          />
          <Card
            label="Control"
            heading="Guardrails you author"
            body="Your migration rules, your scanners, your reviewers, enforced in the loop rather than in a wiki."
          />
          <Card
            label="Assurance"
            heading="Evidence per slice"
            body="Contract tests, security findings and a written record for every endpoint you move."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 40 }}>
        <Kicker>
          Worth saying plainly: someone still reviews the work, and writing the guardrails is real
          effort. Budget for both.
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
        Now do it on your own code.
      </Title>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1} style={{ marginTop: 36 }}>
        <Lead onDark width={1500}>
          Everything you just watched ran on a stand-in, which is exactly why it proves nothing about
          your estate. The next step is small, contained, and measurable.
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
            body="Your migration rules in the repo, your scanners in the loop, your reviewers in the path."
          />
          <DarkCard
            label="Step 03"
            heading="Measure it"
            body="Time to merge and evidence produced, against your own baseline. Your numbers, not ours."
          />
        </div>
      </FadeUp>
      <FadeUp delay={0.26} style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <AccentRule width={120} />
          <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.3, color: colors.navyText }}>
            Then decide on your own evidence, not on our demo.
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
  'Say what this is in one sentence: a working migration, done live, not a capability pitch. One PMI endpoint comes off WCF and EF6 and lands on .NET 8, and we show the tests that prove the behaviour held. Flag now that the codebase is synthetic. We deal with that properly on slide five, and it is deliberate.',
  'The job here is to prove we understand their position before we ask for anything. Framework 4.x with an MVC 5 front end, a WCF tail, EF6 over SQL Server, a funded move to .NET 6, Bamboo on Azure, Copilot out to 1,750 people. They have picked the destination and signed the cheque. The only thing on the table today is how long the journey takes.',
  'This is the slide their delivery leads will already agree with, so let them agree out loud. Reading the old code is weeks. Proving parity rarely happens properly. The write-up slips every time. If anyone claims coding is the bottleneck, ask what the last migration post-mortem actually blamed.',
  'Set the running order so nobody sits waiting for a slide that never comes. Tell them Act 2 is the part worth interrupting, and that Act 3 is for whoever in the room does not read C#.',
  'Trust slide, so do not hurry it. Their code should never leave the building for a vendor demo, and their security team would be right to say no. We rebuilt the shape from public sources and wrote the contract down. Sourced is labelled sourced, inferred is labelled inferred, in the repo rather than just in the talk. If our domain detail is wrong, that is useful, and it takes ten minutes to correct.',
  'What matters here is elapsed time, not cleverness. Open the worst file, ask what it promises, and get the SOAP contract, the EF6 query path and the NCD rules read back. Someone will ask whether it can be trusted. The honest answer: it is a first draft for an engineer to check, and it beats two weeks of archaeology.',
  'Use this to reset attention before the longest stretch. Be blunt that we are not skipping gates to make the demo look quick. If their SDLC has a fifth gate we have not covered, now is the cheap moment to hear about it.',
  'The core of the demo. Labour the order: tests written from the contract and run on the legacy endpoint first, migration second, same tests again third. If something fails live, show it. A failing test is the control working, and pretending otherwise costs more credibility than the failure does.',
  'The point for this audience is consistency. Today a good review depends on which senior engineer picked up the PR. With the rules in the repo it does not. The dropped discount cap is the kind of thing that becomes a remediation exercise and a customer letter, so name that cost.',
  'Security people expect a vendor to treat their gate as an obstacle, so do the opposite. The injection came with the legacy code and had been sitting there. Moving the slice is what put it in front of a human. Use whatever scanners they own. The agent proposes the fix and re-scans, and a security engineer still signs it off.',
  'This one is for the risk and audit side of the room rather than the engineers. Impact on shared modules and remaining callers, a summary in business language, a check against the ticket, filed where the programme already keeps its records. Under a phased regulatory plan, that record is what buys permission to do the next slice.',
  'Slow down and let the build land. Contract first, green on legacy, migrate, green on modern. This is the most defensible claim in the deck and the one to invite scrutiny on. If they remember one slide, it should be this one. Everything else is speed sitting on top of it.',
  'Short slide. Same app, either engine, switched mid-journey, numbers unchanged. Worth saying out loud that this is also the rollback story, because that is what a CTO will actually be thinking. Then kick off a Cloud Agent on the next slice so it does not look like a one-at-a-time trick.',
  'The Copilot question is coming, so get there first and do not run it down. 1,750 people use it and it earns its keep. The difference is scope: finishing a line versus taking a slice across files with tests, review and a record. Frame it as work you can delegate and then audit.',
  'Land it in their language: cost, control, assurance, no new platform decision. Then say the uncomfortable part yourself. Someone still reviews the output, and writing the guardrails is real effort that needs a named owner. Executives trust a pitch that volunteers its own caveats.',
  'Ask for something small and specific. One awkward endpoint with real callers, guardrails written with their engineers, a measured result against their own baseline. No estate-wide promise, no platform commitment. Then stop talking and let them decide.',
];

export const meta: SlideMeta = {
  title: 'Aviva PMI Migration: legacy .NET to .NET 8, live in Cursor',
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
