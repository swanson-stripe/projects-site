import { useEffect, useRef } from 'react';
import type React from 'react';
import { useTheme } from './ThemeContext';

const TILE           = 104;   // px between mark centres (halved from 208)
const MARK_SIZE      = 9;     // mark size in CSS px
const GLOW_RADIUS    = 130;   // px — distance at which glow starts
const NORMAL_ALPHA   = 0.12;
const ANGLE_THRESHOLD = Math.tan(15 * Math.PI / 180); // ~0.268 — cone for — and |

// Returns the box-drawing character for a mark at (dx, dy) relative to the cursor.
// dx = markCenterX - cursorX, dy = markCenterY - cursorY
function getGridChar(dx: number, dy: number): string {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax > 0 && ay / ax < ANGLE_THRESHOLD) return '\u2014'; // —
  if (ay > 0 && ax / ay < ANGLE_THRESHOLD) return '|';
  if (dx < 0 && dy < 0) return '\u250c'; // ┌
  if (dx > 0 && dy < 0) return '\u2510'; // ┐
  if (dx > 0 && dy > 0) return '\u2518'; // ┘
  return '\u2514'; // └
}

// Parse a CSS hex color (#RRGGBB or #RGB) into [r, g, b]
function parseHex(hex: string): [number, number, number] {
  const h = hex.trim().replace('#', '');
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  return [parseInt(h.slice(0,2), 16), parseInt(h.slice(2,4), 16), parseInt(h.slice(4,6), 16)];
}

// Read hash color, base alpha, and glow color from CSS variables
function getHashStyle(): { rgb: [number, number, number]; alpha: number; glowRgb: [number, number, number] } {
  const style = getComputedStyle(document.documentElement);
  const gridHash  = style.getPropertyValue('--color-grid-hash').trim();
  const gridAlpha = style.getPropertyValue('--grid-hash-alpha').trim();
  const pink      = style.getPropertyValue('--color-pink').trim();
  const accentRgb = pink.startsWith('#') ? parseHex(pink) : [0xAA, 0xE8, 0x7B] as [number, number, number];
  const rgb = gridHash.startsWith('#') ? parseHex(gridHash) : accentRgb;
  const alpha = gridAlpha ? parseFloat(gridAlpha) : NORMAL_ALPHA;
  // Glow always uses the theme accent (--color-pink) so it's visible even at full base alpha
  return { rgb, alpha, glowRgb: accentRgb };
}

function accentColor(accent: [number, number, number]) {
  return `rgb(${accent[0]},${accent[1]},${accent[2]})`;
}

export function GridBackground({ scrollEl }: { scrollEl?: React.RefObject<HTMLElement | null> } = {}) {
  const { theme }  = useTheme();
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouseRef   = useRef<{ x: number; y: number } | null>(null);
  const rafRef     = useRef<number>(0);
  const scheduleRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    function draw() {
      const dpr   = window.devicePixelRatio || 1;
      const w     = window.innerWidth;
      const h     = window.innerHeight;
      const mouse = mouseRef.current;
      const { rgb: accent, alpha: baseAlpha, glowRgb } = getHashStyle();

      // Scroll offset — shift pattern so grid appears to scroll with content
      const scrollTop  = scrollEl?.current?.scrollTop  ?? 0;
      const scrollLeft = scrollEl?.current?.scrollLeft ?? 0;
      const shiftX = scrollLeft % TILE;
      const shiftY = scrollTop  % TILE;

      // Resize bitmap to physical pixels
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      // All subsequent coords in CSS px
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const offset = (TILE - MARK_SIZE) / 2;
      // +2 cols/rows to cover the partial tile revealed by scrolling
      const cols   = Math.ceil(w / TILE) + 2;
      const rows   = Math.ceil(h / TILE) + 2;

      // Text rendering settings — set once before the loop
      ctx.font         = `${MARK_SIZE}px monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * TILE + offset - shiftX;   // top-left of mark
          const py = r * TILE + offset - shiftY;
          const cx = px + MARK_SIZE / 2;            // mark centre x
          const cy = py + MARK_SIZE / 2;            // mark centre y

          // Distance from mark centre to cursor + directional character
          let glow = 0;
          let char = '+';
          if (mouse) {
            const dx   = cx - mouse.x;
            const dy   = cy - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            glow = Math.max(0, 1 - dist / GLOW_RADIUS);
            glow = glow * glow; // quadratic — tighter falloff
            char = getGridChar(dx, dy);
          }

          ctx.save();

          ctx.globalAlpha = baseAlpha + (1 - baseAlpha) * glow;

          if (glow > 0) {
            // Blend fill color from base hash color toward the accent (glow) color
            const r = Math.round(accent[0] + (glowRgb[0] - accent[0]) * glow);
            const g = Math.round(accent[1] + (glowRgb[1] - accent[1]) * glow);
            const b = Math.round(accent[2] + (glowRgb[2] - accent[2]) * glow);
            ctx.fillStyle   = `rgb(${r},${g},${b})`;
            ctx.shadowColor = accentColor(glowRgb);
            ctx.shadowBlur  = 16 * dpr * glow;
          } else {
            ctx.fillStyle = accentColor(accent);
          }

          ctx.fillText(char, cx, cy);
          ctx.restore();
        }
      }
    }

    function schedule() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    }
    scheduleRef.current = schedule;

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    }
    function onMouseLeave() {
      mouseRef.current = null;
      schedule();
    }

    const scrollTarget = scrollEl?.current ?? null;
    function onScroll() { schedule(); }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', draw);
    scrollTarget?.addEventListener('scroll', onScroll, { passive: true });
    draw();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', draw);
      scrollTarget?.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Redraw when theme changes — data-theme attribute is set after mount so
  // the initial canvas draw may use stale CSS variables without this.
  useEffect(() => {
    scheduleRef.current();
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position:      'absolute',
        top:            0,
        left:           0,
        width:         '100%',
        height:        '100%',
        zIndex:         0,
        pointerEvents: 'none',
      }}
    />
  );
}
