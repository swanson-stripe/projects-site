import type { IncomingMessage, ServerResponse } from 'http';
import { ImageResponse } from '@vercel/og';

interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  send(body: Buffer): void;
  setHeader(name: string, value: string): this;
}

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
    let provider: string;
    let service: string;
    try {
      provider = decodeURIComponent(part.slice(0, tildeIdx)).toLowerCase();
      service = decodeURIComponent(part.slice(tildeIdx + 1));
    } catch {
      continue;
    }
    if (!PROVIDER_NAMES[provider]) continue;
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

async function fetchAsDataUri(url: string, mime: string): Promise<string | null> {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const buf = Buffer.from(await resp.arrayBuffer());
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

function h(type: string, props: any, ...children: any[]): any {
  const flat = children.flat().filter(c => c !== undefined && c !== null && c !== false);
  return {
    type,
    props: {
      ...props,
      children: flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat,
    },
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'projects.dev';
  const siteUrl = `${protocol}://${host}`;
  const stack = (req.query.stack as string) || '';
  const services = decodeStackServices(stack);
  const grouped = groupByProvider(services);

  const maxVisible = grouped.length > 7 ? 7 : grouped.length;
  const displayProviders = grouped.slice(0, maxVisible);
  const count = displayProviders.length;

  const [fontData, fontBoldData, logos, bgDataUri, stripeLogoUri] = await Promise.all([
    fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf')
      .then(r => r.arrayBuffer()).catch(() => null),
    fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf')
      .then(r => r.arrayBuffer()).catch(() => null),
    getLogos(siteUrl),
    fetchAsDataUri(`${siteUrl}/assets/images/og/og-gradient-bg.jpg`, 'image/jpeg'),
    fetchAsDataUri(`${siteUrl}/assets/images/og/stripe-projects-logo.png`, 'image/png'),
  ]);

  const logoUris: Record<string, string | null> = {};
  for (const g of displayProviders) {
    const svg = logos[g.provider];
    logoUris[g.provider] = svg ? `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}` : null;
  }

  // Dynamic sizing
  const cardTop = count <= 2 ? '100px' : count <= 4 ? '60px' : count <= 6 ? '40px' : '30px';
  const cardPadTop = count <= 3 ? '48px' : count <= 5 ? '40px' : '36px';
  const rowGap = count <= 3 ? '40px' : count <= 5 ? '30px' : '22px';
  const logoHeight = count <= 4 ? 42 : count <= 6 ? 36 : 30;
  const badgePad = count <= 4 ? '10px 20px' : '8px 16px';
  const badgeFont = count <= 4 ? '20px' : '17px';

  // Title: dynamic for single provider
  let title: string;
  if (count === 1) {
    const providerName = PROVIDER_NAMES[displayProviders[0].provider] || displayProviders[0].provider;
    const serviceName = displayProviders[0].services[0];
    title = `Provision ${providerName} ${serviceName}`;
  } else {
    title = 'Clone this stack';
  }

  const element = h('div', { style: { width: '1200px', height: '630px', display: 'flex', fontFamily: '"Inter"', overflow: 'hidden', position: 'relative' } },
    // Background
    bgDataUri
      ? h('img', { src: bgDataUri, width: 1200, height: 630, style: { position: 'absolute', top: 0, left: 0, width: '1200px', height: '630px' } })
      : h('div', { style: { position: 'absolute', top: 0, left: 0, width: '1200px', height: '630px', background: 'linear-gradient(135deg, #f97316 0%, #a855f7 50%, #635BFF 100%)', display: 'flex' } }),

    // Left column
    h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '48px 0 48px 64px', width: '440px', flexShrink: 0 } },
      stripeLogoUri
        ? h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: '32px' } },
            h('img', { src: stripeLogoUri, height: 28 })
          )
        : h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' } },
            h('svg', { width: 18, height: 18, viewBox: '0 0 16 16', fill: '#635BFF' },
              h('path', { d: 'M15.8074 0L0.195312 3.31818V16L15.8074 12.6818V0Z' })
            ),
            h('span', { style: { color: '#0f172a', fontSize: '17px', fontWeight: 600 } }, 'Stripe Projects')
          ),
      h('span', { style: { color: '#0f172a', fontSize: '58px', fontWeight: 700, lineHeight: 1.1 } }, title)
    ),

    // Right — card anchored to bottom-right
    h('div', { style: { position: 'absolute', right: '-24px', bottom: '0px', width: '660px', display: 'flex' } },
      // Glass rim
      h('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', borderRadius: '20px 0 0 0', background: 'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.25) 100%)', padding: '8px 0 0 8px' } },
        // Inner white card
        h('div', { style: { display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '14px 0 0 0', padding: `${cardPadTop} 56px 0 48px`, boxShadow: '-4px -4px 40px rgba(0,0,0,0.06)' } },
          // Provider rows
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: rowGap } },
            ...displayProviders.map(g => {
              return h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                h('div', { style: { display: 'flex', alignItems: 'center', height: `${logoHeight}px`, flex: 1 } },
                  logoUris[g.provider]
                    ? h('img', { src: logoUris[g.provider], height: logoHeight })
                    : h('span', { style: { color: '#0f172a', fontSize: '28px', fontWeight: 700 } }, PROVIDER_NAMES[g.provider] || g.provider)
                ),
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 } },
                  ...g.services.map(svc =>
                    h('div', { style: { display: 'flex', alignItems: 'center', padding: badgePad, background: '#ede9fe', borderRadius: '22px' } },
                      h('span', { style: { color: '#4c1d95', fontSize: badgeFont, fontWeight: 500 } }, svc)
                    )
                  )
                )
              );
            })
          ),
          // Divider
          h('div', { style: { width: '100%', height: '1px', background: '#e2e8f0', marginTop: '28px' } }),
          // Clone button
          h('div', { style: { display: 'flex', justifyContent: 'center', padding: '24px 0 24px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', padding: '16px 40px', background: '#635BFF', borderRadius: '10px' } },
              h('span', { style: { color: '#ffffff', fontSize: '22px', fontWeight: 600 } }, 'Clone')
            )
          )
        )
      )
    )
  );

  const fonts: any[] = [];
  if (fontData) fonts.push({ name: 'Inter', data: fontData, style: 'normal' as const, weight: 400 as const });
  if (fontBoldData) fonts.push({ name: 'Inter', data: fontBoldData, style: 'normal' as const, weight: 700 as const });

  const imageResponse = new ImageResponse(element, {
    width: 1200,
    height: 630,
    ...(fonts.length > 0 ? { fonts } : {}),
  });

  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
  res.status(200).send(buffer);
}
