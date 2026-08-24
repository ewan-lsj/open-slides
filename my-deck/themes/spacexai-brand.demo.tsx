import { type DesignSystem, type Page } from '@open-slide/core';

import titleSlideBg from '@assets/spacexai_background.png';
import wordmarkWhite from '@assets/spacexai - wordmark - white - transparent.png';
import symbolWhite from '@assets/spacexai - symbol - white - transparent.svg';
import symbolBlack from '@assets/spacexai - symbol - black - transparent.png';

export const design: DesignSystem = {
  palette: {
    bg: '#F7F7F4',
    text: '#26251E',
    accent: '#3D4454',
  },
  fonts: {
    display: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    body: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
  },
  typeScale: {
    hero: 103,
    body: 34,
  },
  radius: 4,
};

const font = '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';
const PAD = 110;

const styles = `
  @keyframes brandFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .brandFadeUp { opacity: 0; animation: brandFadeUp 0.7s cubic-bezier(.2,.7,.2,1) forwards; }
  @media (prefers-reduced-motion: reduce) {
    .brandFadeUp { animation: none; opacity: 1; }
  }
`;

const Styles = () => <style>{styles}</style>;

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#9B9A92',
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
      color: '#26251E',
      fontFamily: font,
    }}
  >
    {children}
  </h1>
);

const HeroTitle = ({
  children,
  color = '#FFFFFF',
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <h1
    style={{
      fontSize: 103,
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: '-0.03em',
      margin: 0,
      color,
      fontFamily: font,
    }}
  >
    {children}
  </h1>
);

const CoverWordmark = () => (
  <img
    src={wordmarkWhite}
    alt="SpaceXAI"
    style={{ position: 'absolute', bottom: 64, right: 48, height: 48, width: 'auto', zIndex: 1 }}
  />
);

const SpaceXAILogo = ({ onDark = false }: { onDark?: boolean }) => (
  <img
    src={onDark ? symbolWhite : symbolBlack}
    alt="SpaceXAI"
    style={{ position: 'absolute', top: 48, right: 48, height: 40, width: 'auto' }}
  />
);

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

const Body = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingBottom: 24,
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
      fontSize: 34,
      lineHeight: 1.45,
      color: '#26251E',
      marginBottom: 20,
      listStyle: 'none',
    }}
  >
    <span
      style={{
        width: 10,
        height: 10,
        marginTop: 14,
        flexShrink: 0,
        background: '#3D4454',
      }}
    />
    <span>{children}</span>
  </li>
);

const Tile = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    style={{
      background: '#FFFFFF',
      border: '1px solid #E3E2DD',
      borderRadius: 4,
      boxShadow: '0 2px 4px rgba(20,18,11,0.05), 0 6px 16px rgba(20,18,11,0.07)',
      padding: '18px 22px',
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ width: 56, height: 6, background: '#3D4454', marginBottom: 10 }} />
    <div
      style={{
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#9B9A92',
        marginBottom: 10,
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
      background: '#020202',
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
    <div className="brandFadeUp" style={{ position: 'relative', zIndex: 1 }}>
      <HeroTitle>Product Roadmap</HeroTitle>
      <p
        style={{
          margin: '41px 0 0',
          fontSize: 139,
          fontWeight: 400,
          color: '#999999',
          lineHeight: 1.05,
          maxWidth: 1400,
        }}
      >
        Q3 2026
      </p>
    </div>
    <CoverWordmark />
  </div>
);

const Content: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: '#F7F7F4',
      color: '#26251E',
      padding: PAD,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: font,
    }}
  >
    <Styles />
    <SpaceXAILogo />
    <FadeUp>
      <Eyebrow>Data flow</Eyebrow>
      <Title>Code stays local until you make a request</Title>
    </FadeUp>
    <Body>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 16 }}>
        <FadeUp delay={0.1} fill>
          <Tile title="Indexing">
            <p style={{ margin: 0, fontSize: 26, lineHeight: 1.4, color: '#3E3D36' }}>
              One-way embeddings · raw code never stored
            </p>
          </Tile>
        </FadeUp>
        <FadeUp delay={0.18} fill>
          <Tile title="LLM requests">
            <p style={{ margin: 0, fontSize: 26, lineHeight: 1.4, color: '#3E3D36' }}>
              Privacy Mode + contractual ZDR with every provider
            </p>
          </Tile>
        </FadeUp>
      </div>
      <ul style={{ margin: '28px 0 0', padding: 0 }}>
        <SquareBullet>Privacy Mode on by default for Enterprise</SquareBullet>
        <SquareBullet>Nothing retained after the response is returned</SquareBullet>
      </ul>
    </Body>
  </div>
);

const Closer: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: '#020202',
      color: '#FFFFFF',
      padding: PAD,
      position: 'relative',
      fontFamily: font,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Styles />
    <SpaceXAILogo onDark />
    <div className="brandFadeUp">
      <HeroTitle>Thank you</HeroTitle>
    </div>
  </div>
);

export default [Cover, Content, Closer] satisfies Page[];
