import { useState } from 'react';
import { motion } from 'motion/react';
import { TextLoop } from '@/components/ui/text-loop';

type Tab = 'npm' | 'brew';

const COMMANDS: Record<Tab, string> = {
  npm:  'npm install stripe\nnpm @stripe/projects init',
  brew: 'brew install stripe\nbrew @stripe/projects init',
};

const TABS: { id: Tab; label: string }[] = [
  { id: 'npm',  label: 'npm'      },
  { id: 'brew', label: 'Homebrew' },
];

/* ── pink corner brackets ─────────────────────────────────────────────────── */
const PINK   = 'var(--color-pink)';
const YELLOW = 'var(--color-yellow)';
const C = '10px'; // corner arm length

function PinkCorners({ children }: { children: React.ReactNode }) {
  const corners: { top?: 0; bottom?: 0; left?: 0; right?: 0; borderTop?: string; borderBottom?: string; borderLeft?: string; borderRight?: string }[] = [
    { top: 0,    left: 0,   borderTop:    `1px solid ${PINK}`, borderLeft:  `1px solid ${PINK}` },
    { top: 0,    right: 0,  borderTop:    `1px solid ${PINK}`, borderRight: `1px solid ${PINK}` },
    { bottom: 0, left: 0,   borderBottom: `1px solid ${PINK}`, borderLeft:  `1px solid ${PINK}` },
    { bottom: 0, right: 0,  borderBottom: `1px solid ${PINK}`, borderRight: `1px solid ${PINK}` },
  ];
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {corners.map((s, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: 'absolute',
            width: C,
            height: C,
            pointerEvents: 'none',
            ...s,
          }}
        />
      ))}
      {children}
    </span>
  );
}


