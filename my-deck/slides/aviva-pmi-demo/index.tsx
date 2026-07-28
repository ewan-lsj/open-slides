import type { ReactNode } from 'react';
import type {
  DesignSystem,
  Page,
  SlideMeta,
  SlideTransition,
} from '@open-slide/core';
import cursorLight from '@assets/cursor_light.svg';
import cursorDark from '@assets/cursor_dark.svg';
import coverHillside from './assets/cover-hillside.jpg';

export const design: DesignSystem = {
  palette: { bg: '#F7F6F2', text: '#1A1A1A', accent: '#ED7D31' },
  fonts: {
    display: 'Arial, Helvetica, "Helvetica Neue", system-ui, sans-serif',
    body: 'Arial, Helvetica, "Helvetica Neue", system-ui, sans-serif',
  },
  typeScale: { hero: 120, body: 34 },
  radius: 4,
};

const colors = {
  body: '#3D3D3A',
  secondary: '#5A5A55',
  muted: '#8C8B84',
  tile: '#FFFFFF',
  tileBorder: '#E4E1D8',
  darkInk: '#FFFFFF',
  darkMuted: '#CFD2D7',
  darkRule: 'rgba(255,255,255,0.38)',
  hairline: '#E1DED4',
} as const;

const root = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  position: 'relative',
  fontFamily: 'var(--osd-font-body)',
} as const;

const contentPage = {
  ...root,
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  padding: '96px 120px',
  display: 'flex',
  flexDirection: 'column',
} as const;

const CursorMark = () => (
  <img
    src={cursorLight}
    alt="Cursor"
    style={{ position: 'absolute', top: 48, right: 56, height: 42, width: 'auto' }}
  />
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
      fontFamily: 'var(--osd-font-display)',
    }}
  >
    {children}
  </div>
);

const Title = ({ children }: { children: ReactNode }) => (
  <h1
    style={{
      margin: '20px 0 0',
      fontSize: 72,
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-display)',
      maxWidth: 1600,
    }}
  >
    {children}
  </h1>
);

const Lede = ({ children }: { children: ReactNode }) => (
  <p
    style={{
      margin: '26px 0 0',
      fontSize: 'var(--osd-size-body)',
      lineHeight: 1.5,
      color: colors.secondary,
      maxWidth: 1600,
    }}
  >
    {children}
  </p>
);

const Footnote = ({ children }: { children: ReactNode }) => (
  <p
    style={{
      margin: '28px 0 0',
      fontSize: 24,
      lineHeight: 1.4,
      color: colors.muted,
      maxWidth: 1600,
    }}
  >
    {children}
  </p>
);

// One filled card = one editable PPTX text frame. Text lives directly inside.
const tile = {
  boxSizing: 'border-box',
  background: colors.tile,
  border: `2px solid ${colors.tileBorder}`,
  borderRadius: 'var(--osd-radius)',
} as const;

const cardLabel = {
  fontSize: 21,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: colors.muted,
  fontFamily: 'var(--osd-font-display)',
} as const;

const numeralStyle = {
  fontSize: 26,
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '0.02em',
  color: 'var(--osd-accent)',
  fontFamily: 'var(--osd-font-display)',
} as const;

const SurfaceCard = ({
  numeral,
  label,
  detail,
}: {
  numeral: string;
  label: string;
  detail: string;
}) => (
  <div style={{ ...tile, padding: '24px 26px 28px', display: 'flex', flexDirection: 'column' }}>
    <span style={numeralStyle}>{numeral}</span>
    <span
      style={{
        marginTop: 16,
        fontSize: 28,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.015em',
      }}
    >
      {label}
    </span>
    <span style={{ marginTop: 12, fontSize: 22, lineHeight: 1.45, color: colors.body }}>
      {detail}
    </span>
  </div>
);

