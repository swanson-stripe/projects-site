import { ExternalLink } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Docs', href: 'https://stripe.com/docs', external: true },
  { label: 'GitHub', href: 'https://github.com/stripe', external: true },
  { label: 'Twitter', href: 'https://twitter.com/stripe', external: true },
  { label: 'Status', href: 'https://status.stripe.com', external: true },
];

export function Footer() {
  return (
    <footer
      className='relative py-10 px-6'
      style={{ borderTop: '1px solid var(--color-border-subtle)' }}
    >
      <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6'>
        {/* Logo */}
        <div className='flex items-center gap-2'>
          <div
            className='w-6 h-6 rounded-md flex items-center justify-center'
            style={{ background: 'var(--color-stripe-purple)' }}
          >
            <svg width='12' height='16' viewBox='0 0 14 18' fill='none'>
              <path
                d='M6.5 0C3.5 0 1 1.8 1 4.5c0 2.4 1.8 3.6 4.5 4.3C8 9.5 9 10 9 11c0 1-1 1.6-2.5 1.6C4.5 12.6 3 12 1.5 11L0 13.5C2 15 4 15.8 6.5 15.8 9.7 15.8 13 14 13 11c0-2.5-1.8-3.8-4.8-4.6C6 5.7 5 5.3 5 4.3c0-.8.8-1.4 2-1.4 1.5 0 2.8.5 4 1.3L12.5 2C11 .8 9 0 6.5 0Z'
                fill='white'
              />
            </svg>
          </div>
          <span className='text-sm' style={{ color: 'var(--color-text-disabled)' }}>
            Stripe Projects &mdash; A Stripe product
          </span>
        </div>

        {/* Links */}
        <nav className='flex items-center gap-5'>
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className='inline-flex items-center gap-1 text-xs transition-colors duration-200'
              style={{ color: 'var(--color-text-disabled)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-secondary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-disabled)';
              }}
            >
              {link.label}
              {link.external && <ExternalLink className='w-2.5 h-2.5' />}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className='text-xs' style={{ color: 'var(--color-text-disabled)' }}>
          &copy; {new Date().getFullYear()} Stripe, Inc.
        </p>
      </div>
    </footer>
  );
}
