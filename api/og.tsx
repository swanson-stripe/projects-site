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

const PROVIDER_COLORS: Record<string, string> = {
  agentmail: '#635BFF', algolia: '#003DFF', amplitude: '#1E61F0', auth0: '#EB5424',
  browserbase: '#FF6B35', chroma: '#FF6B6B', clerk: '#6C47FF', cloudflare: '#F6821F',
  daytona: '#1C1C1C', elevenlabs: '#000000', firecrawl: '#FF6B35', flyio: '#7B3FE4',
  gitlab: '#FC6D26', huggingface: '#FFD21E', inngest: '#5D5FEF', mixpanel: '#7856FF',
  neon: '#34D59A', netlify: '#32E6E2', openrouter: '#6366F1', planetscale: '#000000',
  posthog: '#1D4AFF', privy: '#6851FF', railway: '#0B0D0E', render: '#46E3B7',
  runloop: '#635BFF', sentry: '#4E2A9A', supabase: '#3ECF8E', turso: '#4FF8D2',
  twilio: '#F22F46', upstash: '#00E9A3', vercel: '#000000', workos: '#6363F1',
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

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const stack = url.searchParams.get('stack') || '';
  const services = decodeStackServices(stack);

  const maxVisible = services.length > 5 ? 5 : services.length;
  const displayServices = services.slice(0, maxVisible);
  const overflow = services.length > 5 ? services.length - 5 : 0;

  const fontData = await fetch(
    'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf'
  ).then(res => res.arrayBuffer()).catch(() => null);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#080c14',
          fontFamily: '"Inter"',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,91,255,0.06) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            display: 'flex',
          }}
        />

        {/* Top gradient bar */}
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #635BFF, #7c3aed, #f97316, #f59e0b)',
            display: 'flex',
          }}
        />

        {/* Content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 64px',
            flex: 1,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}
          >
            {/* Stripe Projects icon */}
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
              <rect width="16" height="16" rx="4" fill="#635BFF"/>
              <circle cx="5" cy="8" r="1.5" fill="white"/>
              <circle cx="8" cy="8" r="1.5" fill="white"/>
              <circle cx="11" cy="8" r="1.5" fill="white"/>
            </svg>
            <span style={{ color: '#94a3b8', fontSize: '20px', fontWeight: 500 }}>
              Stack Share
            </span>
          </div>

          {/* Provider list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
              flex: 1,
            }}
          >
            {displayServices.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  height: '64px',
                }}
              >
                {/* Connector dot + line */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '20px',
                    height: '64px',
                    position: 'relative',
                  }}
                >
                  {i > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        width: '2px',
                        height: '26px',
                        background: 'rgba(99,91,255,0.3)',
                        display: 'flex',
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      top: '26px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: PROVIDER_COLORS[s.provider] || '#635BFF',
                      border: '2px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                    }}
                  />
                  {i < displayServices.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '40px',
                        width: '2px',
                        height: '24px',
                        background: 'rgba(99,91,255,0.3)',
                        display: 'flex',
                      }}
                    />
                  )}
                </div>

                {/* Provider name */}
                <span
                  style={{
                    color: '#f1f5f9',
                    fontSize: '24px',
                    fontWeight: 600,
                    width: '220px',
                  }}
                >
                  {PROVIDER_NAMES[s.provider] || s.provider}
                </span>

                {/* Service badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 14px',
                    background: 'rgba(99,91,255,0.12)',
                    borderRadius: '20px',
                    border: '1px solid rgba(99,91,255,0.2)',
                  }}
                >
                  <span
                    style={{
                      color: '#a5b4fc',
                      fontSize: '16px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {s.service}
                  </span>
                </div>
              </div>
            ))}

            {overflow > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  height: '48px',
                  paddingLeft: '36px',
                }}
              >
                <span style={{ color: '#64748b', fontSize: '18px' }}>
                  +{overflow} more service{overflow !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 64px 36px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#475569', fontSize: '16px' }}>
              projects.dev
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(99,91,255,0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(99,91,255,0.15)',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '15px' }}>
              {services.length} service{services.length !== 1 ? 's' : ''}
            </span>
          </div>
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
