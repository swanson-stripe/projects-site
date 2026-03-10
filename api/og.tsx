/** @jsxImportSource react */
import { ImageResponse } from '@vercel/og';
import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

interface StackData {
  appName: string;
  services: string[];
  createdAt: string;
}

const REGISTRY: Record<string, { category: string; description: string }> = {
  stripe:      { category: 'payments',   description: 'Payments infrastructure' },
  clerk:       { category: 'auth',       description: 'Auth & user management' },
  supabase:    { category: 'storage',    description: 'Open source Firebase alt.' },
  vercel:      { category: 'hosting',    description: 'Frontend cloud platform' },
  neon:        { category: 'database',   description: 'Serverless Postgres' },
  railway:     { category: 'hosting',    description: 'Infrastructure for devs' },
  posthog:     { category: 'analytics',  description: 'Product analytics' },
  sentry:      { category: 'monitoring', description: 'Error monitoring' },
  chroma:      { category: 'ai',         description: 'AI-native vector database' },
  planetscale: { category: 'database',   description: 'Serverless MySQL platform' },
  turso:       { category: 'database',   description: 'SQLite for the agentic era' },
  runloop:     { category: 'ai',         description: 'AI dev infrastructure' },
};

const CATEGORY_COLORS: Record<string, string> = {
  payments:   '#635BFF',
  auth:       '#6C47FF',
  database:   '#34D59A',
  storage:    '#3ECF8E',
  monitoring: '#F87171',
  analytics:  '#F54E00',
  ai:         '#4FF8D2',
  hosting:    '#94a3b8',
};

const BG         = '#0b0e14';
const CARD_BG    = '#111520';
const HEADER_BG  = '#5B50F0';
const BORDER     = 'rgba(255,255,255,0.12)';
const WHITE      = '#f9fafb';
const PINK       = '#FF5FA3';
const MUTED      = '#6b7280';
const DIM        = '#374151';

