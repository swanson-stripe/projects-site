/* ── ScrollView ──────────────────────────────────────────────────────────────
   Scrollable layout using the real Window component (draggable / resizable).
   Sections are pre-positioned so they don't overlap by default.
   Cross-drag from ecosystem icons to the terminal works identically to the
   desktop variant.
────────────────────────────────────────────────────────────────────────────── */

import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GridBackground } from '@/components/ui/grid-background';
import { Window } from '@/components/desktop/Window';
import { CliTerminal, type CliHandle } from '@/components/sections/CliTerminal';
import {
  PARTNERS,
  PartnerDetail,
  type Partner,
  type Category,
} from '@/components/sections/Partners';
import { FEATURES } from '@/components/sections/Features';
import { Footer } from '@/components/sections/Footer';

/* ── layout constants ────────────────────────────────────────────────────── */
const PAD      = 32;   // horizontal padding on both sides of content
const VGAP     = 80;   // vertical gap between sections
const MAX_W    = 1280; // max content width

/* ── window id type ──────────────────────────────────────────────────────── */
type SWinId = 'terminal' | 'ecosystem' | `feat:${number}` | 'purpose' | 'ace' | `partner:${string}`;

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

const CASCADE_H    = 320;
const CASCADE_DOWN = 28; // vertical offset per window

/* shared terminal dimensions — referenced by all layout helpers */
const TERM_Y = 48;
const TERM_H = 520;

function initialLayout(): SWinState[] {
  const vw       = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const maxW     = Math.min(vw, MAX_W);
  const left     = Math.max(PAD, (vw - maxW) / 2 + PAD);
  const contentW = maxW - PAD * 2;

  // terminal centered horizontally within the content area
  const termW    = Math.min(720, Math.floor(contentW * 0.62));
  const termX    = left + Math.floor((contentW - termW) / 2);
  const termY    = TERM_Y;
  const termH    = TERM_H;

  // below terminal: docs button + inline install (no window)
  const docsRowY   = termY + termH + 40;
  const inlineEstH = 44;

  const ecoY = docsRowY + inlineEstH + VGAP;
  const ecoH = 96;

  // 5 cascading windows: feat:0–feat:3 + purpose
  // Windows span the full content width: step = (contentW - winW) / (n-1)
  const cascadeIds: SWinId[] = ['feat:0', 'feat:1', 'feat:2', 'feat:3', 'purpose'];
  const CASCADE_W    = Math.floor(contentW * 0.44); // ~44% of content width each
  const CASCADE_STEP = Math.floor((contentW - CASCADE_W) / (cascadeIds.length - 1));
  const cascadeBaseY = ecoY + ecoH + VGAP;

  const cascadeWins: SWinState[] = cascadeIds.map((id, i) => ({
    id,
    x:      left + i * CASCADE_STEP,
    y:      cascadeBaseY + (cascadeIds.length - 1 - i) * CASCADE_DOWN,
    w:      CASCADE_W,
    h:      CASCADE_H,
    zIndex: cascadeIds.length - i, // leftmost = highest, rightmost = lowest
  }));

  return [
    { id: 'terminal',  x: termX, y: termY, w: termW,     h: termH, zIndex: 10 },
    { id: 'ecosystem', x: left,  y: ecoY,  w: contentW,  h: ecoH,  zIndex: 6  },
    ...cascadeWins,
  ];
}

/* row below terminal: install inline (left) + docs button (right), spanning terminal width */
function heroRowPos() {
  const vw    = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const maxW  = Math.min(vw, MAX_W);
  const left  = Math.max(PAD, (vw - maxW) / 2 + PAD);
  const cW    = maxW - PAD * 2;
  const termW = Math.min(720, Math.floor(cW * 0.62));
  const termX = left + Math.floor((cW - termW) / 2);
  return { termX, termW, y: TERM_Y + TERM_H + 40 };
}

/* position of the Ace desktop icon — centered behind the terminal window */
function aceIconPos() {
  const vw      = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const maxW    = Math.min(vw, MAX_W);
  const left    = Math.max(PAD, (vw - maxW) / 2 + PAD);
  const cW      = maxW - PAD * 2;
  const termW   = Math.min(720, Math.floor(cW * 0.62));
  const termX   = left + Math.floor((cW - termW) / 2);
  const termY   = 48;
  const termH   = 440;
  return {
    x: termX + Math.floor(termW  / 2) - 24,
    y: termY + Math.floor(termH  / 2) - 30,
  };
}

