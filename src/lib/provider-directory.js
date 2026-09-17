/**
 * The provider directory behind stack share links, derived from
 * src/_data/providers.js.
 *
 * A share payload looks like `v1:neon~postgres,vercel~project`: the token left
 * of each `~` is the first segment of a provider's `slug`, which is what the CLI
 * emits and what /providers anchors on. Three separate consumers have to agree
 * on what that token may be:
 *
 *   - middleware.ts  — the unfurl metadata a preview bot gets for /s/<payload>
 *   - api/og.ts      — the rows drawn into the generated OG PNG
 *   - src/s.webc     — the Stack Share card itself
 *
 * Each of those used to carry its own hand-written copy of the map. All three
 * had stalled at the same 31 entries while the catalog grew to 65, so a link
 * containing any of the other 34 providers silently lost those rows — and a link
 * containing ONLY those providers rendered "No stack found in this URL". Sharing
 * one derivation is what stops that recurring: a provider added to providers.js
 * is shareable immediately, with no second list to remember.
 *
 * src/s.webc cannot import this module, because it runs in the browser. It is
 * handed the same data at build time instead, from the `providers` global that
 * Eleventy loads out of the very same file.
 */

import providers from "../_data/providers.js";

/**
 * The share-link token for a provider: the owner segment of its catalog slug.
 * Note that these are not all `[a-z]+` — `customer.io`, `wordpress.com`,
 * `laravel_cloud`, and `base44_projects` are all real keys, so never assume a
 * token can be derived from a display name.
 */
export function providerKey(provider) {
    return provider.slug.split("/")[0];
}

/** slug -> { name, description }, in catalog order. */
export const PROVIDER_DIRECTORY = Object.freeze(
    Object.fromEntries(
        providers.map(provider => [
            providerKey(provider),
            Object.freeze({ name: provider.name, description: provider.description }),
        ]),
    ),
);

/** slug -> display name. The name providers.js gives, so /s and /providers agree. */
export const PROVIDER_NAMES = Object.freeze(
    Object.fromEntries(Object.entries(PROVIDER_DIRECTORY).map(([slug, p]) => [slug, p.name])),
);

/**
 * Logos that only paint correctly inside a document.
 *
 * logo-herenow and logo-base44 set their wordmark as live <text>, and
 * logo-heygen references a PNG by path. Inlined into /s all three are fine: a
 * font is resolvable and the asset is same-origin. Rasterised standalone for the
 * OG image they are not — resvg has no font to shape the text with and no base
 * URL to resolve the image against, so the card would show a mark with its name
 * missing, or in HeyGen's case nothing at all. /api/og draws the provider name
 * for these instead.
 *
 * scripts/build-provider-logos.mjs re-derives this set from the components on
 * every run and fails if it disagrees with this list, so it cannot go stale.
 */
export const LOGO_NEEDS_DOM = Object.freeze(["base44_projects", "herenow", "heygen"]);

/**
 * Parses the encoded stack payload out of a share URL.
 *
 * Tolerant by design — a share link is something a person pastes, so a single
 * malformed pair drops that pair rather than failing the whole link. Unknown
 * providers are dropped too, which is the documented behaviour of /api/og's
 * `stack` parameter; that is a guard against a crafted payload injecting
 * arbitrary text into an unfurl, not a catalog gate, so it must stay keyed to
 * the full directory.
 *
 * @param {string} encoded  e.g. `v1:neon~postgres,vercel~project`
 * @returns {{provider: string, service: string}[]} in the order given
 */
export function decodeStackServices(encoded) {
    if (typeof encoded !== "string") return [];
    const colonIdx = encoded.indexOf(":");
    if (colonIdx <= 0) return [];
    if (encoded.slice(0, colonIdx) !== "v1") return [];
    const payload = encoded.slice(colonIdx + 1);
    if (!payload) return [];

    const services = [];
    for (const part of payload.split(",")) {
        const tildeIdx = part.indexOf("~");
        if (tildeIdx <= 0) continue;
        let provider;
        let service;
        try {
            // Share links may use display casing; normalize before the lookup.
            provider = decodeURIComponent(part.slice(0, tildeIdx)).toLowerCase();
            service = decodeURIComponent(part.slice(tildeIdx + 1));
        } catch {
            // A stray "%" is not a reason to lose the rest of the stack.
            continue;
        }
        if (!PROVIDER_DIRECTORY[provider]) continue;
        services.push({ provider, service });
    }
    return services;
}

/**
 * Collapses repeated providers into one row each, keeping first-seen order, so
 * `neon~postgres,neon~branch` renders as one Neon row with two service badges.
 */
export function groupServicesByProvider(services) {
    const grouped = [];
    for (const { provider, service } of services) {
        const existing = grouped.find(g => g.provider === provider);
        if (existing) existing.services.push(service);
        else grouped.push({ provider, services: [service] });
    }
    return grouped;
}
