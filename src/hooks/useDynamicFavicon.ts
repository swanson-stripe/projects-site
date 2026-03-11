import { useEffect } from 'react';
import { useTheme, THEMES } from '@/components/ui/ThemeContext';

export function useDynamicFavicon() {
  const { theme } = useTheme();

  useEffect(() => {
    const accent = THEMES.find(t => t.id === theme)?.accent ?? '#AAE87B';
    const SIZE = 64;

    const canvas = document.createElement('canvas');
    canvas.width  = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // 2×4 dot grid matching the WelcomeBox logo — no font dependency
    const DOT = SIZE * 0.14;   // dot size
    const GAP = SIZE * 0.08;   // gap between dots
    const COLS = 2, ROWS = 4;
    const gridW = COLS * DOT + (COLS - 1) * GAP;
    const gridH = ROWS * DOT + (ROWS - 1) * GAP;
    const ox = (SIZE - gridW) / 2;
    const oy = (SIZE - gridH) / 2;
    // lit dots: (col=1,row=0), (col=1,row=1), (col=0,row=2), (col=0,row=3)
    const lit: [number, number][] = [[1,0],[1,1],[0,2],[0,3]];
    ctx.fillStyle = accent;
    for (const [col, row] of lit) {
      const rx = Math.round(ox + col * (DOT + GAP));
      const ry = Math.round(oy + row * (DOT + GAP));
      ctx.fillRect(rx, ry, Math.round(DOT), Math.round(DOT));
    }

    const dataUrl = canvas.toDataURL('image/png');
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = dataUrl;
  }, [theme]);
}
