declare const process: { env: Record<string, string | undefined> };

export const config = {
  matcher: ['/', '/:code*'],
};

const SITE_URL = 'https://projects.dev';

const BOT_UA = /slack|twitterbot|facebookexternalhit|linkedinbot|whatsapp|discordbot|telegrambot|iMessage|applebot|Googlebot|bingbot|yahoo/i;

function isBot(req: Request): boolean {
  return BOT_UA.test(req.headers.get('user-agent') ?? '');
}

function getCookie(req: Request, name: string): string | undefined {
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.split(';').map(c => c.trim()).find(c => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}

function passwordFormHtml(redirectTo: string, error = false): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>stripe projects</title>
  <link rel="icon" type="image/svg+xml" href="${SITE_URL}/logo-24-stripe.svg" />
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
      <input type="hidden" name="redirect" value="${redirectTo}" />
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
}): Response {
  const { title, description, imageUrl, pageUrl, siteName = 'projects' } = tags;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <link rel="icon" type="image/svg+xml" href="${SITE_URL}/logo-24-stripe.svg" />
  <meta property="og:site_name" content="${siteName}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${pageUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
</head>
<body></body>
</html>`;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export default async function middleware(req: Request): Promise<Response | void> {
  const url = new URL(req.url);
  const path = url.pathname;

  /* ── Password gate — DISABLED for public access ─────────────── */

  /* ── Bot / OG handling ────────────────────────────────────────── */
  if (!isBot(req)) return;

  /* ── home page ────────────────────────────────────────────────── */
  if (path === '/') {
    return ogHtml({
      title: 'Stripe Projects: Provision and manage services from the CLI',
      description: 'Set up hosting, databases, auth, AI, observability, analytics, and more from the CLI. Stripe Projects gives developers and coding agents a reliable way to provision real services, manage credentials, and keep track of usage across the stack.',
      imageUrl: `${SITE_URL}/assets/images/og/og.jpg`,
      pageUrl: SITE_URL,
      siteName: 'Stripe Projects',
    });
  }

  /* ── stack pages ──────────────────────────────────────────────── */
  const code = path.slice(1);
  if (code.startsWith('STACK-')) {
    let title = 'projects';
    let description = 'Stack generated with Stripe projects.';

    try {
      const apiRes = await fetch(`${SITE_URL}/api/stacks/${code}`);
      if (apiRes.ok) {
        const data = await apiRes.json() as { appName: string; services: string[]; createdAt: string };
        const providerCount = data.services.length;
        const date = new Date(data.createdAt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        });
        title = `${data.appName} · stripe projects`;
        description = `${providerCount} provider${providerCount !== 1 ? 's' : ''} · generated ${date}`;
      }
    } catch {
      // fall through to defaults
    }

    return ogHtml({
      title,
      description,
      imageUrl: `${SITE_URL}/assets/images/og/og.jpg`,
      pageUrl: `${SITE_URL}/${code}`,
    });
  }

  return;
}
