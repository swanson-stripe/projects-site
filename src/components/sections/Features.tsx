import { forwardRef } from 'react';
import { InView } from '@/components/ui/in-view';
import { motion } from 'motion/react';

export const FEATURES = [
  {
    title: 'Move from local to live in one command',
    description:
      'Provision hosting, databases, auth, and monitoring across providers from your terminal — and get a production environment in minutes.',
    bullets: [
      'Projects provisions resources and returns ready-to-use keys.',
      'Launch or hand off to an agent to deploy your app automatically.',
    ],
  },
  {
    title: 'Automated secure credentials',
    description:
      'Projects return deterministic, agent-readable credentials into a controlled secret store so agents can act safely and humans can audit access.',
    bullets: [
      'Real keys are provisioned directly in your provider accounts and written to your secret store — no raw keys leaked into the open.',
      'Credentials are agent-readable and auditable, enabling reliable agent workflows.',
      'Centralized secrets reduce orphaned resources and credential sprawl.',
    ],
  },
  {
    title: 'No vendor lock-in',
    description:
      'Services are configured in your own provider accounts — full portability, and direct provider relationships.',
    bullets: [
      'Link to existing provider accounts or create new accounts automatically; Projects provisions into your accounts, preserving ownership.',
      'Opt into unified billing or use provider billing directly.',
    ],
  },
  {
    title: 'Deploy with confidence',
    description:
      'Deterministic provisioning, usage visibility, and centralized billing options reduce deployment toil and make releases predictable.',
    bullets: [
      'Side-by-side pricing and real-time usage let you monitor consumption and prevent surprises.',
      "One-time payment setup with tokenized payment credentials (Stripe's Shared Payment Token) simplifies upgrades across providers.",
      'Deterministic provisioning reduces deployment failures common with AI-assisted workflows.',
    ],
  },
];

export function Features() {
  return (
    <section className='relative py-24 px-6'>
      <div className='max-w-5xl mx-auto'>
        {/* Divider */}
        <div
          className='w-px h-12 mx-auto mb-16'
          style={{ background: 'linear-gradient(to bottom, transparent, var(--color-border))' }}
        />

        <InView
          className='text-center mb-14'
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
            From idea to production.<br />One command. Real infrastructure.
          </h2>
        </InView>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {FEATURES.map((feature, i) => (
            <InView
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.98 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <motion.div
                className='group relative rounded-2xl p-6 h-full overflow-hidden cursor-default flex flex-col gap-3'
                style={{
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                }}
                whileHover={{ borderColor: 'var(--color-border-strong)', y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className='text-base font-semibold text-white'>
                  {feature.title}
                </h3>
                <p className='text-base leading-relaxed' style={{ color: 'var(--color-text-muted)' }}>
                  {feature.description}
                </p>
                <ul className='flex flex-col gap-1 mt-1' style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {feature.bullets.map((b, bi) => (
                    <li key={bi} className='flex gap-2 items-baseline text-sm' style={{ color: 'var(--color-text-muted)' }}>
                      <span style={{ color: 'var(--color-pink)', flexShrink: 0 }}>›</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FeaturesContent ──────────────────────────────────────────────────────────
   Window-safe version: no InView / Intersection Observer — renders immediately.
   Used inside the why.md desktop window where the IO never fires.
─────────────────────────────────────────────────────────────────────────────── */
export const FeaturesContent = forwardRef(function FeaturesContent() {
  const items = FEATURES;
  const PAD = '1.25rem';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      fontFamily: 'var(--font-mono)',
    }}>
      {items.map((f, i) => {
        const isLastRow  = i >= items.length - 2;
        const isRightCol = i % 2 === 1;
        return (
          <div
            key={f.title}
            style={{
              padding:      '1.25rem',
              borderBottom: isLastRow  ? undefined : '1px solid var(--color-border-accent)',
              borderRight:  isRightCol ? undefined : '1px solid var(--color-border-accent)',
              background:   'var(--color-surface)',
              display:      'flex',
              flexDirection:'column',
              gap:          '0.5rem',
            }}
          >
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-ui)', margin: 0, lineHeight: 1.3 }}>
              {f.title}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-ui-muted)', lineHeight: 1.6, margin: 0 }}>
              {f.description}
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {f.bullets.map((b, bi) => (
                <li key={bi} style={{ display: 'flex', gap: '0.4rem', alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--color-pink)', flexShrink: 0, fontSize: '0.65rem' }}>›</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-ui-muted)', lineHeight: 1.55 }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
});