const WhyCard = ({
  numeral,
  label,
  detail,
}: {
  numeral: string;
  label: string;
  detail: string;
}) => (
  <div style={{ ...tile, padding: '26px 26px 32px', display: 'flex', flexDirection: 'column' }}>
    <span style={numeralStyle}>{numeral}</span>
    <span
      style={{
        marginTop: 22,
        fontSize: 26,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.015em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
    <span style={{ marginTop: 14, fontSize: 22, lineHeight: 1.45, color: colors.body }}>
      {detail}
    </span>
  </div>
);

const StackCard = ({ label, detail }: { label: string; detail: string }) => (
  <div style={{ ...tile, padding: '22px 28px 26px', display: 'flex', flexDirection: 'column' }}>
    <span style={cardLabel}>{label}</span>
    <span style={{ marginTop: 14, fontSize: 28, lineHeight: 1.35, color: colors.body }}>
      {detail}
    </span>
  </div>
);

// Flow steps stay sibling shapes; the text arrow is the connector so PPTX keeps
// every card as its own editable text frame.
const FlowCard = ({
  numeral,
  label,
  detail,
}: {
  numeral: string;
  label: string;
  detail: string;
}) => (
  <div
    style={{
      ...tile,
      flex: 1,
      padding: '22px 24px 26px',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <span style={{ ...numeralStyle, fontSize: 22 }}>{numeral}</span>
    <span
      style={{
        marginTop: 12,
        fontSize: 25,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.015em',
      }}
    >
      {label}
    </span>
    <span style={{ marginTop: 10, fontSize: 20, lineHeight: 1.45, color: colors.body }}>
      {detail}
    </span>
  </div>
);

const FlowArrow = () => (
  <span
    style={{
      width: 44,
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 30,
      lineHeight: 1,
      color: colors.muted,
      fontFamily: 'var(--osd-font-display)',
    }}
  >
    &rarr;
  </span>
);

const BeatCard = ({
  numeral,
  label,
  detail,
}: {
  numeral: string;
  label: string;
  detail: string;
}) => (
  <div style={{ ...tile, padding: '24px 28px 28px', display: 'flex', flexDirection: 'column' }}>
    <span style={{ ...numeralStyle, fontSize: 22 }}>{numeral}</span>
    <span
      style={{
        marginTop: 14,
        fontSize: 26,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.015em',
      }}
    >
      {label}
    </span>
    <span style={{ marginTop: 12, fontSize: 22, lineHeight: 1.45, color: colors.body }}>
      {detail}
    </span>
  </div>
);

// Hairline rows, no fill: the divider is a one-sided border on the row itself,
// so PPTX keeps the text native and the rule exports as a strip on that frame.
const hairlineRow = {
  boxSizing: 'border-box',
  borderTop: `2px solid ${colors.hairline}`,
  display: 'flex',
  alignItems: 'baseline',
} as const;

const AgendaRow = ({ numeral, heading }: { numeral: string; heading: string }) => (
  <div style={{ ...hairlineRow, padding: '22px 0 24px', gap: 40 }}>
    <span
      style={{
        fontSize: 48,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        color: 'var(--osd-accent)',
        fontFamily: 'var(--osd-font-display)',
        minWidth: 110,
      }}
    >
      {numeral}
    </span>
    <span style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.015em' }}>
      {heading}
    </span>
  </div>
);

const StepRow = ({ numeral, detail }: { numeral: string; detail: string }) => (
  <div style={{ ...hairlineRow, padding: '26px 0 28px', gap: 40 }}>
    <span
      style={{
        fontSize: 42,
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        color: 'var(--osd-accent)',
        fontFamily: 'var(--osd-font-display)',
        minWidth: 100,
      }}
    >
      {numeral}
    </span>
    <span style={{ fontSize: 32, lineHeight: 1.4, color: colors.body }}>{detail}</span>
  </div>
);

const Chip = ({ label }: { label: string }) => (
  <div
    style={{
      ...tile,
      padding: '14px 24px',
      fontSize: 24,
      fontWeight: 700,
      lineHeight: 1.2,
      color: colors.body,
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
);

const ChipCaption = ({ children }: { children: ReactNode }) => (
  <div style={{ ...cardLabel, marginBottom: 20 }}>{children}</div>
);

const Cover: Page = () => (
  <div style={{ ...root, background: '#0B0D11', color: colors.darkInk }}>
    <img
      src={coverHillside}
      alt="Dawn over a hillside ridge"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
    {/* Scrim so the white lockup and title stay legible over the photograph. */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(102deg, rgba(8,10,14,0.74) 0%, rgba(8,10,14,0.52) 38%, rgba(8,10,14,0.16) 72%, rgba(8,10,14,0.05) 100%), linear-gradient(180deg, rgba(8,10,14,0.46) 0%, rgba(8,10,14,0) 34%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 88,
        left: 120,
        display: 'flex',
        alignItems: 'center',
        gap: 30,
      }}
    >
      <img src={cursorDark} alt="Cursor" style={{ height: 52, width: 'auto' }} />
      <div style={{ width: 2, height: 46, background: colors.darkRule }} />
      <span
        style={{
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: colors.darkInk,
          fontFamily: 'var(--osd-font-display)',
        }}
      >
        Aviva
      </span>
    </div>
    <div
      style={{
        position: 'absolute',
        left: 120,
        bottom: 176,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 700,
          lineHeight: 1.04,
          letterSpacing: '-0.035em',
          color: '#FFFFFF',
          fontFamily: 'var(--osd-font-display)',
        }}
      >
        Aviva PMI Migration
      </h1>
      <p
        style={{
          margin: '34px 0 0',
          fontSize: 38,
          lineHeight: 1.4,
          color: colors.darkMuted,
          maxWidth: 1200,
        }}
      >
        A working migration from .NET Framework 4.8 to .NET 8.
      </p>
    </div>
  </div>
);

const Surfaces: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Where Cursor lives</Eyebrow>
    <Title>One agent platform, several surfaces.</Title>
    <Lede>
      This is not an IDE-only demo. The same agents show up wherever the work starts.
    </Lede>
    <div
      style={{
        marginTop: 'auto',
        paddingTop: 48,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
        alignItems: 'stretch',
      }}
    >
      <SurfaceCard
        numeral="01"
        label="IDE"
        detail="Full editor with agents, files, terminal and tests in one loop."
      />
      <SurfaceCard
        numeral="02"
        label="Agents Window (Glass)"
        detail="Agent-first workspace for running and reviewing many agents in parallel. The IDE stays one click away."
      />
      <SurfaceCard
        numeral="03"
        label="Cloud Agents"
        detail="Long-running agents that keep working while you are away, with demos and screenshots to review."
      />
      <SurfaceCard
        numeral="04"
        label="CLI"
        detail="The same agent in the terminal, for scripts, CI and headless work."
      />
      <SurfaceCard
        numeral="05"
        label="Web"
        detail="cursor.com/agents for starting and reviewing work from a browser."
      />
      <SurfaceCard
        numeral="06"
        label="Mobile"
        detail="Direct and review cloud agents from your phone, including remote control of a session on your computer."
      />
    </div>
    <Footnote>
      Agents kicked off from Slack, GitHub or Linear land in the same sidebar.
    </Footnote>
  </div>
);

const WhyCursor: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Why Cursor</Eyebrow>
    <Title>Five things that matter on a codebase this old.</Title>
    <Lede>
      The model is the easy part. What sits around it decides whether any of this survives review.
    </Lede>
    <div
      style={{
        marginTop: 'auto',
        paddingTop: 64,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 24,
        alignItems: 'stretch',
      }}
    >
      <WhyCard
        numeral="01"
        label="Model neutral"
        detail="Every frontier lab in one place, picked per task."
      />
      <WhyCard
        numeral="02"
        label="Cursor harness"
        detail="Retrieval, edits, terminal and tests in one loop."
      />
      <WhyCard
        numeral="03"
        label="Composer models"
        detail="Our own fast models for the repetitive work."
      />
      <WhyCard
        numeral="04"
        label="Multi-agentic UX"
        detail="Several agents at once, and you keep what survives review."
      />
      <WhyCard
        numeral="05"
        label="Software factory"
        detail="Rules and Skills live in the repo, so teams inherit them."
      />
    </div>
  </div>
);

const AppToday: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>The app today</Eyebrow>
    <Title>What is in production right now.</Title>
    <Lede>
      Nothing unusual for its age. Worth being precise about it before we touch anything.
    </Lede>
    <div
      style={{
        marginTop: 'auto',
        paddingTop: 44,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 24,
        alignItems: 'stretch',
      }}
    >
      <StackCard label="Runtime" detail="C# on .NET Framework 4.8. Windows only, hosted in-house." />
      <StackCard label="Web" detail="ASP.NET MVC 5, server-rendered Razor views." />
      <StackCard
        label="Services"
        detail="WCF/SOAP endpoints, with contracts used by clients we do not own."
      />
      <StackCard label="Data" detail="EF6 over SQL Server, plus hand-written SQL in places." />
    </div>
    <div style={{ ...tile, marginTop: 24, padding: '22px 28px 26px' }}>
      <span style={cardLabel}>Domain logic</span>
      <span
        style={{ display: 'block', marginTop: 14, fontSize: 28, lineHeight: 1.35, color: colors.body }}
      >
        NCD (No Claims Discount) banding sits inside PolicyManager, a God class that has absorbed a
        decade of changes. Protected NCD and the maximum cap are in there too, with no tests around
        them.
      </span>
    </div>
  </div>
);

const DemoFlow: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>The demo</Eyebrow>
    <Title>One migration loop, end to end.</Title>
    <Lede>Everything that follows is this sequence, live against the repo.</Lede>
    <div
      style={{
        marginTop: 'auto',
        paddingTop: 44,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <FlowCard
          numeral="01"
          label="Comprehend"
          detail="Ask Cursor how NCD actually works in the legacy code."
        />
        <FlowArrow />
        <FlowCard
          numeral="02"
          label="Migrate AAD-1"
          detail="Jira ticket, then characterization tests, then a .NET 8 Minimal API on EF Core, then a pull request."
        />
        <FlowArrow />
        <FlowCard
          numeral="03"
          label="Bugbot reviews"
          detail="Automatic pull-request review as soon as the migration PR opens."
        />
        <FlowArrow />
        <FlowCard
          numeral="04"
          label="Skills review"
          detail="Aviva-specific Skill catches dropped protected-NCD and max-cap behaviour."
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <FlowCard
          numeral="05"
          label="Security"
          detail="Inherited SQL injection found and fixed on the same pull request."
        />
        <FlowArrow />
        <FlowCard
          numeral="06"
          label="Confluence"
          detail="Impact assessment written back with links to the PR and the tests."
        />
        <FlowArrow />
        <FlowCard
          numeral="07"
          label="UI toggle"
          detail="Flip Legacy .NET across to .NET 8. Same UI, modernized engine."
        />
        <FlowArrow />
        <FlowCard
          numeral="08"
          label="Slack to NCD badge"
          detail="A request in #aviva-pmi-demo adds the NCD tier and discount % badge to the policy card."
        />
      </div>
    </div>
    <Footnote>
      Same OpenAPI contract. The same characterization tests green before and after.
    </Footnote>
  </div>
);

const Agenda: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Agenda</Eyebrow>
    <Title>What we will show live.</Title>
    <Lede>Six beats, all against the real repo. Questions as we go.</Lede>
    <div style={{ marginTop: 'auto', paddingTop: 48, display: 'flex', flexDirection: 'column' }}>
      <AgendaRow numeral="01" heading="Legacy comprehension" />
      <AgendaRow numeral="02" heading="Live migration, Jira to PR (AAD-1) with Bugbot" />
      <AgendaRow numeral="03" heading="Agentic Skills review" />
      <AgendaRow numeral="04" heading="Security review" />
      <AgendaRow numeral="05" heading="Impact assessment to Confluence" />
      <AgendaRow numeral="06" heading="UI toggle, then a Slack feature request to NCD badge" />
    </div>
  </div>
);

const DemoComprehension: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Demo 01 / Legacy comprehension</Eyebrow>
    <Title>Ask the codebase how NCD actually works.</Title>
    <Lede>
      The people who wrote this have moved on. So we point Cursor at the WCF service and the EF6
      mappings and make it explain the banding, including the parts nobody wrote down.
    </Lede>
    <div style={{ marginTop: 'auto', paddingTop: 64 }}>
      <ChipCaption>On screen</ChipCaption>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'nowrap' }}>
        <Chip label="PolicyManager.cs" />
        <Chip label="NcdService.svc" />
        <Chip label="EF6 mappings" />
      </div>
    </div>
  </div>
);

