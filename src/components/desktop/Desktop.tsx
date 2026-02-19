import { useState, useCallback, useRef, forwardRef, type CSSProperties } from 'react';
import { Shuffle } from 'lucide-react';
import { Window } from './Window';
import { GridBackground } from '@/components/ui/grid-background';
import { StatusBar, type ViewMode } from '@/components/sections/TerminalBanner';
import { CliTerminal, type CliHandle } from '@/components/sections/CliTerminal';
import { InstallWindow } from '@/components/sections/Hero';
import { FeaturesContent } from '@/components/sections/Features';
import { AgentView } from '@/components/sections/AgentView';
import {
  EcosystemIcons,
  PartnerDetail,
  PARTNERS,
  type Partner,
  type EcosystemHandle,
} from '@/components/sections/Partners';

/* ── constants ────────────────────────────────────────────────────── */
const STATUSBAR_H = 40;

/* ── types ────────────────────────────────────────────────────────── */
type CoreId = 'terminal' | 'install' | 'why' | 'ecosystem' | 'treasure' | 'users';
type WinId  = CoreId | `partner:${string}`;

const CORE_IDS: CoreId[] = ['terminal', 'install', 'why', 'ecosystem'];

interface WinState {
  id:       WinId;
  x:        number;
  y:        number;
  w:        number;
  h:        number;
  zIndex:   number;
}

/* ── window metadata helpers ──────────────────────────────────────── */
function getTitle(id: WinId): string {
  if (id === 'terminal')  return 'terminal';
  if (id === 'install')   return 'install.sh';
  if (id === 'why')       return 'what.md';
  if (id === 'ecosystem') return 'ecosystem.json';
  if (id === 'treasure')  return 'treasure';
  if (id === 'users')     return 'users.log';
  return id.slice('partner:'.length).toLowerCase() + '.json';
}

function isNoScroll(id: WinId): boolean {
  return id === 'terminal' || id === 'ecosystem';
}

/* ── initial staggered layout ─────────────────────────────────────── */
// 4 cols × 80px + 3×GAP(40) + 2×PAD(40) = 320+120+80 = 520px wide
// 3 rows × (48+16+14)=78px + 2×GAP(40) + 2×PAD(40) = 234+80+80 = 394px tall
const ECO_W = 520;
const ECO_H = 394;

function initialWindows(): WinState[] {
  const vw    = typeof window !== 'undefined' ? window.innerWidth  : 1440;
  const vh    = typeof window !== 'undefined' ? window.innerHeight : 900;
  const areaH = vh - STATUSBAR_H;

  const ww = Math.floor(vw    * 0.55);
  const wh = Math.floor(areaH * 0.55);

  // install width ~50% of base, height fixed to just contain its content
  const iw   = Math.floor(ww * 0.5);
  const ih   = 200; // titlebar(31) + tabs(34) + sep(1) + cmd(90) + copy(36) + breathing room

  const m = 20; // edge margin

  // Install sits in the top-right, starting where the terminal ends + a gap
  const installX = Math.max(ww + 40, vw - iw - m);

  return [
    // terminal  — top-left
    { id: 'terminal',  x: m,         y: m,  w: ww, h: wh, zIndex: 4 },
    // install   — top-right, guaranteed right of terminal
    { id: 'install',   x: installX,  y: m,  w: iw, h: ih, zIndex: 3 },
    // what.md   — bottom-left
    { id: 'why',       x: m + 20,         y: areaH - wh - m,   w: ww,    h: wh,    zIndex: 2 },
    // ecosystem — bottom-right
    { id: 'ecosystem', x: vw - ECO_W - m, y: areaH - ECO_H - m, w: ECO_W, h: ECO_H, zIndex: 1 },
  ];
}

