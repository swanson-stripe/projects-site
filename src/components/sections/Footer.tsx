export function Footer() {
  return (
    <footer className='relative py-10 px-6'>
      <div className='flex items-center justify-center gap-4'>
        <p className='font-mono text-xs' style={{ color: 'var(--color-text-ui-subtle)' }}>
          &copy; 2026 Stripe
        </p>
        {[
          { label: 'Terms', href: 'https://stripe.com/legal' },
          { label: 'Privacy', href: 'https://stripe.com/privacy' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target='_blank'
            rel='noopener noreferrer'
            className='font-mono text-xs transition-colors duration-150'
            style={{ color: 'var(--color-text-ui-subtle)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-ui)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-ui-subtle)';
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
