import type { CSSProperties, PointerEvent, ReactNode } from 'react';

/* ── constants ────────────────────────────────────────────────────── */
const BORDER          = '1px solid var(--color-border-accent)';
const PINK            = 'var(--color-pink)';
const INACTIVE_CORNER = 'var(--color-text-ui-subtle)';
const ACTIVE_BAR_BG   = 'var(--color-pink)';
const ACTIVE_TITLE    = 'var(--color-surface-dark)';  // dark text on bright bar
const INACTIVE_TITLE  = 'var(--color-text-ui-subtle)';
const DOT_COLOR       = 'var(--color-border-accent)'; // all dots same as border, always
const CORNER_PX       = 8;
const MIN_W           = 280;
const MIN_H           = 180;
const GRIP            = 5; // resize handle thickness (px)

/* ── types ────────────────────────────────────────────────────────── */
type Corner = 'tl' | 'tr' | 'bl' | 'br';
type Dir    = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface WindowProps {
  title:         string;
  children:      ReactNode;
  x:             number;
  y:             number;
  w:             number;
  h:             number;
  zIndex:        number;
  isActive?:     boolean;
  /** Replace scrollable content area with overflow:hidden (e.g. for CliTerminal) */
  noScroll?:     boolean;
  /** Called when the red traffic-light is clicked — hides the window */
  onClose?:      () => void;
  /** Extra content rendered in the right side of the title bar */
  headerRight?:  ReactNode;
  /** Override the window background color */
  background?:   string;
  onFocus:       () => void;
  onMove:        (x: number, y: number) => void;
  onResize:      (x: number, y: number, w: number, h: number) => void;
}

/* ── corner bracket ───────────────────────────────────────────────── */
function CornerBracket({ corner, color }: { corner: Corner; color: string }) {
  const isTop  = corner === 'tl' || corner === 'tr';
  const isLeft = corner === 'tl' || corner === 'bl';
  return (
    <div
      aria-hidden
      style={{
        position:     'absolute',
        width:        CORNER_PX,
        height:       CORNER_PX,
        top:          isTop  ? -1 : undefined,
        bottom:       !isTop ? -1 : undefined,
        left:         isLeft  ? -1 : undefined,
        right:        !isLeft ? -1 : undefined,
        borderTop:    isTop  ? `1px solid ${color}` : undefined,
        borderBottom: !isTop ? `1px solid ${color}` : undefined,
        borderLeft:   isLeft  ? `1px solid ${color}` : undefined,
        borderRight:  !isLeft ? `1px solid ${color}` : undefined,
        zIndex:       10,
        pointerEvents:'none',
      }}
    />
  );
}

/* ── resize handle styles ─────────────────────────────────────────── */
const HANDLE: Record<Dir, CSSProperties> = {
  n:  { top: 0,    left: GRIP,  right: GRIP,  height: GRIP, cursor: 'ns-resize'   },
  s:  { bottom: 0, left: GRIP,  right: GRIP,  height: GRIP, cursor: 'ns-resize'   },
  e:  { top: GRIP, bottom: GRIP, right: 0,    width:  GRIP, cursor: 'ew-resize'   },
  w:  { top: GRIP, bottom: GRIP, left: 0,     width:  GRIP, cursor: 'ew-resize'   },
  ne: { top: 0,    right: 0,    width: GRIP,  height: GRIP, cursor: 'nesw-resize' },
  nw: { top: 0,    left: 0,     width: GRIP,  height: GRIP, cursor: 'nwse-resize' },
  se: { bottom: 0, right: 0,    width: GRIP,  height: GRIP, cursor: 'nwse-resize' },
  sw: { bottom: 0, left: 0,     width: GRIP,  height: GRIP, cursor: 'nesw-resize' },
};
const DIRS: Dir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

/* ── traffic-light dots ───────────────────────────────────────────── */
const LIGHTS = [
  { label: 'close',    activeColor: '#FF5F57' },
  { label: 'minimise', activeColor: '#FEBC2E' },
  { label: 'maximise', activeColor: '#28C840' },
];

