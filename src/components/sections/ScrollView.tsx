/* ── ScrollView ──────────────────────────────────────────────────────────────
   Scrollable layout using the real Window component (draggable / resizable).
   Sections are pre-positioned so they don't overlap by default.
   Cross-drag from ecosystem icons to the terminal works identically to the
   desktop variant.
────────────────────────────────────────────────────────────────────────────── */

import { useState, useCallback, useRef, forwardRef, useImperativeHandle, useLayoutEffect, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ArrowUpRight, LayoutGrid, Columns3 } from 'lucide-react';
import { GridBackground } from '@/components/ui/grid-background';
import { useTheme } from '@/components/ui/ThemeContext';
import { Window } from '@/components/desktop/Window';
import { JoinContent } from '@/components/desktop/Desktop';
import { CliTerminal, type CliHandle } from '@/components/sections/CliTerminal';
import {
  PARTNERS,
  ROTATING_MORE_PROVIDERS,
  PartnerDetail,
  shufflePartners,
  type Partner,
  type Category,
} from '@/components/sections/Partners';
import { FEATURES } from '@/components/sections/Features';
import { Footer } from '@/components/sections/Footer';
import { InstallModal } from '@/components/ui/InstallModal';

/* ── layout constants ────────────────────────────────────────────────────── */
const PAD      = 32;   // horizontal padding on both sides of content
const MAX_W    = 1280; // max content width

/* ── window id type ──────────────────────────────────────────────────────── */
type SWinId = 'terminal' | 'ecosystem' | `feat:${number}` | 'join' | 'purpose' | 'howitworks' | `partner:${string}`;

interface SWinState {
  id:     SWinId;
  x:      number;
  y:      number;
  w:      number;
  h:      number | 'auto';
  zIndex: number;
}

/* ── initial window layout ───────────────────────────────────────────────── */
const INSTALL_GAP = 20;  // gap between docs button and install inline

const CASCADE_DOWN          = 28;  // vertical offset per window in cascade mode
const FEAT_H                = 180; // desktop fixed height — title + description, no bullets

const MOBILE_CASCADE_ESTIMATE = 220; // initial y-spacing estimate; useLayoutEffect corrects before paint

/* shared terminal dimensions — referenced by all layout helpers */
const HEADLINE_H = 100; // headline text height + gap below it
const TERM_Y    = 40 + HEADLINE_H; // shifted down to leave room for headline above
const HW_TERM_Y  = 80;  // helm-wave two-col terminal top offset (double the original 40px)
const TERM_H        = 360;
const TERM_EXPAND   = Math.round(TERM_H * 0.3); // ~108 — added on first user submit
const SECTION_GAP = 40; // consistent vertical gap between all major sections
const ECO_STRIP_H     = 105; // actual rendered height of the bare eco icon strip (desktop)
const ECO_BTN_STRIP_H = 77;  // provider footer button strip: 40px gap + ~37px button row
const ECO_AFTER_BTN_GAP = 80; // gap from button strip to "what" windows

const MOBILE_PAD    = 16;
const MOBILE_BP     = 768;
const TWO_COL_GAP   = 120; // gap between left/right columns in helm-wave two-col hero

function initialLayout(isHelmWave = false): SWinState[] {
  const vw       = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const mobile   = vw < MOBILE_BP;
  const mPad     = mobile ? MOBILE_PAD : PAD;
  const maxW     = Math.min(vw, MAX_W);
  const left     = mobile ? mPad : Math.max(PAD, (vw - maxW) / 2 + PAD);
  const contentW = mobile ? vw - mPad * 2 : maxW - PAD * 2;

  // helm-wave desktop uses a two-column layout: left content, right terminal
  const usesTwoCol = !mobile && isHelmWave;

  // terminal: right half on two-col (50/50 split), centred 62% on regular desktop, full on mobile
  const halfW  = Math.floor((contentW - TWO_COL_GAP) / 2);
  const termW  = usesTwoCol
    ? halfW
    : mobile ? contentW : Math.min(720, Math.floor(contentW * 0.62));
  const termX  = usesTwoCol
    ? left + halfW + TWO_COL_GAP
    : mobile ? left : left + Math.floor((contentW - termW) / 2);
  const termY  = usesTwoCol ? HW_TERM_Y : TERM_Y;
  const termH  = TERM_H;

  // hero row height: 0 for two-col (headline lives in left column), 120 mobile, 44 desktop
  const heroH  = usesTwoCol ? 0 : (mobile ? 120 : 44);
  const heroGap = heroH > 0 ? SECTION_GAP : 0;

  // ecosystem: 4-col grid on mobile needs ~320px (incl. window title bar); single row on desktop ~96px
  // use extra gap for helm-wave two-col to give breathing room below the hero
  const heroEcoGap = usesTwoCol ? 80 : SECTION_GAP;
  const ecoY   = termY + termH + heroEcoGap + heroH + heroGap;
  const ecoH   = mobile ? 320 : 203;

  // purpose + howitworks appear first, then the four feat windows — all in a 2-column grid
  const cascadeIds: SWinId[] = ['purpose', 'howitworks', 'feat:0', 'feat:1', 'feat:2', 'feat:3'];
  const gridGap   = 40;
  // Desktop: actual eco strip height + button strip + gap to "what" windows
  // Mobile: no buttons rendered below eco window, use standard section gap
  const gridBaseY = mobile
    ? ecoY + ecoH + SECTION_GAP
    : ecoY + ECO_STRIP_H + ECO_BTN_STRIP_H + ECO_AFTER_BTN_GAP;

  // Width of a single "what" window (half the content area on desktop)
  const gridWinW = Math.floor((contentW - gridGap) / 2);

  // For helm-wave desktop: all windows auto-height, masonry layout via useLayoutEffect.
  // For other themes: info windows auto-height, feat windows fixed; useLayoutEffect equalizes row 0.
  const MASONRY_ESTIMATE = 220; // initial placeholder spacing; useLayoutEffect corrects before paint
  const ROW0_ESTIMATE = 300;    // estimate for non-masonry desktop; useLayoutEffect corrects
  function desktopRowY(row: number): number {
    if (row === 0) return gridBaseY;
    if (row === 1) return gridBaseY + ROW0_ESTIMATE + gridGap;
    return gridBaseY + ROW0_ESTIMATE + gridGap + FEAT_H + gridGap;
  }

  const isInfoWin = (id: SWinId) => id === 'purpose' || id === 'howitworks';

  const cascadeWins: SWinState[] = mobile
    // mobile: 1-column stack, auto-height (useLayoutEffect restacks before paint)
    ? cascadeIds.map((id, i) => ({
        id,
        x:      left,
        y:      gridBaseY + i * (MOBILE_CASCADE_ESTIMATE + gridGap),
        w:      contentW,
        h:      'auto' as const,
        zIndex: cascadeIds.length - i,
      }))
    : (isHelmWave
      // helm-wave desktop: masonry — all auto-height, stacked with placeholder spacing
      ? cascadeIds.map((id, i) => ({
          id,
          x:      left + (i % 2) * (gridWinW + gridGap),
          y:      gridBaseY + Math.floor(i / 2) * (MASONRY_ESTIMATE + gridGap),
          w:      gridWinW,
          h:      'auto' as const,
          zIndex: cascadeIds.length - i,
        }))
      // other themes: 2-column grid; info windows auto-height, feat windows fixed
      : cascadeIds.map((id, i) => ({
          id,
          x:      left + (i % 2) * (gridWinW + gridGap),
          y:      desktopRowY(Math.floor(i / 2)),
          w:      gridWinW,
          h:      isInfoWin(id) ? ('auto' as const) : FEAT_H,
          zIndex: cascadeIds.length - i,
        })));

  return [
    { id: 'terminal',  x: termX, y: termY, w: termW,    h: termH, zIndex: 10 },
    { id: 'ecosystem', x: left,  y: ecoY,  w: contentW, h: ecoH,  zIndex: 6  },
    ...cascadeWins,
  ];
}

