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
    const gridRows = [0, 1, 2, 3, 4, 5];
    const gridCols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    return new ImageResponse(
      (
        <div style={{
          width: 1200, height: 630, background: BG,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'SpaceMono',
          position: 'relative',
        }}>
          {/* Grid background */}
          <div style={{
            position: 'absolute', top: 48, left: 48,
            display: 'flex', flexDirection: 'column',
          }}>
            {gridRows.map(r => (
              <div key={r} style={{ display: 'flex', height: 104 }}>
                {gridCols.map(c => (
                  <div key={c} style={{
                    width: 104, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.13)', fontSize: 9 }}>+</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Main title */}
          <div style={{
            display: 'flex',
            color: WHITE, fontSize: 84, fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1,
          }}>
            stripe projects
          </div>

          {/* Tagline */}
          <div style={{
            color: MUTED, fontSize: 40, textAlign: 'center',
            maxWidth: 900, lineHeight: 1.5, display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            marginTop: 32,
          }}>
            <span>From idea to production.</span>
            <span>One command, real infrastructure.</span>
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
          {/* Window card — 90% of width */}
          <div style={{
            width: 1080,
            display: 'flex', flexDirection: 'column',
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
          }}>

            {/* Purple header */}
            <div style={{
              background: HEADER_BG,
              padding: '18px 28px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '9px 9px 0 0',
            }}>
              {/* Traffic lights */}
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 20, height: 20, background: '#FF5F57', borderRadius: 10, display: 'flex' }} />
                <div style={{ width: 20, height: 20, background: '#FEBC2E', borderRadius: 10, display: 'flex' }} />
                <div style={{ width: 20, height: 20, background: '#28C840', borderRadius: 10, display: 'flex' }} />
              </div>
              {/* Centered title */}
              <div style={{
                flex: 1, display: 'flex', justifyContent: 'center',
                color: 'rgba(255,255,255,0.9)', fontSize: 20,
                letterSpacing: '0.1em',
              }}>
                {windowTitle}
              </div>
              {/* Spacer to balance traffic lights */}
              <div style={{ width: 80, display: 'flex' }} />
            </div>

            {/* Body */}
            <div style={{
              background: CARD_BG,
              padding: '32px 36px',
              display: 'flex', flexDirection: 'column',
              borderRadius: '0 0 9px 9px',
            }}>
              {/* App name */}
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                  <span style={{ color: PINK, fontSize: 26 }}>→</span>
                  <span style={{ color: WHITE, fontWeight: 700, fontSize: 30 }}>{appName}</span>
                </div>
                <div style={{ color: '#4b5563', fontSize: 20, paddingLeft: 40, display: 'flex' }}>
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
                    display: 'flex', alignItems: 'center', gap: 18,
                    padding: '16px 0',
                    borderBottom: isLast ? 'none' : `1px solid ${BORDER}`,
                  }}>
                    <span style={{ color: WHITE, fontSize: 22, width: 160, flexShrink: 0, display: 'flex' }}>
                      {svc}
                    </span>
                    <span style={{
                      fontSize: 16,
                      border: `1px solid ${catColor}`,
                      color: catColor,
                      padding: '3px 10px',
                      letterSpacing: '0.04em',
                      display: 'flex',
                      flexShrink: 0,
                    }}>
                      {info?.category ?? ''}
                    </span>
                    <span style={{ color: MUTED, fontSize: 19, flex: 1, display: 'flex' }}>
                      {info?.description ?? ''}
                    </span>
                    <span style={{ color: DIM, fontSize: 19, display: 'flex' }}>↗</span>
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
