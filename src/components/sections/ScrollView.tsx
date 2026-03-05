/* ── ScrollView ──────────────────────────────────────────────────────────────
   Scrollable layout using the real Window component (draggable / resizable).
   Sections are pre-positioned so they don't overlap by default.
   Cross-drag from ecosystem icons to the terminal works identically to the
   desktop variant.
────────────────────────────────────────────────────────────────────────────── */

import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { GridBackground } from '@/components/ui/grid-background';
import { Window } from '@/components/desktop/Window';
import { CliTerminal, type CliHandle } from '@/components/sections/CliTerminal';
import {
  PARTNERS,
  PartnerDetail,
  EcoFilterButton,
  type Partner,
  type Category,
} from '@/components/sections/Partners';
import { FEATURES } from '@/components/sections/Features';

/* ── layout constants ────────────────────────────────────────────────────── */
const PAD      = 32;   // horizontal padding on both sides of content
const HGAP     = 28;   // horizontal gap between hero text and terminal
const VGAP     = 80;   // vertical gap between sections
const MAX_W    = 1200; // max content width

/* ── window id type ──────────────────────────────────────────────────────── */
type SWinId = 'terminal' | 'ecosystem' | 'features' | `partner:${string}`;

interface SWinState {
  id:     SWinId;
  x:      number;
  y:      number;
  w:      number;
  h:      number | 'auto';
  zIndex: number;
}

/* ── initial window layout ───────────────────────────────────────────────── */
function initialLayout(): SWinState[] {
  const vw       = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const maxW     = Math.min(vw, MAX_W);
  const left     = Math.max(PAD, (vw - maxW) / 2 + PAD);
  const contentW = maxW - PAD * 2;

  const heroTextW = Math.max(220, Math.floor(contentW * 0.40));
  const termX     = left + heroTextW + HGAP;
  const termW     = contentW - heroTextW - HGAP;
  const termY     = 48;
  const termH     = 440;

  const ecoY      = termY + termH + VGAP;
  const ecoH      = 148; // title bar ~27 + 24 pad top/bottom + icons ~53 + 12px scrollbar track

  const featY     = ecoY + ecoH + VGAP;

  return [
    { id: 'terminal',  x: termX, y: termY, w: termW,    h: termH, zIndex: 3 },
    { id: 'ecosystem', x: left,  y: ecoY,  w: contentW, h: ecoH,  zIndex: 2 },
    { id: 'features',  x: left,  y: featY, w: contentW, h: 'auto', zIndex: 1 },
  ];
}

function heroTextPos() {
  const vw   = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const maxW = Math.min(vw, MAX_W);
  const left = Math.max(PAD, (vw - maxW) / 2 + PAD);
  const cW   = maxW - PAD * 2;
  return { x: left, y: 48, w: Math.max(220, Math.floor(cW * 0.40)), h: 440 };
}

function canvasMinH(wins: SWinState[]) {
  return wins.reduce((m, w) => w.h === 'auto' ? m : Math.max(m, w.y + w.h), 0) + 80;
}

/* ── EcosystemScrollStrip ────────────────────────────────────────────────── */
// Single horizontal scrollable row of partner logos with cross-drag + double-click support.
type EcoStripHandle = { resetIconPosition: (name: string) => void };

const EcosystemScrollStrip = forwardRef<EcoStripHandle, {
  onCrossDragStart?: (p: Partner) => void;
  onCrossDragMove?:  (x: number, y: number) => void;
  onCrossDragEnd?:   (p: Partner, x: number, y: number) => void;
  onOpen?:           (p: Partner, iconOrigin?: { x: number; y: number }) => void;
  activeFilter?:     Category | null;
}>(function EcosystemScrollStrip({ onCrossDragStart, onCrossDragMove, onCrossDragEnd, onOpen, activeFilter }, ref) {
  // resetIconPosition is a no-op here — icons live in flex flow, no absolute tracking
  useImperativeHandle(ref, () => ({ resetIconPosition: () => {} }));

  const visible = activeFilter ? PARTNERS.filter(p => p.category === activeFilter) : PARTNERS;

  function startCrossDrag(e: React.PointerEvent<HTMLDivElement>, partner: Partner) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const sx = e.clientX, sy = e.clientY;
    let started = false;

    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!started && Math.sqrt(dx * dx + dy * dy) < 5) return;
      if (!started) { started = true; onCrossDragStart?.(partner); }
      onCrossDragMove?.(ev.clientX, ev.clientY);
    }
    function onUp(ev: PointerEvent) {
      if (started) onCrossDragEnd?.(partner, ev.clientX, ev.clientY);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
  }

  return (
    <div style={{
      display:         'flex',
      overflowX:       'auto',
      scrollbarWidth:  'thin',
      scrollbarColor:  'var(--color-border-accent) transparent',
      padding:         '24px 32px',
      justifyContent:  'space-between',
      height:          '100%',
      boxSizing:       'border-box',
      alignItems:      'center',
      background:      'var(--color-bg)',
    }}>
      {visible.map(partner => (
        <div
          key={partner.name}
          onPointerDown={e => startCrossDrag(e, partner)}
          onDoubleClick={e => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            onOpen?.(partner, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
          }}
          style={{
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:            7,
            flexShrink:    0,
            cursor:        'pointer',
            userSelect:    'none',
          }}
        >
          <div
            style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            className={partner.lightInvert ? 'logo-on-light' : ''}
          >
            <partner.logo className='w-full h-full object-contain' />
          </div>
          <span style={{
            fontSize:   '0.58rem',
            color:      'var(--color-text-ui-muted)',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
          }}>
            {partner.name}
          </span>
        </div>
      ))}
    </div>
  );
});

