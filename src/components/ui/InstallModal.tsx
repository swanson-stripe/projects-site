import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Copy, Check, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

const DIM        = '#9ca3af';
const TEXT       = '#111827';
const SUBTEXT    = '#6b7280';
const BORDER     = '1px solid #e5e7eb';
const STATUSBAR_H = 100; // 9. increased top margin

type InstallMethod = 'homebrew' | 'apt' | 'yum' | 'scoop' | 'macOS' | 'Linux' | 'Windows' | 'Docker';

const INSTALL_METHODS: InstallMethod[] = [
  'homebrew', 'apt', 'yum', 'scoop', 'macOS', 'Linux', 'Windows', 'Docker',
];

interface InstallStep {
  label?: string;
  code: string;
  link?: boolean;
}

const METHOD_CONTENT: Record<InstallMethod, InstallStep[]> = {
  homebrew: [
    { code: 'brew install stripe/stripe-cli/stripe' },
    { code: 'stripe plugin install projects' },
  ],
  apt: [
    { label: '1. Add GPG key', code: 'curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg' },
    { label: '2. Add apt repository', code: 'echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list' },
    { label: '3. Update packages', code: 'sudo apt update' },
    { label: '4. Install', code: 'sudo apt install stripe' },
  ],
  yum: [
    { label: '1. Add yum repository', code: 'echo -e "[Stripe]\\nname=stripe\\nbaseurl=https://packages.stripe.dev/stripe-cli-rpm-local/\\nenabled=1\\ngpgcheck=0" >> /etc/yum.repos.d/stripe.repo' },
    { label: '2. Install', code: 'sudo yum install stripe' },
  ],
  scoop: [
    { code: 'scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git' },
    { code: 'scoop install stripe' },
  ],
  macOS: [
    { label: 'Download the latest mac-os release from GitHub', code: 'https://github.com/stripe/stripe-cli/releases/latest', link: true },
    { label: 'Unzip the archive', code: 'tar -xvf stripe_[X.X.X]_mac-os_[ARCH_TYPE].tar.gz' },
    { label: 'Optionally move to global bin', code: 'sudo mv ./stripe /usr/local/bin' },
  ],
  Linux: [
    { label: 'Download the latest linux release from GitHub', code: 'https://github.com/stripe/stripe-cli/releases/latest', link: true },
    { label: 'Unzip the archive', code: 'tar -xvf stripe_X.X.X_linux_x86_64.tar.gz' },
    { label: 'Move to execution path', code: 'sudo mv ./stripe /usr/local/bin' },
  ],
  Windows: [
    { label: 'Download the latest windows release from GitHub', code: 'https://github.com/stripe/stripe-cli/releases/latest', link: true },
    { label: 'Unzip the archive', code: 'stripe_X.X.X_windows_x86_64.zip' },
    { label: 'Add stripe.exe to your Path environment variable', code: 'setx PATH "%PATH%;C:\\path\\to\\stripe"' },
  ],
  Docker: [
    { code: 'docker run --rm -it stripe/stripe-cli:latest' },
  ],
};

// 8. icon-only copy button — no background, no border
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75em',
      padding: '0.85em 1em',
    }}>
      <code style={{
        flex: 1,
        fontSize: '0.95rem', // 7. larger font size
        fontFamily: 'var(--font-mono, monospace)',
        color: TEXT,
        wordBreak: 'break-all',
        lineHeight: 1.6,
      }}>
        {code}
      </code>
      <button
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy'}
        style={{
          flexShrink: 0,
          background: 'none',   // 8. no background
          border: 'none',       // 8. no border
          padding: '0.25em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          color: copied ? '#16a34a' : DIM,
          transition: 'color 0.15s',
        }}
      >
        {copied ? <Check size={15} strokeWidth={2} /> : <Copy size={15} strokeWidth={1.5} />}
      </button>
    </div>
  );
}

