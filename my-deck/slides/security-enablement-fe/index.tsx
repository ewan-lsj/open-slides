import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import titleSlideBg from '@assets/title_slide.svg';
import lockupDark from '@assets/LOCKUP_HORIZONTAL_2D_DARK.svg';
import cursorLight from '@assets/cursor_light.svg';
import cursorDark from '@assets/cursor_dark.svg';

export const design: DesignSystem = {
  palette: { bg: '#F7F7F4', text: '#26251E', accent: '#F54E00' },
  fonts: {
    display: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    body: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
  },
  typeScale: { hero: 64, body: 26 },
  radius: 4,
};

const muted = '#9B9A92';
const secondary = '#5C5B54';
const body = '#3E3D36';
const border = '#E3E2DD';
const soft = '#F0EFEB';
const pale = '#FFF0E9';
const dark = '#14120B';
const darkText = '#EDECEC';
const darkMuted = '#969592';
const green = '#2F7D5B';
const amber = '#B56A00';
const font = '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif';

const pageRoot: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  padding: 110,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--osd-font-body)',
  boxSizing: 'border-box',
};

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

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: muted,
      marginBottom: 12,
      fontFamily: font,
    }}
  >
    {children}
  </div>
);

const Title = ({ children, maxWidth = 1500 }: { children: React.ReactNode; maxWidth?: number }) => (
  <h1
    style={{
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 700,
      lineHeight: 1.12,
      letterSpacing: '-0.02em',
      margin: 0,
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-display)',
      maxWidth,
    }}
  >
    {children}
  </h1>
);

const HeroTitle = ({
  children,
  color = darkText,
  size = 96,
}: {
  children: React.ReactNode;
  color?: string;
  size?: number;
}) => (
  <h1
    style={{
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: '-0.03em',
      margin: 0,
      color,
      fontFamily: font,
    }}
  >
    {children}
  </h1>
);

const BodyArea = ({ children }: { children: React.ReactNode }) => (
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

const Node = ({
  label,
  detail,
  width,
  accent = 'var(--osd-accent)',
  darkMode = false,
  style,
}: {
  label: string;
  detail?: string;
  width?: number | string;
  accent?: string;
  darkMode?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: darkMode ? '#2A2823' : '#FFFFFF',
      border: `2px solid ${darkMode ? '#4A4840' : border}`,
      borderTop: `6px solid ${accent}`,
      borderRadius: 'var(--osd-radius)',
      padding: detail ? '18px 20px' : '16px 20px',
      boxSizing: 'border-box',
      width,
      ...style,
    }}
  >
    <div
      style={{
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1.2,
        color: darkMode ? darkText : 'var(--osd-text)',
        fontFamily: font,
      }}
    >
      {label}
    </div>
    {detail ? (
      <div
        style={{
          marginTop: 8,
          fontSize: 20,
          lineHeight: 1.3,
          color: darkMode ? darkMuted : secondary,
          fontFamily: font,
        }}
      >
        {detail}
      </div>
    ) : null}
  </div>
);

const Arrow = ({ size = 34 }: { size?: number }) => (
  <span
    style={{
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: size,
      color: muted,
      flexShrink: 0,
      fontFamily: font,
      lineHeight: 1,
      padding: '0 8px',
    }}
  >
    →
  </span>
);

const DownArrow = () => (
  <div style={{ textAlign: 'center', fontSize: 28, color: muted, lineHeight: 1, padding: '6px 0' }}>↓</div>
);

const Callout = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      marginTop: 22,
      padding: '18px 24px',
      background: pale,
      border: `2px solid #F5C4A8`,
      borderRadius: 'var(--osd-radius)',
      fontSize: 24,
      lineHeight: 1.35,
      color: body,
      fontFamily: font,
    }}
  >
    {children}
  </div>
);

const Zone = ({
  title,
  badge,
  children,
  style,
  darkMode = false,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  darkMode?: boolean;
}) => (
  <div
    style={{
      background: darkMode ? '#1C1A14' : '#FFFFFF',
      border: `2px solid ${darkMode ? '#3A3832' : border}`,
      borderRadius: 12,
      padding: '18px 20px',
      boxSizing: 'border-box',
      position: 'relative',
      ...style,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: darkMode ? darkMuted : muted,
        }}
      >
        {title}
      </div>
      {badge ? (
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: darkMode ? '#E8A07A' : 'var(--osd-accent)',
            background: darkMode ? '#2A2218' : pale,
            border: `1px solid ${darkMode ? '#5C4030' : '#F5C4A8'}`,
            borderRadius: 999,
            padding: '4px 12px',
          }}
        >
          {badge}
        </div>
      ) : null}
    </div>
    {children}
  </div>
);

const InnerBox = ({
  title,
  detail,
  accent,
}: {
  title: string;
  detail?: string;
  accent?: string;
}) => (
  <div
    style={{
      background: soft,
      border: `2px solid ${border}`,
      borderLeft: accent ? `5px solid ${accent}` : `2px solid ${border}`,
      borderRadius: 8,
      padding: '14px 16px',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--osd-text)', lineHeight: 1.2 }}>{title}</div>
    {detail ? (
      <div style={{ marginTop: 6, fontSize: 18, lineHeight: 1.3, color: secondary }}>{detail}</div>
    ) : null}
  </div>
);

const StepPill = ({ n, label }: { n: number | string; label: string }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      background: '#FFFFFF',
      border: `2px solid ${border}`,
      borderRadius: 999,
      padding: '6px 14px 6px 8px',
    }}
  >
    <span
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: 'var(--osd-accent)',
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </span>
    <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--osd-text)' }}>{label}</span>
  </div>
);

const LinkLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: '0.04em',
      color: muted,
      textAlign: 'center',
      lineHeight: 1.25,
      whiteSpace: 'pre-line',
    }}
  >
    {children}
  </div>
);

/* ─── 1. Cover ─── */
const Cover: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: dark,
      color: '#FFFFFF',
      padding: 110,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: font,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
    }}
  >
    <img
      src={titleSlideBg}
      alt=""
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
    />
    <TitleLockup />
    <div style={{ position: 'relative', zIndex: 1, marginTop: 80 }}>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.65)',
          marginBottom: 20,
        }}
      >
        Field engineer enablement
      </div>
      <HeroTitle color="#FFFFFF" size={88}>
        Cursor security architecture
      </HeroTitle>
      <p style={{ margin: '28px 0 0', fontSize: 36, fontWeight: 500, lineHeight: 1.3, color: '#FFFFFF', maxWidth: 1100 }}>
        Data flow diagrams, Cloud Agents topology, and EU sovereignty — Hugo-style.
      </p>
    </div>
  </div>
);

