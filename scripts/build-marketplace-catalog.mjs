/**
 * Builds src/_data/catalog.js — the data behind /marketplace/.
 *
 * Input is a snapshot of the real Projects catalog:
 *
 *     stripe projects catalog --json > catalog.json
 *     node scripts/build-marketplace-catalog.mjs catalog.json
 *
 * The snapshot is reshaped into a marketplace-friendly form: services are split
 * into plans (entitlements) and deployables (resources), and each deployable
 * records how it gets priced —
 *
 *   component : needs a companion plan first, chosen from parent_services
 *   tiered    : priced inline, pick one of the paid_pricing configurations
 *   free      : no selection needed
 *
 * Provider websites, icons, and ToS links are merged in from the site's own
 * provider table since the catalog API does not carry them.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const inputPath = process.argv[2];
if (!inputPath) {
    console.error("usage: node scripts/build-marketplace-catalog.mjs <catalog.json>");
    process.exit(1);
}

// The CLI may prefix its JSON with a plugin hint line — start at the first brace.
const rawInput = fs.readFileSync(inputPath, "utf-8");
const snapshot = JSON.parse(rawInput.slice(rawInput.indexOf("{")));
const services = snapshot?.data?.services ?? [];
if (!services.length) {
    console.error("no services found in snapshot");
    process.exit(1);
}

/* -------------------------------------------------------------------------- */
/* Provider identity                                                          */
/* -------------------------------------------------------------------------- */

// Catalog provider_name → url-and-asset slug, where the derived slug is wrong.
const SLUG_OVERRIDES = {
    Base44_Projects: "base44",
    Laravel_Cloud: "laravelcloud",
    "WordPress.com": "wordpress",
};

// Catalog provider_name → display name, where the raw value reads badly.
const NAME_OVERRIDES = {
    AgentMail: "AgentMail",
    Base44_Projects: "Base 44",
    createos: "CreateOS",
    customerio: "Customer.io",
    Flyio: "Fly.io",
    HuggingFace: "Hugging Face",
    KERNEL: "KERNEL",
    Laravel_Cloud: "Laravel Cloud",
    PostalForm: "PostalForm",
    "WordPress.com": "WordPress.com",
};

function toSlug(providerName) {
    if (SLUG_OVERRIDES[providerName]) return SLUG_OVERRIDES[providerName];
    return providerName
        .toLowerCase()
        .replace(/_projects$/, "")
        .replace(/[^a-z0-9]/g, "");
}

function toDisplayName(providerName) {
    if (NAME_OVERRIDES[providerName]) return NAME_OVERRIDES[providerName];
    return providerName.replace(/_/g, " ");
}