/* ── FeaturesGrid ────────────────────────────────────────────────────────── */
const BORDER = '1px solid var(--color-border-accent)';

function FeaturesGrid({ cols }: { cols: 1 | 2 }) {
  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: cols === 2 ? '1fr 1fr' : '1fr',
      overflowY:           'auto',
      scrollbarWidth:      'none',
    }}>
      {FEATURES.map((f, i) => {
        const isLastRow  = cols === 2 ? i >= FEATURES.length - 2 : i === FEATURES.length - 1;
        const isRightCol = cols === 2 && i % 2 === 1;
        return (
          <div key={f.title} style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '0.5rem',
            padding:       '1.25rem',
            borderBottom:  isLastRow  ? undefined : BORDER,
            borderRight:   isRightCol ? undefined : (cols === 2 ? BORDER : undefined),
            background:    'var(--color-surface)',
          }}>
            <h3 style={{
              fontSize:   '0.82rem', fontWeight: 700,
              color:      'var(--color-text-ui)',
              margin:      0, fontFamily: 'var(--font-mono)',
              lineHeight:  1.3,
            }}>
              {f.title}
            </h3>
            <p style={{
              fontSize:   '0.78rem', color: 'var(--color-text-ui-muted)',
              lineHeight:  1.6, margin: 0, fontFamily: 'var(--font-mono)',
            }}>
              {f.description}
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {f.bullets.map((b, bi) => (
                <li key={bi} style={{ display: 'flex', gap: '0.4rem', alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--color-pink)', flexShrink: 0, fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>›</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-ui-muted)', lineHeight: 1.55, fontFamily: 'var(--font-mono)' }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ── ScrollView ──────────────────────────────────────────────────────────── */
export function ScrollView() {
  const isMobile = useIsMobile();
  const [wins, setWins]     = useState<SWinState[]>(() => initialLayout());
  const [draggingPartner, setDraggingPartner] = useState<Partner | null>(null);
  const [ghostPos, setGhostPos]               = useState<{ x: number; y: number } | null>(null);
  const [ecoFilter, setEcoFilter]             = useState<Category | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const cliRef    = useRef<CliHandle>(null);
  const ecoRef    = useRef<EcoStripHandle>(null);

  const heroText = heroTextPos();

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
      clientY >= winTop  && clientY <= winTop  + term.h
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

  const maxZ     = Math.max(...wins.map(w => w.zIndex));
  const canvasH  = canvasMinH(wins);
  const isDragging = !!draggingPartner;

  function getTitle(id: SWinId): string {
    if (id === 'terminal')  return 'terminal';
    if (id === 'ecosystem') return 'ecosystem.json';
    if (id === 'features')  return 'what.md';
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
        style={{ position: 'relative', width: '100%', minHeight: canvasH, zIndex: 1 }}
      >
        {/* hero headline — not a window, positioned left of terminal */}
        <div style={{
          position:       'absolute',
          left:            heroText.x,
          top:             heroText.y,
          width:           heroText.w,
          height:          heroText.h,
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          gap:            '1.25rem',
          paddingRight:    16,
          pointerEvents:  'none',
        }}>
          <h1 style={{
            fontSize:   isMobile ? '1.75rem' : 'clamp(1.6rem, 2.2vw, 2.25rem)',
            fontWeight:  700,
            color:      'var(--color-text-ui)',
            lineHeight:  1.15,
            fontFamily: 'var(--font-mono)',
            margin:      0,
          }}>
            From idea to production.<br />
            One command.<br />
            Real infrastructure.
          </h1>
          <p style={{
            fontSize:   '0.875rem',
            color:      'var(--color-text-ui-muted)',
            fontFamily: 'var(--font-mono)',
            margin:      0,
            lineHeight:  1.65,
          }}>
            Stripe Projects eliminates manual infrastructure setup and dashboard-hopping. Developers and AI agents can connect, pay, and provision hosting, databases, AI, auth, messaging and more, directly in their own cloud accounts — securely, deterministically, and without lock-in.
          </p>
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
              padding:        '0.4rem 0.85rem',
              textDecoration: 'none',
              letterSpacing:  '0.04em',
              pointerEvents:  'auto',
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

        {/* windows */}
        {wins.map(win => {
          const isActive    = win.zIndex === maxZ;
          const isTerminal  = win.id === 'terminal';
          const isEcosystem = win.id === 'ecosystem';
          const isFeatures  = win.id === 'features';
          const isPartner   = win.id.startsWith('partner:');
          const bg = isActive ? 'var(--color-bg)' : 'var(--color-surface-dark)';

          const partner = isPartner
            ? PARTNERS.find(p => `partner:${p.name}` === win.id) ?? null
            : null;

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
                  <CliTerminal ref={cliRef} installDemo />
                </div>
              );
            }
            if (isEcosystem) {
              return (
                <EcosystemScrollStrip
                  ref={ecoRef}
                  onCrossDragStart={p => setDraggingPartner(p)}
                  onCrossDragMove={(x, y) => setGhostPos({ x, y })}
                  onCrossDragEnd={handleCrossDragEnd}
                  onOpen={openPartner}
                  activeFilter={ecoFilter}
                />
              );
            }
            if (isFeatures) return <FeaturesGrid cols={isMobile ? 1 : 2} />;
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
              onClose={isPartner ? () => closeWindow(win.id) : undefined}
              onFocus={() => bringToFront(win.id)}
              onMove={(x, y) => handleMove(win.id, x, y)}
              onResize={(x, y, w, h) => handleResize(win.id, x, y, w, h)}
              headerRight={isEcosystem ? (
                <EcoFilterButton activeFilter={ecoFilter} onFilter={setEcoFilter} />
              ) : undefined}
            >
              {content}
            </Window>
          );
        })}
      </div>
    </div>
  );
}
