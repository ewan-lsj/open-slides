import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';

import cursorLight from '@assets/cursor_light.svg';
import cursorDark from '@assets/cursor_dark.svg';
import lockupDark from '@assets/LOCKUP_HORIZONTAL_2D_DARK.svg';
import titleSlideBg from '@assets/title_slide.svg';

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
    body: 30,
  },
  radius: 4,
};

const muted = '#9B9A92';
const textBody = '#3E3D36';
const tileBorder = '#E3E2DD';
const tileShadow = '0 2px 4px rgba(20,18,11,0.05), 0 6px 16px rgba(20,18,11,0.07)';
const bgDark = '#14120B';
const textDark = '#EDECEC';
const textDarkMuted = '#969592';
const PAD = 110;

const Styles = () => (
  <style>{`
    @keyframes brandFadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .brandFadeUp { opacity: 0; animation: brandFadeUp 0.6s cubic-bezier(.2,.7,.2,1) both; }
    @media (prefers-reduced-motion: reduce) { .brandFadeUp { animation: none; opacity: 1; } }
  `}</style>
);

const FadeUp = ({
  delay = 0,
  fill = false,
  children,
}: {
  delay?: number;
  fill?: boolean;
  children: React.ReactNode;
}) => (
  <div
    className="brandFadeUp"
    style={{ animationDelay: `${delay}s`, ...(fill ? { height: '100%' } : null) }}
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

const TitleLockup = () => (
  <img
    src={lockupDark}
    alt="Cursor"
    style={{ position: 'absolute', top: 48, left: PAD, height: 124, width: 'auto', zIndex: 1 }}
  />
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: muted,
      marginBottom: 16,
      fontFamily: 'var(--osd-font-body)',
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
    }}
  >
    {children}
  </h1>
);

const HeroTitle = ({
  children,
  color = textDark,
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <h1
    style={{
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
      margin: 0,
      color,
      fontFamily: 'var(--osd-font-display)',
    }}
  >
    {children}
  </h1>
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

const SquareBullet = ({ children }: { children: React.ReactNode }) => (
  <li
    style={{
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start',
      fontSize: 'var(--osd-size-body)',
      lineHeight: 1.45,
      color: 'var(--osd-text)',
      marginBottom: 22,
      listStyle: 'none',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    <span
      style={{
        width: 10,
        height: 10,
        marginTop: 12,
        flexShrink: 0,
        background: 'var(--osd-accent)',
      }}
    />
    <span>{children}</span>
  </li>
);

const Tile = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      background: '#FFFFFF',
      border: `1px solid ${tileBorder}`,
      borderRadius: 'var(--osd-radius)',
      boxShadow: tileShadow,
      padding: '22px 26px',
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ width: 56, height: 6, background: 'var(--osd-accent)', marginBottom: 12 }} />
    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: muted,
        marginBottom: 12,
        fontFamily: 'var(--osd-font-body)',
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const pageRoot: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  padding: PAD,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--osd-font-body)',
};

const Cover: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: bgDark,
      color: '#FFFFFF',
      padding: PAD,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--osd-font-body)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    }}
  >
    <img
      src={titleSlideBg}
      alt=""
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
      }}
    />
    <Styles />
    <TitleLockup />
    <div className="brandFadeUp" style={{ position: 'relative', zIndex: 1, marginTop: 80 }}>
      <HeroTitle color="#FFFFFF">Four-week trial</HeroTitle>
      <p
        style={{
          margin: '24px 0 0',
          fontSize: 48,
          fontWeight: 500,
          lineHeight: 1.2,
          color: '#FFFFFF',
        }}
      >
        From first install to proven value
      </p>
    </div>
  </div>
);

const Principles: Page = () => (
  <div style={pageRoot}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>Why trials succeed</Eyebrow>
      <Title>Access alone does not drive adoption</Title>
    </FadeUp>
    <Body>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxWidth: 1500 }}>
        <FadeUp delay={0.1}>
          <SquareBullet>Run at org scale — small cherry-picked pilots underperform</SquareBullet>
        </FadeUp>
        <FadeUp delay={0.16}>
          <SquareBullet>Secure a top-down mandate with usage tracking from day one</SquareBullet>
        </FadeUp>
        <FadeUp delay={0.22}>
          <SquareBullet>Anchor the trial to a concrete use case with a visible outcome</SquareBullet>
        </FadeUp>
      </ul>
    </Body>
  </div>
);