function toInitials(name) {
    const parts = String(name).split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

const ICON_SOURCES = [
    { dir: "src/assets/images/provider-favicons", url: "/assets/images/provider-favicons" },
    { dir: "src/assets/images/svg/provider-icons", url: "/assets/images/svg/provider-icons" },
];

function findIconPath(slug) {
    for (const source of ICON_SOURCES) {
        const filePath = path.join(ROOT, source.dir, `${slug}.svg`);
        if (fs.existsSync(filePath)) return { filePath, url: `${source.url}/${slug}.svg` };
    }
    return null;
}

/* -------------------------------------------------------------------------- */
/* Brand colour                                                               */
/* -------------------------------------------------------------------------- */

// Monochrome marks (Vercel, Railway, …) get the site's headline navy so the
// accent reads as "no brand colour" rather than an off-palette guess.
const NEUTRAL_BRAND = "#061b31";

function expandHex(hex) {
    const value = hex.replace("#", "");
    if (value.length === 3) {
        return `#${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`.toLowerCase();
    }
    return `#${value.toLowerCase()}`;
}

/* WCAG relative luminance, used to pick legible ink on a flooded brand tile. */
function relativeLuminance(hex) {
    const channels = [1, 3, 5].map((offset) => {
        const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a, b) {
    const [lighter, darker] = a > b ? [a, b] : [b, a];
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Whether a tile flooded with this colour needs light or dark ink. Picks
 * whichever gives the higher contrast ratio rather than a fixed threshold, so
 * mid-tone brands land on the better of the two.
 */
function inkFor(hex) {
    const brand = relativeLuminance(hex);
    const onWhite = contrastRatio(brand, relativeLuminance("#ffffff"));
    const onInk = contrastRatio(brand, relativeLuminance(NEUTRAL_BRAND));
    return onWhite >= onInk ? "light" : "dark";
}

function toHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lightness = (max + min) / 2;
    const delta = max - min;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    return { saturation, lightness };
}

// Where the logo component's filename differs from the provider slug.
const LOGO_COMPONENT_ALIASES = { steel: "steelbrowser" };

function brandColorSources(slug) {
    return [
        findIconPath(slug)?.filePath,
        path.join(ROOT, "src/assets/images/svg/provider-logos", `${slug}.svg`),
        path.join(ROOT, "src/_components/svg/logos", `logo-${LOGO_COMPONENT_ALIASES[slug] ?? slug}.webc`),
    ].filter((filePath) => filePath && fs.existsSync(filePath));
}

/**
 * Picks a provider's accent from its own mark.
 *
 * A saturated colour wins outright. Failing that we take the darkest ink in the
 * mark, because many of these brands really are monochrome (Vercel, Auth0,
 * Prisma) — an invented hue would misrepresent them, and near-black still
 * carries a usable hairline and tint.
 */
function extractBrandColor(slug) {
    let darkest = null;

    for (const filePath of brandColorSources(slug)) {
        const svg = fs.readFileSync(filePath, "utf-8");
        const counts = new Map();
        for (const [, hex] of svg.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
            const value = expandHex(hex);
            counts.set(value, (counts.get(value) ?? 0) + 1);
        }
        // `fill="black"` is as much a brand choice as a hex value.
        if (/fill="black"|fill:\s*black|fill="#000"/.test(svg)) {
            counts.set("#000000", (counts.get("#000000") ?? 0) + 1);
        }

        const entries = [...counts.entries()].map(([hex, count]) => ({ hex, count, ...toHsl(hex) }));

        const saturated = entries
            .filter((entry) => entry.saturation > 0.18 && entry.lightness > 0.14 && entry.lightness < 0.88)
            .sort((a, b) => b.count - a.count || b.saturation - a.saturation);
        if (saturated.length) return saturated[0].hex;

        const inks = entries.filter((entry) => entry.lightness < 0.6).sort((a, b) => a.lightness - b.lightness);
        if (inks.length && !darkest) darkest = inks[0].hex;
    }

    return darkest ?? NEUTRAL_BRAND;
}

/* -------------------------------------------------------------------------- */
/* Site provider table — websites and marketing copy                          */
/* -------------------------------------------------------------------------- */

// Scraped from the rows of src/providers.webc so the marketplace listing reuses
// the copy already reviewed for /providers/ rather than a second set of strings.
function readSiteProviders() {
    const source = fs.readFileSync(path.join(ROOT, "src/providers.webc"), "utf-8");
    const rows = source.matchAll(
        /<tr data-provider-row data-url="([^"]+)" data-name="([^"]+)"[\s\S]*?<\/tr>/g,
    );
    const bySlug = new Map();
    for (const [row, url, name] of rows) {
        // Third cell of each row is the long description.
        const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(([, cell]) =>
            cell.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
        );
        bySlug.set(name.replace(/[^a-z0-9]/g, ""), {
            url,
            description: cells[2] ?? "",
        });
    }
    return bySlug;
}

const siteProviders = readSiteProviders();

function findSiteProvider(slug, displayName) {
    return (
        siteProviders.get(slug) ??
        siteProviders.get(displayName.toLowerCase().replace(/[^a-z0-9]/g, "")) ??
        null
    );
}

/* -------------------------------------------------------------------------- */
/* Legal links                                                                */
/* -------------------------------------------------------------------------- */

// Mock data: the catalog API returns tos_url / privacy_policy_url per provider,
// but `stripe projects catalog` does not expose them. The demo needs a link to
// show in the acceptance modal, so fall back to the conventional paths.
const LEGAL_OVERRIDES = {
    cloudflare: {
        tosUrl: "https://www.cloudflare.com/website-terms/",
        privacyUrl: "https://www.cloudflare.com/privacypolicy/",
    },
    vercel: {
        tosUrl: "https://vercel.com/legal/terms",
        privacyUrl: "https://vercel.com/legal/privacy-policy",
    },
    supabase: {
        tosUrl: "https://supabase.com/terms",
        privacyUrl: "https://supabase.com/privacy",
    },
    twilio: {
        tosUrl: "https://www.twilio.com/en-us/legal/tos",
        privacyUrl: "https://www.twilio.com/en-us/legal/privacy",
    },
    shopify: {
        tosUrl: "https://www.shopify.com/legal/terms",
        privacyUrl: "https://www.shopify.com/legal/privacy",
    },
    sentry: {
        tosUrl: "https://sentry.io/terms/",
        privacyUrl: "https://sentry.io/privacy/",
    },
};

function legalLinks(slug, url) {
    if (LEGAL_OVERRIDES[slug]) return LEGAL_OVERRIDES[slug];
    const origin = url ? url.replace(/\/+$/, "") : `https://${slug}.com`;
    return { tosUrl: `${origin}/terms`, privacyUrl: `${origin}/privacy` };
}

/* -------------------------------------------------------------------------- */
/* Pricing                                                                    */
/* -------------------------------------------------------------------------- */

const TOS_CONFIG_KEY = "tos_url";

// Mirrors the CLI's pricing resolution: a freeform string wins, then a
// description, then the entry falls back to "Free".
function pricingLabel(entry) {
    if (!entry) return "Free";
    const freeform = entry.freeform?.trim();
    if (freeform) return freeform;
    const description = entry.description?.trim();
    if (description) return description;
    return entry.type === "free" ? "Free" : "Usage-based";
}

function pricingStatus(entry) {
    if (!entry || entry.type === "free") return "free";
    return "paid";
}

function tierEntries(service) {
    const entries = service.pricing?.paid_pricing ?? [];
    return entries.map((entry, index) => ({
        id: `tier-${index}`,
        // The configuration that selects this tier, minus the ToS marker.
        configuration: Object.fromEntries(
            Object.entries(entry.configuration ?? {}).filter(([key]) => key !== TOS_CONFIG_KEY),
        ),
        label: tierLabel(entry, index),
        price: pricingLabel(entry),
        status: pricingStatus(entry),
        description: entry.description?.trim() ?? "",
        isDefault: entry.is_default === true,
        // Present when accepting this specific tier needs extra terms.
        tosUrl: entry.configuration?.[TOS_CONFIG_KEY] ?? null,
    }));
}

function tierLabel(entry, index) {
    const values = Object.entries(entry.configuration ?? {})
        .filter(([key]) => key !== TOS_CONFIG_KEY)
        .map(([, value]) => String(value));
    if (values.length) return values.join(" · ");
    return entry.type === "free" ? "Free" : `Option ${index + 1}`;
}

/* -------------------------------------------------------------------------- */
/* Credentials                                                                */
/* -------------------------------------------------------------------------- */

// Mock data: env var suffixes to mint per resource, keyed by service category.
// The real credential set comes from the provider on provisioning.
const CREDENTIAL_TEMPLATES = {
    database: ["DATABASE_URL", "DATABASE_HOST", "DATABASE_USER", "DATABASE_PASSWORD"],
    cache: ["URL", "TOKEN"],
    auth: ["PUBLISHABLE_KEY", "SECRET_KEY", "ISSUER_URL"],
    hosting: ["PROJECT_ID", "TOKEN", "DEPLOY_URL"],
    sandbox: ["API_KEY", "SANDBOX_ID"],
    browser: ["API_KEY", "PROJECT_ID"],
    ai: ["API_KEY"],
    search: ["API_KEY", "APP_ID"],
    analytics: ["API_KEY", "PROJECT_ID", "HOST"],
    observability: ["API_KEY", "DSN"],
    communications: ["API_KEY", "SENDER_ID"],
    ecommerce: ["STORE_DOMAIN", "ADMIN_TOKEN", "STOREFRONT_TOKEN"],
    domains: ["API_KEY", "DOMAIN"],
    payments: ["API_KEY", "WEBHOOK_SECRET"],
    feature_flags: ["API_KEY", "ENVIRONMENT_ID"],
    ci: ["API_TOKEN", "PROJECT_ID"],
    "ci-cd": ["API_TOKEN", "PROJECT_ID"],
    compute: ["API_KEY", "REGION"],
    storage: ["ACCESS_KEY_ID", "SECRET_ACCESS_KEY", "BUCKET"],
    queues: ["URL", "TOKEN"],
};

function credentialKeys(categories) {
    for (const category of categories) {
        if (CREDENTIAL_TEMPLATES[category]) return CREDENTIAL_TEMPLATES[category];
    }
    return ["API_KEY"];
}

/* -------------------------------------------------------------------------- */
/* Service shaping                                                            */
/* -------------------------------------------------------------------------- */

function envToken(value) {
    return String(value).toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function shapePlan(service) {
    const tiers = tierEntries(service);
    return {
        serviceId: service.service_id,
        ref: `${toSlug(service.provider_name)}/${service.service_id}`,
        description: service.description || "",
        categories: service.categories ?? [],
        scope: service.scope,
        status: pricingStatus(service.pricing?.paid),
        price: service.pricing?.type === "free" ? "Free" : pricingLabel(service.pricing?.paid),
        tiers,
        // Plans this plan can be switched to (drives upgrade/downgrade).
        updateableTo: service.updateable_to ?? [],
    };
}

function shapeDeployable(service) {
    const slug = toSlug(service.provider_name);
    const tiers = tierEntries(service);
    const componentOptions = service.pricing?.component?.options ?? [];

    // A deployable is priced one of three ways. `component` means a companion
    // plan carries the price and must exist first; `tiered` means the price is
    // picked inline from paid_pricing; otherwise it is free.
    let selectionMode = "free";
    if (service.pricing?.type === "component" && componentOptions.length) {
        selectionMode = "component";
    } else if (tiers.length > 1) {
        selectionMode = "tiered";
    }

    const planOptions = componentOptions.flatMap((option) =>
        (option.parent_services ?? []).map((planServiceId) => ({
            planServiceId,
            status: option.type === "free" ? "free" : "paid",
            price: option.type === "free" ? "Free" : pricingLabel(option.paid),
            isDefault: option.is_default === true,
        })),
    );

    return {
        serviceId: service.service_id,
        ref: `${slug}/${service.service_id}`,
        description: service.description || "",
        categories: service.categories ?? [],
        scope: service.scope,
        selectionMode,
        planOptions,
        tiers: selectionMode === "tiered" ? tiers : [],
        status: selectionMode === "free" ? "free" : "paid",
        price:
            selectionMode === "free"
                ? "Free"
                : selectionMode === "tiered"
                  ? pricingLabel(tiers.find((tier) => tier.isDefault) ?? tiers[0])
                  : "Depends on plan",
        // Default local resource name, matching the CLI's `--name` default.
        defaultResourceName: service.service_id.replace(/[^a-zA-Z0-9]+/g, "-"),
        envPrefix: `${envToken(slug)}_${envToken(service.service_id)}`,
        credentialKeys: credentialKeys(service.categories ?? []),
        updateableTo: service.updateable_to ?? [],
    };
}

/* -------------------------------------------------------------------------- */
/* Assemble                                                                   */
/* -------------------------------------------------------------------------- */

const byProvider = new Map();
for (const service of services) {
    if (service.availability !== "available" || service.development) continue;
    const list = byProvider.get(service.provider_name) ?? [];
    list.push(service);
    byProvider.set(service.provider_name, list);
}

const providers = [...byProvider.entries()]
    .map(([providerName, providerServices]) => {
        const slug = toSlug(providerName);
        const name = toDisplayName(providerName);
        const site = findSiteProvider(slug, name);
        const url = site?.url ?? "";
        const deployables = providerServices
            .filter((service) => service.kind === "deployable")
            .map(shapeDeployable)
            .sort((a, b) => a.serviceId.localeCompare(b.serviceId));
        const plans = providerServices
            .filter((service) => service.kind === "plan")
            .map(shapePlan)
            .sort((a, b) => Number(b.status === "free") - Number(a.status === "free"));

        // A few deployables name parent_services that are not listed plans
        // (e.g. twilio/email). Drop them so the plan step only ever offers a
        // plan that can actually be provisioned.
        const planIds = new Set(plans.map((plan) => plan.serviceId));
        for (const deployable of deployables) {
            const resolvable = deployable.planOptions.filter((option) => planIds.has(option.planServiceId));
            if (resolvable.length !== deployable.planOptions.length) {
                const dropped = deployable.planOptions
                    .filter((option) => !planIds.has(option.planServiceId))
                    .map((option) => option.planServiceId);
                console.log(`  ${deployable.ref}: dropped unlisted plan(s) ${dropped.join(", ")}`);
            }
            deployable.planOptions = resolvable;
            if (deployable.selectionMode !== "component" || resolvable.length) continue;

            // Component pricing with no usable parent_services (e.g.
            // openrouter/api leaves the list empty). The service is still plan
            // priced, so offer every plan the provider publishes.
            if (plans.length) {
                deployable.planOptions = plans.map((plan) => ({
                    planServiceId: plan.serviceId,
                    status: plan.status,
                    price: plan.price,
                    isDefault: false,
                }));
                console.log(`  ${deployable.ref}: no parent_services, offering all ${plans.length} provider plan(s)`);
                continue;
            }

            // No plans at all — nothing to select, so price it inline.
            deployable.selectionMode = deployable.tiers.length > 1 ? "tiered" : "free";
            deployable.status = deployable.selectionMode === "free" ? "free" : "paid";
        }

        // Categories come from the services, ordered by how often they appear.
        const counts = new Map();
        for (const service of providerServices) {
            for (const category of service.categories ?? []) {
                counts.set(category, (counts.get(category) ?? 0) + 1);
            }
        }
        const categories = [...counts.entries()]
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .map(([category]) => category);

        // Cheapest way in, shown on the listing tile.
        const entryPoints = [
            ...plans.map((plan) => ({ status: plan.status, price: plan.price })),
            ...deployables.map((service) => ({ status: service.status, price: service.price })),
            ...deployables.flatMap((service) => service.tiers.map((tier) => ({ status: tier.status, price: tier.price }))),
            ...deployables.flatMap((service) => service.planOptions.map((option) => ({ status: option.status, price: option.price }))),
        ];
        const brandColor = extractBrandColor(slug);
        const freeEntry = entryPoints.find((entry) => entry.status === "free");
        const cheapest = freeEntry ?? entryPoints.find((entry) => entry.price && entry.price !== "Depends on plan") ?? entryPoints[0];

        return {
            slug,
            name,
            url,
            ...legalLinks(slug, url),
            iconUrl: findIconPath(slug)?.url ?? null,
            brandColor,
            // Monochrome accents need a weaker hover wash — mixing near-black
            // into transparent reads as a dirty smudge at colour strength.
            brandIsMono: toHsl(brandColor).saturation <= 0.18,
            // "light" = white ink on the brand, "dark" = near-black ink.
            brandInk: inkFor(brandColor),
            // Very pale brands need a visible edge against a white page.
            brandIsPale: relativeLuminance(brandColor) > 0.62,
            fallbackInitials: toInitials(name),
            entry: {
                status: cheapest?.status ?? "free",
                label: freeEntry ? "Free tier" : (cheapest?.price ?? "Usage-based"),
            },
            description: site?.description || deployables[0]?.description || "",
            categories,
            pageUrl: `/marketplace/${slug}/`,
            // Keyword blob the listing filters against.
            searchText: [name, slug, site?.description ?? "", categories.join(" "),
                ...deployables.map((service) => service.ref),
            ]
                .join(" ")
                .toLowerCase(),
            plans,
            deployables,
        };
    })
    .filter((provider) => provider.deployables.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

const categoryCounts = new Map();
for (const provider of providers) {
    for (const category of provider.categories) {
        categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
}

const CATEGORY_LABELS = {
    ai: "AI",
    "ci-cd": "CI/CD",
    ci: "CI",
    feature_flags: "Feature flags",
};

const categories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([id, count]) => ({
        id,
        label: CATEGORY_LABELS[id] ?? id.charAt(0).toUpperCase() + id.slice(1),
        count,
    }));

const output = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Snapshot of the Projects catalog, reshaped for /marketplace/. Regenerate with:
 *
 *     stripe projects catalog --json > catalog.json
 *     node scripts/build-marketplace-catalog.mjs catalog.json
 *
 * Provider websites and descriptions are merged in from src/providers.webc.
 * Legal links and credential key names are demo stand-ins — see the generator.
 */

export default ${JSON.stringify(
    {
        lastUpdated: snapshot.data.last_updated,
        providerCount: providers.length,
        serviceCount: providers.reduce(
            (total, provider) => total + provider.deployables.length + provider.plans.length,
            0,
        ),
        deployableCount: providers.reduce((total, provider) => total + provider.deployables.length, 0),
        categories,
        providers,
    },
    null,
    4,
)};
`;

fs.writeFileSync(path.join(ROOT, "src/_data/catalog.js"), output);

/*
 * The listing page needs full flow data to provision straight from a tile, but
 * inlining it would add ~230KB to the HTML. Emit it as a module under the
 * passthrough JS directory instead, so the listing can `import()` it on demand.
 */
const flowData = Object.fromEntries(
    providers.map((provider) => {
        const { searchText, categories, description, pageUrl, entry, ...flow } = provider;
        return [provider.slug, flow];
    }),
);

fs.writeFileSync(
    path.join(ROOT, "src/assets/js/marketplace/catalog-data.js"),
    `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Provisioning-flow data keyed by provider slug, imported on demand by the
 * listing page. Regenerate with scripts/build-marketplace-catalog.mjs.
 */

export default ${JSON.stringify(flowData)};
`,
);

console.log(
    `wrote src/_data/catalog.js — ${providers.length} providers, ` +
        `${providers.reduce((t, p) => t + p.deployables.length, 0)} deployables, ` +
        `${providers.reduce((t, p) => t + p.plans.length, 0)} plans`,
);
const missingIcons = providers.filter((provider) => !provider.iconUrl).map((p) => p.slug);
if (missingIcons.length) console.log(`no icon asset (initials fallback): ${missingIcons.join(", ")}`);
const missingSites = providers.filter((provider) => !provider.url).map((p) => p.slug);
if (missingSites.length) console.log(`no website in providers.webc: ${missingSites.join(", ")}`);