/* ─── 2. Agenda as numbered journey ─── */
const Agenda: Page = () => (
  <div style={pageRoot}>
    <CursorLogo />
    <Eyebrow>Session map</Eyebrow>
    <Title>Four chapters. Diagrams first.</Title>
    <BodyArea>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Node label="01 · Architecture" detail="Local path, three egress routes, indexing loop" width="100%" />
        </div>
        <Arrow />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Node label="02 · Cloud Agents" detail="MicroVM topology + hosted vs self-hosted" width="100%" accent={green} />
        </div>
        <Arrow />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Node label="03 · Controls" detail="Deterministic gates vs team steering" width="100%" accent={amber} />
        </div>
        <Arrow />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Node label="04 · Sovereignty" detail="US residency stack vs EU inference-only" width="100%" />
        </div>
      </div>
      <p style={{ margin: '36px 0 0', fontSize: 28, lineHeight: 1.4, color: secondary, maxWidth: 1400 }}>
        Goal: leave able to whiteboard the architecture and correct imprecise claims on a security call.
      </p>
    </BodyArea>
  </div>
);

/* ─── 3. Section: Architecture ─── */
const ArchDivider: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: dark,
      color: darkText,
      padding: 110,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      fontFamily: font,
      boxSizing: 'border-box',
    }}
  >
    <CursorLogo onDark />
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--osd-accent)', marginBottom: 24 }}>
      CHAPTER 01
    </div>
    <HeroTitle size={110}>Architecture</HeroTitle>
    <p style={{ margin: '28px 0 0', fontSize: 36, color: darkMuted, maxWidth: 1000, lineHeight: 1.35 }}>
      How requests move. What leaves the building. What is actually stored.
    </p>
  </div>
);

/* ─── 4. Full local architecture topology ─── */
const LocalTopology: Page = () => (
  <div style={{ ...pageRoot, padding: '72px 80px 56px' }}>
    <CursorLogo />
    <Eyebrow>Hugo architecture · Local / desktop</Eyebrow>
    <Title>Desktop → Cursor AWS → providers</Title>
    <BodyArea>
      <div style={{ position: 'relative', height: 600, width: '100%' }}>
        <svg
          width="1760"
          height="600"
          viewBox="0 0 1760 600"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <defs>
            <marker id="localArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={muted} />
            </marker>
          </defs>
          <line x1="384" y1="200" x2="482" y2="200" stroke={muted} strokeWidth="2.5" markerEnd="url(#localArrow)" />
          <line x1="1054" y1="200" x2="1162" y2="200" stroke={muted} strokeWidth="2.5" markerEnd="url(#localArrow)" />
        </svg>

        <div style={{ position: 'absolute', left: 0, top: 30, width: 380 }}>
          <Zone title="Customer network" badge="Device">
            <InnerBox title="Cursor desktop / CLI" detail="Codebase stays on disk until a request" accent="var(--osd-accent)" />
            <div style={{ height: 10 }} />
            <InnerBox title="Corporate proxy / firewall" detail="Allowlist Cursor backend domains" />
            <div style={{ height: 10 }} />
            <InnerBox title="Never connects directly" detail="No laptop → Anthropic/OpenAI hop" accent={muted} />
          </Zone>
        </div>

        <div style={{ position: 'absolute', left: 388, top: 148, width: 90 }}>
          <LinkLabel>{'TLS 1.2+\nencrypted'}</LinkLabel>
        </div>

        <div style={{ position: 'absolute', left: 490, top: 30, width: 560 }}>
          <Zone title="Cursor backend" badge="AWS · us-east-1" darkMode>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div
                style={{
                  background: '#2A2823',
                  border: '2px solid #4A4840',
                  borderRadius: 8,
                  padding: '14px 16px',
                  color: darkText,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700 }}>Orchestration</div>
                <div style={{ fontSize: 16, color: darkMuted, marginTop: 4 }}>Prompt harness · policy · routing</div>
              </div>
              <div
                style={{
                  background: '#2A2823',
                  border: '2px solid #4A4840',
                  borderRadius: 8,
                  padding: '14px 16px',
                  color: darkText,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700 }}>Indexing path</div>
                <div style={{ fontSize: 16, color: darkMuted, marginTop: 4 }}>Embed → Turbopuffer (GCP)</div>
              </div>
              <div
                style={{
                  gridColumn: '1 / -1',
                  background: '#2A2823',
                  border: '2px solid #4A4840',
                  borderLeft: '5px solid #E8A07A',
                  borderRadius: 8,
                  padding: '14px 16px',
                  color: darkText,
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700 }}>Multi-AZ in us-east-1</div>
                <div style={{ fontSize: 16, color: darkMuted, marginTop: 4 }}>
                  No cross-region failover today · processing/storage default here
                </div>
              </div>
            </div>
          </Zone>
        </div>

        <div style={{ position: 'absolute', left: 1062, top: 148, width: 90 }}>
          <LinkLabel>{'ZDR\ncontracts'}</LinkLabel>
        </div>

        <div style={{ position: 'absolute', left: 1170, top: 30, width: 550 }}>
          <Zone title="External model providers" badge="Inference">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <InnerBox title="Anthropic" detail="Claude family" accent={green} />
              <InnerBox title="OpenAI" detail="GPT family" accent={green} />
              <InnerBox title="Google · others" detail="Allowlisted only" accent={green} />
              <InnerBox title="Composer · Grok" detail="First-party" accent={green} />
            </div>
          </Zone>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 14,
          }}
        >
          <Node label="In transit" detail="TLS 1.2+ · encrypted everywhere on the wire" width="100%" accent={green} />
          <Node label="At rest" detail="AES-256 · CMEK available for Cloud Agent state" width="100%" accent={green} />
          <Node
            label="Field precision"
            detail="Raw code does reach AWS during processing — then embeddings or prompt context"
            width="100%"
            accent="var(--osd-accent)"
          />
        </div>
      </div>
    </BodyArea>
  </div>
);

