import { Zap, Lock, Layers, RefreshCw } from 'lucide-react';
import { InView } from '@/components/ui/in-view';
import { motion } from 'motion/react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Zero config payments',
    description:
      'Stripe is pre-wired. Accept one-time payments, subscriptions, and invoices from day one — no boilerplate required.',
    iconBg: 'rgba(245,158,11,0.1)',
    iconBorder: 'rgba(245,158,11,0.2)',
    iconColor: '#f59e0b',
  },
  {
    icon: Layers,
    title: 'Full-stack scaffolding',
    description:
      'Choose your frontend, backend, and database. Projects generates a working app with all layers connected and ready to deploy.',
    iconBg: 'rgba(99,91,255,0.1)',
    iconBorder: 'rgba(99,91,255,0.2)',
    iconColor: '#635bff',
  },
  {
    icon: Lock,
    title: 'Auth out of the box',
    description:
      'User authentication is configured with your chosen provider. Login, sign-up, and session management work on first boot.',
    iconBg: 'rgba(0,179,212,0.1)',
    iconBorder: 'rgba(0,179,212,0.2)',
    iconColor: '#00b3d4',
  },
  {
    icon: RefreshCw,
    title: 'Deploy in one command',
    description:
      'From scaffolding to production in seconds. Projects handles environment variables, secrets, and deployment configuration for you.',
    iconBg: 'rgba(34,197,94,0.1)',
    iconBorder: 'rgba(34,197,94,0.2)',
    iconColor: '#22c55e',
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
          <p
            className='text-xs font-medium tracking-widest uppercase mb-3'
            style={{ color: 'var(--color-text-muted)' }}
          >
            Why Projects
          </p>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
            Everything you need, nothing you don't
          </h2>
          <p
            className='text-lg max-w-xl mx-auto'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Stop spending weekends wiring up the same boilerplate. Projects handles
            the scaffolding so you can focus on what makes your product unique.
          </p>
        </InView>

        <div className='grid sm:grid-cols-2 gap-3'>
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
                className='group relative rounded-2xl p-6 h-full overflow-hidden cursor-default'
                style={{
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                }}
                whileHover={{
                  borderColor: 'var(--color-border-strong)',
                  y: -2,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Icon */}
                <div
                  className='w-10 h-10 rounded-xl flex items-center justify-center mb-5'
                  style={{
                    background: feature.iconBg,
                    border: `1px solid ${feature.iconBorder}`,
                    color: feature.iconColor,
                  }}
                >
                  <feature.icon className='w-4.5 h-4.5' />
                </div>

                <h3 className='text-sm font-semibold text-white mb-2'>
                  {feature.title}
                </h3>
                <p
                  className='text-sm leading-relaxed'
                  style={{ color: 'var(--color-text-muted)' }}
                >
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
export function FeaturesContent() {
  return (
    <div style={{ padding: '1.25rem', overflowY: 'auto', scrollbarWidth: 'none' }}>
      <p style={{
        fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--color-text-ui-subtle)', marginBottom: '0.375rem',
        fontFamily: 'var(--font-mono)',
      }}>
        Why Projects
      </p>
      <h2 style={{
        fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-ui)',
        marginBottom: '0.875rem', lineHeight: 1.3,
      }}>
        Everything you need,<br />nothing you don't
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {FEATURES.map(f => (
          <div
            key={f.title}
            style={{
              border: '1px solid var(--color-border-accent)',
              padding: '0.875rem',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: f.iconBg,
              border: `1px solid ${f.iconBorder}`, color: f.iconColor,
              marginBottom: '0.625rem', flexShrink: 0,
            }}>
              <f.icon style={{ width: 14, height: 14 }} />
            </div>
            <h3 style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-ui)', marginBottom: '0.25rem' }}>
              {f.title}
            </h3>
            <p style={{ fontSize: '0.65rem', color: 'var(--color-text-ui-muted)', lineHeight: 1.55, margin: 0 }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