/* ── desktop icon definitions ─────────────────────────────────────── */
const CORE_ICON_DEFS: { id: CoreId; src: string; label: string }[] = [
  { id: 'terminal',  src: '/terminal.png', label: 'terminal'  },
  { id: 'install',   src: '/install.png',  label: 'install'   },
  { id: 'ecosystem', src: '/maps.png',     label: 'ecosystem' },
  { id: 'why',       src: '/docs.png',     label: 'what.md'   },
  { id: 'users',     src: '/users.png',    label: 'users'     },
];

/* ── Desktop ──────────────────────────────────────────────────────── */
export function Desktop() {
  const [wins, setWins]               = useState<WinState[]>(initialWindows);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [viewMode, setViewMode]       = useState<ViewMode>('ui');
  const [closedCore, setClosedCore]   = useState<Set<CoreId>>(new Set());
  const [maximizedId, setMaximizedId] = useState<WinId | null>(null);
  const ecoRef                        = useRef<EcosystemHandle>(null);
  const cliRef                        = useRef<CliHandle>(null);
  const windowAreaRef                 = useRef<HTMLDivElement>(null);
  const [draggingPartner, setDraggingPartner] = useState<Partner | null>(null);
  const [ghostPos,        setGhostPos]        = useState<{ x: number; y: number } | null>(null);

  /* bring clicked window to front */
  const bringToFront = useCallback((id: WinId) => {
    setWins(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex));
      if (prev.find(w => w.id === id)?.zIndex === maxZ) return prev;
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
    });
  }, []);

  /* drag */
  const handleMove = useCallback((id: WinId, x: number, y: number) => {
    setWins(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  /* resize */
  const handleResize = useCallback((id: WinId, x: number, y: number, ww: number, h: number) => {
    setWins(prev => prev.map(w => w.id === id ? { ...w, x, y, w: ww, h } : w));
  }, []);

  /* close — CORE_IDS windows hide (preserve pos); treasure/users/partner windows are removed */
  const handleClose = useCallback((id: WinId) => {
    if (CORE_IDS.includes(id as CoreId)) {
      setClosedCore(prev => new Set([...prev, id as CoreId]));
      if (maximizedId === id) setMaximizedId(null);
    } else {
      setWins(prev => prev.filter(w => w.id !== id));
      if (maximizedId === id) setMaximizedId(null);
    }
  }, [maximizedId]);

  /* minimize — reset window to default position */
  const handleMinimize = useCallback((id: WinId) => {
    if (maximizedId === id) setMaximizedId(null);
    const defaults = initialWindows();
    const def = defaults.find(w => w.id === id);
    if (def) {
      setWins(prev => prev.map(w => w.id === id ? { ...w, x: def.x, y: def.y, w: def.w, h: def.h } : w));
    }
  }, [maximizedId]);

  /* maximize — toggle fill-desktop state */
  const handleMaximize = useCallback((id: WinId) => {
    if (maximizedId === id) {
      setMaximizedId(null);
    } else {
      setMaximizedId(id);
      bringToFront(id);
    }
  }, [maximizedId, bringToFront]);

  /* open (or bring to front) the treasure window */
  const openTreasure = useCallback(() => {
    setWins(prev => {
      const existing = prev.find(w => w.id === 'treasure');
      if (existing) {
        const maxZ = Math.max(...prev.map(w => w.zIndex));
        if (existing.zIndex === maxZ) return prev;
        return prev.map(w => w.id === 'treasure' ? { ...w, zIndex: maxZ + 1 } : w);
      }
      const maxZ = Math.max(...prev.map(w => w.zIndex));
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;
      return [...prev, {
        id:     'treasure' as const,
        x:      Math.round(vw / 2 - 200),
        y:      Math.round(vh / 2 - 150),
        w:      420,
        h:      560,
        zIndex: maxZ + 1,
      }];
    });
  }, []);

  /* open a core window (show if hidden, create if not yet in wins, or bring to front) */
  const openCoreWindow = useCallback((id: CoreId) => {
    if (closedCore.has(id)) {
      setClosedCore(prev => { const n = new Set(prev); n.delete(id); return n; });
      bringToFront(id);
      return;
    }
    setWins(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        const maxZ = Math.max(...prev.map(w => w.zIndex));
        return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
      }
      // first open — create centered
      const maxZ = Math.max(...prev.map(w => w.zIndex));
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return [...prev, {
        id,
        x: Math.round(vw / 2 - 220),
        y: Math.round(vh / 2 - 200),
        w: 440,
        h: 520,
        zIndex: maxZ + 1,
      }];
    });
  }, [closedCore, bringToFront]);

  /* cross-window drag: icon released — check if over CLI window */
  const handleCrossDragEnd = useCallback((partner: Partner, clientX: number, clientY: number) => {
    setDraggingPartner(null);
    setGhostPos(null);
    const cli     = wins.find(w => w.id === 'terminal');
    const areaTop = windowAreaRef.current?.getBoundingClientRect().top ?? STATUSBAR_H;
    if (
      cli &&
      clientX >= cli.x && clientX <= cli.x + cli.w &&
      clientY >= areaTop + cli.y && clientY <= areaTop + cli.y + cli.h
    ) {
      cliRef.current?.submit(`projects service add ${partner.name.toLowerCase()}`);
      bringToFront('terminal');
      ecoRef.current?.resetIconPosition(partner.name);
    }
  }, [wins, bringToFront]);

  /* open a partner detail window — or bring to front if already open */
  const openPartner = useCallback((partner: Partner) => {
    const id: WinId = `partner:${partner.name}`;
    setWins(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        const maxZ = Math.max(...prev.map(w => w.zIndex));
        return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
      }
      const maxZ = Math.max(...prev.map(w => w.zIndex));
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;
      return [...prev, {
        id,
        x: Math.round(vw / 2 - 190 + (prev.length - 4) * 24),
        y: Math.round(vh / 2 - 180 + (prev.length - 4) * 24),
        w: 380,
        h: 360,
        zIndex: maxZ + 1,
      }];
    });
  }, []);

  /* desktop dimensions for maximized windows */
  const vw = typeof window !== 'undefined' ? window.innerWidth  : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  return (
    <div
      style={{
        width:      '100vw',
        height:     '100vh',
        overflow:   'hidden',
        position:   'relative',
        background: 'var(--color-surface-dark)',
        display:    'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Full-viewport grid — behind everything ────────────────── */}
      <GridBackground />

      {/* ── Drag ghost — follows cursor when dragging an icon cross-window */}
      {draggingPartner && ghostPos && (
        <div
          aria-hidden
          style={{
            position:       'fixed',
            left:            ghostPos.x - 20,
            top:             ghostPos.y - 20,
            pointerEvents:  'none',
            zIndex:          9999,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:             6,
            opacity:         0.85,
          }}
        >
          <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
               className={draggingPartner.lightInvert ? 'logo-on-light' : ''}>
            <draggingPartner.logo className='w-full h-full object-contain' />
          </div>
          <span style={{
            fontSize:   '0.55rem',
            fontFamily: 'var(--font-mono)',
            color:      'var(--color-text-ui)',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          }}>
            {draggingPartner.name}
          </span>
        </div>
      )}

      {/* ── Global status bar — always on top ─────────────────────── */}
      <StatusBar
        onReset={() => { setWins(initialWindows()); setClosedCore(new Set()); setMaximizedId(null); }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* ── Agent view — replaces window area when active ─────────── */}
      {viewMode === 'agent' && <AgentView />}

      {/* ── Window area — fills remaining height ──────────────────── */}
      <div
        ref={windowAreaRef}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', display: viewMode === 'agent' ? 'none' : undefined }}
        onClick={() => setSelectedIcon(null)}
      >
        {/* ── Treasure desktop icon ─────────────────────────────── */}
        <DesktopIcon
          label="treasure"
          src="/treasure-closed.png"
          openSrc="/treasure-open.png"
          isOpen={wins.some(w => w.id === 'treasure')}
          isSelected={selectedIcon === 'treasure'}
          onSelect={() => setSelectedIcon('treasure')}
          onOpen={openTreasure}
          style={{ bottom: 24, left: 24 }}
        />

        {/* ── Core window desktop icons — tiled vertically top-right */}
        {CORE_ICON_DEFS.map((def, i) => {
          const isOpen = def.id === 'users'
            ? wins.some(w => w.id === 'users')
            : !closedCore.has(def.id);
          return (
            <DesktopIcon
              key={def.id}
              label={def.label}
              src={def.src}
              isOpen={isOpen}
              isSelected={selectedIcon === def.id}
              onSelect={e => { e.stopPropagation(); setSelectedIcon(def.id); }}
              onOpen={() => openCoreWindow(def.id)}
              style={{ top: 24 + i * 96, right: 24 }}
            />
          );
        })}

        {wins
          .filter(win => !closedCore.has(win.id as CoreId))
          .map(win => {
            const partnerName = win.id.startsWith('partner:') ? win.id.slice('partner:'.length) : null;
            const partner     = partnerName ? PARTNERS.find(p => p.name === partnerName) : null;
            const maxZ        = Math.max(...wins.map(w => w.zIndex));

            const isCloseable  = !!partnerName || win.id === 'treasure' || win.id === 'users';
            const isEcosystem  = win.id === 'ecosystem';
            const isActive     = win.zIndex === maxZ;
            const isMaximized  = maximizedId === win.id;
            const darkBg       = isActive ? 'var(--color-bg)' : 'var(--color-surface-dark)';

            // Override position/size when maximized
            const finalX = isMaximized ? 0 : win.x;
            const finalY = isMaximized ? 0 : win.y;
            const finalW = isMaximized ? vw : win.w;
            const finalH = isMaximized ? vh - STATUSBAR_H : win.h;

            return (
              <Window
                key={win.id}
                title={getTitle(win.id)}
                noScroll={isNoScroll(win.id)}
                isActive={isActive}
                isMaximized={isMaximized}
                x={finalX}
                y={finalY}
                w={finalW}
                h={finalH}
                zIndex={win.zIndex}
                background={darkBg}
                onClose={() => handleClose(win.id)}
                onMinimize={() => handleMinimize(win.id)}
                onMaximize={() => handleMaximize(win.id)}
                headerRight={isEcosystem ? (
                  <button
                    aria-label='Shuffle icons'
                    onClick={e => { e.stopPropagation(); ecoRef.current?.shuffle(); }}
                    style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--color-text-ui-muted)' }}
                  >
                    <Shuffle size={10} strokeWidth={1.5} />
                  </button>
                ) : undefined}
                onFocus={() => bringToFront(win.id)}
                onMove={(x, y) => handleMove(win.id, x, y)}
                onResize={(x, y, w, h) => handleResize(win.id, x, y, w, h)}
              >
                {win.id === 'terminal'  && (
                  <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {draggingPartner && (
                      <div aria-hidden style={{
                        position:     'absolute',
                        inset:         0,
                        zIndex:        10,
                        background:   'var(--color-pink)',
                        opacity:       0.1,
                        pointerEvents:'none',
                      }} />
                    )}
                    <TerminalContent ref={cliRef} />
                  </div>
                )}
                {win.id === 'install'   && <InstallWindow />}
                {win.id === 'why'       && <FeaturesContent />}
                {win.id === 'ecosystem' && (
                  <EcosystemIcons
                    ref={ecoRef}
                    onOpen={openPartner}
                    onCrossDragStart={p => setDraggingPartner(p)}
                    onCrossDragMove={(x, y) => setGhostPos({ x, y })}
                    onCrossDragEnd={handleCrossDragEnd}
                  />
                )}
                {win.id === 'treasure'  && <TreasureContent />}
                {win.id === 'users'     && <UsersContent />}
                {partner && (
                  <PartnerDetail
                    partner={partner}
                    onShowMe={cmd => { cliRef.current?.submit(cmd); bringToFront('terminal'); }}
                  />
                )}
              </Window>
            );
          })}
      </div>
    </div>
  );
}

