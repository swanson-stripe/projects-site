import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { SlidersHorizontal } from 'lucide-react';
import { useTheme } from '@/components/ui/ThemeContext';
import { DotSpinner } from '@/components/sections/TerminalBanner';

const MONO = 'ui-monospace, "SFMono-Regular", "Cascadia Code", "Fira Code", monospace';
const BORDER = '1px solid rgba(0,0,0,0.12)';
const DIM = 'rgba(10,10,10,0.45)';

type Row =
  | { type: 'install' }
  | { type: 'blank' }
  | { type: 'heading'; label: string }
  | { type: 'usage'; text: string }
  | { type: 'cmd'; cmd: string; desc: string }
  | { type: 'example'; text: string };

const ROWS: Row[] = [
  { type: 'install' },
  { type: 'blank' },
  { type: 'heading', label: 'DESCRIPTION' },
  { type: 'usage',   text: 'Stripe Projects eliminates manual infrastructure setup and dashboard-hopping. One command provisions real services across providers, in accounts you own.' },
  { type: 'blank' },
  { type: 'heading', label: 'USAGE' },
  { type: 'usage',   text: 'stripe projects <command> [flags]' },
  { type: 'blank' },
  { type: 'heading', label: 'GET STARTED' },
  { type: 'cmd', cmd: 'init [name]',                         desc: 'Initialize a new Project' },
  { type: 'cmd', cmd: 'status',                              desc: 'View the current project, providers, and services' },
  { type: 'cmd', cmd: 'catalog',                             desc: 'Browse available services' },
  { type: 'blank' },
  { type: 'heading', label: 'PROVIDERS' },
  { type: 'cmd', cmd: 'providers link <provider>',           desc: 'Link an existing provider account' },
  { type: 'cmd', cmd: 'providers list',                      desc: 'List available providers' },
  { type: 'cmd', cmd: 'llm-context',                         desc: 'List provider guidance URLs for AI-assisted development' },
  { type: 'blank' },
  { type: 'heading', label: 'SERVICES' },
  { type: 'cmd', cmd: 'services add [service]',              desc: 'Add a service to your project' },
  { type: 'cmd', cmd: 'services update <service_reference>', desc: 'Update a service resource to another service in the same provider' },
  { type: 'cmd', cmd: 'services remove <resource>',          desc: 'Remove a service resource' },
  { type: 'cmd', cmd: 'services rotate <resource>',          desc: 'Rotate credentials for a service resource' },
  { type: 'cmd', cmd: 'services open <provider>',            desc: "Get a link to a service's provider dashboard" },
  { type: 'blank' },
  { type: 'heading', label: 'ENVIRONMENT' },
  { type: 'cmd', cmd: 'env list',                            desc: 'List all project keys and environment variables' },
  { type: 'cmd', cmd: 'env sync',                            desc: 'Sync environment variables to local .env files' },
  { type: 'blank' },
  { type: 'heading', label: 'BILLING' },
  { type: 'cmd', cmd: 'billing method',                      desc: 'View your current billing method' },
  { type: 'cmd', cmd: 'billing update',                      desc: 'Update your billing method' },
  { type: 'blank' },
  { type: 'heading', label: 'FLAGS' },
  { type: 'cmd', cmd: '--json',                              desc: 'Output results in JSON format' },
  { type: 'cmd', cmd: '-y, --yes',                           desc: 'Skip confirmation prompts' },
  { type: 'cmd', cmd: '--no-stream',                         desc: 'Disable streaming output animations' },
  { type: 'cmd', cmd: '--debug',                             desc: 'Enable debug logging for Stripe API requests' },
  { type: 'blank' },
  { type: 'heading', label: 'EXAMPLES' },
  { type: 'example', text: 'stripe projects init my-app' },
  { type: 'example', text: 'stripe projects services add vercel/hosting' },
  { type: 'example', text: 'stripe projects env sync' },
  { type: 'blank' },
  { type: 'usage', text: '---' },
];

