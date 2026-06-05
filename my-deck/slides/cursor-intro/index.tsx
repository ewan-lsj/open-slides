import { useSlidePageNumber, type DesignSystem, type Page, type SlideMeta } from '@open-slide/core';

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
  cardBorder: '#E3E2DD',
  cardShadow: '0 2px 4px rgba(20, 18, 11, 0.05), 0 6px 16px rgba(20, 18, 11, 0.07)',
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

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: palette.muted,
      marginBottom: 16,
      fontFamily: font,
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
      color: palette.text,
      fontFamily: font,
    }}
  >
    {children}
  </h1>
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
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
      margin: 0,
      color,
      fontFamily: font,
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
    style={{ position: 'absolute', top: 48, left: PAD, height: 124, width: 'auto', zIndex: 1 }}
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
  partnerName = 'Cursor',
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
        left: PAD,
        right: PAD,
        bottom: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontSize: 22,
        color: dark ? palette.textDarkMuted : palette.muted,
        fontFamily: font,
      }}
    >
      <span style={{ color: dark ? palette.textDark : palette.text }}>{partnerName}</span>
      <span>
        {current} / {total}
      </span>
    </div>
  );
};

const Tile = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    style={{
      background: '#FFFFFF',
      border: `1px solid ${palette.cardBorder}`,
      borderRadius: 4,
      boxShadow: palette.cardShadow,
      padding: '28px 32px',
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ width: 56, height: 6, background: palette.accent, marginBottom: 16 }} />
    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: palette.muted,
        marginBottom: 14,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

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
    <TitleLockup />
    <div className="brandFadeUp" style={{ position: 'relative', zIndex: 1, marginTop: 80 }}>
      <HeroTitle color="#FFFFFF">Getting started with Cursor</HeroTitle>
      <p style={{ margin: '24px 0 0', fontSize: 48, fontWeight: 500, lineHeight: 1.2, color: '#FFFFFF' }}>
        For the engineering team
      </p>
    </div>
    <Footer partnerName="Cursor" dark />
  </div>
);

const Statement: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: palette.bg,
      color: palette.text,
      padding: PAD,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: font,
    }}
  >
    <CursorLogo />
    <Styles />
    <FadeUp>
      <Eyebrow>What it is</Eyebrow>
    </FadeUp>
    <Body>
      <FadeUp delay={0.08}>
        <h1
          style={{
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            margin: 0,
            maxWidth: 1480,
            color: palette.text,
          }}
        >
          The AI code editor, built to{' '}
          <span style={{ color: palette.accent }}>work alongside you</span>.
        </h1>
      </FadeUp>
    </Body>
    <Footer partnerName="Cursor" />
  </div>
);

const Ways: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: palette.bg,
      color: palette.text,
      padding: PAD,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: font,
    }}
  >
    <CursorLogo />
    <Styles />
    <FadeUp>
      <Eyebrow>How you'll use it</Eyebrow>
      <Title>Three ways to work</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridAutoRows: '1fr', gap: 20 }}>
        <FadeUp delay={0.1} fill>
          <Tile title="Tab">
            <p style={{ margin: 0, fontSize: 30, lineHeight: 1.4, color: palette.textBody }}>
              Predicts your next edit and completes it in a keystroke.
            </p>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.18} fill>
          <Tile title="Chat">
            <p style={{ margin: 0, fontSize: 30, lineHeight: 1.4, color: palette.textBody }}>
              Ask about the codebase with full project context.
            </p>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.26} fill>
          <Tile title="Agent">
            <p style={{ margin: 0, fontSize: 30, lineHeight: 1.4, color: palette.textBody }}>
              Hands a task to the model to plan and edit across files.
            </p>
          </Tile>
        </FadeUp>
      </div>
    </Body>
    <Footer partnerName="Cursor" />
  </div>
);

const Stat: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: palette.bg,
      color: palette.text,
      padding: PAD,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: font,
    }}
  >
    <CursorLogo />
    <Styles />
    <FadeUp>
      <Eyebrow>Why it matters</Eyebrow>
    </FadeUp>
    <Body>
      <FadeUp delay={0.1}>
        <div style={{ fontSize: 240, fontWeight: 700, lineHeight: 1, color: palette.accent, letterSpacing: '-0.04em' }}>
          1<span style={{ fontSize: 140 }}> day</span>
        </div>
      </FadeUp>
      <FadeUp delay={0.2}>
        <p style={{ margin: '24px 0 0', fontSize: 40, lineHeight: 1.35, color: palette.textSecondary, maxWidth: 1200 }}>
          From clone to first merged change — the goal for every new hire's first day.
        </p>
      </FadeUp>
    </Body>
    <Footer partnerName="Cursor" />
  </div>
);

const Closer: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: palette.bgDark,
      color: palette.textDark,
      padding: PAD,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: font,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <CursorLogo onDark />
    <Styles />
    <FadeUp>
      <HeroTitle>Let's build.</HeroTitle>
    </FadeUp>
    <FadeUp delay={0.12}>
      <p style={{ margin: '24px 0 0', fontSize: 40, fontWeight: 500, lineHeight: 1.3, color: palette.textDarkMuted }}>
        Open the repo, start a chat, ship something today.
      </p>
    </FadeUp>
    <Footer partnerName="Cursor" dark />
  </div>
);

export const meta: SlideMeta = {
  title: 'Getting started with Cursor',
  theme: 'cursor-brand',
  createdAt: '2026-06-05T17:07:14Z',
};

export default [Cover, Statement, Ways, Stat, Closer] satisfies Page[];