/* ─── 5. Three egress — branched diagram ─── */
const ThreeEgress: Page = () => (
  <div style={pageRoot}>
    <CursorLogo />
    <Eyebrow>Egress model</Eyebrow>
    <Title>Three ways data leaves the building</Title>
    <BodyArea>
      <div style={{ position: 'relative', height: 540, width: '100%' }}>
        <svg
          width="1700"
          height="420"
          viewBox="0 0 1700 420"
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
        >
          <defs>
            <marker id="egressArrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill={muted} />
            </marker>
          </defs>
          <path d="M760 76 C500 96, 340 120, 264 172" stroke={muted} strokeWidth="2.5" fill="none" markerEnd="url(#egressArrow)" />
          <line x1="850" y1="80" x2="850" y2="172" stroke={muted} strokeWidth="2.5" markerEnd="url(#egressArrow)" />
          <path d="M940 76 C1200 96, 1360 120, 1436 172" stroke={muted} strokeWidth="2.5" fill="none" markerEnd="url(#egressArrow)" />
        </svg>

        <div style={{ position: 'absolute', left: 560, top: 0, width: 580 }}>
          <div
            style={{
              background: dark,
              color: darkText,
              border: '2px solid #3A3832',
              borderRadius: 'var(--osd-radius)',
              padding: '20px 28px',
              textAlign: 'center',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Customer environment
          </div>
        </div>

        <div style={{ position: 'absolute', left: 0, top: 180, width: 520 }}>
          <Node
            label="1 · Indexing"
            detail="Full codebase → embeddings. Store vectors + obfuscated path/line. Raw source not retained for search."
            width="100%"
          />
        </div>
        <div style={{ position: 'absolute', left: 590, top: 180, width: 520 }}>
          <Node
            label="2 · LLM requests"
            detail="Selected snippets as raw context → Cursor → providers. Privacy Mode + contractual ZDR."
            width="100%"
            accent={green}
          />
        </div>
        <div style={{ position: 'absolute', left: 1180, top: 180, width: 520 }}>
          <Node
            label="3 · Git app"
            detail="Only if Cloud Agents or Bugbot. Encrypted repo access via GitHub/GitLab app — not embeddings."
            width="100%"
            accent={amber}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 20,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: `2px solid ${border}`,
              borderLeft: '6px solid var(--osd-accent)',
              padding: '18px 22px',
              fontSize: 24,
              lineHeight: 1.35,
              color: body,
            }}
          >
            <span style={{ fontWeight: 700 }}>Correct this on calls: </span>
            “No raw code ever leaves the device” is inaccurate.
          </div>
          <div
            style={{
              background: '#FFFFFF',
              border: `2px solid ${border}`,
              borderLeft: `6px solid ${green}`,
              padding: '18px 22px',
              fontSize: 24,
              lineHeight: 1.35,
              color: body,
            }}
          >
            Raw code <span style={{ fontWeight: 700 }}>does</span> reach Cursor AWS during
            processing — then becomes embeddings or is forwarded as prompt context.
          </div>
        </div>
      </div>
    </BodyArea>
  </div>
);

/* ─── 6. Indexing process — Notion diagram replica ─── */
const IndexingLoop: Page = () => (
  <div style={{ ...pageRoot, padding: '72px 80px 56px' }}>
    <CursorLogo />
    <Eyebrow>Notion primer · Indexing</Eyebrow>
    <Title maxWidth={1600}>Cursor indexing process</Title>
    <BodyArea>
      <div style={{ position: 'relative', height: 620, width: '100%' }}>
        <svg
          width="1760"
          height="460"
          viewBox="0 0 1760 460"
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
        >
          <defs>
            <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={muted} />
            </marker>
          </defs>
          <line x1="328" y1="210" x2="502" y2="210" stroke={muted} strokeWidth="2.5" markerEnd="url(#arrowHead)" />
          <line x1="1018" y1="210" x2="1192" y2="210" stroke={muted} strokeWidth="2.5" markerEnd="url(#arrowHead)" />
        </svg>

        {/* IDE */}
        <div style={{ position: 'absolute', left: 0, top: 88, width: 320 }}>
          <Zone title="Cursor IDE" badge="Client">
            <div
              style={{
                height: 200,
                background: soft,
                border: `2px solid ${border}`,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  background: dark,
                  color: darkText,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                ⌁
              </div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>Local codebase</div>
              <div style={{ fontSize: 18, color: secondary, textAlign: 'center', padding: '0 16px' }}>
                Code stays on disk · read at index time
              </div>
            </div>
          </Zone>
        </div>

        {/* Arrow 1 payload + encryption */}
        <div style={{ position: 'absolute', left: 320, top: 138, width: 190 }}>
          <LinkLabel>{'Code,\nline numbers,\nobfuscated file paths'}</LinkLabel>
        </div>
        <div style={{ position: 'absolute', left: 328, top: 232, width: 176, fontSize: 14, lineHeight: 1.35, color: secondary, textAlign: 'center' }}>
          File paths encrypted with AES-256-CTR, preserving separators · TLS 1.2+ in transit
        </div>

        {/* Backend AWS */}
        <div style={{ position: 'absolute', left: 510, top: 88, width: 500 }}>
          <Zone title="Cursor backend server" badge="AWS" darkMode>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 200, justifyContent: 'center' }}>
              <div
                style={{
                  background: '#2A2823',
                  border: '2px solid #4A4840',
                  borderRadius: 8,
                  padding: '18px 20px',
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 700, color: darkText }}>Compute embeddings</div>
                <div style={{ marginTop: 6, fontSize: 18, color: darkMuted, lineHeight: 1.3 }}>
                  Raw code processed transiently · one-way vectors out
                </div>
              </div>
              <div style={{ textAlign: 'center', color: darkMuted, fontSize: 20 }}>↕</div>
              <div
                style={{
                  background: '#2A2823',
                  border: '2px solid #4A4840',
                  borderLeft: '5px solid var(--osd-accent)',
                  borderRadius: 8,
                  padding: '16px 20px',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 700, color: darkText }}>Embedding cache</div>
                <div style={{ marginTop: 4, fontSize: 17, color: darkMuted }}>Reuse prior vectors · reduce recompute</div>
              </div>
            </div>
          </Zone>
        </div>

        {/* Arrow 2 payload + encryption */}
        <div style={{ position: 'absolute', left: 1010, top: 138, width: 190 }}>
          <LinkLabel>{'Embeddings,\nline numbers,\nobfuscated file paths'}</LinkLabel>
        </div>
        <div style={{ position: 'absolute', left: 1018, top: 232, width: 176, fontSize: 14, lineHeight: 1.35, color: secondary, textAlign: 'center' }}>
          No raw code crosses this hop — vectors only · TLS 1.2+ in transit
        </div>

        {/* Turbopuffer GCP */}
        <div style={{ position: 'absolute', left: 1200, top: 20, width: 560 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: green,
              marginBottom: 8,
              lineHeight: 1.3,
              paddingLeft: 4,
            }}
          >
            If using CMEK, embeddings are encrypted with the customer key before storage ↓
          </div>
          <Zone title="Turbopuffer vector DB" badge="GCP">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200, justifyContent: 'center' }}>
              <InnerBox title="What is stored" detail="Embeddings · line numbers · obfuscated file paths" accent={green} />
              <InnerBox title="What is not stored" detail="Raw source code is never retained here" accent={amber} />
              <InnerBox
                title="At query time"
                detail="Nearest-neighbor hit → path/line returned → client resolves code locally"
              />
            </div>
          </Zone>
        </div>

        {/* Data examples */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            background: '#FFFFFF',
            border: `2px solid ${border}`,
            borderRadius: 10,
            padding: '16px 22px',
            display: 'grid',
            gridTemplateColumns: '140px 1fr 1fr 1fr 1fr',
            gap: 14,
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: muted }}>DATA EXAMPLES</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: muted, marginBottom: 4 }}>Code</div>
            <div style={{ fontSize: 18, fontFamily: 'ui-monospace, Menlo, monospace', color: body }}>
              print(&quot;hello&quot;)
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: muted, marginBottom: 4 }}>Embeddings</div>
            <div style={{ fontSize: 18, fontFamily: 'ui-monospace, Menlo, monospace', color: body }}>
              [1234, 5678, …]
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: muted, marginBottom: 4 }}>Line numbers</div>
            <div style={{ fontSize: 18, fontFamily: 'ui-monospace, Menlo, monospace', color: body }}>L34</div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: muted, marginBottom: 4 }}>Obfuscated paths</div>
            <div style={{ fontSize: 18, fontFamily: 'ui-monospace, Menlo, monospace', color: body }}>
              /aqwg/qgub.asfa
            </div>
          </div>
        </div>
      </div>
    </BodyArea>
  </div>
);

