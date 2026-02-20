/* ── AgentView ────────────────────────────────────────────────────────────────
   Clean, single-column document layout showing all site content as agents see it.
   Mirrors the content in /public/llms.txt and /public/index.html.md.
   Update this component whenever site content changes (see .cursor/rules/agent-content-sync.mdc).
────────────────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    title: 'No dashboard hopping',
    description:
      'Eliminate the "dashboard maze" of dozens of sign-ups, configuration steps, and API key hunts. With just one command, you can provision a complete, working stack directly from your CLI.',
  },
  {
    title: 'Real infrastructure without lock-in',
    description:
      'We provision real services, not sandboxes. You maintain direct, unintermediated relationships with every provider — the accounts are in your name, the credentials are yours, and if you ever leave, you keep everything.',
  },
  {
    title: 'Built for AI-assisted development',
    description:
      "AI agents can write great code, but they historically couldn't provision the infrastructure to run it. This tool is machine-readable and tool-callable, giving coding agents the ability to reliably provision and wire up real infrastructure.",
  },
  {
    title: 'A central hub for keys and secrets',
    description:
      'Stop scattering API keys across multiple dashboards and local files. One secure, central place to manage credentials and environment variables across your entire stack, automatically injected into your project environment.',
  },
  {
    title: 'Seamless upgrades',
    description:
      'Manage paid plan selections and billing upgrades across multiple providers without ever leaving your workflow. Powered by the Agentic Commerce Protocol, scale your stack and handle payments centrally rather than juggling separate invoices.',
  },
  {
    title: 'Bring your existing stack',
    description:
      "You don't have to start from scratch. Easily link your existing third-party service accounts and initialize projects on your current Stripe account, bringing your established infrastructure under one coherent control plane.",
  },
];

const PARTNERS = [
  { name: 'Stripe',      category: 'payments',    desc: 'Accept one-time payments, subscriptions, and invoices. Pre-wired with no boilerplate.',                                    url: 'https://stripe.com'       },
  { name: 'Clerk',       category: 'auth',        desc: 'Drop-in authentication with social login, magic links, MFA, and full user management UI.',                                url: 'https://clerk.dev'        },
  { name: 'Supabase',    category: 'storage',     desc: 'Open-source Firebase alternative with Postgres, realtime subscriptions, and file storage.',                               url: 'https://supabase.com'     },
  { name: 'Vercel',      category: 'hosting',     desc: 'Deploy frontend apps to the edge with automatic CI/CD, edge functions, and global CDN.',                                  url: 'https://vercel.com'       },
  { name: 'Neon',        category: 'database',    desc: 'Serverless Postgres with autoscaling to zero, database branching, and a generous free tier.',                             url: 'https://neon.tech'        },
  { name: 'Railway',     category: 'hosting',     desc: 'Deploy servers, databases, and cron jobs with zero ops overhead.',                                                        url: 'https://railway.app'      },
  { name: 'PostHog',     category: 'analytics',   desc: 'Self-hostable product analytics with event capture, session replay, feature flags, and A/B testing.',                    url: 'https://posthog.com'      },
  { name: 'Sentry',      category: 'monitoring',  desc: 'Full-stack error monitoring, performance tracing, and alerting. Pre-configured with zero setup.',                         url: 'https://sentry.io'        },
  { name: 'Chroma',      category: 'ai',          desc: 'Open-source embedding database for AI applications. Store, search, and manage vector embeddings at any scale.',           url: 'https://trychroma.com'    },
  { name: 'PlanetScale', category: 'database',    desc: 'MySQL-compatible serverless database with non-blocking schema changes and branching workflows.',                          url: 'https://planetscale.com'  },
];

const CLI_COMMANDS = [
  { cmd: 'stripe projects create <app-name>', desc: 'Scaffold a new full-stack application' },
  { cmd: 'stripe projects init',              desc: 'Initialize services and configuration' },
  { cmd: 'stripe projects service add <name>',desc: 'Add an ecosystem service to your project' },
  { cmd: 'stripe projects service list',      desc: 'List all available ecosystem services' },
  { cmd: '/contest',                          desc: 'Submit contest entry from within the CLI' },
  { cmd: '/install',                          desc: 'Show the install command' },
  { cmd: '/services',                         desc: 'Show the available services list' },
  { cmd: '/help',                             desc: 'Show all available commands' },
];

/* ── tiny style helpers ──────────────────────────────────────────────────── */
const s = {
  page: {
    width: '100%',
    height: '100%',
    overflowY: 'auto' as const,
    background: 'var(--color-bg)',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-ui)',
  },
  inner: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '3rem 2rem 6rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.6rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    padding: '2px 8px',
    border: '1px solid var(--color-border-accent)',
    color: 'var(--color-text-ui-subtle)',
    marginBottom: '1.5rem',
  },
  h1: {
    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
    fontWeight: 700,
    color: 'var(--color-text-ui)',
    lineHeight: 1.2,
    marginBottom: '1rem',
    margin: '0 0 1rem',
  },
  lead: {
    fontSize: '0.9rem',
    color: 'var(--color-text-ui-muted)',
    lineHeight: 1.75,
    maxWidth: 600,
    margin: '0 0 2rem',
  },
  hr: {
    border: 'none',
    borderTop: '1px solid var(--color-border-accent)',
    margin: '2.5rem 0',
  },
  sectionLabel: {
    fontSize: '0.6rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-text-ui-subtle)',
    marginBottom: '1rem',
  },
  h2: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--color-text-ui)',
    margin: '0 0 1.25rem',
  },
  codeBlock: {
    background: 'var(--color-surface-dark)',
    border: '1px solid var(--color-border-accent)',
    padding: '1rem 1.25rem',
    fontSize: '0.78rem',
    color: 'var(--color-pink)',
    lineHeight: 1.8,
    marginBottom: '2rem',
    overflowX: 'auto' as const,
  },
  featureGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  featureCard: {
    border: '1px solid var(--color-border-accent)',
    background: 'var(--color-surface)',
    padding: '1rem',
  },
  featureTitle: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--color-text-ui)',
    marginBottom: '0.375rem',
  },
  featureDesc: {
    fontSize: '0.72rem',
    color: 'var(--color-text-ui-muted)',
    lineHeight: 1.65,
    margin: 0,
  },
  partnerRow: {
    display: 'flex' as const,
    alignItems: 'baseline',
    gap: '0.75rem',
    padding: '0.6rem 0',
    borderBottom: '1px solid var(--color-border-accent)',
  },
  partnerName: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--color-text-ui)',
    minWidth: 100,
    flexShrink: 0,
  },
  partnerCategory: {
    fontSize: '0.6rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-text-ui-subtle)',
    minWidth: 72,
    flexShrink: 0,
  },
  partnerDesc: {
    fontSize: '0.72rem',
    color: 'var(--color-text-ui-muted)',
    lineHeight: 1.5,
    flex: 1,
  },
  partnerLink: {
    fontSize: '0.65rem',
    color: 'var(--color-blue)',
    textDecoration: 'none' as const,
    flexShrink: 0,
  },
  cmdTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '0.75rem',
  },
  cmdRow: (i: number): React.CSSProperties => ({
    background: i % 2 === 0 ? 'var(--color-surface)' : 'transparent',
  }),
  cmdCell: {
    padding: '0.5rem 0.75rem',
    border: '1px solid var(--color-border-accent)',
    verticalAlign: 'top' as const,
  },
  cmdCode: {
    color: 'var(--color-pink)',
    fontFamily: 'var(--font-mono)',
  },
  cmdDesc: {
    color: 'var(--color-text-ui-muted)',
  },
  contestStep: {
    display: 'flex' as const,
    alignItems: 'baseline',
    gap: '0.75rem',
    padding: '0.375rem 0',
  },
  contestNum: {
    color: 'var(--color-pink)',
    fontSize: '0.72rem',
    minWidth: '1.25rem',
    flexShrink: 0,
  },
  contestText: {
    fontSize: '0.78rem',
    color: 'var(--color-text-ui)',
    lineHeight: 1.5,
  },
  discoveryLinks: {
    display: 'flex' as const,
    gap: '1rem',
    flexWrap: 'wrap' as const,
    marginTop: '0.75rem',
  },
  discoveryLink: {
    fontSize: '0.72rem',
    color: 'var(--color-blue)',
    textDecoration: 'none' as const,
    padding: '4px 10px',
    border: '1px solid var(--color-border-accent)',
  },
};