/* position + dimensions of the hero row below the terminal */
function heroRowPos() {
  const vw     = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const mobile = vw < MOBILE_BP;
  const mPad   = mobile ? MOBILE_PAD : PAD;
  const maxW   = Math.min(vw, MAX_W);
  const left   = mobile ? mPad : Math.max(PAD, (vw - maxW) / 2 + PAD);
  const cW     = mobile ? vw - mPad * 2 : maxW - PAD * 2;
  const termW  = mobile ? cW : Math.min(720, Math.floor(cW * 0.62));
  const termX  = mobile ? left : left + Math.floor((cW - termW) / 2);
  return { termX, termW, y: TERM_Y + TERM_H + 40, mobile };
}

/* left-column position for the helm-wave two-column hero layout */
function helmWaveHeroLeft() {
  const vw       = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const maxW     = Math.min(vw, MAX_W);
  const left     = Math.max(PAD, (vw - maxW) / 2 + PAD);
  const contentW = maxW - PAD * 2;
  return { left, width: Math.floor((contentW - TWO_COL_GAP) / 2) };
}


function canvasMinH(wins: SWinState[]) {
  // include auto-height windows with a minimum estimate so canvas scrolls far enough
  return wins.reduce((m, w) => Math.max(m, w.y + (w.h === 'auto' ? 280 : w.h)), 0) + 80;
}

/* ── EcosystemScrollStrip ────────────────────────────────────────────────── */
// Bare horizontal row of partner icons — no window wrapper.
// Single click opens detail (and selects with pink corner brackets).
type EcoStripHandle = { resetIconPosition: (name: string) => void };

const ICON_SEL = 40; // highlight box size (matches HIGHLIGHT in Partners.tsx: ICON_BOX 24 + 16)

const ECO_CORNER = 6;
const ECO_PINK   = 'var(--color-pink)';
const ECO_B      = `1px solid ${ECO_PINK}`;
const ECO_CORNERS: React.CSSProperties[] = [
  { top: 0,    left: 0,  borderTop: ECO_B,    borderLeft:  ECO_B },
  { top: 0,    right: 0, borderTop: ECO_B,    borderRight: ECO_B },
  { bottom: 0, right: 0, borderBottom: ECO_B, borderRight: ECO_B },
  { bottom: 0, left: 0,  borderBottom: ECO_B, borderLeft:  ECO_B },
];