/* ── Treasure window content ──────────────────────────────────────── */
function TreasureContent() {
  return (
    <div style={{
      padding:       '1.75rem 1.5rem',
      fontFamily:    'var(--font-mono)',
      display:       'flex',
      flexDirection: 'column',
      gap:           '1.25rem',
      overflowY:     'auto',
    }}>
      {/* icon */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src='/contest.png'
          alt='contest'
          draggable={false}
          style={{ width: 64, height: 64, imageRendering: 'pixelated' }}
        />
      </div>

      {/* heading */}
      <h2 style={{
        margin:      0,
        fontSize:    '0.9rem',
        fontWeight:  700,
        color:       'var(--color-text-ui)',
        lineHeight:  1.35,
        textAlign:   'center',
      }}>
        Enter to win a mac mini +{' '}
        <span style={{ color: 'var(--color-pink)' }}>openclaw</span>
        {' '}+ stripe projects credits
      </h2>

      {/* divider */}
      <div style={{ height: 1, background: 'var(--color-border-accent)' }} />

      {/* subheading */}
      <p style={{
        margin:       0,
        fontSize:     '0.62rem',
        textTransform:'uppercase',
        letterSpacing:'0.12em',
        color:        'var(--color-text-ui-subtle)',
      }}>
        How to enter
      </p>

      {/* steps */}
      <ol style={{
        margin:     0,
        padding:    0,
        listStyle:  'none',
        display:    'flex',
        flexDirection: 'column',
        gap:        '0.6rem',
      }}>
        {[
          'install stripe projects',
          'run stripe projects init',
          'submit the slash command /contest',
        ].map((step, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{
              flexShrink: 0,
              fontSize:   '0.65rem',
              color:      'var(--color-pink)',
              minWidth:   '1ch',
            }}>
              {i + 1}.
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-ui)', lineHeight: 1.5 }}>
              {step}
            </span>
          </li>
        ))}
      </ol>

      {/* divider */}
      <div style={{ height: 1, background: 'var(--color-border-accent)' }} />

      {/* body */}
      <p style={{
        margin:     0,
        fontSize:   '0.72rem',
        color:      'var(--color-text-ui-muted)',
        lineHeight: 1.7,
      }}>
        That's it. The email associated with your Stripe account will be entered into the contest.
      </p>
      <p style={{
        margin:     0,
        fontSize:   '0.72rem',
        color:      'var(--color-text-ui-subtle)',
        lineHeight: 1.7,
        fontStyle:  'italic',
      }}>
        10 total winners will be randomly chosen.
      </p>
    </div>
  );
}

