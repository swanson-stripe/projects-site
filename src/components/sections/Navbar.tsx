import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Docs', href: 'https://stripe.com/docs', external: true },
  { label: 'Integrations', href: '#integrations' },
  { label: 'GitHub', href: 'https://github.com/stripe', external: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className='fixed top-0 left-0 right-0 z-40 transition-all duration-300'
        style={{
          background: scrolled ? 'rgba(33,37,44,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
        }}
      >
        <div className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
          {/* Logo */}
          <a href='/' className='flex items-center gap-2.5 group'>
            <div
              className='relative w-7 h-7 rounded-lg flex items-center justify-center'
              style={{ background: 'var(--color-stripe-purple)' }}
            >
              <svg width='14' height='18' viewBox='0 0 14 18' fill='none'>
                <path
                  d='M6.5 0C3.5 0 1 1.8 1 4.5c0 2.4 1.8 3.6 4.5 4.3C8 9.5 9 10 9 11c0 1-1 1.6-2.5 1.6C4.5 12.6 3 12 1.5 11L0 13.5C2 15 4 15.8 6.5 15.8 9.7 15.8 13 14 13 11c0-2.5-1.8-3.8-4.8-4.6C6 5.7 5 5.3 5 4.3c0-.8.8-1.4 2-1.4 1.5 0 2.8.5 4 1.3L12.5 2C11 .8 9 0 6.5 0Z'
                  fill='white'
                />
              </svg>
            </div>
            <div className='flex items-baseline gap-1'>
              <span className='font-semibold text-sm text-white'>Stripe</span>
              <span className='font-medium text-sm' style={{ color: 'var(--color-text-muted)' }}>
                Projects
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className='hidden md:flex items-center gap-1'>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className='inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-all duration-200'
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-surface)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-secondary)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }}
              >
                {link.label}
                {link.external && <ExternalLink className='w-3 h-3' />}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className='hidden md:flex items-center gap-3'>
            <a
              href='#get-started'
              className='inline-flex items-center gap-1.5 rounded-lg font-semibold px-4 py-2 text-sm transition-all duration-200'
              style={{
                background: 'var(--color-surface-2)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-strong)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)';
              }}
            >
              Get started
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className='md:hidden p-2 transition-colors'
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {mobileOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className='fixed top-16 left-0 right-0 z-30 md:hidden'
          style={{
            background: 'rgba(33,37,44,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <nav className='flex flex-col px-6 py-4 gap-1'>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={() => setMobileOpen(false)}
                className='flex items-center gap-2 px-3 py-3 text-sm rounded-lg transition-all duration-200'
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {link.label}
                {link.external && <ExternalLink className='w-3 h-3' />}
              </a>
            ))}
            <a
              href='#get-started'
              className='mt-2 text-center rounded-lg font-semibold px-4 py-2.5 text-sm text-white'
              style={{ background: 'var(--color-stripe-purple)' }}
            >
              Get started
            </a>
          </nav>
        </motion.div>
      )}
    </>
  );
}