const DemoMigration: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Demo 02 / Jira to code to PR</Eyebrow>
    <Title>AAD-1: move GET /ncd onto .NET 8, live.</Title>
    <Lede>
      Cursor picks the ticket up from Jira, writes characterization tests against today&apos;s
      behaviour, then rebuilds the endpoint as a .NET 8 Minimal API on EF Core. The tests have to
      give the same answers before and after, or the pull request does not go up. When the pull
      request opens, Bugbot reviews it automatically.
    </Lede>
    <div style={{ marginTop: 'auto', paddingTop: 64 }}>
      <ChipCaption>On screen</ChipCaption>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'nowrap' }}>
        <Chip label="AAD-1" />
        <Chip label="Characterization tests" />
        <Chip label="Minimal API" />
        <Chip label="EF Core" />
        <Chip label="Bugbot review" />
      </div>
    </div>
  </div>
);

const DemoReview: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Demo 03 / Agentic code review</Eyebrow>
    <Title>Review that knows Aviva&apos;s rules, not just C#.</Title>
    <Lede>
      Bugbot covers the generic pull-request pass. The Aviva Skills layer sits on top of it. The
      first pass at the migration quietly drops protected NCD and the maximum cap. The compiler does
      not care. The review Skill does, because that rule lives in the repo and gets applied to every
      diff.
    </Lede>
    <div style={{ marginTop: 'auto', paddingTop: 64 }}>
      <ChipCaption>On screen</ChipCaption>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'nowrap' }}>
        <Chip label="Local Skills" />
        <Chip label="Protected NCD" />
        <Chip label="Maximum cap" />
      </div>
    </div>
  </div>
);

