import { Terminal, Server, Bot, KeyRound, CreditCard, Link2 } from 'lucide-react';
import { InView } from '@/components/ui/in-view';
import { motion } from 'motion/react';

const FEATURES = [
  {
    icon: Terminal,
    graphic: '/graphic3.png',
    title: 'No dashboard hopping',
    description:
      'Eliminate the "dashboard maze" of dozens of sign-ups, configuration steps, and API key hunts. With just one command, you can provision a complete, working stack directly from your CLI.',
    iconBg: 'rgba(245,158,11,0.1)',
    iconBorder: 'rgba(245,158,11,0.2)',
    iconColor: '#f59e0b',
  },
  {
    icon: Server,
    graphic: '/graphic1.png',
    title: 'Real infrastructure without lock-in',
    description:
      'We provision real services, not sandboxes. You maintain direct, unintermediated relationships with every provider — the accounts are in your name, the credentials are yours, and if you ever leave, you keep everything.',
    iconBg: 'rgba(99,91,255,0.1)',
    iconBorder: 'rgba(99,91,255,0.2)',
    iconColor: '#635bff',
  },
  {
    icon: Bot,
    graphic: '/graphic5.png',
    title: 'Built for AI-assisted development',
    description:
      'AI agents can write great code, but they historically couldn\'t provision the infrastructure to run it. This tool is machine-readable and tool-callable, giving coding agents the ability to reliably provision and wire up real infrastructure.',
    iconBg: 'rgba(0,179,212,0.1)',
    iconBorder: 'rgba(0,179,212,0.2)',
    iconColor: '#00b3d4',
  },
  {
    icon: KeyRound,
    graphic: '/graphic2.png',
    title: 'A central hub for keys and secrets',
    description:
      'Stop scattering API keys across multiple dashboards and local files. One secure, central place to manage credentials and environment variables across your entire stack, automatically injected into your project environment.',
    iconBg: 'rgba(34,197,94,0.1)',
    iconBorder: 'rgba(34,197,94,0.2)',
    iconColor: '#22c55e',
  },
  {
    icon: CreditCard,
    graphic: '/graphic6.png',
    title: 'Seamless upgrades',
    description:
      'Manage paid plan selections and billing upgrades across multiple providers without ever leaving your workflow. One payment method, one place to pay — and your agent can handle it all on your behalf.',
    iconBg: 'rgba(244,63,94,0.1)',
    iconBorder: 'rgba(244,63,94,0.2)',
    iconColor: '#f43f5e',
  },
  {
    icon: Link2,
    graphic: '/graphic4.png',
    title: 'Bring your existing stack',
    description:
      'You don\'t have to start from scratch. Easily link your existing third-party service accounts and initialize projects on your current Stripe account, bringing your established infrastructure under one coherent control plane.',
    iconBg: 'rgba(251,146,60,0.1)',
    iconBorder: 'rgba(251,146,60,0.2)',
    iconColor: '#fb923c',
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

        <div className='flex flex-col gap-3'>
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

                <h3 className='text-base font-semibold text-white mb-2'>
                  {feature.title}
                </h3>
                <p
                  className='text-base leading-relaxed'
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
  const PAD = '1.25rem';
  return (
    <div style={{ padding: PAD, overflowY: 'auto', scrollbarWidth: 'none', fontFamily: 'var(--font-mono)' }}>
      <h2 style={{
        fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-ui)',
        marginBottom: PAD, lineHeight: 1.3, textAlign: 'center',
      }}>
        From idea to production.<br />One command. Real infrastructure.
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: PAD }}>
        {FEATURES.map(f => (
          <div
            key={f.title}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.875rem',
              alignItems: 'flex-start',
              border: '1px solid var(--color-border-accent)',
              padding: '0.875rem',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{
              width: 140, height: 140, flexShrink: 0,
              border: '1px solid var(--color-text-ui)',
              overflow: 'hidden',
            }}>
              <img
                src={f.graphic}
                alt={f.title}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-ui)', margin: '0 0 0.25rem' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-ui)', lineHeight: 1.55, margin: 0 }}>
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
