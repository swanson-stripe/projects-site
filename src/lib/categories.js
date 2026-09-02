/**
 * The provider category taxonomy, shared by /providers, /marketplace, and the
 * llms.txt / index.html.md sync.
 *
 * Category ids are the raw ids the CLI reports in `service.categories[]` from
 * `stripe projects catalog --json`. Keeping the ids verbatim means a filter pill
 * on /providers round-trips to the CLI: clicking "Database" selects the same set
 * as `stripe projects catalog database`. Labels are display-only.
 *
 * Providers are multi-category — a third of the catalog sits in two or more —
 * so treat `categories` as the truth and a single `category` only as the
 * editorial lead. See providerRows.js for how the two are joined.
 */

const CATEGORY_LABELS = {
    ai: "AI",
    analytics: "Analytics",
    auth: "Auth",
    browser: "Browser",
    cache: "Cache",
    cdn: "CDN",
    ci: "CI",
    communications: "Communications",
    /*
     * The catalog calls this "compute"; the site and docs.stripe.com/projects
     * both present it as "Hosting". The id stays "compute" so the pill still
     * matches `stripe projects catalog compute`.
     */
    compute: "Hosting",
    database: "Database",
    domains: "Domains",
    ecommerce: "Ecommerce",
    email: "Email",
    feature_flags: "Feature flags",
    messaging: "Messaging",
    notification: "Notifications",
    observability: "Observability",
    payments: "Payments",
    queue: "Queue",
    sandbox: "Sandbox",
    search: "Search",
    storage: "Storage",
};

/**
 * Ids that have an explicit label above. A test asserts the live catalog never
 * introduces an id missing from this set, so a new category fails CI rather
 * than silently rendering a bare slug.
 */
export const KNOWN_CATEGORIES = new Set(Object.keys(CATEGORY_LABELS));

/**
 * Falls back to sentence-casing the id rather than throwing: a catalog refresh
 * that adds a category should still render a usable page, and the test above is
 * what flags the missing label.
 */
export function categoryLabel(category) {
    return CATEGORY_LABELS[category] ?? category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Providers whose lead category is deliberately not one the catalog reports.
 *
 * The catalog describes the services on offer today, which for these three
 * reads wrong as a headline: it lists only `email` for a communications
 * platform, and calls a sandbox product and a web host `compute` and `cdn`.
 * The site leads with the reviewed category instead and keeps the catalog's own
 * categories as the remaining chips — so the lead reads correctly while
 * filtering still reaches everything the catalog actually reports.
 *
 * A test asserts every OTHER provider leads with a category the catalog agrees
 * with, so accidental drift still fails while these stay declared.
 */
export const INTENTIONAL_LEAD_OVERRIDES = new Map([
    ["twilio/email", "catalog lists only email services for a communications platform"],
    ["createos/project", "catalog says compute; the product is sandboxed AI compute"],
    ["herenow/hosting", "catalog says cdn + storage; the product is web hosting"],
]);

/**
 * Provider slugs differ between the two data sources: providers.js addresses a
 * service ("wordpress.com/site") while the generated catalog keys on a
 * normalised provider slug ("wordpress"). Strip the service, then the
 * punctuation, then fix up the two that still disagree.
 */
const SLUG_ALIASES = {
    base44projects: "base44",
    wordpresscom: "wordpress",
};

export function catalogSlug(serviceSlug) {
    const provider = String(serviceSlug).split("/")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    return SLUG_ALIASES[provider] ?? provider;
}

/**
 * The anchor /#<name> deep links from the home page target, and the value the
 * search box matches. Only "Auth0/Okta" contains a slash, and it anchors to
 * "auth0", so cutting at the slash reproduces every existing anchor.
 */
export function providerAnchor(name) {
    return String(name).toLowerCase().split("/")[0].trim();
}
