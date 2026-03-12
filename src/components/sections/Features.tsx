import { forwardRef } from 'react';
import { InView } from '@/components/ui/in-view';
import { motion } from 'motion/react';

export const FEATURES = [
  {
    title: 'From local to live in one command',
    description:
      'Go from local development to a running production stack in minutes. One command provisions everything your app needs across providers.',
  },
  {
    title: 'Automated secure credentials',
    description:
      'Receive real credentials directly to a secret store—no copying keys across tabs. Agent-readable and auditable by default.',
  },
  {
    title: 'No vendor lock-in',
    description:
      'Keep full ownership of every account. Services are provisioned directly in your provider accounts—with the freedom to leave anytime.',
  },
  {
    title: 'Deploy with confidence',
    description:
      'Provision the same environment every time. Centralized billing and real-time usage visibility across providers means no surprises.',
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
          </div>
        );
      })}
    </div>
  );
});