export function AgentView() {
  return (
    <div style={s.page}>
      <div style={s.inner}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={s.badge}>agent view · llms.txt</div>
        <h1 style={s.h1}>Stripe Projects</h1>
        <p style={s.lead}>
          A CLI tool that scaffolds production-ready, full-stack applications with Stripe payments,
          authentication, a database, and deployment pre-configured.
          Run one command. Ship faster.
        </p>

        {/* Install command */}
        <div style={s.codeBlock}>
          <span style={{ color: 'var(--color-text-ui-subtle)' }}>$ </span>
          stripe projects create my-app
        </div>

        <hr style={s.hr} />

        {/* ── Features ───────────────────────────────────────────────────── */}
        <p style={s.sectionLabel}>Why Projects</p>
        <h2 style={s.h2}>Everything you need, nothing you don't</h2>
        <div style={s.featureGrid}>
          {FEATURES.map(f => (
            <div key={f.title} style={s.featureCard}>
              <p style={s.featureTitle}>{f.title}</p>
              <p style={s.featureDesc}>{f.description}</p>
            </div>
          ))}
        </div>

        <hr style={s.hr} />

        {/* ── Ecosystem ──────────────────────────────────────────────────── */}
        <p style={s.sectionLabel}>Ecosystem</p>
        <h2 style={s.h2}>Supported Services</h2>
        <p style={{ ...s.featureDesc, marginBottom: '1rem' }}>
          Add any service via <code style={{ color: 'var(--color-pink)' }}>projects service add &lt;name&gt;</code>
        </p>
        <div>
          {PARTNERS.map(p => (
            <div key={p.name} style={s.partnerRow}>
              <span style={s.partnerName}>{p.name}</span>
              <span style={s.partnerCategory}>{p.category}</span>
              <span style={s.partnerDesc}>{p.desc}</span>
              <a href={p.url} target='_blank' rel='noopener noreferrer' style={s.partnerLink}>
                {p.url.replace('https://', '')}
              </a>
            </div>
          ))}
        </div>

        <hr style={s.hr} />

        {/* ── CLI Reference ──────────────────────────────────────────────── */}
        <p style={s.sectionLabel}>CLI Reference</p>
        <h2 style={s.h2}>Commands</h2>
        <table style={s.cmdTable}>
          <tbody>
            {CLI_COMMANDS.map((c, i) => (
              <tr key={c.cmd} style={s.cmdRow(i)}>
                <td style={{ ...s.cmdCell, width: '50%' }}>
                  <code style={s.cmdCode}>{c.cmd}</code>
                </td>
                <td style={{ ...s.cmdCell }}>
                  <span style={s.cmdDesc}>{c.desc}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr style={s.hr} />

        {/* ── Contest ────────────────────────────────────────────────────── */}
        <p style={s.sectionLabel}>Contest</p>
        <h2 style={s.h2}>Win a Mac Mini + openclaw + Stripe Projects credits</h2>
        <p style={{ ...s.featureDesc, marginBottom: '1rem' }}>
          10 total winners will be randomly chosen from all entries.
        </p>
        <div>
          {['Install Stripe Projects', 'Run stripe projects init', 'Submit the slash command /contest'].map((step, i) => (
            <div key={i} style={s.contestStep}>
              <span style={s.contestNum}>{i + 1}.</span>
              <span style={s.contestText}>{step}</span>
            </div>
          ))}
        </div>

        <hr style={s.hr} />

        {/* ── Agent Discovery ────────────────────────────────────────────── */}
        <p style={s.sectionLabel}>Agent Discovery Files</p>
        <h2 style={s.h2}>Machine-Readable Content</h2>
        <p style={{ ...s.featureDesc, marginBottom: '0.75rem' }}>
          This site provides structured content for AI agents and LLMs at the following endpoints:
        </p>
        <div style={s.discoveryLinks}>
          <a href='/llms.txt' style={s.discoveryLink}>/llms.txt</a>
          <a href='/index.html.md' style={s.discoveryLink}>/index.html.md</a>
          <a href='/robots.txt' style={s.discoveryLink}>/robots.txt</a>
        </div>

      </div>
    </div>
  );
}
