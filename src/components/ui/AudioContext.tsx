import { createContext, useContext, useEffect, useRef, useState } from 'react';

/* ── SoundCloud Widget API types ──────────────────────────────────── */
interface SCWidget {
  play:            () => void;
  pause:           () => void;
  toggle:          () => void;
  seekTo:          (ms: number) => void;
  setVolume:       (vol: number) => void;
  getDuration:     (cb: (ms: number) => void) => void;
  getCurrentSound: (cb: (s: SCSound) => void) => void;
  bind:            (event: string, cb: (e?: unknown) => void) => void;
}
interface SCSound {
  title:       string;
  user:        { username: string };
  artwork_url: string | null;
}
interface SCProgressEvent { currentPosition: number }

type SCWidgetFn = ((el: HTMLIFrameElement) => SCWidget) & {
  Events: Record<string, string>;
};
declare global {
  interface Window { SC?: { Widget: SCWidgetFn } }
}

/* ── Track ────────────────────────────────────────────────────────── */
const TRACK_URL = 'https://soundcloud.com/platform/fred-again-boiler-room-london';

const SC_WIDGET_URL =
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(TRACK_URL)}` +
  `&auto_play=true&hide_related=true&show_comments=false` +
  `&show_user=false&show_reposts=false&show_teaser=false&visual=false`;

/* ── Context shape ────────────────────────────────────────────────── */
export interface AudioState {
  isPlaying: boolean;
  position:  number;
  duration:  number;
  volume:    number;
  meta:      { title: string; artist: string; art: string } | null;
  ready:     boolean;
  toggle:     () => void;
  seekTo:     (ms: number) => void;
  setVolume:  (v: number) => void;
  skipBack:   () => void;
  skipForward:() => void;
}

const AudioCtx = createContext<AudioState | null>(null);

export function useAudio(): AudioState {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used inside AudioProvider');
  return ctx;
}

/* ── Provider ─────────────────────────────────────────────────────── */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SCWidget | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [position,  setPosition]  = useState(0);
  const [duration,  setDuration]  = useState(0);
  const [volume,    setVolume_]   = useState(0);   // muted on start
  const [ready,     setReady]     = useState(false);
  const [meta, setMeta] = useState<{ title: string; artist: string; art: string } | null>(null);

  /* load SC Widget API script once */
  useEffect(() => {
    if (document.getElementById('sc-widget-api')) return;
    const script  = document.createElement('script');
    script.id     = 'sc-widget-api';
    script.src    = 'https://w.soundcloud.com/player/api.js';
    script.async  = true;
    document.head.appendChild(script);
  }, []);

  /* bind widget once iframe + SC global are ready */
  useEffect(() => {
    let tries = 0;
    const tid = setInterval(() => {
      if (!iframeRef.current || !window.SC) {
        if (++tries >= 40) clearInterval(tid);
        return;
      }
      clearInterval(tid);

      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;
      const Ev = window.SC.Widget.Events;

      widget.bind(Ev.READY, () => {
        setReady(true);
        widget.setVolume(0);   // start muted
        widget.play();
        widget.getDuration((d: number) => setDuration(d));
        widget.getCurrentSound((sound: SCSound) => {
          if (!sound) return;
          const raw = sound.artwork_url ?? '';
          setMeta({
            title:  sound.title,
            artist: sound.user?.username ?? '',
            art:    raw.replace('-large', '-t500x500'),
          });
        });
      });

      widget.bind(Ev.PLAY,  () => setIsPlaying(true));
      widget.bind(Ev.PAUSE, () => setIsPlaying(false));
      widget.bind(Ev.PLAY_PROGRESS, (e: unknown) => {
        setPosition((e as SCProgressEvent).currentPosition);
      });
      widget.bind(Ev.FINISH, () => { setIsPlaying(false); setPosition(0); });
    }, 100);

    return () => clearInterval(tid);
  }, []);

  /* controls */
  const toggle      = () => widgetRef.current?.toggle();
  const seekTo      = (ms: number) => { setPosition(ms); widgetRef.current?.seekTo(ms); };
  const setVolume   = (v: number)  => { setVolume_(v);   widgetRef.current?.setVolume(v); };
  const skipBack    = () => seekTo(Math.max(0, position - 15_000));
  const skipForward = () => seekTo(Math.min(duration, position + 15_000));

  const value: AudioState = {
    isPlaying, position, duration, volume, meta, ready,
    toggle, seekTo, setVolume, skipBack, skipForward,
  };

  return (
    <AudioCtx.Provider value={value}>
      {/* hidden SC Widget iframe — always mounted so audio runs from page load */}
      <iframe
        ref={iframeRef}
        src={SC_WIDGET_URL}
        allow='autoplay'
        title='SC player'
        style={{ position: 'fixed', width: 1, height: 1, opacity: 0, pointerEvents: 'none', top: -10, left: -10 }}
      />
      {children}
    </AudioCtx.Provider>
  );
}
