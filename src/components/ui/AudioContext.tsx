import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';

/* ── Theme → track mapping ────────────────────────────────────────── */
const TRACK_MAP: Record<string, string> = {
  'stripedotdev': '/dotdev.mp3',
  'stripe-dev':   '/dark.mp3',
  'midnight':     '/midnight.mp3',
  'cybervision':  '/cybervision.mp3',
  'vaporwave':    '/vaporwave.mp3',
  '配色事典':      '/dictionary.mp3',
};

function trackForTheme(themeId: string): string {
  return TRACK_MAP[themeId] ?? '/dark.mp3';
}

/* ── Context shape ────────────────────────────────────────────────── */
export interface AudioState {
  isMuted:    boolean;
  toggleMute: () => void;
}

const AudioCtx = createContext<AudioState | null>(null);

export function useAudio(): AudioState {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used inside AudioProvider');
  return ctx;
}

/* ── Provider ─────────────────────────────────────────────────────── */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  /* create the audio element once on mount */
  useEffect(() => {
    const audio    = new Audio(trackForTheme(theme));
    audio.loop     = true;
    audio.muted    = true;
    audioRef.current = audio;
    audio.play().catch(() => {/* autoplay blocked — will play on next interaction */});

    return () => {
      audio.pause();
      audioRef.current = null;
    };
    // intentionally only on mount; theme changes handled separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* swap track when theme changes */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const newSrc = trackForTheme(theme);
    if (audio.src.endsWith(newSrc)) return; // already on this track
    audio.src = newSrc;
    audio.load();
    audio.play().catch(() => {});
  }, [theme]);

  /* keep audio.muted in sync with state */
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(m => !m);
    /* if audio was blocked by autoplay policy, try playing on first unmute */
    if (isMuted && audioRef.current?.paused) {
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <AudioCtx.Provider value={{ isMuted, toggleMute }}>
      {children}
    </AudioCtx.Provider>
  );
}