/* ── InstallWindow ────────────────────────────────────────────────────────
   Standalone install-command block (no headline) used inside the desktop
   window. Identical segmented control + command box from the Hero.
─────────────────────────────────────────────────────────────────────────── */
export function InstallWindow() {
  const [copied, setCopied] = useState(false);
  const [tab, setTab]       = useState<Tab>('npm');

  const handleCopy = () => {
    navigator.clipboard.writeText(COMMANDS[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Segmented control — caret + label style, no borders */}
      <div className='flex items-stretch' style={{ flexShrink: 0 }}>
        {TABS.map((t, idx) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setCopied(false); }}
              className='py-2 text-sm font-mono transition-colors duration-150'
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4em',
                cursor: 'pointer',
                color: active ? 'var(--color-blue)' : 'var(--color-text-ui-subtle)',
                borderLeft: idx > 0 ? '1px solid var(--color-border-accent)' : undefined,
              }}
            >
              <span style={{ opacity: active ? 1 : 0, userSelect: 'none' }}>›</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: 'var(--color-border-accent)', flexShrink: 0 }} />

      {/* Command text — 24px padding all around */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', alignItems: 'center' }}>
        <div className='font-mono text-sm leading-relaxed' style={{ color: 'var(--color-text-ui)' }}>
          {COMMANDS[tab].split('\n').map((line, i) => <div key={i}>{line}</div>)}
        </div>
      </div>

      {/* Copy toolbar — bottom, center aligned, with top border */}
      <div style={{
        borderTop:      '1px solid var(--color-border-accent)',
        padding:        '0.6rem',
        display:        'flex',
        justifyContent: 'center',
        flexShrink:     0,
      }}>
        <button
          onClick={handleCopy}
          className='font-mono text-sm transition-colors duration-150'
          style={{ color: copied ? 'var(--color-yellow)' : PINK, cursor: 'pointer' }}
          aria-label='Copy command'
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

export function Hero() {
  const [copied, setCopied] = useState(false);
  const [tab, setTab]       = useState<Tab>('npm');

  const handleCopy = () => {
    navigator.clipboard.writeText(COMMANDS[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className='relative flex flex-col items-center justify-start min-h-screen pt-[76px] pb-16 px-6 overflow-hidden'>
      <div className='relative z-10 w-full max-w-4xl mx-auto text-center'>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className='text-5xl sm:text-6xl md:text-7xl font-light tracking-tight font-mono mb-6'
          style={{ lineHeight: 1.15 }}
        >
          <TextLoop interval={5.6} className='text-white'>
            {([
              ['Payments',   'Stripe',      'by'],
              ['Auth',       'Clerk',       'with'],
              ['Storage',    'Supabase',    'with'],
              ['Analytics',  'PostHog',     'with'],
              ['Databases',  'Neon',        'with'],
              ['Monitoring', 'Sentry',      'with'],
              ['AI search',  'Chroma',      'with'],
              ['Scale',      'PlanetScale', 'with'],
              ['Deploy',     'Railway',     'with'],
              ['Frontend',   'Vercel',      'with'],
            ] as [string, string, string][]).map(([category, partner, prep]) => (
              <span key={partner}>
                <span style={{ color: 'var(--color-text-ui-muted)' }}>{category} {prep} </span>
                <PinkCorners><span className='text-white'>{partner}</span></PinkCorners>
              </span>
            ))}
          </TextLoop>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className='text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed'
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Projects will scaffold production-ready applications with payments, auth,
          storage, and hosting — all provisioned and managed in a single tool.
        </motion.p>

        {/* CLI Command */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className='relative max-w-xl mx-auto mb-8'
        >
          {/* Segmented control */}
          <div
            className='inline-flex items-stretch mb-3'
            style={{
              border: '1px solid var(--color-border-accent)',
              background: 'var(--color-bg)',
            }}
          >
            {TABS.map((t, idx) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setCopied(false); }}
                  className='relative py-2 text-sm font-mono transition-colors duration-150'
                  style={{
                    width: 100,
                    cursor: 'pointer',
                    color: active ? 'var(--color-text-ui)' : 'var(--color-text-ui-subtle)',
                    borderLeft: idx > 0 ? '1px solid var(--color-border-accent)' : undefined,
                  }}
                >
                  {/* Yellow corner brackets on active tab */}
                  {active && (['tl','tr','bl','br'] as const).map(corner => {
                    const isTop  = corner === 'tl' || corner === 'tr';
                    const isLeft = corner === 'tl' || corner === 'bl';
                    return (
                      <span
                        key={corner}
                        aria-hidden
                        style={{
                          position: 'absolute',
                          width: 6, height: 6,
                          top:    isTop  ? -1 : undefined,
                          bottom: !isTop ? -1 : undefined,
                          left:   isLeft  ? -1 : undefined,
                          right:  !isLeft ? -1 : undefined,
                          borderTop:    isTop  ? `1px solid ${YELLOW}` : undefined,
                          borderBottom: !isTop ? `1px solid ${YELLOW}` : undefined,
                          borderLeft:   isLeft  ? `1px solid ${YELLOW}` : undefined,
                          borderRight:  !isLeft ? `1px solid ${YELLOW}` : undefined,
                          pointerEvents: 'none',
                          zIndex: 1,
                        }}
                      />
                    );
                  })}
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Command box — styled like the TerminalBanner */}
          <div
            className='relative'
            style={{
              border: '1px solid var(--color-border-accent)',
              background: 'var(--color-bg)',
            }}
          >
            {/* Pink 8px corner brackets */}
            {(['tl','tr','bl','br'] as const).map(corner => {
              const isTop  = corner === 'tl' || corner === 'tr';
              const isLeft = corner === 'tl' || corner === 'bl';
              return (
                <span
                  key={corner}
                  aria-hidden
                  style={{
                    position: 'absolute',
                    width: 8, height: 8,
                    top:    isTop  ? -1 : undefined,
                    bottom: !isTop ? -1 : undefined,
                    left:   isLeft  ? -1 : undefined,
                    right:  !isLeft ? -1 : undefined,
                    borderTop:    isTop  ? `1px solid ${PINK}` : undefined,
                    borderBottom: !isTop ? `1px solid ${PINK}` : undefined,
                    borderLeft:   isLeft  ? `1px solid ${PINK}` : undefined,
                    borderRight:  !isLeft ? `1px solid ${PINK}` : undefined,
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
              );
            })}

            <div className='flex items-center gap-3 px-5 py-4'>
              {/* Command lines */}
              <div className='flex-1 text-left font-mono text-sm leading-relaxed' style={{ color: 'var(--color-text-ui)' }}>
                {COMMANDS[tab].split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className='shrink-0 font-mono text-sm transition-colors duration-150'
                style={{ color: copied ? 'var(--color-cyan)' : 'var(--color-text-ui-muted)', cursor: 'pointer' }}
                aria-label='Copy command'
              >
                <motion.span
                  key={copied ? 'check' : 'copy'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </motion.span>
              </button>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className='absolute bottom-8 left-1/2 -translate-x-1/2'
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className='flex flex-col items-center gap-1'
        >
          <div
            className='w-px h-8'
            style={{ background: 'linear-gradient(to bottom, transparent, var(--color-border))' }}
          />
          <div
            className='w-1 h-1 rounded-full'
            style={{ background: 'var(--color-border)' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