/* ── Users / testimonials window content ─────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "Stripe Projects completely changed how I spin up new services. What used to take a full day of config is now a single command.",
    name:  "Priya Nambiar",
    role:  "Staff Engineer, Vercel",
  },
  {
    quote: "The ecosystem integrations are killer. I dropped in Supabase and Redis in under two minutes. The CLI just works.",
    name:  "Marcus Weil",
    role:  "Founding Engineer, Loom",
  },
  {
    quote: "Finally a developer tool that doesn't make me feel like I'm fighting it. The terminal window alone is worth the install.",
    name:  "Anya Solberg",
    role:  "Senior SWE, Linear",
  },
  {
    quote: "We standardized our entire team on Stripe Projects. Onboarding a new service went from a two-day ordeal to about fifteen minutes.",
    name:  "Daniel Osei",
    role:  "Platform Lead, Retool",
  },
  {
    quote: "Honestly surprised this is free. The DX is better than tools I've paid thousands for.",
    name:  "Camille Tran",
    role:  "CTO, Meridian Labs",
  },
  {
    quote: "The `projects service add` command is pure magic. My whole infra is version-controlled and reproducible now.",
    name:  "Soren Holt",
    role:  "DevOps Engineer, Shopify",
  },
];

function UsersContent() {
  return (
    <div style={{
      padding:       '1.25rem 1.25rem 1.5rem',
      fontFamily:    'var(--font-mono)',
      display:       'flex',
      flexDirection: 'column',
      gap:           '0.75rem',
      overflowY:     'auto',
      scrollbarWidth:'none',
    }}>
      <p style={{
        margin:        0,
        fontSize:      '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color:         'var(--color-text-ui-subtle)',
        paddingBottom: '0.25rem',
        borderBottom:  '1px solid var(--color-border-accent)',
      }}>
        {TESTIMONIALS.length} entries
      </p>

      {TESTIMONIALS.map((t, i) => (
        <div
          key={i}
          style={{
            padding:      '0.85rem 1rem',
            background:   'var(--color-surface-2)',
            border:       '1px solid var(--color-border-accent)',
            display:      'flex',
            flexDirection:'column',
            gap:          '0.6rem',
          }}
        >
          <p style={{
            margin:     0,
            fontSize:   '0.75rem',
            color:      'var(--color-text-ui)',
            lineHeight: 1.65,
            fontStyle:  'italic',
          }}>
            "{t.quote}"
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{
              fontSize:   '0.65rem',
              fontWeight: 700,
              color:      'var(--color-pink)',
            }}>
              {t.name}
            </span>
            <span style={{
              fontSize:   '0.6rem',
              color:      'var(--color-text-ui-subtle)',
            }}>
              — {t.role}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Terminal window content: just the CLI ────────────────────────── */