/* ─── 7. Making an agent request — Notion 5-step loop replica ─── */
const PrivacyMode: Page = () => (
  <div style={{ ...pageRoot, padding: '72px 80px 56px' }}>
    <CursorLogo />
    <Eyebrow>Notion primer · LLM requests</Eyebrow>
    <Title>Making an agent request</Title>
    <BodyArea>
      <div style={{ position: 'relative', height: 680, width: '100%' }}>
        <svg
          width="1760"
          height="680"
          viewBox="0 0 1760 680"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <defs>
            <marker id="reqArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={muted} />
            </marker>
          </defs>
          {/* 1 · IDE → compute embedding */}
          <line x1="306" y1="165" x2="464" y2="165" stroke={muted} strokeWidth="2.5" markerEnd="url(#reqArrow)" />
          {/* → Turbopuffer */}
          <path d="M946 155 C1030 145, 1090 130, 1172 118" stroke={muted} strokeWidth="2.5" fill="none" markerEnd="url(#reqArrow)" />
          {/* 3 · Turbopuffer → IDE (through backend gap) */}
          <path d="M1174 205 C 880 262, 600 262, 312 250" stroke={muted} strokeWidth="2.5" fill="none" markerEnd="url(#reqArrow)" />
          {/* 4 · IDE → build final prompt */}
          <line x1="306" y1="360" x2="464" y2="360" stroke={muted} strokeWidth="2.5" markerEnd="url(#reqArrow)" />
          {/* → providers */}
          <path d="M946 370 C1030 380, 1090 395, 1172 410" stroke={muted} strokeWidth="2.5" fill="none" markerEnd="url(#reqArrow)" />
          {/* 5 · providers → IDE via backend */}
          <path d="M1174 545 C 860 625, 480 580, 306 408" stroke={muted} strokeWidth="2.5" fill="none" strokeDasharray="7 5" markerEnd="url(#reqArrow)" />
        </svg>

        {/* IDE */}
        <div style={{ position: 'absolute', left: 0, top: 80, width: 300 }}>
          <Zone title="Cursor IDE" badge="Client">
            <InnerBox title="User prompt" detail="Agent · Cmd-K · chat" accent="var(--osd-accent)" />
            <div style={{ height: 10 }} />
            <InnerBox title="Local code lookup" detail="Resolves returned paths + line #s on disk" />
            <div style={{ height: 10 }} />
            <InnerBox title="Response rendered" detail="Diffs · answers · edits" />
          </Zone>
        </div>

        {/* Backend */}
        <div style={{ position: 'absolute', left: 470, top: 80, width: 480 }}>
          <Zone title="Cursor backend server" badge="AWS" darkMode>
            <div
              style={{
                background: '#2A2823',
                border: '2px solid #4A4840',
                borderRadius: 8,
                padding: '16px 18px',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: darkText }}>1 · Compute embedding of prompt</div>
              <div style={{ fontSize: 17, color: darkMuted, marginTop: 4 }}>
                Same one-way embedding used at index time
              </div>
            </div>
            <div style={{ height: 56 }} />
            <div
              style={{
                background: '#2A2823',
                border: '2px solid #4A4840',
                borderLeft: '5px solid var(--osd-accent)',
                borderRadius: 8,
                padding: '16px 18px',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: darkText }}>4 · Build final prompt</div>
              <div style={{ fontSize: 17, color: darkMuted, marginTop: 4 }}>
                Merge augmented context · route to chosen model
              </div>
            </div>
          </Zone>
        </div>

        {/* Turbopuffer */}
        <div style={{ position: 'absolute', left: 1180, top: 20, width: 580 }}>
          <Zone title="Turbopuffer vector DB" badge="GCP">
            <InnerBox
              title="2 · Nearest-neighbor search"
              detail="Query embedding vs stored embeddings · CMEK-encrypted at rest when enabled"
              accent={green}
            />
          </Zone>
        </div>

        {/* Providers */}
        <div style={{ position: 'absolute', left: 1180, top: 330, width: 580 }}>
          <Zone title="Model providers" badge="ZDR">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <InnerBox title="OpenAI" detail="Inference only" accent={green} />
              <InnerBox title="Anthropic" detail="Inference only" accent={green} />
              <InnerBox title="Gemini · others" detail="Allowlisted" accent={green} />
              <InnerBox title="Composer · Grok" detail="First-party" accent={green} />
            </div>
            <div style={{ marginTop: 10, fontSize: 16, lineHeight: 1.35, color: secondary }}>
              Zero-data-retention policies — providers never store or train on requests.
            </div>
          </Zone>
        </div>

        {/* Arrow labels */}
        <div style={{ position: 'absolute', left: 296, top: 122, width: 180 }}>
          <LinkLabel>Initial prompt</LinkLabel>
        </div>
        <div style={{ position: 'absolute', left: 980, top: 92, width: 180 }}>
          <LinkLabel>Prompt embedding</LinkLabel>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 986,
            top: 236,
            width: 340,
            background: '#FFFFFF',
            border: `2px solid ${border}`,
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.3,
            color: secondary,
            textAlign: 'center',
          }}
        >
          3 · Line numbers + obfuscated file paths — IDE looks up the code locally
        </div>
        <div style={{ position: 'absolute', left: 296, top: 318, width: 180 }}>
          <LinkLabel>Augmented prompt</LinkLabel>
        </div>
        <div style={{ position: 'absolute', left: 980, top: 396, width: 180 }}>
          <LinkLabel>Final prompt</LinkLabel>
        </div>
        <div style={{ position: 'absolute', left: 560, top: 612, width: 420 }}>
          <LinkLabel>5 · Response returned through Cursor backend</LinkLabel>
        </div>

        {/* Encryption strip */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: 500,
            background: '#FFFFFF',
            border: `2px solid ${border}`,
            borderLeft: `6px solid ${green}`,
            borderRadius: 10,
            padding: '14px 18px',
            fontSize: 17,
            lineHeight: 1.4,
            color: body,
          }}
        >
          TLS 1.2+ in transit to and from the backend · AES-256 at rest in Cursor infrastructure ·
          Privacy Mode: no storage, no training
        </div>
      </div>
    </BodyArea>
  </div>
);

