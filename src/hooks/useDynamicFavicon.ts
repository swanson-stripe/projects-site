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
    ctx.fillStyle    = accent;
    ctx.font         = `${SIZE * 0.9}px sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⡜', SIZE / 2, SIZE / 2);

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
