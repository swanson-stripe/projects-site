import { useState } from 'react';
import { GridBackground } from '@/components/ui/grid-background';
import { StatusBar } from '@/components/sections/TerminalBanner';
import { Window } from '@/components/desktop/Window';
import { useIsMobile } from '@/hooks/useIsMobile';

const PASSWORD    = 'fabric_';
const STORAGE_KEY = 'pw_auth';

const WIN_W = 320;
const WIN_H = 164;

function centerPos(statusbarH: number) {
  const vw = typeof window !== 'undefined' ? window.innerWidth  : 800;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 600;
  return {
    x: Math.round((vw - WIN_W) / 2),
    y: Math.round(statusbarH + (vh - statusbarH - WIN_H) / 2),
  };
}

/* ── GateScreen ──────────────────────────────────────────────────────────── */
function GateScreen({ onAuth }: { onAuth: () => void }) {
  const isMobile    = useIsMobile();
  const statusbarH  = isMobile ? 52 : 40;

  const [pos, setPos]     = useState(() => centerPos(statusbarH));
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1');
      onAuth();
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 1800);
    }
  }

  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        height:         '100vh',
        overflow:       'hidden',
        background:     'var(--color-bg)',
      }}
    >
      <StatusBar gateMode />

      <div style={{ flex: 1, position: 'relative' }}>
        <GridBackground />

        <Window
          title='password'
          x={pos.x}
          y={pos.y}
          w={WIN_W}
          h={WIN_H}
          zIndex={100}
          isActive
          onFocus={() => {}}
          onMove={(x, y) => setPos({ x, y })}
          onResize={() => {}}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display:        'flex',
              flexDirection:  'column',
              gap:            '0.75rem',
              padding:        '1rem 1.25rem',
              fontFamily:     'var(--font-mono)',
              fontSize:       '0.75rem',
            }}
          >
            <input
              type='password'
              value={input}
              onChange={e => { setInput(e.target.value); setError(false); }}
              autoFocus
              autoComplete='off'
              spellCheck={false}
              placeholder='enter password'
              style={{
                background:     'var(--color-surface)',
                border:         '1px solid var(--color-border-accent)',
                color:          'var(--color-text-ui)',
                fontFamily:     'inherit',
                fontSize:       'inherit',
                padding:        '0.4rem 0.6rem',
                outline:        'none',
                width:          '100%',
                boxSizing:      'border-box',
                letterSpacing:  '0.12em',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  color:      'var(--color-pink)',
                  opacity:    error ? 1 : 0,
                  transition: 'opacity 0.15s ease',
                  fontSize:   '0.65rem',
                  letterSpacing: '0.08em',
                }}
              >
                incorrect
              </span>

              <button
                type='submit'
                style={{
                  background:     'none',
                  border:         '1px solid var(--color-border-accent)',
                  color:          'var(--color-text-ui-muted)',
                  fontFamily:     'inherit',
                  fontSize:       'inherit',
                  padding:        '0.3rem 0.75rem',
                  cursor:         'pointer',
                  letterSpacing:  '0.06em',
                }}
              >
                enter
              </button>
            </div>
          </form>
        </Window>
      </div>
    </div>
  );
}

/* ── PasswordGate ────────────────────────────────────────────────────────── */
export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1',
  );

  if (authed) return <>{children}</>;

  return <GateScreen onAuth={() => setAuthed(true)} />;
}