/* ─── 8. Section: Cloud Agents ─── */
const AgentsDivider: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: dark,
      color: darkText,
      padding: 110,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      fontFamily: font,
      boxSizing: 'border-box',
    }}
  >
    <CursorLogo onDark />
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--osd-accent)', marginBottom: 24 }}>
      CHAPTER 02
    </div>
    <HeroTitle size={110}>Cloud Agents</HeroTitle>
    <p style={{ margin: '28px 0 0', fontSize: 36, color: darkMuted, maxWidth: 1100, lineHeight: 1.35 }}>
      Different data profile: encrypted code in isolated VMs — not embeddings.
    </p>
  </div>
);

/* ─── 9. Cloud Agents — structured left-to-right flow ─── */
const FlowChip = ({ n, label }: { n: number; label: string }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
    <span
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'var(--osd-accent)',
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {n}
    </span>
    <span style={{ fontSize: 19, fontWeight: 600, color: 'var(--osd-text)' }}>{label}</span>
  </div>
);

const FlowChipArrow = () => (
  <span style={{ fontSize: 22, color: muted, lineHeight: 1, padding: '0 4px' }}>→</span>
);

const ColArrow = ({ glyph = '→', caption }: { glyph?: string; caption?: string }) => (
  <div
    style={{
      alignSelf: 'center',
      width: 64,
      flexShrink: 0,
      textAlign: 'center',
      fontFamily: font,
    }}
  >
    <div style={{ fontSize: 40, color: muted, lineHeight: 1 }}>{glyph}</div>
    {caption ? (
      <div
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: muted,
          lineHeight: 1.35,
          whiteSpace: 'pre-line',
        }}
      >
        {caption}
      </div>
    ) : null}
  </div>
);

const CloudTopology: Page = () => (
  <div style={{ ...pageRoot, padding: '56px 64px 48px' }}>
    <CursorLogo />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
      <div>
        <Eyebrow>Notion primer · Cloud Agents</Eyebrow>
        <Title maxWidth={1100}>Cloud Agents data flow</Title>
      </div>
      <div style={{ maxWidth: 560, fontSize: 18, lineHeight: 1.35, color: secondary, paddingBottom: 8 }}>
        The VM pod acts like the IDE in foreground mode — the Cursor backend runs the loop and
        talks to LLMs.
      </div>
    </div>
    <BodyArea>
      {/* Four aligned lanes, left to right */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {/* Lane 1 — where agents start + where code lives */}
        <div style={{ flex: 0.9, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Zone title="Created via" style={{ flex: 1 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <InnerBox title="IDE / CLI" />
              <InnerBox title="Slack / Linear" />
              <InnerBox title="Web / API" />
            </div>
          </Zone>
          <Zone title="GitHub / GitLab" style={{ flex: 1 }}>
            <InnerBox title="Code out" detail="Temporary user-scoped token" accent={amber} />
            <div style={{ height: 8 }} />
            <InnerBox title="Draft PR back" detail="Attributed in git history" accent={green} />
          </Zone>
        </div>

        <ColArrow caption={'CREATE\nCLONE · PR'} />

        {/* Lane 2 — the VM environment */}
        <div style={{ flex: 1.3, minWidth: 0, display: 'flex' }}>
          <Zone title="Cursor Cloud Agent env" badge="Segregated AWS" darkMode style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: darkMuted, marginBottom: 12, lineHeight: 1.35 }}>
              Separate, segregated AWS accounts — isolated from all other Cursor infrastructure.
            </div>
            <div
              style={{
                background: '#2A2823',
                border: '2px solid #4A4840',
                borderRadius: 8,
                padding: '14px 16px',
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: darkText }}>Background composer runner</div>
              <div style={{ fontSize: 15, color: darkMuted, marginTop: 4 }}>Provisions the pod per task</div>
            </div>
            <div
              style={{
                background: '#2A2823',
                border: '2px solid #4A4840',
                borderLeft: '5px solid var(--osd-accent)',
                borderRadius: 8,
                padding: '16px 18px',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: darkText, marginBottom: 8 }}>
                Firecracker microVM pod
              </div>
              <div style={{ fontSize: 16, color: darkMuted, lineHeight: 1.4, marginBottom: 10 }}>
                Hardware-isolated · jailer-hardened · minimal guest kernel · configurable egress
              </div>
              <div style={{ fontSize: 16, color: '#C9C7C1', lineHeight: 1.4 }}>
                Executes tool calls, code edits, and terminal commands — like the IDE in
                foreground mode
              </div>
            </div>
          </Zone>
        </div>

        <ColArrow glyph="⇄" caption={'AGENT\nLOOP'} />

        {/* Lane 3 — orchestration + state */}
        <div style={{ flex: 1.15, minWidth: 0, display: 'flex' }}>
          <Zone title="Cursor backend server" badge="AWS" style={{ flex: 1 }}>
            <InnerBox
              title="Headless agentic composer"
              detail="Runs the agent loop · sends instructions to the pod"
              accent="var(--osd-accent)"
            />
            <div style={{ height: 10 }} />
            <InnerBox
              title="PostgreSQL DB of agent state"
              detail="Chat history · tool results · encrypted with per-agent keys"
            />
            <div style={{ height: 10 }} />
            <InnerBox
              title="No employee access"
              detail="SSH to customer VMs blocked · attempts monitored"
            />
          </Zone>
        </div>

        <ColArrow caption={'ZDR\nROUTE'} />

        {/* Lane 4 — model providers */}
        <div style={{ flex: 0.85, minWidth: 0, display: 'flex' }}>
          <Zone title="LLMs" badge="ZDR" style={{ flex: 1 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <InnerBox title="OpenAI" accent={green} />
              <InnerBox title="Claude" accent={green} />
              <InnerBox title="Gemini · others" accent={green} />
            </div>
            <div style={{ marginTop: 12, fontSize: 15, lineHeight: 1.35, color: secondary }}>
              Routed via the Cursor backend — never from the pod directly
            </div>
          </Zone>
        </div>
      </div>

      {/* Presenter walk-through — the 8 steps in order */}
      <div
        style={{
          marginTop: 26,
          background: '#FFFFFF',
          border: `2px solid ${border}`,
          borderRadius: 10,
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <FlowChip n={1} label="Create" />
        <FlowChipArrow />
        <FlowChip n={2} label="Provision VM" />
        <FlowChipArrow />
        <FlowChip n={3} label="Clone repo" />
        <FlowChipArrow />
        <FlowChip n={4} label="Agent loop" />
        <FlowChipArrow />
        <FlowChip n={5} label="LLM route" />
        <FlowChipArrow />
        <FlowChip n={6} label="Instruct pod" />
        <FlowChipArrow />
        <FlowChip n={7} label="Persist state" />
        <FlowChipArrow />
        <FlowChip n={8} label="Draft PR" />
      </div>
    </BodyArea>
  </div>
);

/* ─── 9b. Cloud Agents storage table — Notion primer ─── */
const CloudStorage: Page = () => (
  <div style={{ ...pageRoot, padding: '72px 80px 56px' }}>
    <CursorLogo />
    <Eyebrow>Notion primer · What is stored</Eyebrow>
    <Title>Cloud Agent data — where and how long</Title>
    <BodyArea>
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr 0.85fr 0.9fr', gap: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: muted, padding: '8px 4px' }}>
          CATEGORY
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: muted, padding: '8px 4px' }}>
          WHAT
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: muted, padding: '8px 4px' }}>
          WHERE
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: muted, padding: '8px 4px' }}>
          HOW LONG
        </div>

        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Runtime workspace</div>
        </div>
        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, color: body, lineHeight: 1.35 }}>
          Checked-out repo · build artifacts · tool context
        </div>
        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, color: body, lineHeight: 1.35 }}>
          Firecracker VM
        </div>
        <div style={{ background: pale, border: '2px solid #F5C4A8', borderRadius: 8, padding: '18px 18px', fontSize: 20, fontWeight: 700, color: 'var(--osd-accent)', lineHeight: 1.35 }}>
          ~36h default · refreshes on follow-up
        </div>

        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>VM snapshots</div>
        </div>
        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, color: body, lineHeight: 1.35 }}>
          Warm-start cache · may include cloned code
        </div>
        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, color: body, lineHeight: 1.35 }}>
          Snapshot layer
        </div>
        <div style={{ background: '#FFF8E8', border: `2px solid ${amber}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, fontWeight: 700, color: amber, lineHeight: 1.35 }}>
          Max ~90 days
        </div>

        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Agent / conversation state</div>
        </div>
        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, color: body, lineHeight: 1.35 }}>
          Prompts · tool outputs · diffs · artifacts
        </div>
        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, color: body, lineHeight: 1.35 }}>
          Cursor backend · per-agent keys
        </div>
        <div style={{ background: soft, border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, fontWeight: 700, color: secondary, lineHeight: 1.35 }}>
          Until explicit deletion
        </div>

        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Secrets & tokens</div>
        </div>
        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, color: body, lineHeight: 1.35 }}>
          Cloud Agent secrets · OAuth · API credentials
        </div>
        <div style={{ background: '#FFFFFF', border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, color: body, lineHeight: 1.35 }}>
          Encrypted credential store · KMS
        </div>
        <div style={{ background: soft, border: `2px solid ${border}`, borderRadius: 8, padding: '18px 18px', fontSize: 20, fontWeight: 700, color: secondary, lineHeight: 1.35 }}>
          Until deleted / rotated
        </div>
      </div>
      <Callout>
        Unlike indexing, Cloud Agents store encrypted code — not embeddings. CMEK/BYOK supported for
        enterprise server-side encryption.
      </Callout>
    </BodyArea>
  </div>
);

/* ─── 10. Hosted vs self-hosted — layer matrix ─── */
const HostCell = ({
  label,
  detail,
  customer = false,
}: {
  label: string;
  detail?: string;
  customer?: boolean;
}) => (
  <div
    style={{
      background: customer ? '#E8F5EE' : dark,
      border: customer ? `2px solid ${green}` : `2px solid #3A3832`,
      borderRadius: 'var(--osd-radius)',
      padding: '18px 22px',
      boxSizing: 'border-box',
    }}
  >
    <div style={{ fontSize: 23, fontWeight: 700, color: customer ? green : darkText, lineHeight: 1.25 }}>
      {label}
    </div>
    {detail ? (
      <div style={{ marginTop: 4, fontSize: 18, color: customer ? '#3E6B55' : darkMuted, lineHeight: 1.3 }}>
        {detail}
      </div>
    ) : null}
  </div>
);

const RowLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: secondary }}>
    {children}
  </div>
);

const HostedVsSelf: Page = () => (
  <div style={pageRoot}>
    <CursorLogo />
    <Eyebrow>Deployment choice</Eyebrow>
    <Title>Self-hosting moves two layers — not the loop</Title>
    <BodyArea>
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 1fr', gap: 14, alignItems: 'stretch' }}>
        <div />
        <div style={{ textAlign: 'center', fontSize: 19, fontWeight: 700, letterSpacing: '0.1em', color: secondary, paddingBottom: 4 }}>
          CURSOR-HOSTED · DEFAULT
        </div>
        <div style={{ textAlign: 'center', fontSize: 19, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--osd-accent)', paddingBottom: 4 }}>
          SELF-HOSTED POOL · EXCEPTION
        </div>

        <RowLabel>Agent loop</RowLabel>
        <HostCell label="Cursor cloud" detail="Headless composer runs the loop" />
        <HostCell label="Still Cursor cloud" detail="Unchanged — loop never moves" />

        <RowLabel>Tool execution</RowLabel>
        <HostCell label="Isolated Cursor microVM" detail="Firecracker pod · segregated AWS" />
        <HostCell label="Customer worker / VPC" detail="Moves inside your network" customer />

        <RowLabel>Full repo / build cache</RowLabel>
        <HostCell label="On Cursor VM" detail="Documented retention lifecycle" />
        <HostCell label="Customer infrastructure" detail="Code never rests on Cursor VMs" customer />

        <RowLabel>Model inference</RowLabel>
        <HostCell label="Cursor → providers · ZDR" detail="Selected context only" />
        <HostCell label="Still Cursor → providers" detail="Unchanged — context still flows out" />
      </div>
      <Callout>
        Self-hosting is not air-gapped. Justify it with a named policy, unreachable private
        dependency, or customer-owned host control — not “we prefer it inside the network.”
      </Callout>
    </BodyArea>
  </div>
);

/* ─── 11. Section: Controls ─── */
const ControlsDivider: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: dark,
      color: darkText,
      padding: 110,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      fontFamily: font,
      boxSizing: 'border-box',
    }}
  >
    <CursorLogo onDark />
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--osd-accent)', marginBottom: 24 }}>
      CHAPTER 03
    </div>
    <HeroTitle size={110}>Controls</HeroTitle>
    <p style={{ margin: '28px 0 0', fontSize: 36, color: darkMuted, maxWidth: 1000, lineHeight: 1.35 }}>
      Hard gates admins enforce — and soft steering teams encode.
    </p>
  </div>
);

