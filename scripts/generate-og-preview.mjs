import { ImageResponse } from '@vercel/og';
import { writeFileSync, readFileSync } from 'fs';
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

const PROVIDER_COLORS = {
  agentmail: '#635BFF', algolia: '#003DFF', amplitude: '#1E61F0', auth0: '#EB5424',
  browserbase: '#FF6B35', chroma: '#FF6B6B', clerk: '#6C47FF', cloudflare: '#F6821F',
  daytona: '#1C1C1C', elevenlabs: '#ffffff', firecrawl: '#FF6B35', flyio: '#7B3FE4',
  gitlab: '#FC6D26', huggingface: '#FFD21E', inngest: '#5D5FEF', mixpanel: '#7856FF',
  neon: '#34D59A', netlify: '#32E6E2', openrouter: '#6366F1', planetscale: '#ffffff',
  posthog: '#1D4AFF', privy: '#6851FF', railway: '#ffffff', render: '#46E3B7',
  runloop: '#635BFF', sentry: '#4E2A9A', supabase: '#3ECF8E', turso: '#4FF8D2',
  twilio: '#F22F46', upstash: '#00E9A3', vercel: '#ffffff', workos: '#6363F1',
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
const services = STACKS[variant] || STACKS.standard;

// Download Inter font for preview generation
const fontResp = await fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf');
const fontData = Buffer.from(await fontResp.arrayBuffer());

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
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,91,255,0.06) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            display: 'flex',
          },
        },
      },
      // Gradient bar
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
      // Content
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 64px',
            flex: 1,
          },
          children: [
            // Header
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '40px',
                },
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
            // Provider rows
            {
              type: 'div',
              props: {
                style: { display: 'flex', flexDirection: 'column', flex: 1 },
                children: [
                  ...services.slice(0, services.length > 5 ? 5 : services.length).map((s, i) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      height: '72px',
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
                            width: '24px',
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
                                  left: '11px',
                                  width: '2px',
                                  height: '30px',
                                  background: 'rgba(99,91,255,0.3)',
                                  display: 'flex',
                                },
                              },
                            }] : []),
                            {
                              type: 'div',
                              props: {
                                style: {
                                  position: 'absolute',
                                  top: '30px',
                                  left: '6px',
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background: PROVIDER_COLORS[s.provider] || '#635BFF',
                                  display: 'flex',
                                },
                              },
                            },
                            ...(i < Math.min(services.length, 5) - 1 ? [{
                              type: 'div',
                              props: {
                                style: {
                                  position: 'absolute',
                                  top: '44px',
                                  left: '11px',
                                  width: '2px',
                                  height: '28px',
                                  background: 'rgba(99,91,255,0.3)',
                                  display: 'flex',
                                },
                              },
                            }] : []),
                          ],
                        },
                      },
                      // Provider name
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#f1f5f9',
                            fontSize: '26px',
                            fontWeight: 600,
                            width: '240px',
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
                            background: 'rgba(99,91,255,0.12)',
                            borderRadius: '20px',
                            border: '1px solid rgba(99,91,255,0.25)',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                color: '#a5b4fc',
                                fontSize: '17px',
                              },
                              children: s.service,
                            },
                          },
                        },
                      },
                    ],
                  },
                })),
                  ...(services.length > 5 ? [{
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        height: '48px',
                        paddingLeft: '36px',
                      },
                      children: {
                        type: 'span',
                        props: {
                          style: { color: '#64748b', fontSize: '18px' },
                          children: `+${services.length - 5} more service${services.length - 5 !== 1 ? 's' : ''}`,
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
            padding: '0 64px 36px',
          },
          children: [
            {
              type: 'span',
              props: {
                style: { color: '#475569', fontSize: '16px' },
                children: 'projects.dev',
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  background: 'rgba(99,91,255,0.08)',
                  borderRadius: '8px',
                  border: '1px solid rgba(99,91,255,0.15)',
                },
                children: {
                  type: 'span',
                  props: {
                    style: { color: '#94a3b8', fontSize: '15px' },
                    children: `${services.length} services`,
                  },
                },
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
      {
        name: 'Inter',
        data: fontData,
        style: 'normal',
        weight: 400,
      },
    ],
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  const outPath = join(ROOT, `og-preview-${variant}.png`);
  writeFileSync(outPath, buffer);
  console.log(`✓ Generated OG preview: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

generate().catch(console.error);