const SERVICES: { category: string; providers: { name: string; desc: string; url: string }[] }[] = [
  { category: 'HOSTING', providers: [
    { name: 'vercel',      url: 'vercel.com',      desc: 'Deploy frontend apps to the edge with automatic CI/CD, edge functions, and global CDN distribution. Seamless integration with Next.js and all major frameworks.' },
    { name: 'railway',     url: 'railway.app',     desc: "Railway is the all-in-one intelligent cloud provider. Our mission is to build the cloud computing stack that unburdens you, so you can focus on what matters to you." },
  ]},
  { category: 'DATABASE', providers: [
    { name: 'planetscale', url: 'planetscale.com', desc: 'PlanetScale is a fully managed database platform for Postgres and Vitess/MySQL, delivering NVMe-backed performance, massive scale through horizontal sharding, developer-friendly features, and enterprise-grade reliability.' },
    { name: 'neon',        url: 'neon.tech',       desc: "Neon, a Databricks company, is a fully-managed Postgres database platform built on a distributed architecture that separates storage and compute, delivering an automated operational model perfect for today's AI-powered development." },
    { name: 'turso',       url: 'turso.tech',      desc: 'Turso Cloud gives AI agents the fast, durable, and isolated state they need to run reliably at scale. Each agent gets its own lightweight, replicated SQLite-compatible database with fast reads, built-in vector search, and automatic sync.' },
  ]},
  { category: 'VECTOR-DB', providers: [
    { name: 'chroma',      url: 'trychroma.com',   desc: 'Fast, serverless, and scalable search engine supporting vector, full-text, regex, and metadata search. Built on object storage and trusted by millions of developers. Open-source Apache 2.0.' },
  ]},
  { category: 'AI', providers: [
    { name: 'runloop',     url: 'runloop.ai',      desc: 'Runloop.ai provides secure execution infrastructure for AI agents. Run agent workloads inside isolated micro-VM sandboxes, allowing agents to safely execute code, use tools, and access external systems without exposing credentials or production environments.' },
  ]},
  { category: 'AUTH', providers: [
    { name: 'clerk',       url: 'clerk.dev',       desc: 'Drop-in authentication with social login, magic links, MFA, and full user management UI. Works out of the box with zero configuration.' },
  ]},
  { category: 'STORAGE', providers: [
    { name: 'supabase',    url: 'supabase.com',    desc: 'Supabase is the easy-to-use, open-source managed Postgres with integrated backend services — Database, Auth, Storage, Edge Functions, Realtime, and Vector search.' },
  ]},
  { category: 'ANALYTICS', providers: [
    { name: 'posthog',     url: 'posthog.com',     desc: 'PostHog is the single platform for software teams — analytics, session replay, feature flags, A/B testing, data warehouse, CDP, and more. Open-source with transparent usage-based pricing.' },
  ]},
  { category: 'MONITORING', providers: [
    { name: 'sentry',      url: 'sentry.io',       desc: 'Catch errors before your users do. Sentry provides full-stack error monitoring, performance tracing, and alerting — all pre-configured with zero setup.' },
  ]},
];

