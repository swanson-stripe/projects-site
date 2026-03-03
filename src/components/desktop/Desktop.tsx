import { useState, useCallback, useRef, forwardRef, type CSSProperties } from 'react';
import { AnimatePresence } from 'motion/react';
import { Shuffle } from 'lucide-react';
import { Window } from './Window';
import { GridBackground } from '@/components/ui/grid-background';
import { StatusBar, type ViewMode } from '@/components/sections/TerminalBanner';
import { CliTerminal, type CliHandle } from '@/components/sections/CliTerminal';
import { InstallWindow } from '@/components/sections/Hero';
import { FeaturesContent, type FeaturesHandle } from '@/components/sections/Features';
import { AgentView } from '@/components/sections/AgentView';
import {
  EcosystemIcons,
  PartnerDetail,
  PARTNERS,
  ECO_CONTENT_W,
  ECO_CONTENT_H,
  type Partner,
  type EcosystemHandle,
} from '@/components/sections/Partners';
import { useIsMobile } from '@/hooks/useIsMobile';

/* ── constants ────────────────────────────────────────────────────── */
const STATUSBAR_H        = 40;
const MOBILE_STATUSBAR_H = 52;
const MOBILE_MARGIN      = 12;
const MOBILE_GAP         = 12;
const MOBILE_ICON_CELL_W = 84;
const MOBILE_ICON_CELL_H = 96;

/* ── types ────────────────────────────────────────────────────────── */
type CoreId = 'terminal' | 'install' | 'why' | 'ecosystem' | 'treasure' | 'users' | 'feedback' | 'join';
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
  if (id === 'feedback')  return 'feedback';
  if (id === 'join')      return 'join.md';
  return id.slice('partner:'.length).toLowerCase() + '.json';
}

function isNoScroll(id: WinId): boolean {
  return id === 'terminal';
}

/* ── initial staggered layout ─────────────────────────────────────── */
// Window dimensions = content dimensions + window chrome overhead
// Title bar height (desktop): padding 0.45rem×2 + ~0.6rem font + 1px border ≈ 27px
const ECO_TITLEBAR_H = 27;
const ECO_W = ECO_CONTENT_W;
const ECO_H = ECO_CONTENT_H + ECO_TITLEBAR_H;

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
    { id: 'terminal',  x: m,         y: m,  w: ww, h: wh, zIndex: 3 },
    // install   — top-right, guaranteed right of terminal
    { id: 'install',   x: installX,  y: m,  w: iw, h: ih, zIndex: 4 },
    // what.md   — bottom-left
    { id: 'why',       x: m + 20,         y: areaH - wh - m,   w: Math.floor(ww * 0.75),    h: wh,    zIndex: 2 },
    // ecosystem — bottom-right
    { id: 'ecosystem', x: vw - ECO_W - m, y: areaH - ECO_H - m, w: ECO_W, h: ECO_H, zIndex: 1 },
  ];
}

function mobileInitialWindows(): WinState[] {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 390;
  const ww = vw - MOBILE_MARGIN * 2;

  const defs: { id: CoreId; h: number }[] = [
    { id: 'install',   h: 220 },
    { id: 'why',       h: 400 },
    // Mobile title bar is taller (~39px vs ~27px desktop), compensate accordingly.
    { id: 'ecosystem', h: ECO_CONTENT_H + 39 },
    // Terminal boot sequence is ~450px of content; give the output area enough room.
    { id: 'terminal',  h: 560 },
  ];

  // Small gap from the top of the window area so the first window doesn't butt up against the status bar
  let y = 8;
  return defs.map((d, i) => {
    const win: WinState = { id: d.id, x: MOBILE_MARGIN, y, w: ww, h: d.h, zIndex: defs.length - i };
    y += d.h + MOBILE_GAP;
    return win;
  });
}

