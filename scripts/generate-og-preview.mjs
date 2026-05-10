import { ImageResponse } from '@vercel/og';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ICONS_DIR = join(ROOT, 'src/assets/images/svg/provider-icons');

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

function loadSvgData(provider) {
  const path = join(ICONS_DIR, `${provider}.svg`);
  if (!existsSync(path)) return null;
  const content = readFileSync(path, 'utf-8');
  const base64 = Buffer.from(content).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

const fontResp = await fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf');
const fontData = Buffer.from(await fontResp.arrayBuffer());
const fontBoldResp = await fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf');
const fontBoldData = Buffer.from(await fontBoldResp.arrayBuffer());

const maxVisible = services.length > 5 ? 5 : services.length;
const displayServices = services.slice(0, maxVisible);
const overflow = services.length > 5 ? services.length - 5 : 0;

const element = {
  type: 'div',
  props: {
    style: {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      background: '#080c14',
      fontFamily: '"Inter"',
      position: 'relative',
      overflow: 'hidden',
    },
    children: [
      // Dot grid background
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,91,255,0.05) 1px, transparent 0)',
            backgroundSize: '32px 32px',
            display: 'flex',
          },
        },
      },
      // Top gradient bar
      {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #635BFF, #7c3aed, #f97316, #f59e0b)',
            display: 'flex',
          },
        },
      },
      // Main content — centered
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 80px',
            flex: 1,
            justifyContent: 'center',
          },
          children: [
            // Header row
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '36px',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', alignItems: 'center', gap: '12px' },
                      children: [
                        {
                          type: 'svg',
                          props: {
                            width: 28,
                            height: 28,
                            viewBox: '0 0 16 16',
                            fill: 'none',
                            children: [
                              { type: 'rect', props: { width: 16, height: 16, rx: 4, fill: '#635BFF' } },
                              { type: 'circle', props: { cx: 5, cy: 8, r: 1.5, fill: 'white' } },
                              { type: 'circle', props: { cx: 8, cy: 8, r: 1.5, fill: 'white' } },
                              { type: 'circle', props: { cx: 11, cy: 8, r: 1.5, fill: 'white' } },
                            ],
                          },
                        },
                        {
                          type: 'span',
                          props: {
                            style: { color: '#94a3b8', fontSize: '20px', fontWeight: 500 },
                            children: 'Stack Share',
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 18px',
                        background: 'rgba(99,91,255,0.08)',
                        borderRadius: '8px',
                        border: '1px solid rgba(99,91,255,0.15)',
                      },
                      children: {
                        type: 'span',
                        props: {
                          style: { color: '#94a3b8', fontSize: '16px' },
                          children: `${services.length} service${services.length !== 1 ? 's' : ''}`,
                        },
                      },
                    },
                  },
                ],
              },
            },
            // Provider rows
            {
              type: 'div',
              props: {
                style: { display: 'flex', flexDirection: 'column', gap: '0' },
                children: [
                  ...displayServices.map((s, i) => {
                    const logoSrc = loadSvgData(s.provider);
                    return {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          height: '72px',
                          gap: '0',
                        },
                        children: [
                          // Connector column
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '32px',
                                height: '72px',
                                position: 'relative',
                              },
                              children: [
                                ...(i > 0 ? [{
                                  type: 'div',
                                  props: {
                                    style: {
                                      position: 'absolute',
                                      top: '0',
                                      left: '15px',
                                      width: '2px',
                                      height: '28px',
                                      background: 'rgba(99,91,255,0.25)',
                                      display: 'flex',
                                    },
                                  },
                                }] : []),
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      position: 'absolute',
                                      top: '28px',
                                      left: '10px',
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%',
                                      background: 'rgba(99,91,255,0.4)',
                                      border: '2px solid rgba(99,91,255,0.6)',
                                      display: 'flex',
                                    },
                                  },
                                },
                                ...(i < displayServices.length - 1 ? [{
                                  type: 'div',
                                  props: {
                                    style: {
                                      position: 'absolute',
                                      top: '42px',
                                      left: '15px',
                                      width: '2px',
                                      height: '30px',
                                      background: 'rgba(99,91,255,0.25)',
                                      display: 'flex',
                                    },
                                  },
                                }] : []),
                              ],
                            },
                          },
                          // Logo
                          {
                            type: 'div',
                            props: {
                              style: {
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
                              },
                              children: logoSrc ? {
                                type: 'img',
                                props: {
                                  src: logoSrc,
                                  width: 22,
                                  height: 22,
                                },
                              } : {
                                type: 'span',
                                props: {
                                  style: { color: '#f1f5f9', fontSize: '14px', fontWeight: 600 },
                                  children: (PROVIDER_NAMES[s.provider] || s.provider).slice(0, 2),
                                },
                              },
                            },
                          },
                          // Provider name
                          {
                            type: 'span',
                            props: {
                              style: {
                                color: '#f1f5f9',
                                fontSize: '24px',
                                fontWeight: 600,
                                width: '220px',
                              },
                              children: PROVIDER_NAMES[s.provider] || s.provider,
                            },
                          },
                          // Service badge
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                padding: '6px 16px',
                                background: 'rgba(99,91,255,0.1)',
                                borderRadius: '20px',
                                border: '1px solid rgba(99,91,255,0.2)',
                              },
                              children: {
                                type: 'span',
                                props: {
                                  style: { color: '#a5b4fc', fontSize: '16px' },
                                  children: s.service,
                                },
                              },
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
                        paddingLeft: '48px',
                      },
                      children: {
                        type: 'span',
                        props: {
                          style: { color: '#64748b', fontSize: '17px' },
                          children: `+${overflow} more service${overflow !== 1 ? 's' : ''}`,
                        },
                      },
                    },
                  }] : []),
                ],
              },
            },
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
            padding: '0 80px 32px',
          },
          children: [
            {
              type: 'span',
              props: {
                style: { color: '#334155', fontSize: '16px' },
                children: 'projects.dev',
              },
            },
            {
              type: 'span',
              props: {
                style: { color: '#334155', fontSize: '14px' },
                children: 'npx stripe-projects clone',
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
  const outPath = join(ROOT, `og-preview.png`);
  writeFileSync(outPath, buffer);
  console.log(`✓ Generated: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

generate().catch(console.error);
