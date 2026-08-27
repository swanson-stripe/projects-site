/**
 * Mock provisioning backend.
 *
 * Every call here stands in for a `stripe projects …` invocation: it takes the
 * same preconditions, fails with the same error codes, reports the same
 * progress steps, and returns records shaped like the CLI's own. Nothing leaves
 * the browser.
 */

import * as store from "./store.js";

/** Error codes the CLI surfaces, reused verbatim so the UI can branch on them. */
export class ProvisioningError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = "ProvisioningError";
        this.code = code;
        this.details = details;
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Provisioning feels instant in a mock; a little latency keeps it legible. */
function latency(min, max) {
    return sleep(min + Math.random() * (max - min));
}

const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomId(prefix, length = 16) {
    let id = "";
    for (let i = 0; i < length; i += 1) {
        id += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
    }
    return `${prefix}_${id}`;
}

function secretToken(length) {
    return randomId("", length).slice(1);
}

function envToken(value) {
    return String(value)
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
}

/* -------------------------------------------------------------------------- */
/* Credentials                                                                */
/* -------------------------------------------------------------------------- */

/** Shapes a plausible value for a credential key so reveal/copy has substance. */
function credentialValue(key, provider, resourceName) {
    const host = (provider.url || `https://${provider.slug}.com`).replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    switch (true) {
        case key === "DATABASE_URL":
            return `postgresql://${provider.slug}_owner:${secretToken(24)}@ep-${secretToken(12).toLowerCase()}.${host}/${resourceName}?sslmode=require`;
        case key === "DATABASE_HOST":
            return `ep-${secretToken(12).toLowerCase()}.${host}`;
        case key === "DATABASE_USER":
            return `${provider.slug}_owner`;
        case key === "DATABASE_PASSWORD":
        case key === "SECRET_ACCESS_KEY":
            return secretToken(32);
        case key === "URL":
        case key === "DEPLOY_URL":
            return `https://${resourceName}-${secretToken(6).toLowerCase()}.${host}`;
        case key === "ISSUER_URL":
            return `https://${resourceName}.${host}`;
        case key === "HOST":
            return `https://api.${host}`;
        case key === "STORE_DOMAIN":
            return `${resourceName}-${secretToken(4).toLowerCase()}.myshopify.com`;
        case key === "DOMAIN":
            return `${resourceName}.dev`;
        case key === "DSN":
            return `https://${secretToken(32).toLowerCase()}@o${Math.floor(Math.random() * 1e6)}.ingest.${host}/${Math.floor(Math.random() * 1e7)}`;
        case key === "PUBLISHABLE_KEY":
            return `pk_live_${secretToken(28)}`;
        case key.endsWith("SECRET"):
            return `whsec_${secretToken(32)}`;
        case key.endsWith("_ID") || key === "BUCKET" || key === "REGION":
            return `${resourceName}-${secretToken(8).toLowerCase()}`;
        case key === "ACCESS_KEY_ID":
            return secretToken(20).toUpperCase();
        default:
            // API keys, tokens, and anything else provider-shaped.
            return `${provider.slug.slice(0, 3)}_${secretToken(36)}`;
    }
}

function mintCredentials(provider, service, resourceName) {
    const prefix = `${envToken(provider.slug)}_${envToken(resourceName)}`;
    return service.credentialKeys.map((key) => ({
        key,
        envKey: `${prefix}_${key}`,
        value: credentialValue(key, provider, resourceName),
    }));
}

/* -------------------------------------------------------------------------- */
/* Account linking                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Stands in for `stripe projects link <provider>` — the account request the CLI
 * makes after terms are accepted. Terms acceptance is a hard precondition: the
 * CLI throws TOS_NOT_ACCEPTED rather than provisioning.
 */
export async function linkProvider(provider, { acceptedTos }) {
    if (!acceptedTos) {
        throw new ProvisioningError(
            `Did not accept ${provider.name} terms of service and privacy policy.`,
            "TOS_NOT_ACCEPTED",
            { provider: provider.name },
        );
    }

    const existing = store.getProviderLink(provider.slug);
    if (existing?.status === "linked") return existing;

    await latency(700, 1300);

    const record = {
        status: "linked",
        accountId: randomId("acct", 14),
        accountEmail: store.getState().identity.email,
        linkedAt: new Date().toISOString(),
        tosAcceptedAt: new Date().toISOString(),
        tosUrl: provider.tosUrl,
        privacyUrl: provider.privacyUrl,
    };
    store.saveProviderLink(provider.slug, record);
    return record;
}

export function unlinkProvider(slug) {
    store.saveProviderLink(slug, { status: "not_linked" });
}

/* -------------------------------------------------------------------------- */
/* Plans (entitlements)                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Stands in for `stripe projects add <provider>/<plan>` for a plan-kind service.
 * A plan carries pricing and limits; the deployable attaches to it.
 */
export async function provisionPlan(provider, plan) {
    const existing = store.findPlan(provider.slug, plan.serviceId);
    if (existing) return { record: existing, reused: true };

    await latency(600, 1100);

    const record = {
        id: randomId("prvres", 14),
        providerSlug: provider.slug,
        providerName: provider.name,
        planServiceId: plan.serviceId,
        ref: plan.ref,
        description: plan.description,
        price: plan.price,
        status: plan.status,
        provisionedAt: new Date().toISOString(),
        // Plans this one can be switched to, driving upgrade/downgrade.
        updateableTo: plan.updateableTo,
    };
    store.savePlan(record);
    return { record, reused: false };
}

