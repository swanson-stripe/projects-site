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

const SITE_URL = 'https://projects.dev';

async function loadProviderIcon(provider: string): Promise<string | null> {
  try {
    const resp = await fetch(`${SITE_URL}/assets/images/svg/provider-icons/${provider}.svg`);
    if (!resp.ok) return null;
    const svg = await resp.text();
    const base64 = btoa(svg);
    return `data:image/svg+xml;base64,${base64}`;
  } catch {
    return null;
  }
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const stack = url.searchParams.get('stack') || '';
  const services = decodeStackServices(stack);

  const maxVisible = services.length > 5 ? 5 : services.length;
  const displayServices = services.slice(0, maxVisible);
  const overflow = services.length > 5 ? services.length - 5 : 0;

  const [fontData, ...icons] = await Promise.all([
    fetch(
      'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf'
    ).then(res => res.arrayBuffer()).catch(() => null),
    ...displayServices.map(s => loadProviderIcon(s.provider)),
  ]);

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
        {/* Dot grid */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,91,255,0.05) 1px, transparent 0)',
            backgroundSize: '32px 32px',
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

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 80px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '36px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                background: 'rgba(99,91,255,0.08)',
                borderRadius: '8px',
                border: '1px solid rgba(99,91,255,0.15)',
              }}
            >
              <span style={{ color: '#94a3b8', fontSize: '16px' }}>
                {services.length} service{services.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Provider list */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {displayServices.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '72px',
                }}
              >
                {/* Connector */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '32px',
                    height: '72px',
                    position: 'relative',
                  }}
                >
                  {i > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '15px',
                        width: '2px',
                        height: '28px',
                        background: 'rgba(99,91,255,0.25)',
                        display: 'flex',
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      top: '28px',
                      left: '10px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'rgba(99,91,255,0.4)',
                      border: '2px solid rgba(99,91,255,0.6)',
                      display: 'flex',
                    }}
                  />
                  {i < displayServices.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '42px',
                        left: '15px',
                        width: '2px',
                        height: '30px',
                        background: 'rgba(99,91,255,0.25)',
                        display: 'flex',
                      }}
                    />
                  )}
                </div>

                {/* Logo */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    marginLeft: '16px',
                    marginRight: '20px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {icons[i] ? (
                    <img src={icons[i]!} width={22} height={22} />
                  ) : (
                    <span style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600 }}>
                      {(PROVIDER_NAMES[s.provider] || s.provider).slice(0, 2)}
                    </span>
                  )}
                </div>

                {/* Name */}
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
                    padding: '6px 16px',
                    background: 'rgba(99,91,255,0.1)',
                    borderRadius: '20px',
                    border: '1px solid rgba(99,91,255,0.2)',
                  }}
                >
                  <span style={{ color: '#a5b4fc', fontSize: '16px' }}>
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
                  height: '48px',
                  paddingLeft: '48px',
                }}
              >
                <span style={{ color: '#64748b', fontSize: '17px' }}>
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
            padding: '0 80px 32px',
          }}
        >
          <span style={{ color: '#334155', fontSize: '16px' }}>
            projects.dev
          </span>
          <span style={{ color: '#334155', fontSize: '14px' }}>
            npx stripe-projects clone
          </span>
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