/** Total canvas height needed for a tiled mobile layout */
function mobileTotalH(wins: WinState[]): number {
  const maxBottom = wins.reduce((m, w) => Math.max(m, w.y + w.h), 0);
  return maxBottom + 32; // small bottom breathing room only — treasure is hidden inside the terminal window
}

/* ── desktop icon definitions ─────────────────────────────────────── */
const CORE_ICON_DEFS: { id: CoreId; src: string; label: string }[] = [
  { id: 'terminal',  src: '/terminal.png', label: 'terminal'  },
  { id: 'install',   src: '/install.png',  label: 'install'   },
  { id: 'ecosystem', src: '/maps.png',     label: 'ecosystem' },
  { id: 'why',       src: '/docs.png',     label: 'what.md'   },
  { id: 'users',     src: '/users.png',    label: 'users'     },
  { id: 'feedback',  src: '/help.png',     label: 'feedback'  },
];

/* ── Desktop ──────────────────────────────────────────────────────── */
export function Desktop() {
  const isMobile                      = useIsMobile();
  const [wins, setWins]               = useState<WinState[]>(() =>
    (typeof window !== 'undefined' && window.innerWidth < 768) ? mobileInitialWindows() : initialWindows()
  );
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [viewMode, setViewMode]       = useState<ViewMode>('ui');
  const [closedCore, setClosedCore]   = useState<Set<CoreId>>(new Set());
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [maximizedId, setMaximizedId] = useState<WinId | null>(null);
  const ecoRef                        = useRef<EcosystemHandle>(null);
  const cliRef                        = useRef<CliHandle>(null);
  const featuresRef                   = useRef<FeaturesHandle>(null);
  const windowAreaRef                 = useRef<HTMLDivElement>(null);
  const [draggingPartner, setDraggingPartner] = useState<Partner | null>(null);
  const [partnerOrigins,  setPartnerOrigins]  = useState<Record<string, { x: number; y: number }>>({});
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
    const defaults = isMobile ? mobileInitialWindows() : initialWindows();
    const def = defaults.find(w => w.id === id);
    if (def) {
      setWins(prev => prev.map(w => w.id === id ? { ...w, x: def.x, y: def.y, w: def.w, h: def.h } : w));
    }
  }, [maximizedId, isMobile]);

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
      const maxZ     = Math.max(...prev.map(w => w.zIndex));
      const vw       = window.innerWidth;
      const vh       = window.innerHeight;
      const w        = isMobile ? vw - MOBILE_MARGIN * 2 : 420;
      const h        = 560;
      const scrollTop = windowAreaRef.current?.scrollTop ?? 0;
      const areaH    = vh - (isMobile ? MOBILE_STATUSBAR_H : STATUSBAR_H);
      return [...prev, {
        id:     'treasure' as const,
        x:      isMobile ? MOBILE_MARGIN : Math.round(vw / 2 - 200),
        y:      Math.round(scrollTop + (areaH - h) / 2),
        w,
        h,
        zIndex: maxZ + 1,
      }];
    });
  }, [isMobile]);

  /* open a core window (show if hidden, create if not yet in wins, or bring to front) */
  const openCoreWindow = useCallback((id: CoreId) => {
    if (id === 'feedback') setFeedbackKey(k => k + 1);
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
      // first open — create centered in current viewport
      const maxZ      = Math.max(...prev.map(w => w.zIndex));
      const vw        = window.innerWidth;
      const vh        = window.innerHeight;
      const scrollTop = windowAreaRef.current?.scrollTop ?? 0;
      const areaH     = vh - (isMobile ? MOBILE_STATUSBAR_H : STATUSBAR_H);
      const w         = isMobile ? vw - MOBILE_MARGIN * 2 : (id === 'feedback' || id === 'join' ? 420 : 440);
      const h         = id === 'feedback' ? 380 : id === 'join' ? 420 : 520;
      return [...prev, {
        id,
        x: isMobile ? MOBILE_MARGIN : Math.round(vw / 2 - w / 2),
        y: Math.round(scrollTop + (areaH - h) / 2),
        w,
        h,
        zIndex: maxZ + 1,
      }];
    });
  }, [closedCore, bringToFront, isMobile]);

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
  const openPartner = useCallback((partner: Partner, iconOrigin?: { x: number; y: number }) => {
    const id: WinId = `partner:${partner.name}`;
    if (iconOrigin) setPartnerOrigins(prev => ({ ...prev, [id]: iconOrigin }));
    setWins(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        const maxZ = Math.max(...prev.map(w => w.zIndex));
        return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
      }
      const maxZ      = Math.max(...prev.map(w => w.zIndex));
      const vw        = window.innerWidth;
      const vh        = window.innerHeight;
      const scrollTop = windowAreaRef.current?.scrollTop ?? 0;
      const areaH     = vh - (isMobile ? MOBILE_STATUSBAR_H : STATUSBAR_H);
      const w         = isMobile ? vw - MOBILE_MARGIN * 2 : 380;
      const h         = 360;
      return [...prev, {
        id,
        x: isMobile ? MOBILE_MARGIN : Math.round(vw / 2 - 190 + (prev.length - 4) * 24),
        y: isMobile
          ? Math.round(scrollTop + (areaH - h) / 2)
          : Math.round(vh / 2 - 180 + (prev.length - 4) * 24),
        w,
        h,
        zIndex: maxZ + 1,
      }];
    });
  }, [isMobile]);

  /* desktop dimensions for maximized windows */
  const vw = typeof window !== 'undefined' ? window.innerWidth  : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  /* mobile canvas height — tall enough for all tiled windows + treasure area */
  const mobileCanvasH = isMobile ? mobileTotalH(wins) : undefined;

  /* mobile icon grid geometry */
  const mobileIconsPerRow = Math.max(1, Math.floor((vw - MOBILE_MARGIN * 2) / MOBILE_ICON_CELL_W));

  /* treasure icon on mobile — positioned inside the terminal window's bounds so it's hidden behind it */
  const mobileTerminalWin  = isMobile ? wins.find(w => w.id === 'terminal') : undefined;
  const mobileTreasureY    = mobileTerminalWin
    ? mobileTerminalWin.y + mobileTerminalWin.h - MOBILE_ICON_CELL_H - 16
    : undefined;

  /* icon viewport-center for each window id — used as animation transform origin */
  function getOrigin(id: WinId): { x: number; y: number } | undefined {
    if (isMobile) return undefined; // skip transform-origin animation on mobile
    const coreIdx = CORE_ICON_DEFS.findIndex(d => d.id === id);
    if (coreIdx !== -1) {
      return { x: vw - 24 - 32, y: STATUSBAR_H + 24 + coreIdx * 96 + 32 };
    }
    if (id === 'treasure') return { x: 24 + 32, y: vh - 24 - 32 };
    if (id.startsWith('partner:')) return partnerOrigins[id];
    return undefined;
  }

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
        onReset={() => {
          setWins(isMobile ? mobileInitialWindows() : initialWindows());
          setClosedCore(new Set());
          setMaximizedId(null);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* ── Agent view — replaces window area when active ─────────── */}
      {viewMode === 'agent' && <AgentView />}

      {/* ── Window area — fills remaining height ──────────────────── */}
      <div
        ref={windowAreaRef}
        style={{
          flex:          1,
          position:      'relative',
          overflowX:     'hidden',
          overflowY:     isMobile ? 'auto' : 'hidden',
          scrollbarWidth:'none',
          display:       viewMode === 'agent' ? 'none' : undefined,
        }}
        onClick={() => setSelectedIcon(null)}
      >
        {/* ── Inner canvas — gives absolute-positioned children a scrollable height context */}
        <div style={{ position: 'relative', width: '100%', minHeight: isMobile ? mobileCanvasH : '100%' }}>

        {/* ── Treasure desktop icon ─────────────────────────────── */}
        <DesktopIcon
          label="treasure"
          src="/treasure-closed.png"
          openSrc="/treasure-open.png"
          isOpen={wins.some(w => w.id === 'treasure')}
          isSelected={selectedIcon === 'treasure'}
          onSelect={() => setSelectedIcon('treasure')}
          onOpen={openTreasure}
          style={isMobile
            ? { top: mobileTreasureY, left: '50%', transform: 'translateX(-50%)', zIndex: 0 }
            : { bottom: 24, left: 24 }
          }
        />

        {/* ── Core window desktop icons ──────────────────────────── */}
        {isMobile ? (
          /* Mobile: grid layout top-left */
          CORE_ICON_DEFS.map((def, i) => {
            const isOpen = def.id === 'users'
              ? wins.some(w => w.id === 'users')
              : !closedCore.has(def.id);
            const col = i % mobileIconsPerRow;
            const row = Math.floor(i / mobileIconsPerRow);
            return (
              <DesktopIcon
                key={def.id}
                label={def.label}
                src={def.src}
                isOpen={isOpen}
                isSelected={selectedIcon === def.id}
                onSelect={e => { e.stopPropagation(); setSelectedIcon(def.id); }}
                onOpen={() => openCoreWindow(def.id)}
                style={{
                  top:  16 + row * MOBILE_ICON_CELL_H,
                  left: MOBILE_MARGIN + col * MOBILE_ICON_CELL_W,
                }}
              />
            );
          })
        ) : (
          /* Desktop: tiled vertically on the right */
          CORE_ICON_DEFS.map((def, i) => {
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
          })
        )}

        <AnimatePresence>
        {wins
          .filter(win => !closedCore.has(win.id as CoreId))
          .map(win => {
            const partnerName = win.id.startsWith('partner:') ? win.id.slice('partner:'.length) : null;
            const partner     = partnerName ? PARTNERS.find(p => p.name === partnerName) : null;
            const maxZ        = Math.max(...wins.map(w => w.zIndex));

            const isEcosystem  = win.id === 'ecosystem';
            const isWhy        = win.id === 'why';
            const isActive     = win.zIndex === maxZ;
            const isMaximized  = maximizedId === win.id;
            const darkBg       = isActive ? 'var(--color-bg)' : 'var(--color-surface-dark)';

            // Override position/size when maximized
            const finalX = isMaximized ? 0 : win.x;
            const finalY = isMaximized ? 0 : win.y;
            const finalW = isMaximized ? vw : win.w;
            const finalH = isMaximized ? vh - (isMobile ? MOBILE_STATUSBAR_H : STATUSBAR_H) : win.h;

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
                headerRight={(isEcosystem || isWhy) ? (
                  <button
                    aria-label='Shuffle'
                    onClick={e => {
                      e.stopPropagation();
                      if (isEcosystem) ecoRef.current?.shuffle();
                      if (isWhy)       featuresRef.current?.shuffle();
                    }}
                    style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--color-text-ui-muted)' }}
                  >
                    <Shuffle size={10} strokeWidth={1.5} />
                  </button>
                ) : undefined}
                origin={getOrigin(win.id)}
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
                {win.id === 'why'       && <FeaturesContent ref={featuresRef} />}
                {win.id === 'ecosystem' && (
                  <EcosystemIcons
                    ref={ecoRef}
                    onOpen={openPartner}
                    onOpenJoin={() => openCoreWindow('join')}
                    onCrossDragStart={p => setDraggingPartner(p)}
                    onCrossDragMove={(x, y) => setGhostPos({ x, y })}
                    onCrossDragEnd={handleCrossDragEnd}
                  />
                )}
                {win.id === 'treasure'  && <TreasureContent />}
                {win.id === 'users'     && <UsersContent />}
                {win.id === 'feedback'  && <FeedbackContent key={feedbackKey} />}
                {win.id === 'join'      && <JoinContent />}
                {partner && (
                  <PartnerDetail
                    partner={partner}
                    onShowMe={cmd => { cliRef.current?.submit(cmd); bringToFront('terminal'); }}
                  />
                )}
              </Window>
            );
          })}
        </AnimatePresence>
        </div>{/* end inner canvas */}
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
          style={{ width: 128, height: 128, imageRendering: 'pixelated' }}
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
        Enter to win a mac mini + openclaw + stripe projects credits
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
        10 total winners will be randomly chosen.{' '}
        <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Read more about the rules and terms.</a>
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

