declare const process: { env: Record<string, string | undefined> };

export const config = {
  matcher: ['/', '/s', '/s/:path*'],
};

const SITE_URL_FALLBACK = 'https://projects.dev';
const HOME_LINK_HEADER = '</.well-known/api-catalog>; rel="api-catalog", </docs/api/>; rel="service-doc", </index.html.md>; rel="alternate"; type="text/markdown"';

/*
 * These hosts serve the marketplace, not the main site. The redirects in
 * vercel.json cover them too, but a redirect puts /marketplace/bold/ in the
 * address bar; rewriting here keeps the bare domain. Exact hosts rather than a
 * suffix test, so a lookalike host can never match.
 */
const MARKETPLACE_HOSTS = new Set([
  'provisioning.dev',
  'www.provisioning.dev',
  'provisioning.stripe.dev',
]);
const MARKETPLACE_FRONT_DOOR = '/marketplace/bold/';

function getSiteUrl(req: Request): string {
  const url = new URL(req.url);
  return url.origin || SITE_URL_FALLBACK;
}

const PREVIEW_BOT_UA = /slack|twitterbot|facebookexternalhit|linkedinbot|whatsapp|discordbot|telegrambot|iMessage/i;

function isPreviewBot(req: Request): boolean {
  return PREVIEW_BOT_UA.test(req.headers.get('user-agent') ?? '');
}

function wantsMarkdown(req: Request): boolean {
  return (req.headers.get('accept') ?? '').toLowerCase().includes('text/markdown');
}

function withHomeDiscoveryHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Link', HOME_LINK_HEADER);
  headers.set('Vary', 'Accept, User-Agent');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function getCookie(req: Request, name: string): string | undefined {
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.split(';').map(c => c.trim()).find(c => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function passwordFormHtml(redirectTo: string, error = false): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>stripe projects</title>
  <link rel="icon" type="image/svg+xml" href="${SITE_URL_FALLBACK}/logo-24-stripe.svg" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      background: #fff;
      color: #0a0a0a;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100dvh;
    }
    .wrap {
      width: 100%;
      max-width: 320px;
      padding: 0 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 15px;
      color: #0a0a0a;
    }
    .logo svg { flex-shrink: 0; }
    form { display: flex; flex-direction: column; gap: 12px; }
    input[type="password"] {
      width: 100%;
      height: 40px;
      padding: 0 12px;
      border: 1px solid ${error ? '#e53e3e' : 'rgba(0,0,0,0.15)'};
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      background: #fff;
      color: #0a0a0a;
      transition: border-color 0.15s;
    }
    input[type="password"]:focus { border-color: #535BFF; }
    button {
      height: 40px;
      background: #0a0a0a;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    button:hover { opacity: 0.75; }
    .error { font-size: 13px; color: #e53e3e; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="16" height="16" rx="4" fill="#635BFF"/>
        <circle cx="5" cy="8" r="1.5" fill="white"/>
        <circle cx="8" cy="8" r="1.5" fill="white"/>
        <circle cx="11" cy="8" r="1.5" fill="white"/>
      </svg>
      stripe projects
    </div>
    <form method="POST" action="/auth">
      <input type="hidden" name="redirect" value="${escapeHtml(redirectTo)}" />
      <input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password" />
      ${error ? '<p class="error">Incorrect password — try again.</p>' : ''}
      <button type="submit">Continue</button>
    </form>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function ogHtml(tags: {
  title: string;
  description: string;
  imageUrl: string;
  pageUrl: string;
  siteName?: string;
  twitterImage?: string;
}): Response {
  const { title, description, imageUrl, pageUrl, siteName = 'Stripe Projects', twitterImage } = tags;
  const twImg = twitterImage || imageUrl;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="icon" type="image/svg+xml" href="${SITE_URL_FALLBACK}/assets/images/favicon/favicon.svg" />
  <meta property="og:site_name" content="${siteName}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:type" content="${imageUrl.includes('/api/og') ? 'image/png' : 'image/jpeg'}" />
  <meta property="og:image:width" content="${imageUrl.includes('/api/og') ? '1200' : '1024'}" />
  <meta property="og:image:height" content="${imageUrl.includes('/api/og') ? '630' : '535'}" />
  <meta property="og:image:alt" content="${title}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@stripe" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${twImg}" />
</head>
<body></body>
</html>`;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function safeOgHtml(tags: {
  title: string;
  description: string;
  imageUrl: string;
  pageUrl: string;
  siteName?: string;
  twitterImage?: string;
}): Response {
  return ogHtml({
    title: escapeHtml(tags.title),
    description: escapeHtml(tags.description),
    imageUrl: escapeHtml(tags.imageUrl),
    pageUrl: escapeHtml(tags.pageUrl),
    siteName: tags.siteName ? escapeHtml(tags.siteName) : undefined,
    twitterImage: tags.twitterImage ? escapeHtml(tags.twitterImage) : undefined,
  });
}

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
      // Share links may use display casing; normalize before allowlist lookup.
      provider = decodeURIComponent(part.slice(0, tildeIdx)).toLowerCase();
      service = decodeURIComponent(part.slice(tildeIdx + 1));
    } catch {
      continue;
    }
    // Only known providers are rendered into Stack Share metadata.
    if (!PROVIDER_NAMES[provider]) continue;
    services.push({ provider, service });
  }
  return services;
}

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

export default async function middleware(req: Request): Promise<Response | void> {
  const url = new URL(req.url);
  const path = url.pathname;
  const SITE_URL = getSiteUrl(req);

  /* ── Password gate — DISABLED for public access ─────────────── */

  /* ── Stack Share path-based URLs (/s/v1:...) ────────────────── */
  if (path.startsWith('/s/') && path.length > 3) {
    const encoded = path.slice(3);
    const services = decodeStackServices(encoded);
    const names = [...new Set(services.map(s => PROVIDER_NAMES[s.provider]))];
    const count = services.length;

    if (isPreviewBot(req)) {
      const title = count > 0
        ? names.join(', ')
        : 'Stack Share | Stripe Projects';
      const description = count > 0
        ? `Clone this ${count}-service stack with one command.`
        : 'View and clone a shared Stripe Projects stack.';
      const imageUrl = count > 0
        ? `${SITE_URL}/api/og?stack=${encodeURIComponent(encoded)}`
        : `${SITE_URL}/assets/images/og/og.jpg`;
      return safeOgHtml({
        title,
        description,
        imageUrl,
        pageUrl: `${SITE_URL}/s/${encoded}`,
      });
    }

    // Non-bot: redirect to hash-based URL
    const redirectUrl = new URL('/s', SITE_URL);
    redirectUrl.hash = encoded;
    return new Response(null, {
      status: 302,
      headers: { Location: redirectUrl.toString() },
    });
  }

  /* ── home page ────────────────────────────────────────────────── */
  if (path === '/') {
    /*
     * On provisioning.dev the root is the marketplace. This runs ahead of the
     * markdown and preview-bot branches below on purpose: those are about the
     * main site's home page, and a crawler here should see the Plaza's own
     * metadata rather than Stripe Projects'.
     */
    if (MARKETPLACE_HOSTS.has(url.hostname)) {
      // Carry the query through — the listing reads ?q= and ?stack=open.
      const target = new URL(MARKETPLACE_FRONT_DOOR + url.search, SITE_URL);
      const upstream = await fetch(target.toString());
      const headers = new Headers(upstream.headers);
      // fetch has already decoded the body, so these would now misdescribe it.
      headers.delete('content-encoding');
      headers.delete('content-length');
      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers,
      });
    }

    if (wantsMarkdown(req)) {
      const markdownUrl = new URL('/index.html.md', SITE_URL);
      const markdownResponse = await fetch(markdownUrl.toString());
      const headers = new Headers(markdownResponse.headers);
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
      return withHomeDiscoveryHeaders(new Response(markdownResponse.body, {
        status: markdownResponse.status,
        statusText: markdownResponse.statusText,
        headers,
      }));
    }

    if (isPreviewBot(req)) {
      return withHomeDiscoveryHeaders(safeOgHtml({
        title: 'Stripe Projects | Provision and Manage Services from the CLI',
        description: 'Enable you or your agents to provision hosting, databases, auth, AI, and more from the CLI. Generate credentials and manage usage and billing in one place.',
        imageUrl: `${SITE_URL}/assets/images/og/og.jpg`,
        pageUrl: SITE_URL,
        twitterImage: `${SITE_URL}/assets/images/og/twitter-large.jpg`,
      }));
    }
  }

  return;
}
