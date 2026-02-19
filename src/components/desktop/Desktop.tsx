import { useState, useCallback, useRef, type CSSProperties } from 'react';
import { Shuffle } from 'lucide-react';
import { Window } from './Window';
import { GridBackground } from '@/components/ui/grid-background';
import { StatusBar } from '@/components/sections/TerminalBanner';
import { CliTerminal } from '@/components/sections/CliTerminal';
import { InstallWindow } from '@/components/sections/Hero';
import { FeaturesContent } from '@/components/sections/Features';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import {
  EcosystemIcons,
  PartnerDetail,
  PARTNERS,
  type Partner,
  type EcosystemHandle,
} from '@/components/sections/Partners';

/* ── types ────────────────────────────────────────────────────────── */
type CoreId = 'terminal' | 'install' | 'why' | 'ecosystem' | 'player' | 'treasure';
type WinId  = CoreId | `partner:${string}`;

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
  if (id === 'player')    return 'player.fm';
  if (id === 'treasure')  return 'treasure';
  return id.slice('partner:'.length).toLowerCase() + '.json';
}

function isNoScroll(id: WinId): boolean {
  return id === 'terminal' || id === 'ecosystem' || id === 'player';
}

/* ── initial staggered layout ─────────────────────────────────────── */
// 4 cols × 80px + 3×GAP(40) + 2×PAD(40) = 320+120+80 = 520px wide
// 3 rows × (48+16+14)=78px + 2×GAP(40) + 2×PAD(40) = 234+80+80 = 394px tall
const ECO_W = 520;
const ECO_H = 394;

function initialWindows(): WinState[] {
  const vw    = typeof window !== 'undefined' ? window.innerWidth  : 1440;
  const vh    = typeof window !== 'undefined' ? window.innerHeight : 900;
  const areaH = vh - 40;   // subtract status-bar height

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

/* ── Desktop ──────────────────────────────────────────────────────── */
export function Desktop() {
  const [wins, setWins]               = useState<WinState[]>(initialWindows);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const ecoRef                        = useRef<EcosystemHandle>(null);

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

  /* close (remove) a window — only for partner detail windows */
  const handleClose = useCallback((id: WinId) => {
    setWins(prev => prev.filter(w => w.id !== id));
  }, []);

  /* open / bring-to-front the music player window */
  const openPlayer = useCallback(() => {
    setWins(prev => {
      const existing = prev.find(w => w.id === 'player');
      if (existing) {
        const maxZ = Math.max(...prev.map(w => w.zIndex));
        if (existing.zIndex === maxZ) return prev;
        return prev.map(w => w.id === 'player' ? { ...w, zIndex: maxZ + 1 } : w);
      }
      const maxZ = Math.max(...prev.map(w => w.zIndex));
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;
      return [...prev, {
        id:     'player' as const,
        x:      Math.round(vw / 2 - 170),
        y:      Math.round(vh / 2 - 220),
        w:      340,
        h:      370,
        zIndex: maxZ + 1,
      }];
    });
  }, []);

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
        w:      400,
        h:      300,
        zIndex: maxZ + 1,
      }];
    });
  }, []);

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

      {/* ── Global status bar — always on top ─────────────────────── */}
      <StatusBar
        onReset={() => setWins(initialWindows())}
        onOpenPlayer={openPlayer}
        playerWindowOpen={wins.some(w => w.id === 'player')}
      />

      {/* ── Window area — fills remaining height ──────────────────── */}
      <div
        style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        onClick={() => setSelectedIcon(null)}
      >
        {/* ── Desktop icons ─────────────────────────────────────── */}
        <DesktopIcon
          label="treasure"
          closedSrc="/treasure-closed.png"
          openSrc="/treasure-open.png"
          isOpen={wins.some(w => w.id === 'treasure')}
          isSelected={selectedIcon === 'treasure'}
          onSelect={() => setSelectedIcon('treasure')}
          onOpen={openTreasure}
          style={{ bottom: 24, left: 24 }}
        />

      {wins.map(win => {
        const partnerName = win.id.startsWith('partner:') ? win.id.slice('partner:'.length) : null;
        const partner     = partnerName ? PARTNERS.find(p => p.name === partnerName) : null;
        const maxZ        = Math.max(...wins.map(w => w.zIndex));

        const isCloseable  = !!partnerName || win.id === 'player' || win.id === 'treasure';
        const isEcosystem  = win.id === 'ecosystem';
        const isActive     = win.zIndex === maxZ;
        const darkBg       = isActive ? 'var(--color-bg)' : 'var(--color-surface-dark)';

        return (
          <Window
            key={win.id}
            title={getTitle(win.id)}
            noScroll={isNoScroll(win.id)}
            isActive={isActive}
            x={win.x}
            y={win.y}
            w={win.w}
            h={win.h}
            zIndex={win.zIndex}
            background={darkBg}
            onClose={isCloseable ? () => handleClose(win.id) : undefined}
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
            {win.id === 'terminal'  && <TerminalContent />}
            {win.id === 'install'   && <InstallWindow />}
            {win.id === 'why'       && <FeaturesContent />}
            {win.id === 'ecosystem' && <EcosystemIcons ref={ecoRef} onOpen={openPartner} />}
            {win.id === 'player'    && <MusicPlayer />}
            {win.id === 'treasure'  && null}
            {partner && <PartnerDetail partner={partner} />}
          </Window>
        );
        })}
      </div>
    </div>
  );
}

/* ── Terminal window content: just the CLI ────────────────────────── */
function TerminalContent() {
  return <CliTerminal />;
}

/* ── DesktopIcon ──────────────────────────────────────────────────── */
interface DesktopIconProps {
  label:      string;
  closedSrc:  string;
  openSrc:    string;
  isOpen:     boolean;
  isSelected: boolean;
  onSelect:   () => void;
  onOpen:     () => void;
  style?:     CSSProperties;
}

function DesktopIcon({ label, closedSrc, openSrc, isOpen, isSelected, onSelect, onOpen, style }: DesktopIconProps) {
  const C = 6;
  const S = 'var(--color-pink)';
  const b = `1px solid ${S}`;
  const corners: CSSProperties[] = [
    { top: 0,    left: 0,  borderTop:    b, borderLeft:  b },
    { top: 0,    right: 0, borderTop:    b, borderRight: b },
    { bottom: 0, right: 0, borderBottom: b, borderRight: b },
    { bottom: 0, left: 0,  borderBottom: b, borderLeft:  b },
  ];

  return (
    <div
      onClick={e => { e.stopPropagation(); onSelect(); }}
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
          src={isOpen ? openSrc : closedSrc}
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
          textShadow:    '0 1px 3px rgba(0,0,0,0.8)',
          transition:    'color 0.1s',
        }}
      >
        {label}
      </span>
    </div>
  );
}
