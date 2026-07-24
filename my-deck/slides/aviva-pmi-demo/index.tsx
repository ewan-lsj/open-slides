import type { ReactNode } from 'react';
import type {
  DesignSystem,
  Page,
  SlideMeta,
  SlideTransition,
} from '@open-slide/core';
import cursorLight from '@assets/cursor_light.svg';
import cursorDark from '@assets/cursor_dark.svg';

export const design: DesignSystem = {
  palette: { bg: '#F7F6F2', text: '#1A1A1A', accent: '#ED7D31' },
  fonts: {
    display: 'Arial, Helvetica, "Helvetica Neue", sans-serif',
    body: 'Arial, Helvetica, "Helvetica Neue", sans-serif',
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
  darkInk: '#EFEDE8',
  darkMuted: '#A2A5AB',
  darkRule: 'rgba(239,237,232,0.32)',
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
  padding: '104px 120px',
  display: 'flex',
  flexDirection: 'column',
} as const;

const CursorMark = () => (
  <img
    src={cursorLight}
    alt="Cursor"
    style={{ position: 'absolute', top: 52, right: 56, height: 42, width: 'auto' }}
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
      fontSize: 76,
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-display)',
      maxWidth: 1560,
    }}
  >
    {children}
  </h1>
);

const Lede = ({ children }: { children: ReactNode }) => (
  <p
    style={{
      margin: '28px 0 0',
      fontSize: 'var(--osd-size-body)',
      lineHeight: 1.5,
      color: colors.secondary,
      maxWidth: 1320,
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

const WhyCard = ({ label, detail }: { label: string; detail: string }) => (
  <div style={{ ...tile, padding: '30px 26px 32px', display: 'flex', flexDirection: 'column' }}>
    <span style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
      {label}
    </span>
    <span style={{ marginTop: 16, fontSize: 22, lineHeight: 1.45, color: colors.body }}>
      {detail}
    </span>
  </div>
);

const StackCard = ({ label, detail }: { label: string; detail: string }) => (
  <div style={{ ...tile, padding: '26px 30px 30px', display: 'flex', flexDirection: 'column' }}>
    <span style={cardLabel}>{label}</span>
    <span style={{ marginTop: 14, fontSize: 30, lineHeight: 1.35, color: colors.body }}>
      {detail}
    </span>
  </div>
);

const NumberRow = ({
  numeral,
  heading,
  detail,
}: {
  numeral: string;
  heading: string;
  detail: string;
}) => (
  <div
    style={{
      ...tile,
      padding: '24px 34px 26px',
      display: 'flex',
      alignItems: 'baseline',
      gap: 34,
    }}
  >
    <span
      style={{
        fontSize: 50,
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        color: 'var(--osd-accent)',
        fontFamily: 'var(--osd-font-display)',
        minWidth: 84,
      }}
    >
      {numeral}
    </span>
    <span style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
        {heading}
      </span>
      <span style={{ marginTop: 10, fontSize: 26, lineHeight: 1.4, color: colors.body }}>
        {detail}
      </span>
    </span>
  </div>
);

const StepRow = ({ numeral, detail }: { numeral: string; detail: string }) => (
  <div
    style={{
      ...tile,
      padding: '22px 32px 24px',
      display: 'flex',
      alignItems: 'baseline',
      gap: 30,
    }}
  >
    <span
      style={{
        fontSize: 38,
        fontWeight: 700,
        lineHeight: 1.2,
        color: 'var(--osd-accent)',
        fontFamily: 'var(--osd-font-display)',
        minWidth: 68,
      }}
    >
      {numeral}
    </span>
    <span style={{ fontSize: 30, lineHeight: 1.4, color: colors.body }}>{detail}</span>
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
  <div style={{ ...root, background: '#101318', color: colors.darkInk }}>
    {/* Decorative dawn-hillside wash. Gradients raster on export; text stays native. */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(1400px 700px at 16% 92%, rgba(237,125,49,0.34) 0%, rgba(237,125,49,0) 68%), radial-gradient(900px 520px at 82% 8%, rgba(126,150,180,0.20) 0%, rgba(126,150,180,0) 70%), linear-gradient(176deg, #171B22 0%, #1E232B 46%, #0B0D11 100%)',
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

const WhyCursor: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Why Cursor</Eyebrow>
    <Title>Five things that matter on a codebase this old.</Title>
    <Lede>The model is the easy part. What sits around it decides whether any of this survives review.</Lede>
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
        label="Model neutral"
        detail="Every frontier lab in one place. Pick per task, switch when something better lands."
      />
      <WhyCard
        label="Cursor harness"
        detail="Retrieval, edits, terminal and tests in one loop, built for large old repos."
      />
      <WhyCard
        label="Composer models"
        detail="Our own fast models for the repetitive work, like bulk refactors and test scaffolding."
      />
      <WhyCard
        label="Multi-agentic UX"
        detail="Several agents at once. You keep the diffs that survive review."
      />
      <WhyCard
        label="Software factory"
        detail="Rules and Skills live in the repo, so every team inherits the same standard."
      />
    </div>
  </div>
);

const AppToday: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>The app today</Eyebrow>
    <Title>What is in production right now.</Title>
    <Lede>Nothing unusual for its age. Worth being precise about it before we touch anything.</Lede>
    <div
      style={{
        marginTop: 'auto',
        paddingTop: 56,
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
    <div style={{ ...tile, marginTop: 24, padding: '26px 30px 30px' }}>
      <span style={cardLabel}>Domain logic</span>
      <span style={{ display: 'block', marginTop: 14, fontSize: 30, lineHeight: 1.35, color: colors.body }}>
        NCD (No Claims Discount) banding sits inside PolicyManager, a God class that has absorbed a
        decade of changes. Protected NCD and the maximum cap are in there too, with no tests around
        them.
      </span>
    </div>
  </div>
);

const Agenda: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Agenda</Eyebrow>
    <Title>What we'll show today.</Title>
    <Lede>Four demos, all live against the real repo. Questions as we go.</Lede>
    <div style={{ marginTop: 'auto', paddingTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <NumberRow
        numeral="01"
        heading="Legacy comprehension"
        detail="Cursor reads the WCF service and the EF6 model, then explains how NCD is worked out."
      />
      <NumberRow
        numeral="02"
        heading="Live migration, Jira to PR"
        detail="Ticket AAD-1, from the board to a pull request, in this room."
      />
      <NumberRow
        numeral="03"
        heading="Agentic code review"
        detail="Local Skills review the diff against rules that are written down in the repo."
      />
      <NumberRow
        numeral="04"
        heading="Security and impact"
        detail="Scanners on the changed code, then an impact assessment posted to Confluence."
      />
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
      Cursor picks the ticket up from Jira, writes characterization tests against today's behaviour,
      then rebuilds the endpoint as a .NET 8 Minimal API on EF Core. The tests have to give the same
      answers before and after, or the pull request does not go up.
    </Lede>
    <div style={{ marginTop: 'auto', paddingTop: 64 }}>
      <ChipCaption>On screen</ChipCaption>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'nowrap' }}>
        <Chip label="AAD-1" />
        <Chip label="Characterization tests" />
        <Chip label="Minimal API" />
        <Chip label="EF Core" />
      </div>
    </div>
  </div>
);

const DemoReview: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Demo 03 / Agentic code review</Eyebrow>
    <Title>Review that knows Aviva's rules, not just C#.</Title>
    <Lede>
      The first pass at the migration quietly drops protected NCD and the maximum cap. The compiler
      does not care. The review Skill does, because that rule lives in the repo and gets applied to
      every diff.
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

const DemoImpact: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Demo 05 / Impact assessment</Eyebrow>
    <Title>The write-up Risk and audit will ask for.</Title>
    <Lede>
      Cursor drafts the impact assessment, checks it against the{' '}
      <span style={{ whiteSpace: 'nowrap' }}>AAD-1</span> acceptance criteria, then posts it to
      Confluence with links back to the pull request and the test run. The audit trail falls out of
      the work rather than being written up afterwards.
    </Lede>
    <div style={{ marginTop: 'auto', paddingTop: 64 }}>
      <ChipCaption>On screen</ChipCaption>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'nowrap' }}>
        <Chip label="AAD-1 acceptance criteria" />
        <Chip label="Confluence page" />
        <Chip label="PR and test links" />
      </div>
    </div>
  </div>
);

const Close: Page = () => (
  <div style={contentPage}>
    <CursorMark />
    <Eyebrow>Where this goes</Eyebrow>
    <Title>One endpoint moved, with proof it still behaves.</Title>
    <Lede>The rest of the migration is that same loop, repeated. What we would like to agree today:</Lede>
    <div style={{ marginTop: 'auto', paddingTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
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
  "Set the room: this is a working migration, not slideware. Aviva PMI runs on .NET Framework 4.8 today and we will have an endpoint on .NET 8 before we finish. Say the ticket id AAD-1 once so it lands. Then move on, the demos are the deck.",
  'One minute here, no more. Land the point that the model is the easy part and the harness is what makes it work on a codebase this old. If the room asks about model lock-in, answer on card one and keep moving.',
  'Read the stack out flat, no editorial. Pause on PolicyManager and say plainly that the NCD rules are buried in it with no tests. That is the setup for demo three. Resist pitching here.',
  'Four demos, all live against the real repo, questions as we go. Then switch to Cursor with the Aviva PMI repo open.',
  'Say what you are about to ask, then switch to Cursor. Ask how NCD is calculated and where it is enforced. Read one line of the answer out loud, then jump to the EF6 mapping it cites so the room sees it is grounded in the code, not guessed.',
  'This is the main event, give it the time. Switch to Jira, open AAD-1, hand it to Cursor. Let it write the characterization tests first and say out loud why that order matters. Then let it build the Minimal API and EF Core version, run the tests, open the PR. If something fails live, keep going, that is what the tests are for.',
  "Show the diff first, then run the review Skill. When it flags the dropped protected NCD and the cap, open the Skill file and show the rule. Say that this is where a team standard lives instead of inside one person's head.",
  'Run the security review on the pull request. When the SQL injection in the NcdBand lookup surfaces, say clearly that it predates the migration and we only found it because the code finally got read properly. One sentence on the Semgrep OSS fallback if SonarQube licensing comes up.',
  "Generate the impact assessment, then put AAD-1's acceptance criteria beside it and walk one criterion to its evidence. Post to Confluence live and open the page so they see the link back to the PR.",
  'Back to the deck. One endpoint, moved, with proof. Read the three next steps and ask who owns each one. Then stop talking and ask what would block this.',
];

export const meta: SlideMeta = {
  title: 'Aviva PMI Migration',
  createdAt: '2026-07-24T18:54:27.656Z',
};

export default [
  Cover,
  WhyCursor,
  AppToday,
  Agenda,
  DemoComprehension,
  DemoMigration,
  DemoReview,
  DemoSecurity,
  DemoImpact,
  Close,
] satisfies Page[];