const FlowWeek = ({
  week,
  label,
  detail,
}: {
  week: string;
  label: string;
  detail: string;
}) => (
  <div
    style={{
      background: '#FFFFFF',
      border: `1px solid ${tileBorder}`,
      borderRadius: 'var(--osd-radius)',
      boxShadow: tileShadow,
      padding: '28px 24px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--osd-accent)',
        fontFamily: 'var(--osd-font-body)',
      }}
    >
      {week}
    </div>
    <div
      style={{
        fontSize: 36,
        fontWeight: 700,
        lineHeight: 1.2,
        color: 'var(--osd-text)',
        fontFamily: 'var(--osd-font-display)',
      }}
    >
      {label}
    </div>
    <p
      style={{
        margin: 0,
        fontSize: 26,
        lineHeight: 1.4,
        color: textBody,
        fontFamily: 'var(--osd-font-body)',
      }}
    >
      {detail}
    </p>
  </div>
);

const Overview: Page = () => (
  <div style={pageRoot}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>The flow</Eyebrow>
      <Title>Four weeks, one clear path</Title>
    </FadeUp>
    <Body>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 12,
          width: '100%',
        }}
      >
        <FadeUp delay={0.1} fill>
          <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
            <FlowWeek week="Week 1" label="Activate" detail="Install, 101, first agent requests" />
          </div>
        </FadeUp>
        <span
          style={{
            width: 40,
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 36,
            color: muted,
            flexShrink: 0,
          }}
        >
          →
        </span>
        <FadeUp delay={0.16} fill>
          <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
            <FlowWeek week="Week 2" label="Build" detail="Real project work with light support" />
          </div>
        </FadeUp>
        <span
          style={{
            width: 40,
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 36,
            color: muted,
            flexShrink: 0,
          }}
        >
          →
        </span>
        <FadeUp delay={0.22} fill>
          <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
            <FlowWeek week="Week 3" label="Deepen" detail="201/301, rules, governance" />
          </div>
        </FadeUp>
        <span
          style={{
            width: 40,
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 36,
            color: muted,
            flexShrink: 0,
          }}
        >
          →
        </span>
        <FadeUp delay={0.28} fill>
          <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
            <FlowWeek week="Week 4" label="Prove" detail="Concrete outcome and rollout case" />
          </div>
        </FadeUp>
      </div>
    </Body>
  </div>
);

const Setup: Page = () => (
  <div style={pageRoot}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>Before kickoff</Eyebrow>
      <Title>Set the trial up to scale</Title>
    </FadeUp>
    <Body>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridAutoRows: '1fr',
          gap: 20,
        }}
      >
        <FadeUp delay={0.1} fill>
          <Tile title="Scope">
            <p style={{ margin: 0, fontSize: 28, lineHeight: 1.4, color: textBody }}>
              Invite the full engineering org — not a 50-person sample.
            </p>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.16} fill>
          <Tile title="Mandate">
            <p style={{ margin: 0, fontSize: 28, lineHeight: 1.4, color: textBody }}>
              Executive directive plus usage tracking from the admin console.
            </p>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.22} fill>
          <Tile title="Champions">
            <p style={{ margin: 0, fontSize: 28, lineHeight: 1.4, color: textBody }}>
              Name ambassadors and one concrete use case before week 1.
            </p>
          </Tile>
        </FadeUp>
      </div>
    </Body>
  </div>
);

const Week1: Page = () => (
  <div style={pageRoot}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>Week 1</Eyebrow>
      <Title>Activate — install and first wins</Title>
    </FadeUp>
    <Body>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxWidth: 1500 }}>
        <FadeUp delay={0.1}>
          <SquareBullet>101 onboarding — get everyone installed and making a request</SquareBullet>
        </FadeUp>
        <FadeUp delay={0.16}>
          <SquareBullet>Admin walkthrough — usage, model access, conversation insights</SquareBullet>
        </FadeUp>
        <FadeUp delay={0.22}>
          <SquareBullet>Chase non-installers early — signups and agent requests diverge fast</SquareBullet>
        </FadeUp>
      </ul>
    </Body>
  </div>
);

