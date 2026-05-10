import { ImageResponse } from '@vercel/og';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const PROVIDER_NAMES = {
  agentmail: 'AgentMail', algolia: 'Algolia', amplitude: 'Amplitude', auth0: 'Auth0',
  browserbase: 'Browserbase', chroma: 'Chroma', clerk: 'Clerk', cloudflare: 'Cloudflare',
  daytona: 'Daytona', elevenlabs: 'ElevenLabs', firecrawl: 'Firecrawl', flyio: 'Fly.io',
  gitlab: 'GitLab', huggingface: 'Hugging Face', inngest: 'Inngest', mixpanel: 'Mixpanel',
  neon: 'Neon', netlify: 'Netlify', openrouter: 'OpenRouter', planetscale: 'PlanetScale',
  posthog: 'PostHog', privy: 'Privy', railway: 'Railway', render: 'Render',
  runloop: 'Runloop', sentry: 'Sentry', supabase: 'Supabase', turso: 'Turso',
  twilio: 'Twilio', upstash: 'Upstash', vercel: 'Vercel', workos: 'WorkOS',
};

const PROVIDER_DESCRIPTIONS = {
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

const STACKS = {
  standard: [
    { provider: 'neon', service: 'postgres' },
    { provider: 'vercel', service: 'hosting' },
    { provider: 'clerk', service: 'auth' },
    { provider: 'supabase', service: 'storage' },
    { provider: 'sentry', service: 'monitoring' },
  ],
  overflow: [
    { provider: 'neon', service: 'postgres' },
    { provider: 'vercel', service: 'hosting' },
    { provider: 'clerk', service: 'auth' },
    { provider: 'supabase', service: 'storage' },
    { provider: 'sentry', service: 'monitoring' },
    { provider: 'inngest', service: 'jobs' },
    { provider: 'upstash', service: 'redis' },
    { provider: 'posthog', service: 'analytics' },
  ],
  minimal: [
    { provider: 'vercel', service: 'nextjs' },
    { provider: 'neon', service: 'postgres' },
  ],
};

const variant = process.argv[2] || 'standard';
let services;
if (variant.includes('~')) {
  services = variant.split(',').map(part => {
    const [provider, service] = part.replace(/^v1:/, '').split('~');
    return { provider, service };
  });
} else {
  services = STACKS[variant] || STACKS.standard;
}

// Group services by provider (like the real card does)
function groupByProvider(services) {
  const grouped = [];
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

// Load wordmark logos from provider-logos.js
function loadLogos() {
  const content = readFileSync(join(ROOT, 'src/assets/js/provider-logos.js'), 'utf-8');
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}') + 1;
  return JSON.parse(content.slice(start, end));
}

function logoToDataUri(svgString) {
  const base64 = Buffer.from(svgString).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

const LOGOS = loadLogos();
const grouped = groupByProvider(services);
const maxVisible = grouped.length > 5 ? 5 : grouped.length;
const displayProviders = grouped.slice(0, maxVisible);
const overflow = grouped.length > 5 ? grouped.length - 5 : 0;

const fontResp = await fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf');
const fontData = Buffer.from(await fontResp.arrayBuffer());
const fontBoldResp = await fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf');
const fontBoldData = Buffer.from(await fontBoldResp.arrayBuffer());

const element = {
  type: 'div',
  props: {
    style: {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      fontFamily: '"Inter"',
      position: 'relative',
      overflow: 'hidden',
    },
    children: [
      // Gradient header banner
      {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '100px',
            background: 'linear-gradient(135deg, #635BFF 0%, #7c3aed 30%, #f97316 70%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 64px',
          },
          children: {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '14px' },
              children: [
                {
                  type: 'svg',
                  props: {
                    width: 28,
                    height: 28,
                    viewBox: '0 0 16 16',
                    fill: 'none',
                    children: [
                      { type: 'rect', props: { width: 16, height: 16, rx: 4, fill: 'rgba(255,255,255,0.2)' } },
                      { type: 'circle', props: { cx: 5, cy: 8, r: 1.5, fill: 'white' } },
                      { type: 'circle', props: { cx: 8, cy: 8, r: 1.5, fill: 'white' } },
                      { type: 'circle', props: { cx: 11, cy: 8, r: 1.5, fill: 'white' } },
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { color: '#ffffff', fontSize: '28px', fontWeight: 700 },
                    children: 'Stack Share',
                  },
                },
              ],
            },
          },
        },
      },
      // Provider rows
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 64px',
            flex: 1,
            gap: '0',
          },
          children: [
            ...displayProviders.map((g, i) => {
              const logoSvg = LOGOS[g.provider];
              const logoUri = logoSvg ? logoToDataUri(logoSvg) : null;
              return {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    height: `${Math.floor((630 - 100 - 64 - 48) / maxVisible)}px`,
                    borderBottom: i < displayProviders.length - 1 ? '1px solid #f1f5f9' : 'none',
                  },
                  children: [
                    // Wordmark logo
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          width: '180px',
                          height: '28px',
                          flexShrink: 0,
                        },
                        children: logoUri ? {
                          type: 'img',
                          props: {
                            src: logoUri,
                            height: 28,
                          },
                        } : {
                          type: 'span',
                          props: {
                            style: { color: '#0f172a', fontSize: '18px', fontWeight: 700 },
                            children: PROVIDER_NAMES[g.provider] || g.provider,
                          },
                        },
                      },
                    },
                    // Name + description
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                          paddingLeft: '32px',
                        },
                        children: [
                          {
                            type: 'span',
                            props: {
                              style: { color: '#0f172a', fontSize: '22px', fontWeight: 700 },
                              children: PROVIDER_NAMES[g.provider] || g.provider,
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: { color: '#64748b', fontSize: '15px', marginTop: '4px' },
                              children: PROVIDER_DESCRIPTIONS[g.provider] || '',
                            },
                          },
                        ],
                      },
                    },
                    // Service badges
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexShrink: 0,
                        },
                        children: g.services.map(svc => ({
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              alignItems: 'center',
                              padding: '6px 14px',
                              background: '#f0edff',
                              borderRadius: '16px',
                            },
                            children: {
                              type: 'span',
                              props: {
                                style: { color: '#5b52cc', fontSize: '15px' },
                                children: svc,
                              },
                            },
                          },
                        })),
                      },
                    },
                  ],
                },
              };
            }),
            ...(overflow > 0 ? [{
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  height: '48px',
                  paddingLeft: '212px',
                },
                children: {
                  type: 'span',
                  props: {
                    style: { color: '#94a3b8', fontSize: '16px' },
                    children: `+${overflow} more provider${overflow !== 1 ? 's' : ''}`,
                  },
                },
              },
            }] : []),
          ],
        },
      },
      // Footer
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 64px 24px',
          },
          children: [
            {
              type: 'span',
              props: {
                style: { color: '#94a3b8', fontSize: '14px' },
                children: 'projects.dev',
              },
            },
            {
              type: 'span',
              props: {
                style: { color: '#94a3b8', fontSize: '14px' },
                children: `${services.length} service${services.length !== 1 ? 's' : ''} · npx stripe-projects clone`,
              },
            },
          ],
        },
      },
    ],
  },
};

async function generate() {
  const response = new ImageResponse(element, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontData, style: 'normal', weight: 400 },
      { name: 'Inter', data: fontBoldData, style: 'normal', weight: 700 },
    ],
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  const outPath = join(ROOT, 'og-preview.png');
  writeFileSync(outPath, buffer);
  console.log(`✓ Generated: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

generate().catch(console.error);