const DemoSecurity: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Demo 04 / Security review</Eyebrow>
    <Title>An inherited SQL injection, found on the way through.</Title>
    <Lede>
      The NcdBand lookup builds its where clause by string concatenation, and has done for years.
      SonarQube runs first. If the licence check fails we fall back to Semgrep OSS. Either way the
      finding lands on the diff and gets fixed in the same pull request.
    </Lede>
    <div style={{ marginTop: 'auto', paddingTop: 64 }}>
      <ChipCaption>On screen</ChipCaption>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'nowrap' }}>
        <Chip label="SonarQube" />
        <Chip label="Semgrep OSS fallback" />
        <Chip label="NcdBand lookup" />
      </div>
    </div>
  </div>
);

const DemoCloseTheLoop: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Demo 05 / Close the loop</Eyebrow>
    <Title>From audit trail to a badge on the policy card.</Title>
    <Lede>Three beats in one pass.</Lede>
    <div
      style={{
        marginTop: 'auto',
        paddingTop: 48,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
        alignItems: 'stretch',
      }}
    >
      <BeatCard
        numeral="01"
        label="Impact to Confluence"
        detail="Cursor drafts the impact assessment, checks it against AAD-1 acceptance criteria, and posts it to Confluence with links back to the pull request and the test run."
      />
      <BeatCard
        numeral="02"
        label="UI toggle"
        detail="Flip Legacy .NET across to .NET 8. Same OAS, same UI, now served by the modernized slice. The policy card still does not show NCD."
      />
      <BeatCard
        numeral="03"
        label="Slack to NCD badge"
        detail="A product request lands in #aviva-pmi-demo. Cursor adds the NCD tier and discount % as a badge on the policy card, pulled from the modern /ncd endpoint, and opens the PR."
      />
    </div>
    <div style={{ marginTop: 32 }}>
      <ChipCaption>On screen</ChipCaption>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'nowrap' }}>
        <Chip label="AAD-1 acceptance criteria" />
        <Chip label="Confluence page" />
        <Chip label="UI toggle" />
        <Chip label="#aviva-pmi-demo" />
        <Chip label="Policy card badge: NCD Gold, 25%" />
      </div>
    </div>
  </div>
);