const Week2: Page = () => (
  <div style={pageRoot}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>Week 2</Eyebrow>
      <Title>Build — real work, light support</Title>
    </FadeUp>
    <Body>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxWidth: 1500 }}>
        <FadeUp delay={0.1}>
          <SquareBullet>Move from foundations to a live project or migration use case</SquareBullet>
        </FadeUp>
        <FadeUp delay={0.16}>
          <SquareBullet>Daily check-ins with lead users to unblock and keep momentum</SquareBullet>
        </FadeUp>
        <FadeUp delay={0.22}>
          <SquareBullet>Mid-trial survey — surface blockers and watch model mix health</SquareBullet>
        </FadeUp>
      </ul>
    </Body>
  </div>
);

const Week3: Page = () => (
  <div style={pageRoot}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>Week 3</Eyebrow>
      <Title>Deepen — craft, rules, governance</Title>
    </FadeUp>
    <Body>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxWidth: 1500 }}>
        <FadeUp delay={0.1}>
          <SquareBullet>201 / 301 workshop — hands-on, not a repeat of 101</SquareBullet>
        </FadeUp>
        <FadeUp delay={0.16}>
          <SquareBullet>Rules, multi-repo workflows, and team conventions as guardrails</SquareBullet>
        </FadeUp>
        <FadeUp delay={0.22}>
          <SquareBullet>Share usage data with the champion to reinforce what is working</SquareBullet>
        </FadeUp>
      </ul>
    </Body>
  </div>
);

const Week4: Page = () => (
  <div style={pageRoot}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>Week 4</Eyebrow>
      <Title>Prove — outcome and rollout case</Title>
    </FadeUp>
    <Body>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxWidth: 1500 }}>
        <FadeUp delay={0.1}>
          <SquareBullet>Show a concrete result tied to the original use case</SquareBullet>
        </FadeUp>
        <FadeUp delay={0.16}>
          <SquareBullet>Frame it as weeks with Cursor versus months without</SquareBullet>
        </FadeUp>
        <FadeUp delay={0.22}>
          <SquareBullet>Convert momentum into a C-level directive for full rollout</SquareBullet>
        </FadeUp>
      </ul>
    </Body>
  </div>
);

const Measure: Page = () => (
  <div style={pageRoot}>
    <Styles />
    <CursorLogo />
    <FadeUp>
      <Eyebrow>Success signals</Eyebrow>
      <Title>What we watch across the trial</Title>
    </FadeUp>
    <Body>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridAutoRows: '1fr',
          gap: 20,
        }}
      >
        <FadeUp delay={0.1} fill>
          <Tile title="Activation">
            <p style={{ margin: 0, fontSize: 28, lineHeight: 1.4, color: textBody }}>
              Install rate and first agent request within week 1.
            </p>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.16} fill>
          <Tile title="Engagement">
            <p style={{ margin: 0, fontSize: 28, lineHeight: 1.4, color: textBody }}>
              Weekly and daily active users — not seats provisioned.
            </p>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.22} fill>
          <Tile title="Health">
            <p style={{ margin: 0, fontSize: 28, lineHeight: 1.4, color: textBody }}>
              Balanced model mix and feature breadth across the cohort.
            </p>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.28} fill>
          <Tile title="Outcome">
            <p style={{ margin: 0, fontSize: 28, lineHeight: 1.4, color: textBody }}>
              One finished use case the org can point to as proof.
            </p>
          </Tile>
        </FadeUp>
      </div>
    </Body>
  </div>
);

const Close: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: bgDark,
      color: textDark,
      padding: PAD,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    <Styles />
    <CursorLogo onDark />
    <FadeUp>
      <HeroTitle>Ready when you are</HeroTitle>
      <p
        style={{
          margin: '28px 0 0',
          fontSize: 36,
          fontWeight: 500,
          lineHeight: 1.35,
          color: textDarkMuted,
          maxWidth: 1200,
        }}
      >
        Four weeks. Full org. One outcome that makes the rollout obvious.
      </p>
    </FadeUp>
  </div>
);

export const meta: SlideMeta = {
  title: 'Four-week trial',
  theme: 'cursor-brand',
  createdAt: '2026-07-16T10:35:34.590Z',
};

export default [
  Cover,
  Principles,
  Overview,
  Setup,
  Week1,
  Week2,
  Week3,
  Week4,
  Measure,
  Close,
] satisfies Page[];
