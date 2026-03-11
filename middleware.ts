import { next } from '@vercel/edge';

export const config = {
  matcher: ['/', '/:code*'],
};

const SITE_URL = 'https://projects.dev';

const BOT_UA = /slack|twitterbot|facebookexternalhit|linkedinbot|whatsapp|discordbot|telegrambot|iMessage|applebot|Googlebot|bingbot|yahoo/i;

function isBot(req: Request): boolean {
  return BOT_UA.test(req.headers.get('user-agent') ?? '');
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

export default async function middleware(req: Request): Promise<Response> {
  if (!isBot(req)) return next();

  const url = new URL(req.url);
  const path = url.pathname;

  /* ── home page ────────────────────────────────────────────────── */
  if (path === '/') {
    return ogHtml({
      title: 'stripe projects',
      description: 'From idea to production. One command, real infrastructure.',
      imageUrl: `${SITE_URL}/api/og?type=home`,
      pageUrl: SITE_URL,
    });
  }

  /* ── stack pages ──────────────────────────────────────────────── */
  const code = path.slice(1); // strip leading /
  if (code.startsWith('STACK-')) {
    // Fetch stack data so we can write specific title/description
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
      imageUrl: `${SITE_URL}/api/og?code=${code}`,
      pageUrl: `${SITE_URL}/${code}`,
    });
  }

  return next();
}