/* ── Feedback window content ──────────────────────────────────────── */
function FeedbackContent() {
  const [text, setText]       = useState('');
  const [status, setStatus]   = useState<'idle' | 'sending' | 'sent'>('idle');
  const [thanked, setThanked] = useState(false);

  async function handleSubmit() {
    if (!text.trim() || status !== 'idle') return;
    setStatus('sending');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('sent');
    await new Promise(r => setTimeout(r, 800));
    setThanked(true);
  }

  if (thanked) {
    return (
      <div style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '2rem',
        gap:            '1rem',
      }}>
        <img
          src='/thankyou.png'
          alt='thank you'
          draggable={false}
          style={{ width: 80, height: 80, imageRendering: 'pixelated' }}
        />
        <p style={{
          margin:     0,
          fontFamily: 'var(--font-mono)',
          fontSize:   '0.8rem',
          color:      'var(--color-text-ui)',
          textAlign:  'center',
          lineHeight: 1.6,
        }}>
          Thanks for the feedback.
        </p>
      </div>
    );
  }

  const submitLabel =
    status === 'sending' ? 'Sending...' :
    status === 'sent'    ? 'Sent'       :
    'Send feedback';

  const btnColor =
    status === 'sent'    ? 'var(--color-yellow)' :
    status === 'sending' ? 'var(--color-text-ui-muted)' :
    'var(--color-pink)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-mono)' }}>
      {/* scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-ui)', lineHeight: 1.65 }}>
          Let us know what you think about projects. What's good? What's not so good? What would you change? What works well for you?
        </p>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
          rows={6}
          style={{
            resize:     'none',
            background: 'var(--color-surface-2)',
            border:     '1px solid var(--color-border-accent)',
            outline:    'none',
            color:      'var(--color-text-ui)',
            fontFamily: 'var(--font-mono)',
            fontSize:   '0.78rem',
            lineHeight: 1.65,
            padding:    '0.6rem 0.75rem',
            caretColor: 'var(--color-pink)',
            width:      '100%',
            boxSizing:  'border-box',
          }}
        />

        <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--color-text-ui-subtle)', lineHeight: 1.6 }}>
          Have a specific issue?{' '}
          <a href='https://stripe.com/docs' target='_blank' rel='noreferrer'
            style={{ color: 'var(--color-pink)', textDecoration: 'none' }}>
            Contact support
          </a>
          {' '}or{' '}
          <a href='https://stripe.com/docs' target='_blank' rel='noreferrer'
            style={{ color: 'var(--color-pink)', textDecoration: 'none' }}>
            read our docs
          </a>.
        </p>
      </div>

      {/* button bar — same height as install Copy button */}
      <div style={{
        borderTop:      '1px solid var(--color-border-accent)',
        padding:        '0.6rem',
        display:        'flex',
        justifyContent: 'center',
        flexShrink:     0,
      }}>
        <button
          onClick={handleSubmit}
          disabled={status !== 'idle'}
          style={{
            background: 'none',
            border:     'none',
            padding:    0,
            color:      btnColor,
            fontFamily: 'var(--font-mono)',
            fontSize:   '0.8rem',
            cursor:     status === 'idle' ? 'pointer' : 'default',
            transition: 'color 0.15s',
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Join window content ──────────────────────────────────────────── */
const JOIN_CATEGORIES = ['payments', 'auth', 'database', 'storage', 'monitoring', 'analytics', 'ai', 'hosting', 'other'] as const;

function JoinContent() {
  const [category, setCategory] = useState('');
  const [name,     setName]     = useState('');
  const [url,      setUrl]      = useState('');
  const [email,    setEmail]    = useState('');
  const [status,   setStatus]   = useState<'idle' | 'sending' | 'sent'>('idle');
  const [thanked,  setThanked]  = useState(false);

  async function handleSubmit() {
    if (!category || !name.trim() || !url.trim() || !email.trim() || status !== 'idle') return;
    setStatus('sending');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('sent');
    await new Promise(r => setTimeout(r, 800));
    setThanked(true);
  }

  if (thanked) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem', gap: '1rem',
      }}>
        <img
          src='/thankyou.png'
          alt='thank you'
          draggable={false}
          style={{ width: 80, height: 80, imageRendering: 'pixelated' }}
        />
        <p style={{
          margin: 0, fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem', color: 'var(--color-text-ui)',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          Thanks! We'll be in touch.
        </p>
      </div>
    );
  }

  const submitLabel =
    status === 'sending' ? 'Submitting...' :
    status === 'sent'    ? 'Submitted'     :
    'Submit';

  const btnColor =
    status === 'sent'    ? 'var(--color-yellow)'        :
    status === 'sending' ? 'var(--color-text-ui-muted)' :
    'var(--color-pink)';

  const inputStyle: CSSProperties = {
    background:  'var(--color-surface-2)',
    border:      '1px solid var(--color-border-accent)',
    outline:     'none',
    color:       'var(--color-text-ui)',
    fontFamily:  'var(--font-mono)',
    fontSize:    '0.78rem',
    lineHeight:   1.65,
    padding:     '0.5rem 0.75rem',
    caretColor:  'var(--color-pink)',
    width:       '100%',
    boxSizing:   'border-box',
  };

  const labelStyle: CSSProperties = {
    margin:         0,
    fontSize:       '0.6rem',
    textTransform:  'uppercase',
    letterSpacing:  '0.1em',
    color:          'var(--color-text-ui-subtle)',
    marginBottom:   '0.3rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-mono)' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-ui)', lineHeight: 1.65 }}>
          Become a part of the Projects ecosystem.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={labelStyle}>Category</p>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
          >
            <option value="">Select a category</option>
            {JOIN_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={labelStyle}>Name</p>
          <input
            type="text"
            placeholder="Your project or company"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={labelStyle}>URL</p>
          <input
            type="url"
            placeholder="https://"
            value={url}
            onChange={e => setUrl(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={labelStyle}>Contact Email</p>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            style={inputStyle}
          />
        </div>

      </div>

      <div style={{
        borderTop:      '1px solid var(--color-border-accent)',
        padding:        '0.6rem',
        display:        'flex',
        justifyContent: 'center',
        flexShrink:     0,
      }}>
        <button
          onClick={handleSubmit}
          disabled={status !== 'idle'}
          style={{
            background: 'none',
            border:     'none',
            padding:    0,
            color:      btnColor,
            fontFamily: 'var(--font-mono)',
            fontSize:   '0.8rem',
            cursor:     status === 'idle' ? 'pointer' : 'default',
            transition: 'color 0.15s',
          }}
        >
          {submitLabel}
        </button>
      </div>
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

  /* double-tap detection — works for both mouse dblclick and touch */
  const lastTapRef = useRef(0);
  function handleTap(e: React.MouseEvent) {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      e.stopPropagation();
      onOpen();
      lastTapRef.current = 0;
    } else {
      e.stopPropagation();
      onSelect(e);
      lastTapRef.current = now;
    }
  }

  return (
    <div
      onClick={handleTap}
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
