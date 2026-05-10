import { ImageResponse } from '@vercel/og';

const SITE_URL_FALLBACK = 'https://projects.dev';

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

const PROVIDER_DESCRIPTIONS: Record<string, string> = {
  agentmail: 'Email for AI agents', algolia: 'Search & discovery', amplitude: 'Product analytics',
  auth0: 'Authentication', browserbase: 'Headless browsers', chroma: 'Vector database',
  clerk: 'Auth & user management', cloudflare: 'Edge compute', daytona: 'Dev environments',
  elevenlabs: 'Voice AI', firecrawl: 'Web scraping', flyio: 'App hosting',
  gitlab: 'DevOps platform', huggingface: 'ML models', inngest: 'Background jobs',
  mixpanel: 'Product analytics', neon: 'Serverless Postgres', netlify: 'Web hosting',
  openrouter: 'LLM routing', planetscale: 'MySQL platform', posthog: 'Product analytics',
  privy: 'Web3 auth', railway: 'App hosting', render: 'Cloud hosting',
  runloop: 'AI dev tools', sentry: 'Error monitoring', supabase: 'Backend as a service',
  turso: 'Edge database', twilio: 'Communications', upstash: 'Serverless Redis',
  vercel: 'Frontend hosting', workos: 'Enterprise SSO',
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

function groupByProvider(services: { provider: string; service: string }[]) {
  const grouped: { provider: string; services: string[] }[] = [];
  for (const s of services) {
    const existing = grouped.find(g => g.provider === s.provider);
    if (existing) {
      existing.services.push(s.service);
    } else {
      grouped.push({ provider: s.provider, services: [s.service] });
    }
  }
  return grouped;
}

let _logosCache: Record<string, string> | null = null;

async function getLogos(siteUrl: string): Promise<Record<string, string>> {
  if (_logosCache) return _logosCache;
  try {
    const resp = await fetch(`${siteUrl}/assets/js/provider-logos.js`);
    if (!resp.ok) return {};
    const content = await resp.text();
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}') + 1;
    _logosCache = JSON.parse(content.slice(start, end));
    return _logosCache!;
  } catch {
    return {};
  }
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const siteUrl = url.origin || SITE_URL_FALLBACK;
  const stack = url.searchParams.get('stack') || '';
  const services = decodeStackServices(stack);
  const grouped = groupByProvider(services);

  const maxVisible = grouped.length > 5 ? 5 : grouped.length;
  const displayProviders = grouped.slice(0, maxVisible);
  const overflow = grouped.length > 5 ? grouped.length - 5 : 0;

  const [fontData, logos] = await Promise.all([
    fetch(
      'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf'
    ).then(res => res.arrayBuffer()).catch(() => null),
    getLogos(siteUrl),
  ]);

  const logoUris: Record<string, string | null> = {};
  for (const g of displayProviders) {
    const svg = logos[g.provider];
    logoUris[g.provider] = svg ? `data:image/svg+xml;base64,${btoa(svg)}` : null;
  }

  const rowHeight = Math.floor((630 - 100 - 64 - 48) / maxVisible);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          fontFamily: '"Inter"',
          overflow: 'hidden',
        }}
      >
        {/* Gradient header */}
        <div
          style={{
            width: '100%',
            height: '100px',
            background: 'linear-gradient(135deg, #635BFF 0%, #7c3aed 30%, #f97316 70%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 64px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: 700 }}>
              Stack Share
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="white">
                <path d="M15.8074 0L0.195312 3.31818V16L15.8074 12.6818V0Z"/>
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: 500 }}>
                Stripe Projects
              </span>
            </div>
          </div>
        </div>

        {/* Provider rows */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 64px',
            flex: 1,
          }}
        >
          {displayProviders.map((g, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: `${rowHeight}px`,
                borderBottom: i < displayProviders.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}
            >
              {/* Wordmark logo */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '180px',
                  height: '28px',
                  flexShrink: 0,
                }}
              >
                {logoUris[g.provider] ? (
                  <img src={logoUris[g.provider]!} height={28} />
                ) : (
                  <span style={{ color: '#0f172a', fontSize: '18px', fontWeight: 700 }}>
                    {PROVIDER_NAMES[g.provider] || g.provider}
                  </span>
                )}
              </div>

              {/* Name + description */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  paddingLeft: '32px',
                }}
              >
                <span style={{ color: '#0f172a', fontSize: '22px', fontWeight: 700 }}>
                  {PROVIDER_NAMES[g.provider] || g.provider}
                </span>
                <span style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>
                  {PROVIDER_DESCRIPTIONS[g.provider] || ''}
                </span>
              </div>

              {/* Service badges */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0,
                }}
              >
                {g.services.map((svc, j) => (
                  <div
                    key={j}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 14px',
                      background: '#f0edff',
                      borderRadius: '16px',
                    }}
                  >
                    <span style={{ color: '#5b52cc', fontSize: '15px' }}>
                      {svc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {overflow > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '48px',
                paddingLeft: '212px',
              }}
            >
              <span style={{ color: '#94a3b8', fontSize: '16px' }}>
                +{overflow} more provider{overflow !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fontData ? {
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            style: 'normal' as const,
            weight: 400 as const,
          },
        ],
      } : {}),
    },
  );
}