const TerminalContent = forwardRef<CliHandle>(function TerminalContent(_, ref) {
  return <CliTerminal ref={ref} />;
});

/* ── DesktopIcon ──────────────────────────────────────────────────── */
interface DesktopIconProps {
  label:      string;
  src:        string;
  openSrc?:   string;
  isOpen:     boolean;
  isSelected: boolean;
  onSelect:   (e: React.MouseEvent) => void;
  onOpen:     () => void;
  style?:     CSSProperties;
}

function DesktopIcon({ label, src, openSrc, isOpen, isSelected, onSelect, onOpen, style }: DesktopIconProps) {
  const C = 6;
  const S = 'var(--color-pink)';
  const b = `1px solid ${S}`;
  const corners: CSSProperties[] = [
    { top: 0,    left: 0,  borderTop:    b, borderLeft:  b },
    { top: 0,    right: 0, borderTop:    b, borderRight: b },
    { bottom: 0, right: 0, borderBottom: b, borderRight: b },
    { bottom: 0, left: 0,  borderBottom: b, borderLeft:  b },
  ];

  const imgSrc = (openSrc && isOpen) ? openSrc : src;

  return (
    <div
      onClick={e => { e.stopPropagation(); onSelect(e); }}
      onDoubleClick={e => { e.stopPropagation(); onOpen(); }}
      style={{
        position:      'absolute',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        cursor:        'default',
        userSelect:    'none',
        ...style,
      }}
    >
      {/* image wrapper — corner brackets anchor here */}
      <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isSelected && corners.map((s, i) => (
          <span key={i} aria-hidden style={{ position: 'absolute', width: C, height: C, pointerEvents: 'none', ...s }} />
        ))}
        <img
          src={imgSrc}
          alt={label}
          draggable={false}
          style={{ width: 48, height: 48, imageRendering: 'pixelated' }}
        />
      </div>

      <span
        style={{
          marginTop:     8,
          fontSize:      '0.6rem',
          fontFamily:    'var(--font-mono)',
          color:         isSelected ? 'var(--color-text-ui)' : 'var(--color-text-ui-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          transition:    'color 0.1s',
        }}
      >
        {label}
      </span>
    </div>
  );
}