/* ── Window ───────────────────────────────────────────────────────── */
export function Window({
  title, children, x, y, w, h, zIndex, isActive = false, noScroll = false,
  onClose, headerRight, background = 'var(--color-surface-dark)', onFocus, onMove, onResize,
}: WindowProps) {
  const cornerColor = isActive ? PINK : INACTIVE_CORNER;

  /* drag — attached to title bar */
  function handleDragStart(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    onFocus();
    const ox = e.clientX - x;
    const oy = e.clientY - y;

    function onMoveEv(ev: globalThis.PointerEvent) {
      onMove(ev.clientX - ox, ev.clientY - oy);
    }
    function onUp() {
      window.removeEventListener('pointermove', onMoveEv);
      window.removeEventListener('pointerup',   onUp);
    }
    window.addEventListener('pointermove', onMoveEv);
    window.addEventListener('pointerup',   onUp);
  }

  /* resize — attached to edge/corner handles */
  function handleResizeStart(e: PointerEvent<HTMLDivElement>, dir: Dir) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    const sx = e.clientX, sy = e.clientY;
    const sw = w, sh = h, spx = x, spy = y;

    function onMoveEv(ev: globalThis.PointerEvent) {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      let nx = spx, ny = spy, nw = sw, nh = sh;

      if (dir.includes('e')) { nw = Math.max(MIN_W, sw + dx); }
      if (dir.includes('s')) { nh = Math.max(MIN_H, sh + dy); }
      if (dir.includes('w')) { nw = Math.max(MIN_W, sw - dx); nx = spx + (sw - nw); }
      if (dir.includes('n')) { nh = Math.max(MIN_H, sh - dy); ny = spy + (sh - nh); }

      onResize(nx, ny, nw, nh);
    }
    function onUp() {
      window.removeEventListener('pointermove', onMoveEv);
      window.removeEventListener('pointerup',   onUp);
    }
    window.addEventListener('pointermove', onMoveEv);
    window.addEventListener('pointerup',   onUp);
  }

  return (
    <div
      style={{
        position:       'absolute',
        left:            x,
        top:             y,
        width:           w,
        height:          h,
        zIndex,
        display:        'flex',
        flexDirection:  'column',
        border:          BORDER,
        background,
      }}
      onPointerDown={onFocus}
    >
      {/* corner accents — pink when active, white 25% when inactive */}
      <CornerBracket corner='tl' color={cornerColor} />
      <CornerBracket corner='tr' color={cornerColor} />
      <CornerBracket corner='bl' color={cornerColor} />
      <CornerBracket corner='br' color={cornerColor} />

      {/* ── title bar ───────────────────────────────────────────── */}
      <div
        onPointerDown={handleDragStart}
        style={{
          display:       'flex',
          alignItems:    'center',
          gap:           '0.75rem',
          padding:       '0.45rem 0.75rem',
          borderBottom:   BORDER,
          background:    isActive ? ACTIVE_BAR_BG : 'transparent',
          cursor:        'move',
          flexShrink:    0,
          userSelect:    'none',
          fontFamily:    'var(--font-mono)',
        }}
      >
        {/* traffic lights — real colors when closeable, flat border color otherwise */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {LIGHTS.map(l => (
            <div
              key={l.label}
              aria-label={l.label}
              onClick={l.label === 'close' && onClose ? (e) => { e.stopPropagation(); onClose(); } : undefined}
              style={{
                width: 10, height: 10, borderRadius: '50%',
                background: onClose ? l.activeColor : DOT_COLOR,
                flexShrink: 0,
                cursor: l.label === 'close' && onClose ? 'pointer' : 'default',
              }}
            />
          ))}
        </div>

        {/* title — centred, monospace, all-caps */}
        <span
          style={{
            flex:          1,
            textAlign:    'center',
            fontSize:     '0.6rem',
            textTransform:'uppercase',
            letterSpacing:'0.12em',
            color:        isActive ? ACTIVE_TITLE : INACTIVE_TITLE,
          }}
        >
          {title}
        </span>

        {/* right side: custom content or balancing spacer */}
        <div style={{ width: 10 * 3 + 6 * 2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {headerRight}
        </div>
      </div>

      {/* ── content area ────────────────────────────────────────── */}
      <div
        style={{
          flex:          1,
          overflow:      noScroll ? 'hidden' : 'auto',
          overflowX:     'hidden',
          scrollbarWidth:'none',
          minHeight:     0,
          display:       noScroll ? 'flex' : undefined,
          flexDirection: noScroll ? 'column' : undefined,
        }}
      >
        {children}
      </div>

      {/* ── resize handles ───────────────────────────────────────── */}
      {DIRS.map(dir => (
        <div
          key={dir}
          style={{ position: 'absolute', zIndex: 3, ...HANDLE[dir] }}
          onPointerDown={e => handleResizeStart(e, dir)}
        />
      ))}
    </div>
  );
}
