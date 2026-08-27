/**
 * Marketplace entry point. Wires the listing page filters, the provider page
 * provisioning buttons, and the shared modal / drawer / toast plumbing.
 */

import * as store from "./store.js";
import { closeModal, copyText, initModal } from "./ui.js";
import { initStack, openStack } from "./stack.js";
import { openServicePicker, startProvisioning } from "./provision.js";

/* -------------------------------------------------------------------------- */
/* Shared                                                                     */
/* -------------------------------------------------------------------------- */

/** The listing variants, keyed by the `?from=` value their tiles carry. */
const VARIANTS = {
    bold: { url: "/marketplace/bold/", label: "Provisioning Plaza" },
    dark: { url: "/marketplace/dark/", label: "Marketplace" },
    dev: { url: "/marketplace/dev/", label: "Provisioning Plaza" },
    classic: { url: "/marketplace/", label: "Marketplace" },
};

/**
 * Provider pages are shared by both listings, so their back link is generated
 * pointing at the classic one. Retarget it to whichever variant the visitor
 * actually came from, which tiles record in `?from=`.
 */
function applyOriginVariant() {
    const from = new URLSearchParams(window.location.search).get("from");
    const variant = VARIANTS[from];
    if (!variant) return;

    const link = document.querySelector("[data-back-link]");
    const label = document.querySelector("[data-back-label]");
    // Only retarget links that point at a listing — never the Home link.
    if (!link || !link.getAttribute("href").startsWith("/marketplace")) return;
    link.setAttribute("href", variant.url);
    if (label) label.textContent = variant.label;
}

function initSharedControls() {
    initModal();
    initStack();
    applyOriginVariant();

    // Modal contents are re-rendered per step, so close buttons are delegated.
    document.addEventListener("click", (event) => {
        const closer = event.target.closest?.("[data-modal-close]");
        if (closer) closeModal();
    });

    document.querySelectorAll("[data-copy]").forEach((button) => {
        button.addEventListener("click", () => copyText(button.dataset.copy, "Command copied"));
    });
}

/* -------------------------------------------------------------------------- */
/* Tile glow                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Radial wash in the provider's brand colour that eases toward the cursor.
 * Same approach as the homepage's [data-container-hover-follow].
 */
function initTileGlow(tiles) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const EASE = 0.12;

    for (const tile of tiles) {
        const glow = tile.querySelector("[data-hover-follow]");
        if (!glow) continue;

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let hovering = false;
        let frame = null;

        const place = () => {
            const { width, height } = glow.getBoundingClientRect();
            glow.style.transform = `translate(${currentX - width / 2}px, ${currentY - height / 2}px)`;
        };

        const step = () => {
            if (!hovering && Math.abs(targetX - currentX) < 0.5 && Math.abs(targetY - currentY) < 0.5) {
                cancelAnimationFrame(frame);
                frame = null;
                return;
            }
            currentX += (targetX - currentX) * EASE;
            currentY += (targetY - currentY) * EASE;
            place();
            frame = requestAnimationFrame(step);
        };

        tile.addEventListener("mouseenter", (event) => {
            const rect = tile.getBoundingClientRect();
            hovering = true;
            targetX = currentX = event.clientX - rect.left;
            targetY = currentY = event.clientY - rect.top;
            place();
            glow.style.transition = "opacity 0.3s ease-out";
            glow.style.opacity = "1";
            frame ??= requestAnimationFrame(step);
        });

        tile.addEventListener("mousemove", (event) => {
            const rect = tile.getBoundingClientRect();
            targetX = event.clientX - rect.left;
            targetY = event.clientY - rect.top;
            frame ??= requestAnimationFrame(step);
        });

        tile.addEventListener("mouseleave", () => {
            hovering = false;
            glow.style.transition = "opacity 0.4s ease-out";
            glow.style.opacity = "0";
        });
    }
}

/* -------------------------------------------------------------------------- */
/* Listing page                                                               */
/* -------------------------------------------------------------------------- */