/* Small self-contained cell for the rotating "__more__" slot in the strip. */
function RotatingMoreCell({ isSel }: { isSel: boolean }) {
  const [idx,     setIdx]     = useState(0);
  const [opacity, setOpacity] = useState(1);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setOpacity(0);
      fadeRef.current = setTimeout(() => {
        setIdx(i => (i + 1) % ROTATING_MORE_PROVIDERS.length);
        setOpacity(1);
      }, 350);
    }, 5000);
    return () => { clearInterval(id); if (fadeRef.current) clearTimeout(fadeRef.current); };
  }, []);

  const { icon: Icon, name: currentName } = ROTATING_MORE_PROVIDERS[idx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <div style={{ width: ICON_SEL, height: ICON_SEL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isSel && ECO_CORNERS.map((s, i) => (
          <span key={i} aria-hidden style={{ position: 'absolute', width: ECO_CORNER, height: ECO_CORNER, pointerEvents: 'none', ...s }} />
        ))}
        <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', opacity, transition: 'opacity 0.35s ease' }}>
          <Icon className='w-full h-full' />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <span style={{
          fontSize:      '0.58rem',
          color:         isSel ? 'var(--color-text-ui)' : 'var(--color-text-secondary)',
          fontFamily:    'var(--font-mono)',
          whiteSpace:    'nowrap',
          transition:    'color 0.1s',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          opacity,
        }}>
          {currentName}
        </span>
        <span style={{
          fontSize:      '0.58rem',
          color:         isSel ? 'var(--color-text-ui)' : 'var(--color-text-secondary)',
          fontFamily:    'var(--font-mono)',
          whiteSpace:    'nowrap',
          transition:    'color 0.1s',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          More coming
        </span>
      </div>
    </div>
  );
}

const EcosystemScrollStrip = forwardRef<EcoStripHandle, {
  onCrossDragStart?: (p: Partner) => void;
  onCrossDragMove?:  (x: number, y: number) => void;
  onCrossDragEnd?:   (p: Partner, x: number, y: number) => void;
  onOpen?:           (p: Partner, iconOrigin?: { x: number; y: number }) => void;
  activeFilter?:     Category | null;
  selectedIcon?:     string | null;
  onSelectIcon?:     (name: string | null) => void;
}>(function EcosystemScrollStrip({ onCrossDragStart: _onCrossDragStart, onCrossDragMove: _onCrossDragMove, onCrossDragEnd, onOpen, activeFilter, selectedIcon: controlledSelected, onSelectIcon }, ref) {
  const isMobile = useIsMobile();

  useImperativeHandle(ref, () => ({
    resetIconPosition: (name: string) =>
      setOffsets(prev => ({ ...prev, [name]: { dx: 0, dy: 0 } })),
  }));

  /* controlled selection — selectedIcon prop always wins */
  const selected = controlledSelected ?? null;

  /* per-icon drag offset (translate from flex position) */
  const [offsets, setOffsets]   = useState<Record<string, { dx: number; dy: number }>>({});
  const [dragging, setDragging] = useState<string | null>(null);

  const [shuffled] = useState(() => shufflePartners(PARTNERS));
  const visible = activeFilter ? shuffled.filter(p => p.category === activeFilter) : shuffled;

  function startDrag(e: React.PointerEvent<HTMLDivElement>, partner: Partner) {
    if (e.button !== 0) return;
    /* NOTE: no e.preventDefault() — that suppresses click events in Chrome/Safari */
    e.stopPropagation();
    const sx = e.clientX, sy = e.clientY;
    const base = offsets[partner.name] ?? { dx: 0, dy: 0 };
    let started = false;

    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - sx + base.dx;
      const dy = ev.clientY - sy + base.dy;
      if (!started && Math.sqrt((ev.clientX - sx) ** 2 + (ev.clientY - sy) ** 2) < 4) return;
      if (!started) {
        started = true;
        setDragging(partner.name);
        _onCrossDragStart?.(partner);
      }
      setOffsets(prev => ({ ...prev, [partner.name]: { dx, dy } }));
    }
    function onUp(ev: PointerEvent) {
      if (started) {
        setDragging(null);
        onCrossDragEnd?.(partner, ev.clientX, ev.clientY);
      }
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
  }

  return (
    <div style={isMobile ? {
      display:             'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap:                  '8px',
      padding:             '16px',
      overflow:            'visible',
    } : {
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'flex-start',
      padding:        '16px 0',
      overflow:       'visible',
    }}>
      {visible.map(partner => {
        const isMore   = partner.name === '__more__';
        const isSel    = selected === partner.name;
        const isDrag   = dragging === partner.name;
        const offset   = offsets[partner.name] ?? { dx: 0, dy: 0 };

        if (isMore) {
          return (
            <div
              key='__more__'
              style={{
                flexShrink: 0,
                cursor:     'default',
                userSelect: 'none',
                position:   'relative',
              }}
            >
              <RotatingMoreCell isSel={isSel} />
            </div>
          );
        }

        return (
          <div
            key={partner.name}
            onPointerDown={e => startDrag(e, partner)}
            onClick={e => {
              e.stopPropagation();
              if (isDrag) return; // suppress click after drag
              onSelectIcon?.(partner.name);
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              onOpen?.(partner, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }}
            style={{
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              gap:            8,
              flexShrink:    0,
              cursor:        isDrag ? 'grabbing' : 'pointer',
              userSelect:    'none',
              transform:     `translate(${offset.dx}px, ${offset.dy}px)`,
              opacity:        isDrag ? 0.6 : 1,
              zIndex:         isDrag ? 10 : undefined,
              position:      'relative',
              transition:    isDrag ? 'none' : 'transform 0.2s ease, opacity 0.15s',
            }}
          >
            {/* highlight box — corner brackets when selected */}
            <div style={{
              width:          ICON_SEL,
              height:         ICON_SEL,
              position:      'relative',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
            }}>
              {isSel && ECO_CORNERS.map((s, i) => (
                <span key={i} aria-hidden style={{
                  position: 'absolute', width: ECO_CORNER, height: ECO_CORNER, pointerEvents: 'none', ...s,
                }} />
              ))}
              <div
                style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                className={[partner.lightInvert && 'logo-on-light', partner.darkWhite && 'logo-dark-white'].filter(Boolean).join(' ')}
              >
                <partner.logo className='w-full h-full object-contain' />
              </div>
            </div>
            <span style={{
              fontSize:      '0.58rem',
              color:         isSel ? 'var(--color-text-ui)' : 'var(--color-text-secondary)',
              fontFamily:    'var(--font-mono)',
              whiteSpace:    'nowrap',
              transition:    'color 0.1s',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {partner.name}
            </span>
          </div>
        );
      })}
    </div>
  );
});

/* ── PurposeContent ──────────────────────────────────────────────────────── */
function PurposeContent() {
  return (
    <div style={{
      padding:       '1.25rem 1.25rem 1.75rem',
      background:    'var(--color-surface)',
      height:        '100%',
      overflowY:     'auto',
      scrollbarWidth:'none',
      display:       'flex',
      flexDirection: 'column',
      gap:           '0.65rem',
      fontFamily:    'var(--font-mono)',
      boxSizing:     'border-box',
    }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-ui)', lineHeight: 1.65, margin: 0 }}>
        <strong style={{ fontWeight: 700 }}>Code generation got fast. Provisioning didn't.</strong>{' '}
        Being a software engineer has always meant a nagging second job—signing up for services, managing accounts, securing API keys, and clicking through dashboards. Stripe Projects replaces all those steps with programmatic commands, ready for developers and agents alike.
      </p>
    </div>
  );
}

/* ── HowItWorksContent ───────────────────────────────────────────────────── */
function HowItWorksContent() {
  return (
    <div style={{
      padding:       '1.25rem 1.25rem 1.75rem',
      background:    'var(--color-surface)',
      height:        '100%',
      overflowY:     'auto',
      scrollbarWidth:'none',
      display:       'flex',
      flexDirection: 'column',
      gap:           '0.65rem',
      fontFamily:    'var(--font-mono)',
      boxSizing:     'border-box',
    }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-ui)', lineHeight: 1.65, margin: 0 }}>
        <strong style={{ fontWeight: 700 }}>Declare the services your app needs, then run a single CLI command—or let an agent run it.</strong>{' '}
        Stripe Projects provisions resources in provider accounts you own and injects credentials into your secret store. Everything is configured, auditable, and ready to deploy.
      </p>
    </div>
  );
}

/* ── SingleFeatureContent ────────────────────────────────────────────────── */
function SingleFeatureContent({ feature }: { feature: typeof FEATURES[0] }) {
  return (
    <div style={{
      padding:       '1.25rem 1.25rem 1.75rem',
      background:    'var(--color-surface)',
      height:        '100%',
      overflowY:     'auto',
      scrollbarWidth:'none',
      display:       'flex',
      flexDirection: 'column',
      gap:           '0.65rem',
      fontFamily:    'var(--font-mono)',
      boxSizing:     'border-box',
    }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-ui)', lineHeight: 1.65, margin: 0 }}>
        <strong style={{ fontWeight: 700 }}>{feature.title}.</strong>{' '}
        {feature.description}
      </p>
    </div>
  );
}

/* ── InstallInline ───────────────────────────────────────────────────────── */
const BREW_CMD = 'brew install stripe/stripe-cli/stripe\nstripe plugin install projects';

function InstallInline() {
  const isMobile            = useIsMobile();
  const [copied, setCopied] = useState(false);
  const vPad = isMobile ? '0.8rem' : '0.4rem';

  const handleCopy = () => {
    navigator.clipboard.writeText(BREW_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className='install-command' style={{
      display:    'flex',
      alignItems: 'stretch',
      flex:        1,
      border:     '1px solid var(--color-border-accent)',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-mono)',
      fontSize:   '0.75rem',
      boxSizing:  'border-box',
      minWidth:    0,
    }}>
      {/* homebrew label */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: `${vPad} 0.85rem`, whiteSpace: 'nowrap' }}>
        <span style={{ color: 'var(--color-text-ui)' }}>Install</span>
      </div>

      {/* divider — full height via alignItems:stretch on parent */}
      <div style={{ width: 1, background: 'var(--color-border-accent)', flexShrink: 0 }} />

      {/* command — click to copy */}
      <button
        onClick={handleCopy}
        title='Click to copy'
        style={{
          flex:       1,
          padding:    `${vPad} 0.85rem`,
          color:      copied ? 'var(--color-pink)' : 'var(--color-text-ui)',
          cursor:     'pointer',
          textAlign:  'left',
          lineHeight: 1.55,
          transition: 'color 0.15s',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          overflow:   'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {copied
          ? 'Copied!'
          : BREW_CMD.split('\n').map((line, i) => <div key={i}>{line}</div>)
        }
      </button>

      {/* divider */}
      <div style={{ width: 1, background: 'var(--color-border-accent)', flexShrink: 0 }} />

      {/* more link */}
      <a
        href="https://docs.stripe.com/stripe-cli/install?install-method=homebrew#install"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display:    'inline-flex',
          alignItems: 'center',
          gap:        '0.2em',
          flexShrink:  0,
          padding:    `${vPad} 0.85rem`,
          color:      'var(--color-text-ui-muted)',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-ui)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-ui-muted)')}
      >
        See more <ArrowUpRight size={10} strokeWidth={1.5} />
      </a>
    </div>
  );
}



/* ── HWButton — helm-wave pill button with smooth gradient hover ─────────── */
type HWButtonProps = {
  href?: string;
  target?: string;
  rel?: string;
  as?: 'button';
  onClick?: () => void;
  isHelmWave: boolean;
  isInstall: boolean;
  small?: boolean;
  children: React.ReactNode;
};
function HWButton({ href, target, rel, as: Tag, onClick, isHelmWave, isInstall, small, children }: HWButtonProps) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = isHelmWave
    ? isInstall
      ? {
          position:       'relative',
          display:        'inline-flex',
          alignItems:     'center',
          gap:            '0.4rem',
          fontFamily:     'var(--font-sans)',
          fontSize:       small ? '0.78rem' : '0.875rem',
          color:          '#fff',
          border:         'none',
          background:     'linear-gradient(135deg, #8255DC 0%, #D75AA5 55%, #FAA564 100%)',
          padding:        small ? '0.5rem 1rem' : '0.5rem 1.1rem',
          textDecoration: 'none',
          letterSpacing:  '0.02em',
          flexShrink:     0,
          borderRadius:   '999px',
          cursor:         'pointer',
          overflow:       'hidden',
        }
      : {
          position:       'relative',
          display:        'inline-flex',
          alignItems:     'center',
          gap:            small ? '0.3em' : '0.4rem',
          fontFamily:     'var(--font-sans)',
          fontSize:       small ? '0.78rem' : '0.875rem',
          color:          hovered ? '#635BFF' : 'rgba(58,32,96,0.9)',
          border:         '1px solid rgba(255,255,255,0.7)',
          background:     'none',
          padding:        small ? '0.5rem 1rem' : '0.5rem 1.1rem',
          textDecoration: 'none',
          letterSpacing:  '0.02em',
          flexShrink:     0,
          borderRadius:   '999px',
          cursor:         'pointer',
          transition:     'color 0.2s ease, border-color 0.2s ease',
        }
    : {
        display:        'inline-flex',
        alignItems:     'center',
        gap:            '0.4rem',
        fontFamily:     'var(--font-mono)',
        fontSize:       small ? '0.72rem' : '0.75rem',
        color:          'var(--color-text-ui)',
        border:         '1px solid var(--color-border-accent)',
        background:     'var(--color-bg)',
        padding:        small ? '0.4rem 0.85rem' : '0.4rem 0.85rem',
        textDecoration: 'none',
        letterSpacing:  '0.04em',
        flexShrink:     0,
        cursor:         'pointer',
        transition:     'border-color 0.15s, color 0.15s',
      };

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  const inner = (
    <>
      {isHelmWave && isInstall && (
        <span style={{
          position:   'absolute',
          inset:       0,
          borderRadius: '999px',
          background:  'linear-gradient(135deg, #9B6FEE 0%, #E070BA 55%, #FBB87A 100%)',
          opacity:     hovered ? 1 : 0,
          transition:  'opacity 0.25s ease',
          pointerEvents: 'none',
        }} />
      )}
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 'inherit' }}>
        {children}
      </span>
    </>
  );

  if (Tag === 'button' || !href) {
    return (
      <button style={baseStyle} onClick={onClick} {...handlers}>
        {inner}
      </button>
    );
  }
  return (
    <a href={href} target={target} rel={rel} style={baseStyle} {...handlers}>
      {inner}
    </a>
  );
}