/* ─── 12. Controls — matched two-column comparison ─── */
const ControlsStack: Page = () => (
  <div style={pageRoot}>
    <CursorLogo />
    <Eyebrow>Enterprise posture</Eyebrow>
    <Title>Deterministic gates vs steering</Title>
    <BodyArea>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--osd-accent)', marginBottom: 16 }}>
            DETERMINISTIC · ADMIN-ENFORCED
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Node
              label="Model allow / block list"
              detail="Which models the org can use"
              width="100%"
              darkMode
            />
            <Node
              label="MCP allow / block list"
              detail="Which servers agents can reach"
              width="100%"
              darkMode
            />
            <Node
              label="Auto-run / sandbox gates"
              detail="Which terminal commands run without confirmation"
              width="100%"
              darkMode
            />
            <Node
              label="Repo blocklist · MDM locks"
              detail="Block repositories · pin team IDs and extensions"
              width="100%"
              darkMode
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.1em', color: green, marginBottom: 16 }}>
            STEERING · TEAM-ENCODED
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Node
              label="Rules"
              detail="Team guidance the agent always follows"
              width="100%"
              accent={green}
            />
            <Node
              label="Skills · plugins"
              detail="Reusable workflows and integrations"
              width="100%"
              accent={green}
            />
            <Node
              label="Sub-agents"
              detail="Decompose work inside the same trust boundary"
              width="100%"
              accent={green}
            />
            <Node
              label="Usage limits"
              detail="Cap individual and team spend"
              width="100%"
              accent={green}
            />
          </div>
        </div>
      </div>
      <Callout>
        Gates are enforced by infrastructure and cannot be bypassed. Steering shapes agent
        behavior — useful, but never sell it as a hard control.
      </Callout>
    </BodyArea>
  </div>
);

/* ─── 13. Section: Sovereignty ─── */
const SovDivider: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: dark,
      color: darkText,
      padding: 110,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      fontFamily: font,
      boxSizing: 'border-box',
    }}
  >
    <CursorLogo onDark />
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--osd-accent)', marginBottom: 24 }}>
      CHAPTER 04
    </div>
    <HeroTitle size={100}>Data sovereignty</HeroTitle>
    <p style={{ margin: '28px 0 0', fontSize: 36, color: darkMuted, maxWidth: 1100, lineHeight: 1.35 }}>
      Three layers. US can pin all three. EU today pins inference only.
    </p>
  </div>
);

/* ─── 14. Layer stack comparison ─── */
const ResidencyStack: Page = () => (
  <div style={pageRoot}>
    <CursorLogo />
    <Eyebrow>Residency layers</Eyebrow>
    <Title>US full stack vs EU inference-only</Title>
    <BodyArea>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: 16, alignItems: 'stretch' }}>
        <div />
        <div
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: green,
            paddingBottom: 8,
          }}
        >
          US-ONLY RESIDENCY
        </div>
        <div
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'var(--osd-accent)',
            paddingBottom: 8,
          }}
        >
          EU REGIONAL INFERENCE
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: secondary }}>
          Inference
        </div>
        <div
          style={{
            background: '#E8F5EE',
            border: `2px solid ${green}`,
            borderRadius: 'var(--osd-radius)',
            padding: '22px 24px',
            fontSize: 24,
            fontWeight: 700,
            color: green,
            textAlign: 'center',
          }}
        >
          US providers · in-region
        </div>
        <div
          style={{
            background: pale,
            border: '2px solid var(--osd-accent)',
            borderRadius: 'var(--osd-radius)',
            padding: '22px 24px',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--osd-accent)',
            textAlign: 'center',
          }}
        >
          EU + Iceland providers
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: secondary }}>
          Processing
        </div>
        <div
          style={{
            background: '#E8F5EE',
            border: `2px solid ${green}`,
            borderRadius: 'var(--osd-radius)',
            padding: '22px 24px',
            fontSize: 24,
            fontWeight: 700,
            color: green,
            textAlign: 'center',
          }}
        >
          US pipelines
        </div>
        <div
          style={{
            background: soft,
            border: `2px solid ${border}`,
            borderRadius: 'var(--osd-radius)',
            padding: '22px 24px',
            fontSize: 24,
            fontWeight: 700,
            color: muted,
            textAlign: 'center',
          }}
        >
          Still US · not regionalized
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, color: secondary }}>
          Storage
        </div>
        <div
          style={{
            background: '#E8F5EE',
            border: `2px solid ${green}`,
            borderRadius: 'var(--osd-radius)',
            padding: '22px 24px',
            fontSize: 24,
            fontWeight: 700,
            color: green,
            textAlign: 'center',
          }}
        >
          US storage + backups
        </div>
        <div
          style={{
            background: soft,
            border: `2px solid ${border}`,
            borderRadius: 'var(--osd-radius)',
            padding: '22px 24px',
            fontSize: 24,
            fontWeight: 700,
            color: muted,
            textAlign: 'center',
          }}
        >
          Still US · SCCs cover transfer
        </div>
      </div>
      <Callout>
        Never pitch EU inference as “data stays in the EU.” Full EU residency is longer-term —
        confirm the WIP internal doc before quoting timelines.
      </Callout>
    </BodyArea>
  </div>
);

