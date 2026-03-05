import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, SlidersHorizontal, RotateCcw, Bot, Monitor, ScrollText } from 'lucide-react';
import { useAudio } from '@/components/ui/AudioContext';
import { useTheme } from '@/components/ui/ThemeContext';
import { useIsMobile } from '@/hooks/useIsMobile';

export type ViewMode = 'ui' | 'agent' | 'scroll';

/* ── helpers ──────────────────────────────────────────────────────────────── */
function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getTimestamp() {
  const d = new Date();
  return {
    date: `${pad(d.getMonth() + 1)}.${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
  };
}

/* ── dot spinner ──────────────────────────────────────────────────────────── */
//
//  2-column × 4-row grid.  HTML order maps to these visual positions:
//
//    col:  0        1
//  row 0: [1]      [4]
//  row 1: [2]      [5]
//  row 2: [3]      [6]
//  row 3: [7]      [8]
//
const W = 'var(--color-text-ui)';
const P = 'var(--color-pink)';
const U = 'var(--color-purple)';
const B = 'var(--color-blue)';
const Y = 'var(--color-yellow)';

const FRAMES: Record<number, string>[] = [
  { 4: P, 5: U, 3: W, 7: W },
  { 4: P, 5: U, 6: B, 7: W },
  { 4: P, 5: U, 6: B, 8: Y },
  { 1: W, 5: U, 6: B, 8: Y },
  { 1: W, 2: W, 6: B, 8: Y },
  { 1: W, 2: W, 3: W, 8: Y },
  { 1: W, 2: W, 3: W, 7: W },
  { 4: P, 2: W, 3: W, 7: W },
];

// Render order matches the original HTML (grid flows row-by-row: 1,4 / 2,5 / 3,6 / 7,8)
const DOT_ORDER = [1, 4, 2, 5, 3, 6, 7, 8] as const;

// The resting (non-hover) state — all dots use text-ui token
const STATIC_FRAME: Record<number, string> = { 4: W, 5: W, 3: W, 7: W };

function DotSpinner({ isAnimating }: { isAnimating: boolean }) {
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    if (!isAnimating) return;
    const id = setInterval(() => {
      setFrameIdx(i => (i + 1) % FRAMES.length);
    }, 140);
    return () => clearInterval(id);
  }, [isAnimating]);

  const frame = isAnimating ? FRAMES[frameIdx] : STATIC_FRAME;

  return (
    <div
      aria-label='loading'
      role='status'
      style={{
        display: 'grid',
        gridTemplateColumns: '2px 2px',
        gridAutoRows: '2px',
        gap: '2px',
        flexShrink: 0,
      }}
    >
      {DOT_ORDER.map((dot) => {
        const color = frame[dot];
        return (
          <div
            key={dot}
            aria-hidden
            style={{
              width: 2,
              height: 2,
              background: color ?? 'white',
              opacity: color ? 1 : 0,
              transition: 'opacity 80ms linear',
            }}
          />
        );
      })}
    </div>
  );
}

/* ── constants ───────────────────────────────────────────────────────────── */
const BORDER    = '1px solid var(--color-border-accent)';
const CORNER_PX = 8;
const PINK      = 'var(--color-pink)';

/* ── corner bracket helper ───────────────────────────────────────────────── */
type Corner = 'tl' | 'tr' | 'bl' | 'br';

function CornerBracket({ corner }: { corner: Corner }) {
  const isTop  = corner === 'tl' || corner === 'tr';
  const isLeft = corner === 'tl' || corner === 'bl';

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        width:  CORNER_PX,
        height: CORNER_PX,
        top:    isTop  ? -1 : undefined,
        bottom: !isTop ? -1 : undefined,
        left:   isLeft  ? -1 : undefined,
        right:  !isLeft ? -1 : undefined,
        borderTop:    isTop  ? `1px solid ${PINK}` : undefined,
        borderBottom: !isTop ? `1px solid ${PINK}` : undefined,
        borderLeft:   isLeft  ? `1px solid ${PINK}` : undefined,
        borderRight:  !isLeft ? `1px solid ${PINK}` : undefined,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ── cell ─────────────────────────────────────────────────────────────────── */
function Cell({
  children,
  borderRight = false,
  grow = false,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  borderRight?: boolean;
  grow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex items-center px-[clamp(0.5rem,2vw,1rem)] py-[clamp(0.4rem,1.2vw,0.6rem)] min-w-0 ${grow ? 'flex-1' : ''} ${className}`}
      style={{
        borderRight: borderRight ? BORDER : undefined,
        color: 'var(--color-text-ui-muted)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── SettingsPopover ──────────────────────────────────────────────────────── */
function SettingsPopover({
  anchorRef,
  onClose,
  gateMode = false,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  gateMode?: boolean;
}) {
  const { theme, setTheme, themes: allThemes } = useTheme();
  const themes = gateMode ? allThemes.filter(t => t.id !== 'stripedotdev') : allThemes;
  const popoverRef = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current  && !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [anchorRef, onClose]);

  /* position below the anchor button */
  const rect = anchorRef.current?.getBoundingClientRect();
  const top  = rect ? rect.bottom + 6 : 32;
  const left = rect ? rect.left       : 0;

  return (
    <div
      ref={popoverRef}
      style={{
        position:     'fixed',
        top,
        left,
        zIndex:       10000,
        background:   'var(--color-surface-dark)',
        border:       BORDER,
        minWidth:     180,
        padding:      '6px 0',
        fontFamily:   'var(--font-mono)',
        fontSize:     '0.72rem',
      }}
    >
      <div style={{ padding: '4px 12px 8px', color: 'var(--color-text-ui-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.6rem' }}>
        theme
      </div>
      {themes.map(t => {
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => { setTheme(t.id); onClose(); }}
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            10,
              width:          '100%',
              padding:        '6px 12px',
              background:     active ? 'rgba(255,255,255,0.07)' : 'none',
              border:         'none',
              cursor:         'pointer',
              color:          active ? 'var(--color-text-ui)' : 'var(--color-text-ui-muted)',
              textAlign:      'left',
              fontFamily:     'inherit',
              fontSize:       'inherit',
              letterSpacing:  '0.02em',
            }}
          >
            <span style={{ color: 'var(--color-pink)', opacity: active ? 1 : 0, userSelect: 'none' }}>›</span>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── ViewPopover ──────────────────────────────────────────────────────────── */
const VIEW_OPTIONS: { id: ViewMode; label: string; icon: React.FC<{ size: number; strokeWidth: number }> }[] = [
  { id: 'ui',     label: 'desktop', icon: Monitor    },
  { id: 'agent',  label: 'agent',   icon: Bot        },
  { id: 'scroll', label: 'scroll',  icon: ScrollText },
];

function ViewPopover({
  anchorRef,
  viewMode,
  onViewModeChange,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onClose: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current  && !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [anchorRef, onClose]);

  const rect = anchorRef.current?.getBoundingClientRect();
  const top  = rect ? rect.bottom + 6 : 32;
  const left = rect ? rect.left       : 0;

  return (
    <div
      ref={popoverRef}
      style={{
        position:   'fixed',
        top,
        left,
        zIndex:     10000,
        background: 'var(--color-surface-dark)',
        border:     BORDER,
        minWidth:   160,
        padding:    '6px 0',
        fontFamily: 'var(--font-mono)',
        fontSize:   '0.72rem',
      }}
    >
      <div style={{ padding: '4px 12px 8px', color: 'var(--color-text-ui-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.6rem' }}>
        view
      </div>
      {VIEW_OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = viewMode === id;
        return (
          <button
            key={id}
            onClick={() => { onViewModeChange(id); onClose(); }}
            style={{
              display:       'flex',
              alignItems:    'center',
              gap:            10,
              width:         '100%',
              padding:       '6px 12px',
              background:    active ? 'rgba(255,255,255,0.07)' : 'none',
              border:        'none',
              cursor:        'pointer',
              color:         active ? 'var(--color-text-ui)' : 'var(--color-text-ui-muted)',
              textAlign:     'left',
              fontFamily:    'inherit',
              fontSize:      'inherit',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{ color: 'var(--color-pink)', opacity: active ? 1 : 0, userSelect: 'none' }}>›</span>
            <Icon size={11} strokeWidth={1.5} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ── StatusBar ────────────────────────────────────────────────────────────────
   Slim single-row bar pinned to the top of the Desktop.
   No slash-command hints. Date/time reads horizontally.
─────────────────────────────────────────────────────────────────────────── */
export function StatusBar({
  onReset,
  viewMode = 'ui',
  onViewModeChange,
  gateMode = false,
}: {
  onReset?: () => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  gateMode?: boolean;
}) {
  const [ts, setTs]               = useState(getTimestamp);
  const [hovered, setHovered]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const settingsRef               = useRef<HTMLButtonElement>(null);
  const viewRef                   = useRef<HTMLButtonElement>(null);
  const { isMuted, toggleMute } = useAudio();
  const isMobile = useIsMobile();

  const ViewIcon = VIEW_OPTIONS.find(o => o.id === viewMode)?.icon ?? Monitor;

  useEffect(() => {
    const id = setInterval(() => setTs(getTimestamp()), 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className='font-mono'
      style={{
        position:    'relative',
        zIndex:      9999,
        fontSize:    'clamp(0.65rem, 1.4vw, 0.8125rem)',
        borderBottom: BORDER,
        background:  'var(--color-surface-dark)',
        flexShrink:  0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className='flex items-center' style={{ minHeight: isMobile ? 52 : 40 }}>
        {/* logo + name + by stripe */}
        <Cell grow>
          <div className='flex items-center' style={{ gap: 6 }}>
            <DotSpinner isAnimating={hovered} />
            <span className='font-bold' style={{ color: 'var(--color-text-ui)' }}>projects</span>
            {!gateMode && <span>by stripe</span>}
          </div>
        </Cell>

        {/* system icons + date/time */}
        <Cell>
          <div className='flex items-center' style={{ gap: isMobile ? 'clamp(1.2rem, 3vw, 2rem)' : 'clamp(0.6rem, 1.5vw, 1rem)' }}>
            {/* Mute / unmute background music */}
            <button
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              onClick={toggleMute}
              style={{
                display: 'flex', alignItems: 'center', background: 'none', border: 'none',
                padding: 0, cursor: 'pointer',
                color: isMuted ? 'var(--color-text-ui-muted)' : 'var(--color-text-ui)',
              }}
            >
              {isMuted
                ? <VolumeX size={isMobile ? 20 : 13} strokeWidth={1.5} />
                : <Volume2 size={isMobile ? 20 : 13} strokeWidth={1.5} />
              }
            </button>
            <button
              ref={settingsRef}
              aria-label='Settings'
              onClick={() => { setShowSettings(v => !v); setShowViewMenu(false); }}
              style={{
                display: 'flex', alignItems: 'center', background: 'none', border: 'none',
                padding: 0, cursor: 'pointer',
                color: showSettings ? 'var(--color-text-ui)' : 'var(--color-text-ui-muted)',
              }}
            >
              <SlidersHorizontal size={isMobile ? 20 : 13} strokeWidth={1.5} />
            </button>

            {/* View mode selector */}
            {!gateMode && (
              <button
                ref={viewRef}
                aria-label='Switch view'
                onClick={() => { setShowViewMenu(v => !v); setShowSettings(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: viewMode !== 'ui' ? 'var(--color-text-ui)' : (showViewMenu ? 'var(--color-text-ui)' : 'var(--color-text-ui-muted)'),
                }}
              >
                <ViewIcon size={isMobile ? 20 : 13} strokeWidth={1.5} />
              </button>
            )}

            {!gateMode && (
              <button
                aria-label='Reset desktop layout'
                onClick={onReset}
                style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-ui-muted)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <RotateCcw size={isMobile ? 20 : 13} strokeWidth={1.5} />
              </button>
            )}

            {!isMobile && (
              <span style={{ letterSpacing: '0.04em' }}>
                {ts.date}&nbsp;&nbsp;{ts.time}
              </span>
            )}
          </div>
        </Cell>
      </div>

      {showSettings && (
        <SettingsPopover
          anchorRef={settingsRef}
          onClose={() => setShowSettings(false)}
          gateMode={gateMode}
        />
      )}
      {showViewMenu && onViewModeChange && (
        <ViewPopover
          anchorRef={viewRef}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          onClose={() => setShowViewMenu(false)}
        />
      )}
    </div>
  );
}

/* ── TerminalBanner (full two-row version, kept for reference) ───────────── */
export function TerminalBanner() {
  const [ts, setTs] = useState(getTimestamp);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTs(getTimestamp()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className='font-mono'
      style={{
        position: 'relative',
        fontSize: 'clamp(0.65rem, 1.4vw, 0.8125rem)',
        border: BORDER,
        background: 'var(--color-surface-dark)',
        margin: '0 1px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Pink corner brackets ─────────────────────────────────────────── */}
      <CornerBracket corner='tl' />
      <CornerBracket corner='tr' />
      <CornerBracket corner='bl' />
      <CornerBracket corner='br' />

      <motion.div
        className='flex items-stretch'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >

        {/* ── Left: three stacked rows ─────────────────────────────────── */}
        <div className='flex-1 flex flex-col min-w-0' style={{ borderRight: BORDER }}>

          {/* Row 1 — animated logo / version / powered-by */}
          <div className='flex items-stretch' style={{ borderBottom: BORDER }}>
            <Cell borderRight grow>
              <div className='flex items-center' style={{ gap: 6 }}>
                <DotSpinner isAnimating={hovered} />
                <span className='font-bold' style={{ color: 'var(--color-text-ui)' }}>projects</span>
              </div>
            </Cell>
            <Cell borderRight>v&nbsp;1.0.1</Cell>
            <Cell>powered by stripe</Cell>
          </div>

          {/* Row 2 — help hints */}
          <div className='flex items-stretch'>
            <Cell borderRight>/&nbsp;for commands</Cell>
            <Cell borderRight>
              <span className='font-bold text-white'>/install</span>
              &nbsp;for install command
            </Cell>
            <Cell>
              <span className='font-bold text-white'>/services</span>
              &nbsp;for services list
            </Cell>
          </div>

        </div>

        {/* ── Right: live date/time, rotated ───────────────────────────── */}
        <div
          className='flex items-center justify-center'
          style={{
            minWidth: 'clamp(1.5rem, 3vw, 2.25rem)',
            padding: '0 clamp(0.25rem, 0.6vw, 0.5rem)',
            color: 'var(--color-text-ui-muted)',
          }}
        >
          <span
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              letterSpacing: '0.04em',
              whiteSpace: 'pre',
              lineHeight: 1.5,
            }}
          >
            {ts.date}{'\n'}{ts.time}
          </span>
        </div>

      </motion.div>
    </div>
  );
}
