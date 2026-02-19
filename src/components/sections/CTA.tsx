import { ArrowRight, Terminal } from 'lucide-react';
import { InView } from '@/components/ui/in-view';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy } from 'lucide-react';

const CLI_COMMAND = 'stripe projects create my-app';

export function CTA() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CLI_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id='get-started' className='relative py-24 px-6'>
      <div className='max-w-3xl mx-auto'>
        <InView
          variants={{
            hidden: { opacity: 0, y: 32 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div
            className='relative rounded-3xl p-10 text-center overflow-hidden'
            style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <p
              className='text-xs font-medium tracking-widest uppercase mb-4'
              style={{ color: 'var(--color-text-muted)' }}
            >
              Get started
            </p>
            <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
              Start building in seconds
            </h2>
            <p
              className='mb-8 max-w-md mx-auto'
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Run one command. Get a production-ready Stripe application with your
              preferred tech stack.
            </p>

            {/* CLI block */}
            <div className='relative max-w-sm mx-auto mb-8'>
              <div
                className='flex items-center gap-3 rounded-xl px-5 py-4'
                style={{
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                }}
              >
                <Terminal
                  className='w-4 h-4 shrink-0'
                  style={{ color: 'var(--color-cyan)' }}
                />
                <div className='flex-1 text-left font-mono text-sm'>
                  <span style={{ color: 'var(--color-cyan)' }}>$ </span>
                  <TextShimmer
                    as='span'
                    className='text-sm font-mono [--base-color:#3d607e] [--base-gradient-color:#8baec8]'
                    duration={3}
                    spread={3}
                  >
                    {CLI_COMMAND}
                  </TextShimmer>
                </div>
                <button
                  onClick={handleCopy}
                  className='flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200'
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label='Copy command'
                >
                  <motion.div
                    key={copied ? 'check' : 'copy'}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {copied ? (
                      <Check className='w-4 h-4' style={{ color: 'var(--color-cyan)' }} />
                    ) : (
                      <Copy className='w-4 h-4' />
                    )}
                  </motion.div>
                </button>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
              <a
                href='https://stripe.com/docs'
                target='_blank'
                rel='noopener noreferrer'
                className='group inline-flex items-center gap-2 rounded-xl font-semibold px-6 py-3 text-sm text-white transition-all duration-200 hover:-translate-y-0.5'
                style={{ background: 'var(--color-stripe-purple)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-stripe-purple-hover)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-stripe-purple)';
                }}
              >
                Read the docs
                <ArrowRight className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </a>
              <a
                href='https://github.com/stripe'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-xl font-semibold px-6 py-3 text-sm transition-all duration-200'
                style={{
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-strong)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-secondary)';
                }}
              >
                View on GitHub
              </a>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}