/* ─── 15. EU in/out — diagram board ─── */
const EuScope: Page = () => (
  <div style={pageRoot}>
    <CursorLogo />
    <Eyebrow>EU field brief</Eyebrow>
    <Title>What you can promise today</Title>
    <BodyArea>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, minHeight: 500 }}>
        <div
          style={{
            background: '#E8F5EE',
            border: `2px solid ${green}`,
            borderRadius: 'var(--osd-radius)',
            padding: '28px 30px',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.1em', color: green, marginBottom: 20 }}>
            IN SCOPE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Node label="Select GPT · Claude 4.6+ · Composer · Grok" width="100%" accent={green} />
            <Node label="Cloud Agent inference can be EU-routed" width="100%" accent={green} />
            <Node label="Per-team enablement · ~1–2 weeks · 10% model uplift" width="100%" accent={green} />
            <Node label="Traveling users still route to EU/Iceland endpoints" width="100%" accent={green} />
          </div>
        </div>
        <div
          style={{
            background: soft,
            border: `2px solid ${border}`,
            borderRadius: 'var(--osd-radius)',
            padding: '28px 30px',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.1em', color: muted, marginBottom: 20 }}>
            OUT OF SCOPE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Node label="Processing & storage · indexing · Bugbot" width="100%" accent={muted} />
            <Node label="SSO / WorkOS · BYOK · custom gateways" width="100%" accent={muted} />
            <Node label="MCPs · @Web · shared-link recipients" width="100%" accent={muted} />
            <Node label="Slack/web-triggered agent command region" width="100%" accent={muted} />
          </div>
        </div>
      </div>
    </BodyArea>
  </div>
);

/* ─── 16. Decision tree ─── */
const DecisionTree: Page = () => (
  <div style={pageRoot}>
    <CursorLogo />
    <Eyebrow>Discovery</Eyebrow>
    <Title>Which path fits the requirement?</Title>
    <BodyArea>
      <div style={{ position: 'relative', height: 560, width: '100%' }}>
        <svg
          width="1700"
          height="520"
          viewBox="0 0 1700 520"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <defs>
            <marker id="treeArrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill={muted} />
            </marker>
          </defs>
          <path d="M770 78 C 560 100, 420 140, 328 192" stroke={muted} strokeWidth="2.5" fill="none" markerEnd="url(#treeArrow)" />
          <line x1="850" y1="80" x2="850" y2="192" stroke={muted} strokeWidth="2.5" markerEnd="url(#treeArrow)" />
          <path d="M930 78 C 1140 100, 1280 140, 1372 192" stroke={muted} strokeWidth="2.5" fill="none" markerEnd="url(#treeArrow)" />
          <line x1="320" y1="300" x2="320" y2="360" stroke={muted} strokeWidth="2.5" markerEnd="url(#treeArrow)" />
          <line x1="850" y1="300" x2="850" y2="360" stroke={muted} strokeWidth="2.5" markerEnd="url(#treeArrow)" />
          <line x1="1380" y1="300" x2="1380" y2="360" stroke={muted} strokeWidth="2.5" markerEnd="url(#treeArrow)" />
        </svg>

        <div style={{ position: 'absolute', left: 500, top: 0, width: 700 }}>
          <div
            style={{
              background: dark,
              color: darkText,
              borderRadius: 'var(--osd-radius)',
              padding: '18px 28px',
              textAlign: 'center',
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            What does policy actually require?
          </div>
        </div>

        <div style={{ position: 'absolute', left: 40, top: 200, width: 560 }}>
          <Node
            label="Inference region only"
            detail="Model hop must stay in EU/Iceland"
            width="100%"
            accent="var(--osd-accent)"
          />
        </div>
        <div style={{ position: 'absolute', left: 570, top: 200, width: 560 }}>
          <Node
            label="Full repo / tool execution location"
            detail="Code and builds must stay on customer infra"
            width="100%"
            accent={amber}
          />
        </div>
        <div style={{ position: 'absolute', left: 1100, top: 200, width: 560 }}>
          <Node
            label="US processing + storage"
            detail="Pin the whole stack to US"
            width="100%"
            accent={green}
          />
        </div>

        <div style={{ position: 'absolute', left: 40, top: 370, width: 560 }}>
          <div
            style={{
              background: pale,
              border: '2px solid var(--osd-accent)',
              borderRadius: 'var(--osd-radius)',
              padding: '22px 24px',
              fontSize: 26,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            → EU regional inference
          </div>
        </div>
        <div style={{ position: 'absolute', left: 570, top: 370, width: 560 }}>
          <div
            style={{
              background: '#FFF8E8',
              border: `2px solid ${amber}`,
              borderRadius: 'var(--osd-radius)',
              padding: '22px 24px',
              fontSize: 26,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            → Self-hosted Cloud Agents
          </div>
        </div>
        <div style={{ position: 'absolute', left: 1100, top: 370, width: 560 }}>
          <div
            style={{
              background: '#E8F5EE',
              border: `2px solid ${green}`,
              borderRadius: 'var(--osd-radius)',
              padding: '22px 24px',
              fontSize: 26,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            → US-only data residency
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            fontSize: 22,
            color: secondary,
            textAlign: 'center',
          }}
        >
          If they say “everything in the EU” — clarify layers before you commit a path.
        </div>
      </div>
    </BodyArea>
  </div>
);

/* ─── 17. Big precision statement ─── */
const Precision: Page = () => (
  <div style={pageRoot}>
    <CursorLogo />
    <BodyArea>
      <div style={{ maxWidth: 1500 }}>
        <Eyebrow>Field mantra</Eyebrow>
        <HeroTitle color="var(--osd-text)" size={72}>
          Be precise. Point to Trust. Never oversell the EU layer.
        </HeroTitle>
        <div
          style={{
            marginTop: 48,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 20,
          }}
        >
          <Node label="BYOK" detail="Supported · not recommended · loses contractual control" width="100%" />
          <Node label="LLM gateway" detail="Not supported · breaks Cloud Agents" width="100%" accent={amber} />
          <Node
            label="Trust Center"
            detail="SOC 2 · subprocessors · policies · diagrams"
            width="100%"
            accent={green}
          />
        </div>
      </div>
    </BodyArea>
  </div>
);

/* ─── 18. Resources + closer ─── */
const Closer: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: dark,
      color: darkText,
      padding: 110,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: font,
      boxSizing: 'border-box',
    }}
  >
    <CursorLogo onDark />
    <div style={{ marginTop: 40 }}>
      <HeroTitle size={80}>Whiteboard it. Then send the primer.</HeroTitle>
    </div>
    <div
      style={{
        marginTop: 56,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 28,
        flex: 1,
        alignContent: 'start',
      }}
    >
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--osd-accent)', marginBottom: 20 }}>
          CUSTOMER-FACING
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 28, lineHeight: 1.4 }}>
          <div>trust.cursor.com</div>
          <div>cursor.com/security</div>
          <div>Enterprise Security Primer</div>
          <div>Cloud Agents Security Primer</div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.1em', color: darkMuted, marginBottom: 20 }}>
          INTERNAL
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 28, lineHeight: 1.4, color: '#C9C7C1' }}>
          <div>Enterprise Architecture & Security hub</div>
          <div>Cloud Agent deployment decision guide</div>
          <div>EU Regional Inference WIP — ask before quoting</div>
          <div>#proj-ent-arch-refresh</div>
        </div>
      </div>
    </div>
  </div>
);

export const meta: SlideMeta = {
  title: 'Cursor security enablement',
  theme: 'cursor-brand',
  createdAt: '2026-07-21T10:06:58.564Z',
};

export default [
  Cover,
  Agenda,
  ArchDivider,
  LocalTopology,
  ThreeEgress,
  IndexingLoop,
  PrivacyMode,
  AgentsDivider,
  CloudTopology,
  CloudStorage,
  HostedVsSelf,
  ControlsDivider,
  ControlsStack,
  SovDivider,
  ResidencyStack,
  EuScope,
  DecisionTree,
  Precision,
  Closer,
] satisfies Page[];