function initListing() {
    const grid = document.querySelector("[data-grid]");
    if (!grid) return false;

    const tiles = [...grid.querySelectorAll("[data-tile]")];
    const search = document.querySelector("[data-search]");
    const pills = [...document.querySelectorAll("[data-category]")];
    const freeOnly = document.querySelector("[data-filter-free]");
    const provisionedOnly = document.querySelector("[data-filter-provisioned]");
    const sort = document.querySelector("[data-sort]");
    const empty = document.querySelector("[data-empty]");
    const resultCount = document.querySelector("[data-result-count]");

    let category = "all";

    function apply() {
        const query = (search?.value ?? "").toLowerCase().trim();
        const provisionedSlugs = new Set(store.listResources().map((resource) => resource.providerSlug));
        let visible = 0;

        for (const tile of tiles) {
            const matchesQuery = !query || tile.dataset.search.includes(query);
            const matchesCategory = category === "all" || tile.dataset.categories.split(" ").includes(category);
            const matchesFree = !freeOnly?.checked || tile.dataset.free === "1";
            const matchesProvisioned = !provisionedOnly?.checked || provisionedSlugs.has(tile.dataset.slug);
            const show = matchesQuery && matchesCategory && matchesFree && matchesProvisioned;
            tile.style.display = show ? "" : "none";
            if (show) visible += 1;
        }

        if (empty) {
            empty.classList.toggle("hidden", visible > 0);
            empty.classList.toggle("flex", visible === 0);
        }
        if (resultCount) {
            resultCount.textContent = `${visible} provider${visible === 1 ? "" : "s"}`;
        }
    }

    function applySort() {
        const mode = sort?.value ?? "name";
        const sorted = [...tiles].sort((a, b) =>
            mode === "services"
                ? Number(b.dataset.services) - Number(a.dataset.services) || a.dataset.name.localeCompare(b.dataset.name)
                : a.dataset.name.localeCompare(b.dataset.name),
        );
        for (const tile of sorted) grid.appendChild(tile);
    }

    /** Badges reflect what is in the stack, so tiles stay honest after a reload. */
    function paintBadges() {
        const counts = new Map();
        for (const resource of store.listResources()) {
            counts.set(resource.providerSlug, (counts.get(resource.providerSlug) ?? 0) + 1);
        }
        for (const tile of tiles) {
            const badge = tile.querySelector("[data-tile-badge]");
            const label = tile.querySelector("[data-tile-badge-label]");
            const count = counts.get(tile.dataset.slug) ?? 0;
            if (!badge) continue;
            badge.classList.toggle("hidden", count === 0);
            badge.classList.toggle("flex", count > 0);
            if (label) label.textContent = count === 1 ? "Provisioned" : `${count} resources`;

            // Once something is provisioned the footer reports the stack rather
            // than the cheapest way in.
            const state = tile.querySelector("[data-tile-state]");
            if (!state) continue;
            if (count === 0) {
                state.textContent = state.dataset.entry ?? state.textContent;
                state.classList.remove("text-headline");
                state.classList.add("text-detail");
            } else {
                if (!state.dataset.entry) state.dataset.entry = state.textContent;
                const plan = store.getProviderPlan(tile.dataset.slug);
                state.textContent = `${count} resource${count === 1 ? "" : "s"}${plan ? ` · ${plan.ref}` : ""}`;
                state.classList.add("text-headline");
                state.classList.remove("text-detail");
            }
        }
    }

    /*
     * Provisioning from a tile needs the provider's full flow data, which is far
     * too large to inline for 62 providers. Load it once, on the first hover or
     * click, and reuse it after that.
     */
    let flowDataPromise = null;
    const loadFlowData = () => {
        flowDataPromise ??= import("./catalog-data.js").then((module) => module.default);
        return flowDataPromise;
    };

    for (const tile of tiles) {
        tile.addEventListener("mouseenter", loadFlowData, { once: true });
        const button = tile.querySelector("[data-tile-provision]");
        button?.addEventListener("click", async (event) => {
            event.preventDefault();
            button.disabled = true;
            try {
                const providers = await loadFlowData();
                const provider = providers[button.dataset.tileProvision];
                if (!provider) return;
                // One service goes straight into the flow; otherwise pick first.
                if (provider.deployables.length === 1) {
                    startProvisioning(provider, provider.deployables[0]);
                } else {
                    openServicePicker(provider);
                }
            } finally {
                button.disabled = false;
            }
        });
    }

    initTileGlow(tiles);

    search?.addEventListener("input", apply);
    freeOnly?.addEventListener("change", apply);
    provisionedOnly?.addEventListener("change", apply);
    sort?.addEventListener("change", () => {
        applySort();
        apply();
    });

    pills.forEach((pill) => {
        pill.addEventListener("click", () => {
            pills.forEach((other) => other.classList.remove("mkt-pill-active"));
            pill.classList.add("mkt-pill-active");
            category = pill.dataset.category;
            apply();
        });
    });

    // Some listings offer a reset in the filter panel as well as the empty state.
    document.querySelectorAll("[data-clear-filters]").forEach((button) => {
        button.addEventListener("click", () => {
            if (search) search.value = "";
            if (freeOnly) freeOnly.checked = false;
            if (provisionedOnly) provisionedOnly.checked = false;
            pills.forEach((other) => other.classList.toggle("mkt-pill-active", other.dataset.category === "all"));
            category = "all";
            apply();
        });
    });

    // Deep link: /marketplace/?q=postgres
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");
    if (initialQuery && search) search.value = initialQuery;

    store.subscribe(() => {
        paintBadges();
        if (provisionedOnly?.checked) apply();
    });
    apply();
    return true;
}