async function loadFont(name: string, weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@${weight}&display=swap`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } },
  ).then(r => r.text());
  const match = css.match(/src: url\((.+?)\) format/);
  if (!match) throw new Error(`Font URL not found for ${name}:${weight}`);
  return fetch(match[1]).then(r => r.arrayBuffer());
}

export default async function handler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const code = searchParams.get('code');

  const [regular, bold] = await Promise.all([
    loadFont('Space Mono', 400),
    loadFont('Space Mono', 700),
  ]);

  const fonts = [
    { name: 'SpaceMono', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'SpaceMono', data: bold,    weight: 700 as const, style: 'normal' as const },
  ];

  /* ── home image ─────────────────────────────────────────────────── */
  if (type === 'home') {
    return new ImageResponse(
      (
        <div style={{
          width: 1200, height: 630, background: BG,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'SpaceMono',
        }}>
          {/* Stripe brand mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 22, height: 22, background: '#635BFF', borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 10, height: 10, background: 'rgba(255,255,255,0.9)', borderRadius: 2, display: 'flex' }} />
            </div>
            <span style={{ color: '#635BFF', fontSize: 13, letterSpacing: '0.18em' }}>STRIPE</span>
          </div>

          {/* Main title */}
          <div style={{ color: WHITE, fontSize: 84, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, display: 'flex' }}>
            projects
          </div>

          {/* Colored accent stripe */}
          <div style={{ display: 'flex', gap: 6, marginTop: 24, marginBottom: 30 }}>
            <div style={{ width: 52, height: 3, background: '#635BFF', borderRadius: 2, display: 'flex' }} />
            <div style={{ width: 52, height: 3, background: PINK,     borderRadius: 2, display: 'flex' }} />
            <div style={{ width: 52, height: 3, background: '#F5A623', borderRadius: 2, display: 'flex' }} />
            <div style={{ width: 52, height: 3, background: '#4FF8D2', borderRadius: 2, display: 'flex' }} />
          </div>

          {/* Tagline */}
          <div style={{
            color: MUTED, fontSize: 20, textAlign: 'center',
            maxWidth: 560, lineHeight: 1.7, display: 'flex',
            flexDirection: 'column', alignItems: 'center',
          }}>
            <span>From idea to production.</span>
            <span>One command, real infrastructure.</span>
          </div>

          {/* URL */}
          <div style={{ color: DIM, fontSize: 13, marginTop: 44, letterSpacing: '0.08em', display: 'flex' }}>
            projects.dev
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts },
    );
  }

  /* ── stack image ────────────────────────────────────────────────── */
  if (code?.startsWith('STACK-')) {
    const data = await kv.get<StackData>(code);

    if (!data) {
      return new ImageResponse(
        (
          <div style={{
            width: 1200, height: 630, background: BG,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'SpaceMono',
          }}>
            <div style={{ color: MUTED, fontSize: 18, display: 'flex' }}>stack expired or not found</div>
          </div>
        ),
        { width: 1200, height: 630, fonts },
      );
    }

    const { appName, services, createdAt } = data;
    const displayServices = services.slice(0, 5);
    const providerCount   = services.length;
    const date = new Date(createdAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
    const windowTitle = `${appName}.stack`.toUpperCase();

    return new ImageResponse(
      (
        <div style={{
          width: 1200, height: 630, background: BG,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'SpaceMono',
        }}>
          {/* Window card */}
          <div style={{
            width: 580,
            display: 'flex', flexDirection: 'column',
            border: `1px solid ${BORDER}`,
            borderRadius: 6,
          }}>

            {/* Purple header */}
            <div style={{
              background: HEADER_BG,
              padding: '11px 16px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '5px 5px 0 0',
            }}>
              {/* Traffic lights */}
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, background: '#FF5F57', borderRadius: 6, display: 'flex' }} />
                <div style={{ width: 12, height: 12, background: '#FEBC2E', borderRadius: 6, display: 'flex' }} />
                <div style={{ width: 12, height: 12, background: '#28C840', borderRadius: 6, display: 'flex' }} />
              </div>
              {/* Centered title */}
              <div style={{
                flex: 1, display: 'flex', justifyContent: 'center',
                color: 'rgba(255,255,255,0.9)', fontSize: 12,
                letterSpacing: '0.1em',
              }}>
                {windowTitle}
              </div>
              {/* Spacer to balance traffic lights */}
              <div style={{ width: 48, display: 'flex' }} />
            </div>

            {/* Body */}
            <div style={{
              background: CARD_BG,
              padding: '20px',
              display: 'flex', flexDirection: 'column',
              borderRadius: '0 0 5px 5px',
            }}>
              {/* App name */}
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: PINK, fontSize: 15 }}>→</span>
                  <span style={{ color: WHITE, fontWeight: 700, fontSize: 17 }}>{appName}</span>
                </div>
                <div style={{ color: '#4b5563', fontSize: 12, paddingLeft: 24, display: 'flex' }}>
                  {providerCount} provider{providerCount !== 1 ? 's' : ''} · generated {date}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: BORDER, marginBottom: 0, display: 'flex' }} />

              {/* Service rows */}
              {displayServices.map((svc, i) => {
                const info     = REGISTRY[svc.toLowerCase()];
                const catColor = info ? (CATEGORY_COLORS[info.category] ?? '#94a3b8') : '#94a3b8';
                const isLast   = i === displayServices.length - 1;
                return (
                  <div key={svc} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 0',
                    borderBottom: isLast ? 'none' : `1px solid ${BORDER}`,
                  }}>
                    <span style={{ color: WHITE, fontSize: 13, width: 88, flexShrink: 0, display: 'flex' }}>
                      {info?.name ?? svc}
                    </span>
                    <span style={{
                      fontSize: 10,
                      border: `1px solid ${catColor}`,
                      color: catColor,
                      padding: '2px 6px',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      flexShrink: 0,
                    }}>
                      {info?.category ?? ''}
                    </span>
                    <span style={{ color: MUTED, fontSize: 11, flex: 1, display: 'flex' }}>
                      {info?.description ?? ''}
                    </span>
                    <span style={{ color: DIM, fontSize: 11, display: 'flex' }}>↗</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts },
    );
  }

  return new Response('Not found', { status: 404 });
}