function canvasMinH(wins: SWinState[]) {
  // include auto-height windows with a minimum estimate so canvas scrolls far enough
  return wins.reduce((m, w) => Math.max(m, w.y + (w.h === 'auto' ? 280 : w.h)), 0) + 120;
}

/* ── EcosystemScrollStrip ────────────────────────────────────────────────── */
// Bare horizontal row of partner icons — no window wrapper.
// Single click selects (pink corner brackets), double click opens detail.
type EcoStripHandle = { resetIconPosition: (name: string) => void };

const ICON_SEL = 48; // highlight box size

const ECO_CORNER = 6;
const ECO_PINK   = 'var(--color-pink)';
const ECO_B      = `1px solid ${ECO_PINK}`;
const ECO_CORNERS: React.CSSProperties[] = [
  { top: 0,    left: 0,  borderTop: ECO_B,    borderLeft:  ECO_B },
  { top: 0,    right: 0, borderTop: ECO_B,    borderRight: ECO_B },
  { bottom: 0, right: 0, borderBottom: ECO_B, borderRight: ECO_B },
  { bottom: 0, left: 0,  borderBottom: ECO_B, borderLeft:  ECO_B },
];

const EcosystemScrollStrip = forwardRef<EcoStripHandle, {
  onCrossDragStart?: (p: Partner) => void;
  onCrossDragMove?:  (x: number, y: number) => void;
  onCrossDragEnd?:   (p: Partner, x: number, y: number) => void;
  onOpen?:           (p: Partner, iconOrigin?: { x: number; y: number }) => void;
  activeFilter?:     Category | null;
  selectedIcon?:     string | null;
  onSelectIcon?:     (name: string | null) => void;
}>(function EcosystemScrollStrip({ onCrossDragStart: _onCrossDragStart, onCrossDragMove, onCrossDragEnd, onOpen, activeFilter, selectedIcon: controlledSelected, onSelectIcon }, ref) {
  useImperativeHandle(ref, () => ({
    resetIconPosition: (name: string) =>
      setOffsets(prev => ({ ...prev, [name]: { dx: 0, dy: 0 } })),
  }));

  /* controlled selection — selectedIcon prop always wins */
  const selected = controlledSelected ?? null;

  /* per-icon drag offset (translate from flex position) */
  const [offsets, setOffsets]   = useState<Record<string, { dx: number; dy: number }>>({});
  const [dragging, setDragging] = useState<string | null>(null);

  const visible = activeFilter ? PARTNERS.filter(p => p.category === activeFilter) : PARTNERS;

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
    <div style={{
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'center',
      padding:        '16px 0',
      overflow:       'visible',
    }}>
      {visible.map(partner => {
        const isSel    = selected === partner.name;
        const isDrag   = dragging === partner.name;
        const offset   = offsets[partner.name] ?? { dx: 0, dy: 0 };
        return (
          <div
            key={partner.name}
            onPointerDown={e => startDrag(e, partner)}
            onClick={e => {
              e.stopPropagation();
              if (isDrag) return; // suppress click after drag
              onSelectIcon?.(isSel ? null : partner.name);
            }}
            onDoubleClick={e => {
              e.stopPropagation();
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
                style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                className={partner.lightInvert ? 'logo-on-light' : ''}
              >
                <partner.logo className='w-full h-full object-contain' />
              </div>
            </div>
            <span style={{
              fontSize:   '0.58rem',
              color:      isSel ? 'var(--color-text-ui)' : 'var(--color-text-ui-muted)',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              transition: 'color 0.1s',
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
      padding:       '1.25rem',
      display:       'flex',
      flexDirection: 'column',
      gap:           '0.65rem',
      background:    'var(--color-surface)',
      height:        '100%',
      overflowY:     'auto',
      scrollbarWidth:'none',
      boxSizing:     'border-box',
      fontFamily:    'var(--font-mono)',
    }}>
      <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-ui)', margin: 0, lineHeight: 1.35 }}>
        Infrastructure setup should be programmable, secure, and deterministic.
      </h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-ui-muted)', lineHeight: 1.65, margin: 0 }}>
        Developers and AI agents should be able to connect, pay, and provision real services, receive real credentials, and deploy applications through a single, secure, and deterministic development experience without navigating dashboards or copying keys across tabs.
      </p>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-ui-muted)', lineHeight: 1.65, margin: 0 }}>
        This creates a new layer in the development stack: a programmable infrastructure that weaves third-party services directly into where developers and agents already work.
      </p>
    </div>
  );
}

/* ── SingleFeatureContent ────────────────────────────────────────────────── */
function SingleFeatureContent({ feature }: { feature: typeof FEATURES[0] }) {
  return (
    <div style={{
      padding:       '1.25rem',
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
      <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-ui)', margin: 0, lineHeight: 1.35 }}>
        {feature.title}
      </h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-ui-muted)', lineHeight: 1.65, margin: 0 }}>
        {feature.description}
      </p>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {feature.bullets.map((b, bi) => (
          <li key={bi} style={{ display: 'flex', gap: '0.4rem', alignItems: 'baseline' }}>
            <span style={{ color: 'var(--color-pink)', flexShrink: 0, fontSize: '0.65rem' }}>›</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-ui-muted)', lineHeight: 1.55 }}>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── InstallInline ───────────────────────────────────────────────────────── */
type InstallTab = 'npm' | 'brew';
const INSTALL_CMDS: Record<InstallTab, string> = {
  npm:  'npx @stripe/projects init my-app',
  brew: 'brew install stripe-cli\nstripe projects init my-app',
};

function InstallInline() {
  const [tab, setTab]       = useState<InstallTab>('npm');
  const [copied, setCopied] = useState(false);

  const cmd = INSTALL_CMDS[tab];

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{
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
      {/* tab selector */}
      <div style={{ display: 'flex', gap: '1rem', flexShrink: 0, alignItems: 'center', padding: '0.4rem 0.85rem' }}>
        {(['npm', 'brew'] as InstallTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '0.3em',
              cursor:     'pointer',
              color:      t === tab ? 'var(--color-text-ui)' : 'var(--color-text-ui-muted)',
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: 'var(--color-pink)', opacity: t === tab ? 1 : 0 }}>›</span>
            {t === 'npm' ? 'npm' : 'Homebrew'}
          </button>
        ))}
      </div>

      {/* divider — full height via alignItems:stretch on parent */}
      <div style={{ width: 1, background: 'var(--color-border-accent)', flexShrink: 0 }} />

      {/* command — click to copy */}
      <button
        onClick={handleCopy}
        title='Click to copy'
        style={{
          flex:       1,
          padding:    '0.4rem 0.85rem',
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
          : cmd.split('\n').map((line, i) => <div key={i}>{line}</div>)
        }
      </button>
    </div>
  );
}


/* ── AceDesktopIcon ──────────────────────────────────────────────────────── */
const ACE_ICON_SEL = 48;
const ACE_CORNER   = 6;
const ACE_PINK     = 'var(--color-pink)';

const ACE_CORNERS: React.CSSProperties[] = [
  { top: 0,    left: 0,  borderTop:    `1px solid ${ACE_PINK}`, borderLeft:  `1px solid ${ACE_PINK}` },
  { top: 0,    right: 0, borderTop:    `1px solid ${ACE_PINK}`, borderRight: `1px solid ${ACE_PINK}` },
  { bottom: 0, right: 0, borderBottom: `1px solid ${ACE_PINK}`, borderRight: `1px solid ${ACE_PINK}` },
  { bottom: 0, left: 0,  borderBottom: `1px solid ${ACE_PINK}`, borderLeft:  `1px solid ${ACE_PINK}` },
];

function AceDesktopIcon({
  x, y, selected, onPointerDown, onSelect, onDoubleClick,
}: {
  x: number;
  y: number;
  selected: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onSelect: () => void;
  onDoubleClick: () => void;
}) {
  const didDrag = useRef(false);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    didDrag.current = false;
    const sx = e.clientX, sy = e.clientY;
    function onMove(ev: PointerEvent) {
      if (Math.sqrt((ev.clientX - sx) ** 2 + (ev.clientY - sy) ** 2) > 5) didDrag.current = true;
    }
    window.addEventListener('pointermove', onMove, { once: false });
    window.addEventListener('pointerup', () => window.removeEventListener('pointermove', onMove), { once: true });
    onPointerDown(e);
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (didDrag.current) return;
    onSelect();
  }

  function handleDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (didDrag.current) return;
    onDoubleClick();
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        position:      'absolute',
        left:           x,
        top:            y,
        zIndex:         4,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:            8,
        cursor:        'pointer',
        userSelect:    'none',
      }}
    >
      {/* highlight box with optional pink corner brackets */}
      <div style={{
        width:          ACE_ICON_SEL,
        height:         ACE_ICON_SEL,
        position:      'relative',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'center',
      }}>
        {selected && ACE_CORNERS.map((s, i) => (
          <span key={i} aria-hidden style={{
            position:      'absolute',
            width:          ACE_CORNER,
            height:         ACE_CORNER,
            pointerEvents: 'none',
            ...s,
          }} />
        ))}
        <img
          src='/ace.png'
          alt='Ace'
          draggable={false}
          style={{ width: 34, height: 34, imageRendering: 'pixelated', display: 'block', mixBlendMode: 'screen' }}
        />
      </div>
      <span style={{
        fontSize:   '0.58rem',
        color:      selected ? 'var(--color-text-ui)' : 'var(--color-text-ui-muted)',
        fontFamily: 'var(--font-mono)',
        whiteSpace: 'nowrap',
        transition: 'color 0.1s',
      }}>
        Ace
      </span>
    </div>
  );
}

/* ── ScrollView ──────────────────────────────────────────────────────────── */
export function ScrollView() {
  const [wins, setWins]         = useState<SWinState[]>(() => initialLayout());
  const [draggingPartner, setDraggingPartner] = useState<Partner | null>(null);
  const [ghostPos, setGhostPos]               = useState<{ x: number; y: number } | null>(null);
  const [ecoFilter]                           = useState<Category | null>(null);
  const [selectedIcon, setSelectedIcon]       = useState<string | null>(null);
  const [acePosState, setAcePosState]         = useState(aceIconPos);
  const canvasRef = useRef<HTMLDivElement>(null);
  const cliRef    = useRef<CliHandle>(null);
  const ecoRef    = useRef<EcoStripHandle>(null);

  const heroRow = heroRowPos();

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
      cliRef.current?.submit(`projects service add ${partner.name.toLowerCase()}`);
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
      const w = 380, h = 360;
      const x = Math.round(vw / 2 - w / 2);
      const y = Math.round(scrollTop + (vh / 2) - h / 2);
      return [...prev, { id, x: Math.max(16, x), y: Math.max(16, y), w, h, zIndex: maxZ + 1 }];
    });
  }, []);

  const closeWindow = useCallback((id: SWinId) => {
    setWins(prev => prev.filter(w => w.id !== id));
  }, []);

  /* ace icon drag — repositions the icon on the canvas */
  const startAceDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const sx = e.clientX, sy = e.clientY;
    const ox = acePosState.x, oy = acePosState.y;
    let dragged = false;

    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!dragged && Math.sqrt(dx * dx + dy * dy) < 5) return;
      dragged = true;
      setAcePosState({ x: ox + dx, y: oy + dy });
    }
    function onUp() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [acePosState]);

  const openAce = useCallback(() => {
    setWins(prev => {
      const existing = prev.find(w => w.id === 'ace');
      if (existing) {
        const maxZ = Math.max(...prev.map(w => w.zIndex));
        return prev.map(w => w.id === 'ace' ? { ...w, zIndex: maxZ + 1 } : w);
      }
      const maxZ = Math.max(...prev.map(w => w.zIndex));
      const vw   = typeof window !== 'undefined' ? window.innerWidth  : 1280;
      const vh   = typeof window !== 'undefined' ? window.innerHeight : 800;
      const scrollTop = canvasRef.current?.parentElement?.scrollTop ?? 0;
      const w = 320, h = 180;
      return [...prev, {
        id: 'ace' as SWinId,
        x: Math.round(vw / 2 - w / 2),
        y: Math.round(scrollTop + vh / 2 - h / 2),
        w,
        h,
        zIndex: maxZ + 1,
      }];
    });
  }, []);

  const maxZ     = Math.max(...wins.map(w => w.zIndex));
  const canvasH  = canvasMinH(wins);
  const isDragging = !!draggingPartner;

  const FEAT_SHORT = ['local → live', 'credentials', 'no lock-in', 'confidence'];

  function getTitle(id: SWinId): string {
    if (id === 'terminal')  return 'terminal';
    if (id === 'ecosystem') return 'ecosystem';
    if (id === 'purpose')   return 'purpose';
    if (id === 'ace')       return 'Ace';
    if (id.startsWith('feat:')) {
      const i = parseInt(id.slice(5));
      return FEAT_SHORT[i] ?? id;
    }
    if (id.startsWith('partner:')) return id.replace('partner:', '');
    return id;
  }

  return (
    <div style={{
      flex:          1,
      overflowY:     'auto',
      overflowX:     'hidden',
      scrollbarWidth:'none',
      background:    'var(--color-bg)',
      position:      'relative',
    }}>
      {/* grid background — fixed so it tiles the viewport while content scrolls */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <GridBackground />
      </div>

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
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            className={draggingPartner.lightInvert ? 'logo-on-light' : ''}
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
        style={{ position: 'relative', width: '100%', minHeight: canvasH, zIndex: 1 }}
      >
        {/* hero row — install inline (left, flex:1) + docs button (right) */}
        <div style={{
          position:   'absolute',
          left:        heroRow.termX,
          top:         heroRow.y,
          width:       heroRow.termW,
          display:    'flex',
          alignItems: 'stretch',
          gap:         INSTALL_GAP,
          zIndex:      2,
        }}>
          <InstallInline />
          <a
            href='https://stripe.com/docs'
            target='_blank'
            rel='noopener noreferrer'
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '0.4rem',
              fontFamily:     'var(--font-mono)',
              fontSize:       '0.75rem',
              color:          'var(--color-text-ui)',
              border:         '1px solid var(--color-border-accent)',
              background:     'var(--color-bg)',
              padding:        '0.4rem 0.85rem',
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

        {/* ace desktop icon — sits on the canvas behind the terminal window */}
        <AceDesktopIcon
          x={acePosState.x}
          y={acePosState.y}
          selected={selectedIcon === 'ace'}
          onPointerDown={startAceDrag}
          onSelect={() => setSelectedIcon(prev => prev === 'ace' ? null : 'ace')}
          onDoubleClick={() => { setSelectedIcon('ace'); openAce(); }}
        />

        {/* windows */}
        {wins.map(win => {
          const isActive    = win.zIndex === maxZ;
          const isTerminal  = win.id === 'terminal';
          const isEcosystem = win.id === 'ecosystem';
          const isFeat      = win.id.startsWith('feat:');
          const isPurpose   = win.id === 'purpose';
          const isPartner   = win.id.startsWith('partner:');
          const bg = isActive ? 'var(--color-bg)' : 'var(--color-surface-dark)';

          const partner = isPartner
            ? PARTNERS.find(p => `partner:${p.name}` === win.id) ?? null
            : null;

          /* ecosystem — bare icons on the canvas, no window chrome */
          if (isEcosystem) {
            return (
              <div
                key={win.id}
                style={{
                  position: 'absolute',
                  left:      win.x,
                  top:       win.y,
                  width:     win.w,
                  zIndex:    win.zIndex,
                }}
              >
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
              </div>
            );
          }

          const isAce = win.id === 'ace';

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
                  <CliTerminal ref={cliRef} installDemo autoSubmit dragService={draggingPartner?.name ?? null} />
                </div>
              );
            }
            if (isFeat) {
              const idx = parseInt(win.id.slice(5));
              return <SingleFeatureContent feature={FEATURES[idx]} />;
            }
            if (isPurpose)  return <PurposeContent />;
            if (isAce) {
              return (
                <div style={{
                  padding:    '1.5rem 2rem',
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height:     '100%',
                  boxSizing:  'border-box',
                }}>
                  <p style={{
                    margin:     0,
                    fontFamily: 'var(--font-mono)',
                    fontSize:   '0.875rem',
                    color:      'var(--color-text-ui)',
                    lineHeight: 1.7,
                    textAlign:  'center',
                  }}>
                    Ace was a good boy.
                  </p>
                </div>
              );
            }
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

          return (
            <Window
              key={win.id}
              title={getTitle(win.id)}
              x={win.x}
              y={win.y}
              w={win.w}
              h={win.h}
              zIndex={win.zIndex}
              isActive={isActive}
              background={bg}
              noScroll={isTerminal}
              onClose={(isPartner || isAce) ? () => closeWindow(win.id) : undefined}
              onFocus={() => bringToFront(win.id)}
              onMove={(x, y) => handleMove(win.id, x, y)}
              onResize={(x, y, w, h) => handleResize(win.id, x, y, w, h)}
            >
              {content}
            </Window>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}