function InstallBlock() {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const line1 = 'brew install stripe/stripe-cli/stripe';
  const line2 = 'stripe plugin install projects       '; // padded to 37 chars

  function handleClick() {
    navigator.clipboard.writeText(`${line1}\n${line2.trim()}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const textColor = copied ? '#635BFF' : hovered ? 'rgba(10,10,10,0.4)' : 'inherit';

  const r1 = copied ? '✓ copied!                            ' : line1;
  const r2 = copied ? '                                     ' : line2;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title='Copy install commands'
      style={{
        display:      'block',
        background:   'none',
        border:       'none',
        padding:      0,
        cursor:       'pointer',
        fontFamily:   'inherit',
        fontSize:     'inherit',
        textAlign:    'left',
        marginBottom: '0.2rem',
      }}
    >
      <pre style={{ margin: 0, fontFamily: 'inherit', fontSize: 'inherit' }}>
        {`+---------------------------------------+\n| `}<span style={{ color: textColor, transition: 'color 0.15s' }}>{r1}</span>{` |\n| `}<span style={{ color: textColor, transition: 'color 0.15s' }}>{r2}</span>{` |\n+---------------------------------------+`}
      </pre>
    </button>
  );
}


function CopyText({ display, text, style }: { display: React.ReactNode; text: string; style?: React.CSSProperties }) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      onClick={handleClick}
      title={`Copy: ${text}`}
      className='dev-copy-btn'
      style={{
        background:  'none',
        border:      'none',
        padding:     0,
        cursor:      'pointer',
        fontFamily:  'inherit',
        fontSize:    'inherit',
        color:       copied ? '#635BFF' : 'inherit',
        textAlign:   'left',
        transition:  'color 0.15s',
        ...style,
      }}
    >
      {copied ? `✓ copied` : display}
    </button>
  );
}


function CopyCmd({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);

  const text = `stripe projects ${cmd.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()}`;

  function handleClick() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      onClick={handleClick}
      title={`Copy: ${text}`}
      className='dev-copy-btn'
      style={{
        background:  'none',
        border:      'none',
        padding:     0,
        cursor:      'pointer',
        fontFamily:  'inherit',
        fontSize:    'inherit',
        color:       copied ? '#635BFF' : 'inherit',
        textAlign:   'left',
        flex:        '0 0 42ch',
        transition:  'color 0.15s',
      }}
    >
      {copied ? `✓ copied` : cmd}
    </button>
  );
}


function ProviderActions() {
  const [suggesting, setSuggesting] = useState(false);
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSuggestClick() {
    setSuggesting(true);
    setSubmitted(null);
    setValue('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && value.trim()) {
      setSubmitted(value.trim());
      setSuggesting(false);
      setValue('');
    }
    if (e.key === 'Escape') {
      setSuggesting(false);
      setValue('');
    }
  }

  return (
    <div style={{ marginTop: '0.4rem' }}>
      <div style={{ display: 'flex', gap: '2ch', color: DIM, marginBottom: '0.4rem' }}>
        <span>
          become a provider —{' '}
          <span style={{ userSelect: 'all' }}>provider-request@stripe.com</span>
        </span>
        <span>·</span>
        <button
          onClick={handleSuggestClick}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: DIM, fontFamily: 'inherit', fontSize: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}
        >
          suggest a provider
        </button>
      </div>

      {suggesting && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5ch', color: DIM }}
        >
          <span style={{ userSelect: 'none' }}>›</span>
          <input
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='provider name or url…'
            style={{
              background:  'none',
              border:      'none',
              outline:     'none',
              fontFamily:   'inherit',
              fontSize:    'inherit',
              color:       '#0A0A0A',
              width:       '32ch',
              caretColor:  '#635BFF',
            }}
          />
          <span style={{ opacity: 0.4, fontSize: '0.7rem' }}>enter to submit · esc to cancel</span>
        </motion.div>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ color: '#635BFF', paddingLeft: '1.5ch' }}
        >
          ✓ "{submitted}" submitted — thanks!
        </motion.div>
      )}
    </div>
  );
}


function ProviderRow({ name, desc, url }: { name: string; desc: string; url: string }) {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const descRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = descRef.current;
    if (el) setTruncated(el.scrollWidth > el.offsetWidth);
  }, []);

  return (
    <div style={{ minWidth: 0 }}>
      {/* Name + truncated desc on one line */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5ch', minWidth: 0 }}>
        <CopyText display={name} text={`stripe projects services add ${name}`} style={{ flexShrink: 0 }} />
        <span style={{ color: DIM, flexShrink: 0 }}>-</span>
        <span
          ref={descRef}
          style={{
            color: DIM,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            minWidth: 0,
            flex: 1,
          }}
        >
          {desc}
        </span>
        {!expanded && truncated && (
          <button
            onClick={() => setExpanded(true)}
            style={{ background: 'none', border: 'none', padding: '0 0 0 2px', cursor: 'pointer', color: DIM, fontFamily: 'inherit', fontSize: 'inherit', flexShrink: 0 }}
          >
            …
          </button>
        )}
      </div>

      {/* Expanded full description below */}
      {expanded && (
        <div style={{ color: DIM, whiteSpace: 'normal', lineHeight: 1.6, marginTop: '0.2rem' }}>
          {desc}{' '}
          <a
            href={`https://${url}`}
            target='_blank'
            rel='noopener noreferrer'
            style={{ color: DIM, textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            {url}
          </a>
          {' '}
          <button
            onClick={() => setExpanded(false)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: DIM, fontFamily: 'inherit', fontSize: 'inherit' }}
          >
            [collapse]
          </button>
        </div>
      )}
    </div>
  );
}