/* -------------------------------------------------------------------------- */
/* Provider page                                                              */
/* -------------------------------------------------------------------------- */

function initProviderPage() {
    const payload = document.querySelector("[data-marketplace-provider]");
    if (!payload) return false;

    const provider = JSON.parse(payload.textContent);

    document.querySelectorAll("[data-provision]").forEach((button) => {
        button.addEventListener("click", () => {
            const service = provider.deployables.find((item) => item.serviceId === button.dataset.provision);
            if (service) startProvisioning(provider, service);
        });
    });

    document.querySelector("[data-open-picker]")?.addEventListener("click", () => openServicePicker(provider));

    function paint() {
        const link = store.getProviderLink(provider.slug);
        const statusLabel = document.querySelector("[data-account-status-label]");
        const statusWrap = document.querySelector("[data-account-status]");
        if (statusLabel && statusWrap) {
            if (link?.status === "linked") {
                statusLabel.textContent = `Account linked · ${link.accountId}`;
                statusWrap.classList.add("text-success-400");
                statusWrap.classList.remove("text-detail");
            } else {
                statusLabel.textContent = "Account not linked";
                statusWrap.classList.remove("text-success-400");
                statusWrap.classList.add("text-detail");
            }
        }

        for (const service of provider.deployables) {
            const row = document.querySelector(`[data-service="${service.serviceId}"]`);
            const badge = row?.querySelector("[data-service-badge]");
            const label = row?.querySelector("[data-service-badge-label]");
            const resources = store.listResources(provider.slug).filter((item) => item.serviceId === service.serviceId);
            if (!badge) continue;
            badge.classList.toggle("hidden", resources.length === 0);
            badge.classList.toggle("flex", resources.length > 0);
            if (label) label.textContent = resources.length === 1 ? "Provisioned" : `${resources.length} provisioned`;
            const button = row?.querySelector("[data-provision]");
            if (button) button.querySelector("span").textContent = resources.length ? "Provision another" : "Provision";
        }

        const activePlan = store.getProviderPlan(provider.slug);
        for (const plan of provider.plans) {
            const badge = document.querySelector(`[data-plan-badge="${plan.serviceId}"]`);
            if (!badge) continue;
            const active = activePlan?.planServiceId === plan.serviceId;
            badge.classList.toggle("hidden", !active);
            badge.classList.toggle("flex", active);
        }
    }

    store.subscribe(paint);
    return true;
}

/* -------------------------------------------------------------------------- */

initSharedControls();
initListing();
initProviderPage();

// Deep link: /marketplace/?stack=open
if (new URLSearchParams(window.location.search).get("stack") === "open") openStack();