/* ── ScrollView ──────────────────────────────────────────────────────────── */
export function ScrollView() {
  const isMobile = useIsMobile();
  const { themeConfig } = useTheme();
  const isHelmWave = themeConfig.backgroundVariant === 'helm-wave';
  const [wins, setWins]         = useState<SWinState[]>(() => initialLayout(isHelmWave));
  const [draggingPartner, setDraggingPartner] = useState<Partner | null>(null);
  const [ghostPos, setGhostPos]               = useState<{ x: number; y: number } | null>(null);
  const [ecoFilter]                           = useState<Category | null>(null);
  const [selectedIcon, setSelectedIcon]       = useState<string | null>(null);
  const [isGridLayout, setIsGridLayout]       = useState(true);
  const [animateLayout, setAnimateLayout]     = useState(false);
  const [expansionDelta, setExpansionDelta]   = useState(0);
  // Bottom y-coord of the last cascade window on mobile (set by useLayoutEffect)
  const [mobileCascadeBottom, setMobileCascadeBottom] = useState(0);
  // Bottom y-coord of the masonry layout in helm-wave (set by useLayoutEffect)
  const [hwCanvasBottom, setHwCanvasBottom] = useState(0);
  // Incrementing this key remounts CliTerminal, resetting it to page-load state
  const [terminalKey]         = useState(0);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const canvasRef    = useRef<HTMLDivElement>(null);
  const cliRef       = useRef<CliHandle>(null);
  const ecoRef       = useRef<EcoStripHandle>(null);
  const scrollElRef  = useRef<HTMLDivElement>(null);
  // Lock canvas height to the initial layout so dragging/resizing windows never changes page height.
  const initialCanvasH = useRef(canvasMinH(initialLayout(isHelmWave)));

  // Refs to cascade window DOM elements — used to restack mobile auto-height windows
  const cascadeElsRef = useRef<Map<SWinId, HTMLDivElement>>(new Map());
  // Track last known heights to avoid redundant setWins calls
  const lastCascadeHRef = useRef<number[]>([]);

  const heroRow = heroRowPos();
  const hwLeft  = isHelmWave && !isMobile ? helmWaveHeroLeft() : null;

  /* bring focused window to front */
  const bringToFront = useCallback((id: SWinId) => {
    setWins(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex));
      if (prev.find(w => w.id === id)?.zIndex === maxZ) return prev;
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
    });
  }, []);

  const handleMove = useCallback((id: SWinId, x: number, y: number) =>
    setWins(prev => prev.map(w => w.id === id ? { ...w, x, y } : w)),
  []);

  const handleResize = useCallback((id: SWinId, x: number, y: number, w: number, h: number) =>
    setWins(prev => prev.map(win => win.id === id && win.h !== 'auto' ? { ...win, x, y, w, h } : win)),
  []);

  /* cross-drag drop check — same logic as Desktop.tsx, accounting for scroll */
  const handleCrossDragEnd = useCallback((partner: Partner, clientX: number, clientY: number) => {
    setDraggingPartner(null);
    setGhostPos(null);
    const term = wins.find(w => w.id === 'terminal');
    if (!term || !canvasRef.current) return;
    // canvasRef.getBoundingClientRect() already accounts for scroll offset
    const { top: canvasTop, left: canvasLeft } = canvasRef.current.getBoundingClientRect();
    const winLeft = canvasLeft + term.x;
    const winTop  = canvasTop  + term.y;
    if (
      clientX >= winLeft && clientX <= winLeft + term.w &&
      clientY >= winTop  && clientY <= winTop  + (typeof term.h === 'number' ? term.h : 0)
    ) {
      cliRef.current?.submit(`stripe projects services add ${partner.name.toLowerCase()}`);
      bringToFront('terminal');
      ecoRef.current?.resetIconPosition(partner.name);
    }
  }, [wins, bringToFront]);

  /* open a partner detail window (or bring existing to front) */
  const openPartner = useCallback((partner: Partner, _iconOrigin?: { x: number; y: number }) => {
    const id: SWinId = `partner:${partner.name}`;
    setWins(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        const maxZ = Math.max(...prev.map(w => w.zIndex));
        return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
      }
      const maxZ      = Math.max(...prev.map(w => w.zIndex));
      const vw        = typeof window !== 'undefined' ? window.innerWidth  : 1280;
      const vh        = typeof window !== 'undefined' ? window.innerHeight : 800;
      const scrollTop = canvasRef.current?.parentElement?.scrollTop ?? 0;
      const w = 380;
      const x = Math.round(vw / 2 - w / 2);
      const y = Math.round(scrollTop + (vh / 4));
      return [...prev, { id, x: Math.max(16, x), y: Math.max(16, y), w, h: 'auto' as const, zIndex: maxZ + 1 }];
    });
  }, []);

  const closeWindow = useCallback((id: SWinId) => {
    setWins(prev => prev.filter(w => w.id !== id));
  }, []);

  const openJoin = useCallback(() => {
    const id: SWinId = 'join';
    setWins(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        const maxZ = Math.max(...prev.map(w => w.zIndex));
        return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
      }
      const maxZ      = Math.max(...prev.map(w => w.zIndex));
      const vw        = typeof window !== 'undefined' ? window.innerWidth  : 1280;
      const vh        = typeof window !== 'undefined' ? window.innerHeight : 800;
      const scrollTop = canvasRef.current?.parentElement?.scrollTop ?? 0;
      const w = 420;
      return [...prev, {
        id,
        x: Math.round(vw / 2 - w / 2),
        y: Math.round(scrollTop + (vh / 4)),
        w,
        h: 'auto' as const,
        zIndex: maxZ + 1,
      }];
    });
  }, []);

  /* arrange all cascade windows in a 2-column grid */
  const gridCascade = useCallback(() => {
    const vw       = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const mobile   = vw < MOBILE_BP;
    const mPad     = mobile ? MOBILE_PAD : PAD;
    const maxW     = Math.min(vw, MAX_W);
    const left     = mobile ? mPad : Math.max(PAD, (vw - maxW) / 2 + PAD);
    const contentW = mobile ? vw - mPad * 2 : maxW - PAD * 2;
    const effTermY = (!mobile && isHelmWave) ? HW_TERM_Y : TERM_Y;
    const heroH    = (!mobile && isHelmWave) ? 0 : (mobile ? 120 : 44);
    const heroGap  = heroH > 0 ? SECTION_GAP : 0;
    const ecoH     = mobile ? 320 : 203;
    const heroEcoGap = (!mobile && isHelmWave) ? 80 : SECTION_GAP;
    const ecoOffset = mobile ? (ecoH + SECTION_GAP) : (ECO_STRIP_H + ECO_BTN_STRIP_H + ECO_AFTER_BTN_GAP);
    const baseY    = effTermY + TERM_H + heroEcoGap + heroH + heroGap + ecoOffset;
    const gap      = 40;
    const ids: SWinId[] = ['purpose', 'howitworks', 'feat:0', 'feat:1', 'feat:2', 'feat:3'];
    const winW     = mobile ? contentW : Math.floor((contentW - gap) / 2);

    if (!mobile && isHelmWave) {
      // Masonry: measure current heights from DOM, pack into 2 columns
      const els = cascadeElsRef.current;
      const colX = [left, left + winW + gap];
      const colY = [baseY, baseY];
      const updates: Array<{ id: SWinId; x: number; y: number; w: number; h: 'auto' }> = [];
      for (const id of ids) {
        const col = colY[0] <= colY[1] ? 0 : 1;
        const measuredH = els.get(id)?.offsetHeight ?? 220;
        updates.push({ id, x: colX[col], y: colY[col], w: winW, h: 'auto' });
        colY[col] += measuredH + gap;
      }
      setWins(prev => prev.map(w => {
        const upd = updates.find(u => u.id === w.id);
        if (!upd) return w;
        return { ...w, x: upd.x, y: upd.y, w: upd.w, h: upd.h };
      }));
    } else {
      const ROW0_EST = 300;
      function rowY(row: number) {
        if (mobile) return baseY + row * (FEAT_H + gap);
        if (row === 0) return baseY;
        if (row === 1) return baseY + ROW0_EST + gap;
        return baseY + ROW0_EST + gap + FEAT_H + gap;
      }
      function winH(id: SWinId): number | 'auto' {
        const isInfo = id === 'purpose' || id === 'howitworks';
        if (mobile) return FEAT_H;
        return isInfo ? 'auto' : FEAT_H;
      }
      setWins(prev => prev.map(w => {
        const idx = ids.indexOf(w.id as SWinId);
        if (idx === -1) return w;
        const col = mobile ? 0 : idx % 2;
        const row = Math.floor(idx / 2);
        return { ...w, x: left + col * (winW + gap), y: rowY(row), w: winW, h: winH(w.id) };
      }));
    }
    setIsGridLayout(true);
  }, [isHelmWave]);

  /* reset cascade windows back to the original staggered cascade */
  const cascadeReset = useCallback((activeId: SWinId) => {
    const vw       = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const mobile   = vw < MOBILE_BP;
    const mPad     = mobile ? MOBILE_PAD : PAD;
    const maxW     = Math.min(vw, MAX_W);
    const left     = mobile ? mPad : Math.max(PAD, (vw - maxW) / 2 + PAD);
    const contentW = mobile ? vw - mPad * 2 : maxW - PAD * 2;
    const effTermY = (!mobile && isHelmWave) ? HW_TERM_Y : TERM_Y;
    const heroH    = (!mobile && isHelmWave) ? 0 : (mobile ? 120 : 44);
    const heroGap  = heroH > 0 ? SECTION_GAP : 0;
    const ecoH     = mobile ? 320 : 203;
    const heroEcoGap = (!mobile && isHelmWave) ? 80 : SECTION_GAP;
    const ecoOffset = mobile ? (ecoH + SECTION_GAP) : (ECO_STRIP_H + ECO_BTN_STRIP_H + ECO_AFTER_BTN_GAP);
    const baseY    = effTermY + TERM_H + heroEcoGap + heroH + heroGap + ecoOffset;
    const ids: SWinId[] = ['purpose', 'howitworks', 'feat:0', 'feat:1', 'feat:2', 'feat:3'];
    const CASCADE_W    = Math.floor(contentW * 0.44);
    const CASCADE_STEP = Math.floor((contentW - CASCADE_W) / (ids.length - 1));
    setWins(prev => {
      const globalMaxZ = Math.max(...prev.map(w => w.zIndex));
      return prev.map(w => {
        const idx = ids.indexOf(w.id as SWinId);
        if (idx === -1) return w;
        const isInfo = w.id === 'purpose' || w.id === 'howitworks';
        const ch: number | 'auto' = (!mobile && (isHelmWave || isInfo)) ? 'auto' : FEAT_H;
        return {
          ...w,
          x: mobile ? left : left + idx * CASCADE_STEP,
          y: mobile ? baseY + idx * (FEAT_H + 16) : baseY + (ids.length - 1 - idx) * CASCADE_DOWN,
          w: mobile ? contentW : CASCADE_W,
          h: ch,
          zIndex: w.id === activeId ? globalMaxZ : ids.length - idx,
        };
      });
    });
    setIsGridLayout(false);
  }, [isHelmWave]);

  /* expand terminal ~30% on first user submit, sliding everything below it down */
  const termExpandedRef = useRef(false);
  const handleFirstTermSubmit = useCallback(() => {
    if (termExpandedRef.current) return;
    termExpandedRef.current = true;
    const delta = TERM_EXPAND;
    // Force a synchronous render so transition styles are in the DOM before
    // the position update — this ensures the browser animates the change.
    flushSync(() => setAnimateLayout(true));
    setWins(prev => prev.map(w => {
      if (w.id === 'terminal') return { ...w, h: (w.h as number) + delta };
      // Floating windows (partner detail) stay put; layout windows shift down.
      if (w.id.startsWith('partner:')) return w;
      return { ...w, y: w.y + delta };
    }));
    setExpansionDelta(delta);
    setTimeout(() => setAnimateLayout(false), 500);
  }, []);

  // Mobile: restack all 6 cascade windows to their actual rendered heights.
  // Desktop: equalize purpose + howitworks to the taller one, then reposition rows 1-2.
  // useLayoutEffect fires before the browser paints so the user never sees off estimates.
  useLayoutEffect(() => {
    const els = cascadeElsRef.current;

    if (isMobile) {
      const STACK_IDS: SWinId[] = ['purpose', 'howitworks', 'feat:0', 'feat:1', 'feat:2', 'feat:3'];
      if (!STACK_IDS.every(id => els.has(id))) return;

      const heights = STACK_IDS.map(id => els.get(id)!.offsetHeight);
      if (heights.some(h => h === 0)) return;

      const last = lastCascadeHRef.current;
      if (last.length === heights.length && heights.every((h, i) => h === last[i])) return;
      lastCascadeHRef.current = heights;

      const firstWin = wins.find(w => w.id === 'purpose');
      if (!firstWin) return;

      let curY = firstWin.y;
      let needsUpdate = false;
      const updates: Array<{ id: SWinId; y: number }> = [];

      for (let i = 0; i < STACK_IDS.length; i++) {
        const id  = STACK_IDS[i];
        const win = wins.find(w => w.id === id);
        if (!win) return;
        if (win.y !== curY) needsUpdate = true;
        updates.push({ id, y: curY });
        curY += heights[i] + 16;
      }

      setMobileCascadeBottom(prev => prev === curY ? prev : curY);

      if (!needsUpdate) return;
      setWins(prev => prev.map(w => {
        const upd = updates.find(u => u.id === w.id);
        if (!upd || w.y === upd.y) return w;
        return { ...w, y: upd.y };
      }));

    } else {
      const MASONRY_IDS: SWinId[] = ['purpose', 'howitworks', 'feat:0', 'feat:1', 'feat:2', 'feat:3'];

      if (isHelmWave) {
        // Masonry: measure all 6 windows, pack into 2 columns greedily (shortest column next)
        if (!MASONRY_IDS.every(id => els.has(id))) return;
        const heights = MASONRY_IDS.map(id => els.get(id)!.offsetHeight);
        if (heights.some(h => h === 0)) return;

        const last = lastCascadeHRef.current;
        if (last.length === heights.length && heights.every((h, i) => h === last[i])) return;
        lastCascadeHRef.current = heights;

        const purposeWin = wins.find(w => w.id === 'purpose');
        if (!purposeWin) return;
        const gridBaseY = purposeWin.y;
        const gap = 40;

        // Greedy shortest-column packer
        const vw       = typeof window !== 'undefined' ? window.innerWidth : 1280;
        const maxW     = Math.min(vw, MAX_W);
        const left     = Math.max(PAD, (vw - maxW) / 2 + PAD);
        const contentW = maxW - PAD * 2;
        const winW     = Math.floor((contentW - gap) / 2);
        const colX     = [left, left + winW + gap];
        const colY     = [gridBaseY, gridBaseY];

        const positions: Array<{ id: SWinId; x: number; y: number }> = [];
        for (let i = 0; i < MASONRY_IDS.length; i++) {
          const col = colY[0] <= colY[1] ? 0 : 1;
          positions.push({ id: MASONRY_IDS[i], x: colX[col], y: colY[col] });
          colY[col] += heights[i] + gap;
        }

        const masonryBottom = Math.max(colY[0], colY[1]);
        setHwCanvasBottom(prev => prev === masonryBottom ? prev : masonryBottom);

        setWins(prev => {
          let changed = false;
          const next = prev.map(w => {
            const pos = positions.find(p => p.id === w.id);
            if (!pos) return w;
            if (w.x === pos.x && w.y === pos.y) return w;
            changed = true;
            return { ...w, x: pos.x, y: pos.y };
          });
          return changed ? next : prev;
        });

      } else {
        // Non-masonry: equalize purpose + howitworks, then fix rows 1-2 y positions
        const INFO_IDS: SWinId[] = ['purpose', 'howitworks'];
        if (!INFO_IDS.every(id => els.has(id))) return;

        const [ph, hwh] = INFO_IDS.map(id => els.get(id)!.offsetHeight);
        if (!ph || !hwh) return;

        const last = lastCascadeHRef.current;
        if (last.length === 2 && last[0] === ph && last[1] === hwh) return;
        lastCascadeHRef.current = [ph, hwh];

        const equalH = Math.max(ph, hwh);
        const purposeWin = wins.find(w => w.id === 'purpose');
        if (!purposeWin) return;
        const gridBaseY = purposeWin.y;
        const gap = 40;
        const row1Y = gridBaseY + equalH + gap;
        const row2Y = row1Y + FEAT_H + gap;

        const targetY: Partial<Record<string, number>> = {
          purpose: gridBaseY, howitworks: gridBaseY,
          'feat:0': row1Y, 'feat:1': row1Y,
          'feat:2': row2Y, 'feat:3': row2Y,
        };

        setWins(prev => {
          let changed = false;
          const next = prev.map(w => {
            const newY = targetY[w.id];
            const isInfo = w.id === 'purpose' || w.id === 'howitworks';
            if (newY === undefined) return w;
            if (w.y === newY && (!isInfo || w.h === equalH)) return w;
            changed = true;
            return { ...w, y: newY, ...(isInfo ? { h: equalH } : {}) };
          });
          return changed ? next : prev;
        });
      }
    }
  }, [isMobile, wins]);

  const maxZ    = Math.max(...wins.map(w => w.zIndex));
  // On mobile, size the canvas to fit the cascade + CTA buttons; elsewhere use the wins-based estimate
  const canvasH = (isMobile && mobileCascadeBottom > 0)
    ? mobileCascadeBottom + 120  // room for the CTA button row + padding
    : initialCanvasH.current;
  const isDragging = !!draggingPartner;

  const FEAT_SHORT = ['local → live', 'credentials', 'no lock-in', 'confidence'];

  function getTitle(id: SWinId): string {
    if (id === 'terminal')   return 'terminal';
    if (id === 'ecosystem')  return 'ecosystem';
    if (id === 'join')       return 'suggest a provider';
    if (id === 'purpose')    return 'purpose';
    if (id === 'howitworks') return 'how it works';
    if (id.startsWith('feat:')) {
      const i = parseInt(id.slice(5));
      return FEAT_SHORT[i] ?? id;
    }
    if (id.startsWith('partner:')) return id.replace('partner:', '');
    return id;
  }

  return (
    <div ref={scrollElRef} style={{
      flex:          1,
      overflowY:     'auto',
      overflowX:     'hidden',
      scrollbarWidth:'none',
      background:    isHelmWave ? 'transparent' : 'var(--color-bg)',
      position:      'relative',
    }}>
      {showInstallModal && <InstallModal onClose={() => setShowInstallModal(false)} />}

      {/* background — fixed to viewport; helm-wave relies on Desktop's mesh */}
      {!isHelmWave && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <GridBackground scrollEl={scrollElRef} />
        </div>
      )}

      {/* drag ghost */}
      {draggingPartner && ghostPos && (
        <div
          aria-hidden
          style={{
            position:      'fixed',
            left:           ghostPos.x - 20,
            top:            ghostPos.y - 20,
            pointerEvents: 'none',
            zIndex:         9999,
            display:       'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            opacity:        0.85,
          }}
        >
          <div
            style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            className={[draggingPartner.lightInvert && 'logo-on-light', draggingPartner.darkWhite && 'logo-dark-white'].filter(Boolean).join(' ')}
          >
            <draggingPartner.logo className='w-full h-full object-contain' />
          </div>
          <span style={{
            fontSize:   '0.55rem', fontFamily: 'var(--font-mono)',
            color:      'var(--color-text-ui)',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}>
            {draggingPartner.name}
          </span>
        </div>
      )}

      {/* scrollable canvas — contains absolutely positioned windows */}
      <div
        ref={canvasRef}
        onClick={() => setSelectedIcon(null)}
        style={{ position: 'relative', width: '100%', minHeight: (isHelmWave && hwCanvasBottom > 0) ? hwCanvasBottom : canvasH, zIndex: 1 }}
      >
        {/* headline above terminal — hidden in helm-wave (moved to left column) */}
        {!isHelmWave && (
          <p style={{
            position:      'absolute',
            left:           heroRow.termX,
            top:            TERM_Y - HEADLINE_H,
            width:          heroRow.termW,
            margin:         0,
            fontFamily:    'var(--font-mono)',
            fontSize:      isMobile ? '1.3rem' : 'clamp(1.2rem, 2.5vw, 1.9rem)',
            fontWeight:     600,
            lineHeight:     1.3,
            color:         'var(--color-text-ui)',
            textAlign:     'center',
            userSelect:    'none',
            pointerEvents: 'none',
            zIndex:         2,
          }}>
            From idea to production.{isMobile ? ' ' : <br />}One command, real infrastructure.
          </p>
        )}

        {/* hero row — stacked on mobile, side-by-side on desktop; hidden in helm-wave */}
        {!isHelmWave && (
          <div style={{
            position:      'absolute',
            left:           heroRow.termX,
            top:            heroRow.y + expansionDelta,
            width:          heroRow.termW,
            display:       'flex',
            flexDirection:  isMobile ? 'column' : 'row',
            alignItems:     isMobile ? 'stretch' : 'stretch',
            transition:     animateLayout ? 'top 0.4s cubic-bezier(0.4,0,0.2,1)' : undefined,
            gap:             isMobile ? 20 : INSTALL_GAP,
            zIndex:          2,
          }}>
            <InstallInline />
            <a
              href='https://stripe.com/docs'
              target='_blank'
              rel='noopener noreferrer'
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                justifyContent: isMobile ? 'center' : undefined,
                gap:            '0.4rem',
                fontFamily:     'var(--font-mono)',
                fontSize:       '0.75rem',
                color:          'var(--color-text-ui)',
                border:         '1px solid var(--color-border-accent)',
                background:     'var(--color-bg)',
                padding:        isMobile ? '0.8rem 0.85rem' : '0.4rem 0.85rem',
                textDecoration: 'none',
                letterSpacing:  '0.04em',
                flexShrink:      0,
                transition:     'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-pink)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-pink)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-accent)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-ui)';
              }}
            >
              View docs
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
          </div>
        )}

        {/* helm-wave two-column hero: left column with headline, description, and actions */}
        {hwLeft && (
          <div style={{
            position:      'absolute',
            left:           hwLeft.left,
            top:            HW_TERM_Y,
            width:          hwLeft.width,
            display:       'flex',
            flexDirection: 'column',
            gap:           '1.75rem',
            zIndex:         2,
          }}>
            <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
              <p style={{
                margin:     0,
                fontFamily: 'var(--font-mono)',
                fontSize:   'clamp(1.35rem, 2.6vw, 2rem)',
                fontWeight:  500,
                lineHeight:  1.25,
                color:      '#6F769C',
              }}>
              Stripe Projects eliminates manual infrastructure setup and
              dashboard-hopping. One command provisions real services across
              providers, in accounts you own.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '40px' }}>
              <HWButton
                href="https://stripe.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                isHelmWave={isHelmWave}
                isInstall={false}
              >
                View docs
                <ArrowUpRight size={13} strokeWidth={1.5} />
              </HWButton>
              <HWButton
                as="button"
                onClick={() => setShowInstallModal(true)}
                isHelmWave={isHelmWave}
                isInstall={true}
              >
                Install projects
                <ArrowUpRight size={13} strokeWidth={1.5} />
              </HWButton>
            </div>
          </div>
        )}

        {/* windows */}
        {wins.map(win => {
          const isActive    = win.zIndex === maxZ;
          const isTerminal  = win.id === 'terminal';
          const isEcosystem = win.id === 'ecosystem';
          const isFeat      = win.id.startsWith('feat:');
          const isPartner   = win.id.startsWith('partner:');
          const bg = isActive ? 'var(--color-bg)' : 'var(--color-surface-dark)';

          const partner = isPartner
            ? PARTNERS.find(p => `partner:${p.name}` === win.id) ?? null
            : null;

          /* ecosystem — windowed on mobile, bare icons on desktop */
          if (isEcosystem) {
            const ecoStrip = (
              <EcosystemScrollStrip
                ref={ecoRef}
                onCrossDragStart={p => setDraggingPartner(p)}
                onCrossDragMove={(x, y) => setGhostPos({ x, y })}
                onCrossDragEnd={handleCrossDragEnd}
                onOpen={openPartner}
                activeFilter={ecoFilter}
                selectedIcon={selectedIcon}
                onSelectIcon={setSelectedIcon}
              />
            );
            if (isMobile) {
              return (
                <Window
                  key={win.id}
                  title="services"
                  x={win.x}
                  y={win.y}
                  w={win.w}
                  h={win.h}
                  zIndex={win.zIndex}
                  isActive={isActive}
                  background={bg}
                  animateLayout={animateLayout}
                  onFocus={() => bringToFront(win.id)}
                  onMove={(x, y) => handleMove(win.id, x, y)}
                  onResize={(x, y, w, h) => handleResize(win.id, x, y, w, h)}
                >
                  <div style={{ background: 'var(--color-surface)', height: '100%' }}>
                    {ecoStrip}
                  </div>
                </Window>
              );
            }
            return (
              <div
                key={win.id}
                style={{
                  position:   'absolute',
                  left:        win.x,
                  top:         win.y,
                  width:       win.w,
                  zIndex:      win.zIndex,
                  transition:  animateLayout ? 'top 0.4s cubic-bezier(0.4,0,0.2,1)' : undefined,
                }}
              >
                {ecoStrip}
                {/* provider footer strip */}
                <div style={{
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  gap:            '12px',
                  marginTop:      '40px',
                  fontFamily:     'var(--font-mono)',
                  fontSize:       '0.72rem',
                  letterSpacing:  '0.02em',
                }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {[
                      { href: 'mailto:provider-request@stripe.com?subject=Provider%20Partnership', label: 'Become a provider' },
                      { href: 'mailto:provider-request@stripe.com?subject=Provider%20Suggestion',  label: 'Suggest a provider', suggest: true },
                    ].map(({ href, label, suggest }) => {
                      return suggest ? (
                        <HWButton
                          key={label}
                          as='button'
                          onClick={openJoin}
                          isHelmWave={isHelmWave}
                          isInstall={false}
                        >
                          {label} <ArrowUpRight size={10} strokeWidth={1.5} />
                        </HWButton>
                      ) : (
                        <HWButton
                          key={label}
                          href={href}
                          isHelmWave={isHelmWave}
                          isInstall={false}
                        >
                          {label} <ArrowUpRight size={10} strokeWidth={1.5} />
                        </HWButton>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          const isJoin = win.id === 'join';

          const content = (() => {
            if (isTerminal) {
              return (
                <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {isDragging && (
                    <div aria-hidden style={{
                      position:     'absolute', inset: 0, zIndex: 10,
                      background:   'var(--color-pink)', opacity: 0.1, pointerEvents: 'none',
                    }} />
                  )}
                  <CliTerminal key={terminalKey} ref={cliRef} installDemo autoSubmit dragService={draggingPartner?.name ?? null} onFirstSubmit={handleFirstTermSubmit} />
                </div>
              );
            }
            if (isFeat) {
              const idx = parseInt(win.id.slice(5));
              return <SingleFeatureContent feature={FEATURES[idx]} />;
            }
            if (win.id === 'purpose')    return <PurposeContent />;
            if (win.id === 'howitworks') return <HowItWorksContent />;
            if (isJoin) return <JoinContent />;
            if (partner) {
              return (
                <PartnerDetail
                  partner={partner}
                  onShowMe={cmd => { cliRef.current?.submit(cmd); bringToFront('terminal'); }}
                />
              );
            }
            return null;
          })();

          const isCascade = isFeat || win.id === 'purpose' || win.id === 'howitworks';
          const isInfoWin = win.id === 'purpose' || win.id === 'howitworks';

          // On mobile or helm-wave desktop, track all cascade windows for masonry/restack.
          // On other desktop themes, track only the auto-height info windows.
          const trackThisWindow = isMobile ? isCascade : (isHelmWave ? isCascade : isInfoWin);
          const cascadeRef = trackThisWindow
            ? (el: HTMLDivElement | null) => {
                if (el) cascadeElsRef.current.set(win.id as SWinId, el);
                else    cascadeElsRef.current.delete(win.id as SWinId);
              }
            : undefined;

          return (
            <Window
              ref={cascadeRef}
              key={win.id}
              title={isHelmWave && isCascade ? '' : getTitle(win.id)}
              x={win.x}
              y={win.y}
              w={win.w}
              h={win.h}
              zIndex={win.zIndex}
              isActive={isActive}
              background={bg}
              noScroll={isTerminal}
              animateLayout={animateLayout}
              onClose={(isPartner || isJoin) ? () => closeWindow(win.id) : undefined}
              onFocus={() => bringToFront(win.id)}
              onMove={(x, y) => handleMove(win.id, x, y)}
              onResize={(x, y, w, h) => handleResize(win.id, x, y, w, h)}
              headerRight={isCascade && isActive && !isMobile && !isHelmWave ? (
                <button
                  onClick={e => { e.stopPropagation(); isGridLayout ? cascadeReset(win.id) : gridCascade(); }}
                  title={isGridLayout ? 'Reset cascade' : 'Arrange in grid'}
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    background: 'none',
                    border:     'none',
                    padding:     0,
                    cursor:     'pointer',
                    color:      'var(--color-text-ui)',
                    opacity:     0.7,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
                >
                  {isGridLayout
                    ? <Columns3 size={10} strokeWidth={1.5} />
                    : <LayoutGrid size={10} strokeWidth={1.5} />
                  }
                </button>
              ) : undefined}
            >
              {content}
            </Window>
          );
        })}

        {/* Mobile CTA row — shown below the cascade "what" windows */}
        {isMobile && mobileCascadeBottom > 0 && (() => {
          const btnStyle: React.CSSProperties = isHelmWave
            ? {
                display:        'inline-flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '0.4rem',
                fontFamily:     'var(--font-mono)',
                fontSize:       '0.75rem',
                padding:        '0.8rem 0.85rem',
                letterSpacing:  '0.04em',
                textDecoration: 'none',
                cursor:         'pointer',
                flex:            1,
                transition:     'opacity 0.15s',
                color:           '#3a2060',
                background:      'rgba(255,255,255,0.92)',
                border:          'none',
                borderRadius:    '999px',
              }
            : {
                display:        'inline-flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '0.4rem',
                fontFamily:     'var(--font-mono)',
                fontSize:       '0.75rem',
                color:          'var(--color-text-ui)',
                border:         '1px solid var(--color-border-accent)',
                background:     'var(--color-bg)',
                padding:        '0.8rem 0.85rem',
                letterSpacing:  '0.04em',
                textDecoration: 'none',
                cursor:         'pointer',
                flex:            1,
                transition:     'border-color 0.15s, color 0.15s',
              };
          const hoverOn  = (e: React.MouseEvent<HTMLElement>) => {
            if (isHelmWave) {
              (e.currentTarget as HTMLElement).style.opacity = '0.85';
            } else {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-pink)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-pink)';
            }
          };
          const hoverOff = (e: React.MouseEvent<HTMLElement>) => {
            if (isHelmWave) {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            } else {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-accent)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-ui)';
            }
          };

          // left/width match the mobile cascade windows
          const vw       = typeof window !== 'undefined' ? window.innerWidth : 390;
          const btnLeft  = MOBILE_PAD;
          const btnWidth = vw - MOBILE_PAD * 2;

          return (
            <div style={{
              position: 'absolute',
              left:      btnLeft,
              top:       mobileCascadeBottom + 16,
              width:     btnWidth,
              display:   'flex',
              gap:        8,
              zIndex:     1,
            }}>
              <button
                style={btnStyle}
                onClick={() => scrollElRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                ↑ back to top
              </button>
              <a
                href='https://stripe.com/docs'
                target='_blank'
                rel='noopener noreferrer'
                style={btnStyle}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}
              >
                View docs
                <ArrowUpRight size={14} strokeWidth={2} />
              </a>
            </div>
          );
        })()}
      </div>

      <Footer isHelmWave={isHelmWave} />
    </div>
  );
}