function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        ref={btnRef}
        aria-label='Switch theme'
        onClick={() => setOpen(v => !v)}
        style={{
          display:    'inline-flex',
          alignItems: 'center',
          background: 'none',
          border:     'none',
          padding:    '0 0 0 10px',
          cursor:     'pointer',
          color:      open ? '#0A0A0A' : 'rgba(10,10,10,0.4)',
          verticalAlign: 'middle',
        }}
      >
        <SlidersHorizontal size={12} strokeWidth={1.5} />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            position:   'absolute',
            top:        '100%',
            left:        0,
            marginTop:   4,
            zIndex:      10000,
            background: '#FFFFFF',
            border:      BORDER,
            minWidth:    160,
            padding:    '4px 0',
            fontFamily:  MONO,
            fontSize:   '0.72rem',
            boxShadow:  '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ padding: '4px 10px 6px', color: 'rgba(10,10,10,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.6rem' }}>
            theme
          </div>
          {themes.map(t => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:            8,
                  width:         '100%',
                  padding:       '5px 10px',
                  background:    active ? 'rgba(0,0,0,0.04)' : 'none',
                  border:        'none',
                  cursor:        'pointer',
                  color:         active ? '#0A0A0A' : 'rgba(10,10,10,0.55)',
                  textAlign:     'left',
                  fontFamily:    'inherit',
                  fontSize:      'inherit',
                }}
              >
                <span style={{ opacity: active ? 1 : 0, userSelect: 'none' }}>›</span>
                {t.label}
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}

export function DevThemeContent() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className='dev-theme-content'
      style={{
        flex:       1,
        overflowY:  'auto',
        padding:    '2rem 2.5rem',
        fontFamily:  MONO,
        fontSize:   '0.8125rem',
        lineHeight:  1.7,
        color:      '#0A0A0A',
      }}
    >
      {/* Header line — logomark + wordmark + inline theme switcher */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <DotSpinner isAnimating={hovered} />
        <span style={{ fontWeight: 700 }}>stripe projects</span>
        <ThemeSwitcher />
      </div>

      {/* Commands — two-column aligned layout */}
      <div style={{ marginBottom: '1.4rem' }}>
        {ROWS.map((row, i) => {
          const lineDelay = i * 0.03;

          const wrap = (content: React.ReactNode) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: lineDelay, ease: 'easeOut' }}
            >
              {content}
            </motion.div>
          );

          if (row.type === 'blank') {
            return <div key={i} style={{ height: '0.8rem' }} />;
          }
          if (row.type === 'install') {
            return wrap(<InstallBlock key={i} />);
          }
          if (row.type === 'heading') {
            return wrap(<div style={{ marginBottom: '0.2rem', color: '#635BFF', fontWeight: 600 }}>{row.label}</div>);
          }
          if (row.type === 'usage') {
            return wrap(<div style={{ color: '#0A0A0A' }}>{row.text}</div>);
          }
          if (row.type === 'example') {
            return wrap(<div><CopyText display={row.text} text={row.text} style={{ color: '#0A0A0A' }} /></div>);
          }
          if (row.type === 'cmd') {
            return wrap(
              <div style={{ display: 'flex' }}>
                <CopyCmd cmd={row.cmd} />
                <span style={{ color: DIM }}>{row.desc}</span>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Services catalogue */}
      <div style={{ marginTop: '1.4rem' }}>
        {SERVICES.map(({ category, providers }, si) => {
          const baseDelay = ROWS.length * 0.03 + si * 0.08;
          return (
            <div key={category} style={{ marginBottom: '1.2rem' }}>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: baseDelay, ease: 'easeOut' }}
                style={{ marginBottom: '0.2rem', color: '#635BFF', fontWeight: 600 }}
              >
                {category}:
              </motion.div>
              {providers.map(({ name, desc, url }, pi) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: baseDelay + (pi + 1) * 0.05, ease: 'easeOut' }}
                >
                  <ProviderRow name={name} desc={desc} url={url} />
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>

      <ProviderActions />
    </div>
  );
}