/** Stands in for `stripe projects upgrade` / `downgrade` on a plan. */
export async function changePlan(providerSlug, nextPlan) {
    const current = store.getProviderPlan(providerSlug);
    if (!current) throw new ProvisioningError("No plan provisioned for this provider.", "PLAN_REQUIRED");

    await latency(600, 1000);

    const record = {
        ...current,
        planServiceId: nextPlan.serviceId,
        ref: nextPlan.ref,
        description: nextPlan.description,
        price: nextPlan.price,
        status: nextPlan.status,
        updatedAt: new Date().toISOString(),
    };
    store.savePlan(record);

    // Resources priced by the plan follow it.
    for (const resource of store.listResources(providerSlug)) {
        if (resource.planRef) {
            store.saveResource({ ...resource, planRef: record.ref, planPrice: record.price, planStatus: record.status });
        }
    }
    return record;
}

/* -------------------------------------------------------------------------- */
/* Resources (deployables)                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Stands in for `stripe projects add <provider>/<service>`.
 *
 * `onStep` is called as each provisioning step completes, matching the CLI's
 * progress tree: requesting → waiting → syncing credentials → updating config.
 */
export async function provisionResource(provider, service, options = {}) {
    const { planServiceId = null, tier = null, resourceName, onStep = () => {} } = options;

    if (!store.isProviderLinked(provider.slug)) {
        throw new ProvisioningError(
            `${provider.name} requires OAuth linking.`,
            "PROVIDER_NOT_LINKED",
            { provider: provider.name },
        );
    }

    // A component-priced deployable cannot exist without its companion plan —
    // the CLI exits with PLAN_REQUIRED and names the command to fix it.
    if (service.selectionMode === "component") {
        const plan = planServiceId ? store.findPlan(provider.slug, planServiceId) : store.getProviderPlan(provider.slug);
        if (!plan) {
            throw new ProvisioningError(
                `${service.ref} requires a plan. Provision ${provider.slug}/${planServiceId ?? "<plan>"} first.`,
                "PLAN_REQUIRED",
                { service: service.ref, plan: `${provider.slug}/${planServiceId ?? "<plan>"}` },
            );
        }
    }

    const name = (resourceName || service.defaultResourceName).trim();
    const plan = store.getProviderPlan(provider.slug);

    await latency(500, 900);
    onStep("requested");

    await latency(1100, 1900);
    onStep("provisioned");

    const credentials = mintCredentials(provider, service, name);
    await latency(500, 800);
    onStep("synced");

    const record = {
        id: randomId("prvres", 14),
        providerSlug: provider.slug,
        providerName: provider.name,
        providerIconUrl: provider.iconUrl ?? null,
        providerInitials: provider.fallbackInitials,
        serviceId: service.serviceId,
        ref: service.ref,
        description: service.description,
        name,
        scope: service.scope,
        // Pricing is either carried by the plan or selected inline as a tier.
        planRef: service.selectionMode === "component" ? (plan?.ref ?? null) : null,
        planPrice: service.selectionMode === "component" ? (plan?.price ?? null) : null,
        planStatus: service.selectionMode === "component" ? (plan?.status ?? null) : null,
        tier: tier ? { label: tier.label, price: tier.price, status: tier.status } : null,
        price: tier?.price ?? plan?.price ?? service.price,
        status: tier?.status ?? plan?.status ?? service.status,
        provisionedAt: new Date().toISOString(),
        rotatedAt: null,
        credentials,
        // Kept on the record so the stack drawer can offer upgrades without the
        // full catalog on the page.
        planOptions: service.planOptions ?? [],
        tiers: service.tiers ?? [],
        selectionMode: service.selectionMode,
    };
    store.saveResource(record);

    await latency(350, 600);
    onStep("updated");

    return record;
}

/** Stands in for `stripe projects rotate <resource>`. */
export async function rotateCredentials(resourceId) {
    const resource = store.findResource(resourceId);
    if (!resource) throw new ProvisioningError("Resource not found.", "UNKNOWN_ERROR");

    await latency(700, 1200);

    const provider = { slug: resource.providerSlug, name: resource.providerName, url: "" };
    const updated = {
        ...resource,
        rotatedAt: new Date().toISOString(),
        credentials: resource.credentials.map((credential) => ({
            ...credential,
            value: credentialValue(credential.key, provider, resource.name),
        })),
    };
    store.saveResource(updated);
    return updated;
}

/** Stands in for `stripe projects remove <resource>`. */
export async function deprovisionResource(resourceId) {
    await latency(600, 1000);
    store.removeResource(resourceId);
}

/* -------------------------------------------------------------------------- */
/* Environment                                                                */
/* -------------------------------------------------------------------------- */

/** The `.env` `stripe projects env --pull` would write for the whole project. */
export function buildEnvFile() {
    const lines = [`# ${store.getState().project.name} — Stripe Projects`, ""];
    for (const resource of store.listResources()) {
        lines.push(`# ${resource.ref} (${resource.name})`);
        for (const credential of resource.credentials) {
            lines.push(`${credential.envKey}=${credential.value}`);
        }
        lines.push("");
    }
    return lines.join("\n");
}
