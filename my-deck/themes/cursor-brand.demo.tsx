import {
  useSlidePageNumber,
  type DesignSystem,
  type Page,
} from '@open-slide/core';

import titleSlideBg from '@assets/title_slide.svg';
import lockupDark from '@assets/LOCKUP_HORIZONTAL_2D_DARK.svg';

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

const font = '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';
const PAD = 110;

const styles = `
  @keyframes brandFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .brandFadeUp { opacity: 0; animation: brandFadeUp 0.7s cubic-bezier(.2,.7,.2,1) forwards; }
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
  color = '#EDECEC',
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

const TitleLockup = () => (
  <img
    src={lockupDark}
    alt="Cursor"
    style={{ position: 'absolute', top: 48, left: PAD, height: 124, width: 'auto', zIndex: 1 }}
  />
);

const Footer = ({
  partnerName = 'Cursor',
  confidential = false,
  dark = false,
}: {
  partnerName?: string;
  confidential?: boolean;
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
        color: dark ? '#969592' : '#9B9A92',
        fontFamily: font,
      }}
    >
      <span style={{ color: dark ? '#EDECEC' : '#26251E' }}>{partnerName}</span>
      <span style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {confidential && <span>Confidential — prepared for {partnerName}</span>}
        <span>
          {current} / {total}
        </span>
      </span>
    </div>
  );
};

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
        background: '#F54E00',
      }}
    />
    <span>{children}</span>
  </li>
);

const StatCard = ({
  number,
  label,
  description,
}: {
  number: string;
  label: string;
  description?: string;
}) => (
  <div
    style={{
      background: '#F7F7F4',
      border: '1px solid #E3E2DD',
      borderRadius: 4,
      padding: '24px 28px',
      minWidth: 380,
    }}
  >
    <div
      style={{
        fontSize: 80,
        fontWeight: 700,
        color: '#F54E00',
        lineHeight: 1,
        marginBottom: 8,
      }}
    >
      {number}
    </div>
    <div
      style={{
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#26251E',
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    {description && (
      <div style={{ fontSize: 26, color: '#868580', lineHeight: 1.4 }}>{description}</div>
    )}
  </div>
);

const Cover: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: '#14120B',
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
    <TitleLockup />
    <div className="brandFadeUp" style={{ position: 'relative', zIndex: 1, marginTop: 80 }}>
      <HeroTitle color="#FFFFFF">Overview of security controls</HeroTitle>
      <p
        style={{
          margin: '24px 0 0',
          fontSize: 48,
          fontWeight: 500,
          color: '#FFFFFF',
          lineHeight: 1.2,
          maxWidth: 1400,
        }}
      >
        ISS / Cursor
      </p>
    </div>
    <Footer partnerName="Cursor" dark />
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
      fontFamily: font,
    }}
  >
    <Styles />
    <Eyebrow>Data flow</Eyebrow>
    <Title>Code stays local until you make a request</Title>
    <div
      style={{
        marginTop: 48,
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        gap: 48,
        alignItems: 'start',
      }}
    >
      <ul style={{ margin: 0, padding: 0 }}>
        <SquareBullet>Privacy Mode on by default for Enterprise</SquareBullet>
        <SquareBullet>Contractual ZDR with every inference provider</SquareBullet>
        <SquareBullet>Nothing retained after the response is returned</SquareBullet>
      </ul>
      <StatCard
        number="2"
        label="Protection layers"
        description="Privacy Mode + Zero Data Retention"
      />
    </div>
    <Footer partnerName="ISS × Cursor" confidential />
  </div>
);

const FeatureCards: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: '#F7F7F4',
      color: '#26251E',
      padding: PAD,
      position: 'relative',
      fontFamily: font,
    }}
  >
    <Styles />
    <Eyebrow>Controls</Eyebrow>
    <Title>Admin panel capabilities</Title>
    <div
      style={{
        marginTop: 40,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 28,
      }}
    >
      {[
        {
          title: 'Identity + SSO',
          tagline: 'Provision and deprovision via IdP',
          body: 'SAML/OIDC — no shadow accounts.',
        },
        {
          title: 'Model access',
          tagline: 'Govern model mix at scale',
          body: 'Restrict models and set per-user spend limits.',
        },
        {
          title: 'Audit logs',
          tagline: 'Full trail, exportable',
          body: 'Admin actions, access events, SIEM-ready.',
        },
      ].map((card) => (
        <div
          key={card.title}
          style={{
            background: '#F7F7F4',
            border: '1px solid #E3E2DD',
            borderRadius: 4,
            padding: '28px 32px',
            minHeight: 320,
          }}
        >
          <div
            style={{
              width: 67,
              height: 8,
              background: '#F54E00',
              marginBottom: 20,
            }}
          />
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>{card.title}</div>
          <div
            style={{
              fontSize: 28,
              fontStyle: 'italic',
              color: '#6B6A62',
              marginBottom: 16,
            }}
          >
            {card.tagline}
          </div>
          <div style={{ fontSize: 28, color: '#5C5B54', lineHeight: 1.45 }}>{card.body}</div>
        </div>
      ))}
    </div>
    <Footer partnerName="ISS × Cursor" />
  </div>
);

const Closer: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: '#14120B',
      color: '#EDECEC',
      padding: PAD,
      position: 'relative',
      fontFamily: font,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Styles />
    <div className="brandFadeUp">
      <HeroTitle>Thank you</HeroTitle>
    </div>
    <Footer partnerName="Cursor" dark />
  </div>
);

export default [Cover, Content, FeatureCards, Closer] satisfies Page[];
