import { SkipBack, SkipForward, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from './AudioContext';

/* ── helpers ──────────────────────────────────────────────────────── */
function fmt(ms: number): string {
  const s   = Math.floor(ms / 1000);
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

const BORDER = '1px solid var(--color-border-accent)';

/* ── MusicPlayer ─────────────────────────────────────────────────────
   Pure UI — reads from AudioContext. No iframe here; that lives in
   AudioProvider which is always mounted at the app root.
──────────────────────────────────────────────────────────────────── */
export function MusicPlayer() {
  const {
    isPlaying, position, duration, volume, meta,
    toggle, seekTo, setVolume, skipBack, skipForward,
  } = useAudio();

  const remaining = Math.max(0, duration - position);

  const handleSeek   = (e: React.ChangeEvent<HTMLInputElement>) => seekTo(Number(e.target.value));
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(Number(e.target.value));
  const toggleMute   = () => setVolume(volume > 0 ? 0 : 80);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>

      {/* ── artwork + meta ─────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.75rem', padding: '0.875rem', borderBottom: BORDER }}>
        <div style={{ width: 64, height: 64, flexShrink: 0, border: BORDER, background: '#1a1e26', overflow: 'hidden' }}>
          {meta?.art
            ? <img src={meta.art} alt='artwork' style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%' }} />
          }
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, gap: 4 }}>
          <div style={{ color: 'var(--color-text-ui)', fontWeight: 600, fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {meta ? meta.title : 'Loading…'}
          </div>
          <div style={{ color: 'var(--color-text-ui-muted)', fontSize: '0.68rem' }}>
            {meta?.artist ?? ''}
          </div>
        </div>
      </div>

      {/* ── scrubber ───────────────────────────────────────────── */}
      <div style={{ padding: '0.75rem 0.875rem 0.5rem', borderBottom: BORDER }}>
        <input
          type='range' className='player-range'
          min={0} max={duration || 1} value={position}
          onChange={handleSeek}
          style={{ width: '100%', display: 'block' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-ui-muted)', marginTop: 4, fontSize: '0.65rem' }}>
          <span>{fmt(position)}</span>
          <span>−{fmt(remaining)}</span>
        </div>
      </div>

      {/* ── transport ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '0.75rem', borderBottom: BORDER }}>
        <button onClick={skipBack}    aria-label='−15s'                         style={btnStyle}><SkipBack    size={15} strokeWidth={1.5} /></button>
        <button onClick={toggle}      aria-label={isPlaying ? 'Pause' : 'Play'} style={{ ...btnStyle, color: 'var(--color-text-ui)' }}>
          {isPlaying ? <Pause size={18} strokeWidth={1.5} /> : <Play size={18} strokeWidth={1.5} />}
        </button>
        <button onClick={skipForward} aria-label='+15s'                         style={btnStyle}><SkipForward size={15} strokeWidth={1.5} /></button>
      </div>

      {/* ── volume ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem' }}>
        <button onClick={toggleMute} aria-label='Toggle mute' style={btnStyle}>
          {volume === 0 ? <VolumeX size={13} strokeWidth={1.5} /> : <Volume2 size={13} strokeWidth={1.5} />}
        </button>
        <input
          type='range' className='player-range'
          min={0} max={100} value={volume}
          onChange={handleVolume}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'none', border: 'none', padding: 0,
  cursor: 'pointer', color: 'var(--color-text-ui-muted)',
  display: 'flex', alignItems: 'center',
};
