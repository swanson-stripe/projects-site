/**
 * Demo state for the marketplace.
 *
 * Stands in for everything the CLI keeps under `.projects/` — the project, the
 * linked provider accounts, provisioned plans and resources, and the credential
 * vault. Persisted to localStorage so a demo survives a reload.
 */

const STORAGE_KEY = "stripe-projects-marketplace-demo";
const VERSION = 1;

const listeners = new Set();

function emptyState() {
    return {
        version: VERSION,
        // A project is assumed to exist — `stripe projects init` is out of scope.
        project: { id: "proj_demo_8Xq2", name: "my-app" },
        // Payment method on file, as `stripe projects billing show` would report.
        billing: { brand: "Visa", last4: "4242", expMonth: 12, expYear: 2029 },
        identity: { email: "you@example.com" },
        providers: {},
        plans: [],
        resources: [],
    };
}

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyState();
        const parsed = JSON.parse(raw);
        if (parsed?.version !== VERSION) return emptyState();
        return { ...emptyState(), ...parsed };
    } catch {
        return emptyState();
    }
}

let state = load();

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Private browsing or a full quota — the demo still works in memory.
    }
    for (const listener of listeners) listener(state);
}

export function subscribe(listener) {
    listeners.add(listener);
    listener(state);
    return () => listeners.delete(listener);
}

export function getState() {
    return state;
}

export function reset() {
    state = emptyState();
    persist();
}

/* -------------------------------------------------------------------------- */
/* Providers                                                                  */
/* -------------------------------------------------------------------------- */

export function getProviderLink(slug) {
    return state.providers[slug] ?? null;
}

export function isProviderLinked(slug) {
    return state.providers[slug]?.status === "linked";
}

export function saveProviderLink(slug, record) {
    state.providers = { ...state.providers, [slug]: record };
    persist();
}

/* -------------------------------------------------------------------------- */
/* Plans                                                                      */
/* -------------------------------------------------------------------------- */

export function findPlan(providerSlug, planServiceId) {
    return (
        state.plans.find(
            (plan) => plan.providerSlug === providerSlug && plan.planServiceId === planServiceId,
        ) ?? null
    );
}

/** Plans are one-per-provider: adding a second replaces the first. */
export function getProviderPlan(providerSlug) {
    return state.plans.find((plan) => plan.providerSlug === providerSlug) ?? null;
}

export function savePlan(record) {
    state.plans = [...state.plans.filter((plan) => plan.providerSlug !== record.providerSlug), record];
    persist();
}

export function removePlan(id) {
    state.plans = state.plans.filter((plan) => plan.id !== id);
    persist();
}

/* -------------------------------------------------------------------------- */
/* Resources                                                                  */
/* -------------------------------------------------------------------------- */

export function listResources(providerSlug) {
    return providerSlug
        ? state.resources.filter((resource) => resource.providerSlug === providerSlug)
        : state.resources;
}

export function findResource(id) {
    return state.resources.find((resource) => resource.id === id) ?? null;
}

export function hasResource(providerSlug, serviceId) {
    return state.resources.some(
        (resource) => resource.providerSlug === providerSlug && resource.serviceId === serviceId,
    );
}

export function saveResource(record) {
    const index = state.resources.findIndex((resource) => resource.id === record.id);
    state.resources =
        index === -1
            ? [...state.resources, record]
            : state.resources.map((resource) => (resource.id === record.id ? record : resource));
    persist();
}

export function removeResource(id) {
    state.resources = state.resources.filter((resource) => resource.id !== id);
    persist();
}

export function setBilling(billing) {
    state.billing = billing;
    persist();
}
