import { useEffect, useRef } from 'react';

const TILE         = 104;   // px between mark centres (halved from 208)
const MARK_SIZE    = 9;     // hash mark size in CSS px (matches SVG viewBox)
const GLOW_RADIUS  = 130;   // px — distance at which glow starts
const NORMAL_ALPHA = 0.12;

// Path from hash.svg (9×9 viewBox) — drawn directly so we can tint it
const HASH_PATH = new Path2D('M5 4H9V5H5V9H4V5H0V4H4V0H5V4Z');

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

// Read --color-pink from the document at call time
function getAccentRgb(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--color-pink').trim();
  if (raw.startsWith('#')) return parseHex(raw);
  return [0xAA, 0xE8, 0x7B]; // fallback: default lime green
}

function accentColor(accent: [number, number, number]) {
  return `rgb(${accent[0]},${accent[1]},${accent[2]})`;
}

export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef<{ x: number; y: number } | null>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    function draw() {
      const dpr   = window.devicePixelRatio || 1;
      const w     = window.innerWidth;
      const h     = window.innerHeight;
      const mouse = mouseRef.current;
      const accent = getAccentRgb();

      // Resize bitmap to physical pixels
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      // All subsequent coords in CSS px
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const offset = (TILE - MARK_SIZE) / 2;
      const cols   = Math.ceil(w / TILE) + 1;
      const rows   = Math.ceil(h / TILE) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * TILE + offset;   // top-left of mark
          const py = r * TILE + offset;

          // Distance from mark centre to cursor
          let glow = 0;
          if (mouse) {
            const dx   = px + MARK_SIZE / 2 - mouse.x;
            const dy   = py + MARK_SIZE / 2 - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            glow = Math.max(0, 1 - dist / GLOW_RADIUS);
            glow = glow * glow; // quadratic — tighter falloff
          }

          ctx.save();
          ctx.translate(px, py);

          const color = accentColor(accent);
          ctx.fillStyle = color;

          if (glow > 0) {
            ctx.globalAlpha = NORMAL_ALPHA + (1 - NORMAL_ALPHA) * glow;
            ctx.shadowColor = color;
            ctx.shadowBlur  = 10 * dpr * glow;
          } else {
            ctx.globalAlpha = NORMAL_ALPHA;
          }

          ctx.fill(HASH_PATH);
          ctx.restore();
        }
      }
    }

    function schedule() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    }
    function onMouseLeave() {
      mouseRef.current = null;
      schedule();
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', draw);
    draw();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', draw);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
