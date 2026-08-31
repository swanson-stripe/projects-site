import type { IncomingMessage, ServerResponse } from "http";

interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
}

/*
 * `end` is inherited from ServerResponse rather than redeclared — narrowing it to
 * `(body?: string)` conflicts with the base signature and is a type error.
 */
interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  setHeader(name: string, value: string): this;
}

const DOCS = "https://projects.dev/docs/api/";

/*
 * Terminal 404 handler, reached only via the catch-all rewrites in vercel.json —
 * Vercel resolves static files and named functions first, so this never shadows a
 * real route. Two modes:
 *
 *   /api/<unknown>                        -> RFC 9457 problem+json
 *   any path, Accept: text/markdown       -> markdown recovery body (format=md)
 *
 * Both answer 404. Everything else keeps falling through to the static 404.html,
 * so ordinary browser traffic costs no function invocation.
 */

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/* The rewrite passes the original path through, since req.url is the destination. */
function requestedPath(req: VercelRequest): string {
  const raw = first(req.query.path) ?? "";
  if (!raw) return "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

const MARKDOWN_BODY = `# Not found (HTTP 404)

There is no resource at this address on \`projects.dev\`. This is a real 404 — the
site never answers an unknown path with 200, so a path that 404s here does not exist.

## Where to look next

- \`/\` — Home
- \`/developers/\` — Developer resources: CLI, agent skill, site API, versioning policy
- \`/providers/\` — Every supported provider and service slug
- \`/docs/api/\` — Site API documentation and error reference

## Machine-readable

- \`/llms.txt\` — Curated overview of this site
- \`/sitemap.xml\` — Every canonical URL
- \`/skill.md\` — Agent skill for end-to-end provisioning
- \`/404.md\` — Fuller version of this page
- \`/.well-known/api-catalog\` — RFC 9727 API discovery linkset
- \`/api/openapi.json\` — OpenAPI 3.1 description

Product documentation lives at https://docs.stripe.com/projects
`;

export default function handler(req: VercelRequest, res: VercelResponse) {
  const instance = requestedPath(req);
  const wantsMarkdown = first(req.query.format) === "md";

  res.setHeader("Cache-Control", "no-store");
  /* The body varies by Accept, so shared caches must not reuse one for the other. */
  res.setHeader("Vary", "Accept");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Link",
    '</404.md>; rel="alternate"; type="text/markdown", </sitemap.xml>; rel="sitemap", </llms.txt>; rel="alternate"; type="text/plain"',
  );

  if (wantsMarkdown) {
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.status(404).end(MARKDOWN_BODY);
    return;
  }

  res.setHeader("Content-Type", "application/problem+json; charset=utf-8");
  res.status(404).end(
    JSON.stringify({
      type: `${DOCS}#not-found`,
      title: "Not Found",
      status: 404,
      code: "not_found",
      detail:
        "No such endpoint. This site exposes only GET /api/health and GET /api/og; see /api/openapi.json for the full description.",
      instance,
      documentation: DOCS,
      openapi: "https://projects.dev/api/openapi.json",
    }),
  );
}