const Close: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Where this goes</Eyebrow>
    <Title>One endpoint moved, with proof it still behaves.</Title>
    <Lede>
      The rest of the migration is that same loop, repeated. What we would like to agree today:
    </Lede>
    <div style={{ marginTop: 'auto', paddingTop: 56, display: 'flex', flexDirection: 'column' }}>
      <StepRow
        numeral="01"
        detail="Pick the next two endpoints on the same WCF service and run them this way."
      />
      <StepRow
        numeral="02"
        detail="Move the review and security Skills into a shared repo so other teams inherit them."
      />
      <StepRow
        numeral="03"
        detail="Agree with Risk what evidence they need, then have the assessment generate it."
      />
    </div>
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

export const notes: string[] = [
  'Set the room: this is a working migration, not slideware. Aviva PMI runs on .NET Framework 4.8 today and we will have an endpoint on .NET 8 before we finish. Say the ticket id AAD-1 once so it lands. Then move on, the demos are the deck.',
  'Thirty to forty seconds. The point is framing: what you are about to see is not locked inside an IDE. Do not tour each surface. Name Agents Window (Glass) and Cloud Agents, mention Slack and GitHub as intake, then move on.',
  'One minute here, no more. Land the point that the model is the easy part and the harness is what makes it work on a codebase this old.',
  'Read the stack out flat, no editorial. Pause on PolicyManager and say plainly that the NCD rules are buried in it with no tests. Resist pitching here.',
  'This is the map of the room. Spend under a minute. Point at steps 2 to 4 as the core migration proof, and steps 7 to 8 as the product payoff. Then go to the agenda and switch into Cursor.',
  'Read the six beats once. Then switch to Cursor with the Aviva PMI repo open. Do not linger.',
  'Say what you are about to ask, then switch to Cursor. Ask how NCD is calculated and where it is enforced. Read one line of the answer out loud, then jump to the EF6 mapping it cites.',
  'This is the main event. Switch to Jira, open AAD-1, hand it to Cursor. Let it write the characterization tests first and say out loud why that order matters. Then let it build the Minimal API and EF Core version, run the tests, open the PR. When the Bugbot review lands, name it: automatic PR review on the migration change, before any human looks.',
  'Show the diff first, then run the review Skill. When it flags the dropped protected NCD and the cap, open the Skill file and show the rule. Say clearly that Bugbot is the automatic baseline and Skills are how Aviva encodes its own migration standards on top.',
  'Run the security review on the pull request. When the SQL injection in the NcdBand lookup surfaces, say clearly that it predates the migration and we only found it because the code finally got read properly.',
  'Generate the impact assessment, walk one acceptance criterion to its evidence, post to Confluence live. Flip the UI toggle and pause on the policy card so the missing badge is obvious. Then post the Slack request into #aviva-pmi-demo and hand it to Cursor. When the badge appears, land the line: migration is not the finish line, it is what unlocks the next feature, and intake can be Slack as easily as Jira.',
  'Back to the deck. One endpoint, moved, with proof. Read the three next steps and ask who owns each one. Then stop talking and ask what would block this.',
];

export const meta: SlideMeta = {
  title: 'Aviva PMI Migration',
  createdAt: '2026-07-28T09:33:26.113Z',
};

export default [
  Cover,
  Surfaces,
  WhyCursor,
  AppToday,
  DemoFlow,
  Agenda,
  DemoComprehension,
  DemoMigration,
  DemoReview,
  DemoSecurity,
  DemoCloseTheLoop,
  Close,
] satisfies Page[];
