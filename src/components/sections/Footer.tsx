interface FooterProps {
  isHelmWave?: boolean;
}

export function Footer({ isHelmWave }: FooterProps) {
  const textColor = isHelmWave ? 'rgba(255,255,255,0.7)' : 'var(--color-text-ui-subtle)';
  const hoverColor = isHelmWave ? '#ffffff' : 'var(--color-text-ui)';
  return (
    <footer className='relative px-6' style={{ paddingTop: isHelmWave ? '160px' : '40px', paddingBottom: '40px' }}>
      <div className='flex items-center justify-center gap-4'>
        <p className='font-mono text-xs' style={{ color: textColor }}>
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
            style={{ color: textColor }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = hoverColor;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = textColor;
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
