import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const PROVIDER_NAMES: Record<string, string> = {
  agentmail: 'AgentMail', algolia: 'Algolia', amplitude: 'Amplitude', auth0: 'Auth0',
  browserbase: 'Browserbase', chroma: 'Chroma', clerk: 'Clerk', cloudflare: 'Cloudflare',
  daytona: 'Daytona', elevenlabs: 'ElevenLabs', firecrawl: 'Firecrawl', flyio: 'Fly.io',
  gitlab: 'GitLab', huggingface: 'Hugging Face', inngest: 'Inngest', mixpanel: 'Mixpanel',
  neon: 'Neon', netlify: 'Netlify', openrouter: 'OpenRouter', planetscale: 'PlanetScale',
  posthog: 'PostHog', privy: 'Privy', railway: 'Railway', render: 'Render',
  runloop: 'Runloop', sentry: 'Sentry', supabase: 'Supabase', turso: 'Turso',
  twilio: 'Twilio', upstash: 'Upstash', vercel: 'Vercel', workos: 'WorkOS',
};

const CATEGORY_COLORS: Record<string, string> = {
  hosting: '#635BFF', database: '#34D59A', auth: '#6C47FF', analytics: '#F54E00',
  ai: '#4FF8D2', communications: '#E8590C', search: '#3B82F6', cache: '#F59E0B',
  sandbox: '#8B5CF6', 'ci/cd': '#EC4899', observability: '#F87171', payments: '#635BFF',
};

const PROVIDER_CATEGORIES: Record<string, string> = {
  agentmail: 'communications', algolia: 'search', amplitude: 'analytics', auth0: 'auth',
  browserbase: 'ai', chroma: 'database', clerk: 'auth', cloudflare: 'hosting',
  daytona: 'sandbox', elevenlabs: 'ai', firecrawl: 'search', flyio: 'hosting',
  gitlab: 'ci/cd', huggingface: 'ai', inngest: 'ai', mixpanel: 'analytics',
  neon: 'database', netlify: 'hosting', openrouter: 'ai', planetscale: 'database',
  posthog: 'analytics', privy: 'payments', railway: 'hosting', render: 'hosting',
  runloop: 'sandbox', sentry: 'observability', supabase: 'database', turso: 'database',
  twilio: 'communications', upstash: 'cache', vercel: 'hosting', workos: 'auth',
};

function decodeStackServices(encoded: string): { provider: string; service: string }[] {
  const colonIdx = encoded.indexOf(':');
  if (colonIdx <= 0) return [];
  const version = encoded.slice(0, colonIdx);
  if (version !== 'v1') return [];
  const payload = encoded.slice(colonIdx + 1);
  if (!payload) return [];
  const services: { provider: string; service: string }[] = [];
  for (const part of payload.split(',')) {
    const tildeIdx = part.indexOf('~');
    if (tildeIdx <= 0) continue;
    const provider = decodeURIComponent(part.slice(0, tildeIdx));
    const service = decodeURIComponent(part.slice(tildeIdx + 1));
    services.push({ provider, service });
  }
  return services;
}

export default function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const encoded = searchParams.get('s') || '';
  const services = decodeStackServices(encoded);
  const count = services.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: '#061b31',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
            <rect width="16" height="16" rx="4" fill="#635BFF"/>
            <circle cx="5" cy="8" r="1.5" fill="white"/>
            <circle cx="8" cy="8" r="1.5" fill="white"/>
            <circle cx="11" cy="8" r="1.5" fill="white"/>
          </svg>
          <span style={{ color: '#94a3b8', fontSize: '20px' }}>Stripe Projects</span>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '40px' }}>
          <span style={{ color: '#635BFF', fontSize: '32px' }}>→</span>
          <span style={{ color: '#ffffff', fontSize: '32px', fontWeight: 'bold' }}>
            Stack Share
          </span>
          <span style={{ color: '#64748b', fontSize: '20px', marginLeft: '8px' }}>
            {count} service{count !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Provider grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {services.slice(0, 8).map((s, i) => {
            const name = PROVIDER_NAMES[s.provider] || s.provider;
            const cat = PROVIDER_CATEGORIES[s.provider] || '';
            const color = CATEGORY_COLORS[cat] || '#64748b';
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  border: `1px solid ${color}40`,
                  borderRadius: '6px',
                  background: `${color}10`,
                }}
              >
                <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: 500 }}>{name}</span>
                <span style={{ color, fontSize: '13px' }}>{s.service}</span>
              </div>
            );
          })}
          {count > 8 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                border: '1px solid #334155',
                borderRadius: '6px',
              }}
            >
              <span style={{ color: '#64748b', fontSize: '14px' }}>+{count - 8} more</span>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