export function InstallModal({ onClose }: { onClose: () => void }) {
  const [method, setMethod] = useState<InstallMethod>('homebrew');
  const [open, setOpen]     = useState(false);
  const isMobile            = useIsMobile();
  const tabsRef             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // URL hash
  useEffect(() => {
    const base = window.location.pathname + window.location.search;
    window.history.replaceState(null, '', base + '#install');
    return () => {
      if (window.location.hash === '#install') {
        window.history.replaceState(null, '', base);
      }
    };
  }, []);

  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLButtonElement>('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [method]);

  function handleClose() {
    setOpen(false);
    setTimeout(onClose, 300);
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) handleClose();
  }

  const steps = METHOD_CONTENT[method];
  const RADIUS = isMobile ? '0' : '14px';

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    opacity: open ? 1 : 0,
    transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1)',
    zIndex: 999,
  };

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        inset: 0,
        background: '#fff',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }
    : {
        position: 'fixed',
        bottom: 0,
        left: '50%',
        width: '65%',
        top: `${STATUSBAR_H}px`,
        background: '#fff',
        borderRadius: `${RADIUS} ${RADIUS} 0 0`,
        boxShadow: '0 -8px 48px rgba(0,0,0,0.14)',
        transform: open
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(100%)',
        transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      };

  return createPortal(
    <>
      <div style={backdropStyle} onClick={handleBackdrop} />
      <div style={panelStyle}>

        {/* header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '1.5rem 1.75rem 1.25rem',
          flexShrink: 0,
        }}>
          <div>
            {/* 1. hero h1: font-mono, font-light (300), tracking-tight (-0.025em) */}
            <p style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontWeight: 300,
              letterSpacing: '-0.025em',
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              lineHeight: 1.15,
              color: TEXT,
            }}>
              Install Stripe Projects
            </p>
            {/* 2. hero subheadline: inherits body font (sohne-var/sans), text-lg/xl leading-relaxed */}
            <p style={{
              margin: '0.5rem 0 0',
              fontFamily: 'var(--font-sans)',
              fontWeight: 400,
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: 1.625,
              color: SUBTEXT,
            }}>
              Choose your package manager or platform.
            </p>
          </div>

          {/* close button */}
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: '2rem',
              height: '2rem',
              cursor: 'pointer',
              color: SUBTEXT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '0.25rem',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#e5e7eb';
              (e.currentTarget as HTMLButtonElement).style.color = TEXT;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6';
              (e.currentTarget as HTMLButtonElement).style.color = SUBTEXT;
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* 3. tab row — no bottom divider, 6. pill selection */}
        <div
          ref={tabsRef}
          style={{
            display: 'flex',
            flexShrink: 0,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            padding: '0.75rem 1.75rem',
            gap: '0.25rem',
          }}
        >
          {INSTALL_METHODS.map(m => (
            <button
              key={m}
              data-active={m === method ? 'true' : 'false'}
              onClick={() => setMethod(m)}
              style={{
                background: m === method ? 'linear-gradient(135deg, #8255DC 0%, #D75AA5 55%, #FAA564 100%)' : 'none', // 6. pill bg
                border: 'none',
                borderRadius: '999px',                          // 6. pill shape
                padding: '0.35em 0.9em',
                cursor: 'pointer',
                color: m === method ? '#fff' : DIM,            // 6. white on active
                fontSize: '1rem',                               // 4. +4pts (~0.25rem)
                fontFamily: 'var(--font-mono, monospace)',      // 5. monospace
                fontWeight: m === method ? 500 : 400,
                whiteSpace: 'nowrap',
                transition: 'background 0.15s, color 0.15s',
                flexShrink: 0,
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1.75rem 1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {steps.map((step, i) => (
              <div key={i}>
                {step.label && (
                  <p style={{
                    margin: '0 0 0.4rem',
                    color: SUBTEXT,
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                    fontWeight: 500,
                  }}>
                    {step.label}
                  </p>
                )}
                {/* 7. no border on code blocks */}
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}>
                  {step.link ? (
                    <a
                      href={step.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3em',
                        padding: '0.85em 1em',
                        color: '#6366f1',
                        fontSize: '0.95rem', // 7. larger
                        fontFamily: 'var(--font-mono, monospace)',
                        textDecoration: 'none',
                        wordBreak: 'break-all',
                      }}
                    >
                      {step.code}
                      <ArrowUpRight size={12} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    </a>
                  ) : (
                    <CopyButton code={step.code} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderTop: BORDER,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <a
            href="https://docs.stripe.com/stripe-cli/install"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '1rem',
              color: DIM,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25em',
              fontFamily: 'var(--font-sans, system-ui, sans-serif)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = DIM)}
          >
            Full install docs <ArrowUpRight size={13} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </>,
    document.body,
  );
}
