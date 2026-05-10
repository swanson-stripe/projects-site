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

function loadLogos() {
  const content = readFileSync(join(ROOT, 'src/assets/js/provider-logos.js'), 'utf-8');
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}') + 1;
  return JSON.parse(content.slice(start, end));
}

function logoToDataUri(svgString) {
  return `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
}

const LOGOS = loadLogos();

function groupByProvider(services) {
  const grouped = [];
  for (const s of services) {
    const existing = grouped.find(g => g.provider === s.provider);
    if (existing) existing.services.push(s.service);
    else grouped.push({ provider: s.provider, services: [s.service] });
  }
  return grouped;
}

const fontResp = await fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf');
const fontData = Buffer.from(await fontResp.arrayBuffer());
const fontBoldResp = await fetch('https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf');
const fontBoldData = Buffer.from(await fontBoldResp.arrayBuffer());

function h(type, props, ...children) {
  const flat = children.flat().filter(c => c !== undefined && c !== null && c !== false);
  return { type, props: { ...props, children: flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat } };
}

const bgPath = join(ROOT, 'src/assets/images/og/og-gradient-bg.jpg');
const bgBase64 = readFileSync(bgPath).toString('base64');
const bgDataUri = `data:image/jpeg;base64,${bgBase64}`;

const logoPath = join(ROOT, 'src/assets/images/og/stripe-projects-logo.png');
const logoBase64 = readFileSync(logoPath).toString('base64');
const stripeLogoUri = `data:image/png;base64,${logoBase64}`;

function buildElement(grouped, allServices) {
  const count = grouped.length;
  // Dynamic sizing based on provider count
  const cardTop = count <= 2 ? '100px' : count <= 4 ? '60px' : count <= 6 ? '40px' : '30px';
  const cardPadTop = count <= 3 ? '48px' : count <= 5 ? '40px' : '36px';
  const rowGap = count <= 3 ? '40px' : count <= 5 ? '30px' : '22px';
  const logoHeight = count <= 4 ? 42 : count <= 6 ? 36 : 30;
  const badgePad = count <= 4 ? '10px 20px' : '8px 16px';
  const badgeFont = count <= 4 ? '20px' : '17px';

  // Title: dynamic for single provider
  let title;
  if (count === 1) {
    const providerName = PROVIDER_NAMES[grouped[0].provider] || grouped[0].provider;
    const serviceName = grouped[0].services[0];
    title = `Provision ${providerName} ${serviceName}`;
  } else {
    title = 'Clone this stack';
  }

  return h('div', { style: { width: '1200px', height: '630px', display: 'flex', fontFamily: '"Inter"', overflow: 'hidden', position: 'relative' } },
    // Background
    h('img', { src: bgDataUri, width: 1200, height: 630, style: { position: 'absolute', top: 0, left: 0, width: '1200px', height: '630px' } }),

    // Left column
    h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '48px 0 48px 64px', width: '440px', flexShrink: 0 } },
      h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: '32px' } },
        h('img', { src: stripeLogoUri, height: 28 })
      ),
      h('span', { style: { color: '#0f172a', fontSize: '58px', fontWeight: 700, lineHeight: 1.1 } }, title)
    ),

    // Right — card anchored to bottom-right, height varies by content
    h('div', { style: { position: 'absolute', right: '-24px', bottom: '0px', width: '660px', display: 'flex' } },
      // Glass rim — thick
      h('div', { style: { display: 'flex', flexDirection: 'column', width: '100%', borderRadius: '20px 0 0 0', background: 'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.25) 100%)', padding: '8px 0 0 8px' } },
        // Inner white card
        h('div', { style: { display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '14px 0 0 0', padding: `${cardPadTop} 56px 0 48px`, boxShadow: '-4px -4px 40px rgba(0,0,0,0.06)' } },
          // Provider rows
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: rowGap } },
            ...grouped.map(g => {
              const logoSvg = LOGOS[g.provider];
              const logoUri = logoSvg ? logoToDataUri(logoSvg) : null;
              return h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                h('div', { style: { display: 'flex', alignItems: 'center', height: `${logoHeight}px`, flex: 1 } },
                  logoUri
                    ? h('img', { src: logoUri, height: logoHeight })
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
          // Clone button — centered, consistent position
          h('div', { style: { display: 'flex', justifyContent: 'center', padding: '24px 0 24px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', padding: '16px 40px', background: '#635BFF', borderRadius: '10px' } },
              h('span', { style: { color: '#ffffff', fontSize: '22px', fontWeight: 600 } }, 'Clone')
            )
          )
        )
      )
    )
  );
}

// Test stacks with varying provider counts
const ALL_SERVICES = [
  { provider: 'cloudflare', service: 'worker' },
  { provider: 'cloudflare', service: 'r2' },
  { provider: 'neon', service: 'postgres' },
  { provider: 'clerk', service: 'auth' },
  { provider: 'posthog', service: 'analytics' },
  { provider: 'vercel', service: 'hosting' },
  { provider: 'supabase', service: 'storage' },
  { provider: 'sentry', service: 'monitoring' },
  { provider: 'inngest', service: 'jobs' },
];

const variants = [1, 2, 3, 4, 5, 6, 7];

for (const count of variants) {
  // Pick services that give us the right number of unique providers
  const selected = [];
  const seen = new Set();
  for (const s of ALL_SERVICES) {
    if (!seen.has(s.provider)) {
      seen.add(s.provider);
      selected.push(s);
      // Also add other services from same provider
      for (const s2 of ALL_SERVICES) {
        if (s2.provider === s.provider && s2 !== s) selected.push(s2);
      }
    }
    const grouped = groupByProvider(selected);
    if (grouped.length >= count) break;
  }

  const grouped = groupByProvider(selected).slice(0, count);
  const element = buildElement(grouped, selected);

  const response = new ImageResponse(element, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontData, style: 'normal', weight: 400 },
      { name: 'Inter', data: fontBoldData, style: 'normal', weight: 700 },
    ],
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  const outPath = join(ROOT, `og-preview-${count}.png`);
  writeFileSync(outPath, buffer);
  console.log(`✓ ${count} provider${count !== 1 ? 's' : ''}: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}
