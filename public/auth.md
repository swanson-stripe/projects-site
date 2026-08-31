# Authentication

**This site requires no authentication. It publishes no OAuth or OpenID Connect
endpoints, and it has no protected resources.**

If you are an agent looking for credentials to call an API here: there is nothing to
authenticate against. Everything `projects.dev` serves is public and readable with an
unauthenticated `GET`.

## Status

| Property | Value |
|---|---|
| Authentication required | No |
| Authorization required | No |
| Agent registration required | No |
| API keys issued by this site | None |
| OAuth 2.0 authorization server | None |
| OpenID Connect provider | None |
| Declared OAuth scopes | None — there are no protected resources to scope |
| Rate limiting | None documented |

## Endpoints that intentionally do not exist

These paths return `404` by design. Their absence is the correct answer, not a
misconfiguration, and it should not be retried:

- `/.well-known/oauth-authorization-server` (RFC 8414)
- `/.well-known/oauth-protected-resource` (RFC 9728)
- `/.well-known/openid-configuration`
- `/oauth/authorize`, `/oauth/token`, `/token`

The OpenAPI document at `/api/openapi.json` states the same thing in machine-readable
form: its root-level `security` array is empty (`"security": []`), which per the
OpenAPI specification means no security scheme applies to any operation. It declares no
`securitySchemes` because there are none.

## Public resources

All readable without credentials:

- `/` and every page listed in `/sitemap.xml`
- `/developers/` — developer resources index
- `/docs/api/` — API discovery documentation
- `/api/openapi.json` — OpenAPI 3.1 description
- `/api/health` — JSON health check
- `/.well-known/api-catalog` — RFC 9727 linkset
- `/.well-known/agent-skills/index.json` — agent skill discovery
- `/llms.txt`, `/skill.md`, `/index.html.md`, `/404.md` — markdown resources
- `/robots.txt`, `/sitemap.xml`

## Where authentication actually happens

`projects.dev` is a marketing and discovery site. The Stripe Projects product is a
Stripe CLI plugin, and all authenticated work happens through the CLI against Stripe's
own API — not through this domain.

- Install the CLI: https://docs.stripe.com/stripe-cli/install
- Authenticate the CLI (`stripe login`): https://docs.stripe.com/stripe-cli/login
- Stripe API keys and authentication: https://docs.stripe.com/keys
- Stripe API authentication reference: https://docs.stripe.com/api/authentication
- Stripe Connect OAuth, for platforms acting on behalf of other accounts:
  https://docs.stripe.com/connect/oauth-reference

Credentials for third-party providers that Stripe Projects provisions on your behalf
are returned to you by the CLI and written to your configured secret store. They are
never exposed through this website.
