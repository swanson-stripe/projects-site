/**
 * "My stack" drawer — the UI equivalent of `provisioning status`, with the
 * management commands attached to each row: `env`, `rotate`, `upgrade`, and
 * `remove`.
 */

import * as api from "./api.js";
import * as store from "./store.js";
import { bindCredentialList, renderCredentialList, resourceEnvBlock } from "./credentials.js";
import { closeModal, copyText, escapeHtml, modalFooter, modalHeader, openModal, primaryButton, secondaryButton, toast } from "./ui.js";

const html = String.raw;

const ROTATE_ICON = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-12 h-12"><path fill-rule="evenodd" d="M8 3.5a4.5 4.5 0 0 0-4.24 3 .75.75 0 0 1-1.41-.5A6 6 0 0 1 13.5 6.2V4.75a.75.75 0 0 1 1.5 0V8a.75.75 0 0 1-.75.75h-3.25a.75.75 0 0 1 0-1.5h1.62A4.5 4.5 0 0 0 8 3.5Zm-6.25 4A.75.75 0 0 1 2.5 8.25h3.25a.75.75 0 0 1 0 1.5H4.13A4.5 4.5 0 0 0 12.24 9.5a.75.75 0 0 1 1.41.5A6 6 0 0 1 2.5 9.8v1.45a.75.75 0 0 1-1.5 0V8Z" clip-rule="evenodd"/></svg>`;
const TRASH_ICON = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-12 h-12"><path d="M6.5 1a1 1 0 0 0-1 1v.5H3a.75.75 0 0 0 0 1.5h10a.75.75 0 0 0 0-1.5h-2.5V2a1 1 0 0 0-1-1h-3Z"/><path d="M4 5.5h8l-.6 8.07A1.5 1.5 0 0 1 9.9 15H6.1a1.5 1.5 0 0 1-1.5-1.43L4 5.5Z"/></svg>`;
const UPGRADE_ICON = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-12 h-12"><path fill-rule="evenodd" d="M8 1.5a.75.75 0 0 1 .53.22l4 4a.75.75 0 1 1-1.06 1.06L8.75 4.06v9.19a.75.75 0 0 1-1.5 0V4.06L4.53 6.78a.75.75 0 1 1-1.06-1.06l4-4A.75.75 0 0 1 8 1.5Z" clip-rule="evenodd"/></svg>`;

function dot(status) {
    return `<span class="inline-block w-6 h-6 rounded-full ${status === "free" ? "bg-success-400" : "bg-lemon-200"} shrink-0"></span>`;
}

function mark(resource, sizeClass = "w-18 h-18") {
    if (resource.providerIconUrl) {
        return `<img src="${escapeHtml(resource.providerIconUrl)}" alt="" class="${sizeClass} shrink-0 object-contain">`;
    }
    return `<span class="${sizeClass} shrink-0 inline-flex items-center justify-center rounded-full bg-foreground border border-edge text-10 text-detail">${escapeHtml(resource.providerInitials ?? "?")}</span>`;
}

function relativeTime(iso) {
    const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
}

/* -------------------------------------------------------------------------- */
/* Drawer                                                                     */
/* -------------------------------------------------------------------------- */

function nodes() {
    return {
        root: document.querySelector("[data-stack-root]"),
        panel: document.querySelector("[data-stack-panel]"),
        backdrop: document.querySelector("[data-stack-backdrop]"),
        body: document.querySelector("[data-stack-body]"),
        subtitle: document.querySelector("[data-stack-subtitle]"),
        count: document.querySelector("[data-stack-count]"),
    };
}

let isOpen = false;

export function openStack() {
    const { root, panel, backdrop } = nodes();
    if (!root || isOpen) return;
    isOpen = true;
    render();
    root.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    if (window.gsap) {
        window.gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
        window.gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.32, ease: "power3.out" });
    } else {
        backdrop.style.opacity = "1";
    }
    document.addEventListener("keydown", onKeydown);
}

export function closeStack() {
    const { root, panel, backdrop } = nodes();
    if (!root || !isOpen) return;
    isOpen = false;
    document.removeEventListener("keydown", onKeydown);
    document.body.style.overflow = "";

    const finish = () => root.classList.add("hidden");
    if (window.gsap) {
        window.gsap.to(backdrop, { opacity: 0, duration: 0.18, ease: "power2.in" });
        window.gsap.to(panel, { xPercent: 100, duration: 0.24, ease: "power2.in", onComplete: finish });
    } else {
        finish();
    }
}

function onKeydown(event) {
    if (event.key === "Escape") closeStack();
}

/* -------------------------------------------------------------------------- */
/* Rendering                                                                  */
/* -------------------------------------------------------------------------- */

function renderPlanRow(plan) {
    const canChange = (plan.updateableTo ?? []).filter((id) => id !== plan.planServiceId).length > 0;
    return html`<div class="flex items-start justify-between gap-10 px-12 py-10 rounded-6 border border-edge bg-highlight">
        <div class="min-w-0">
            <div class="flex items-center gap-6">
                <span class="font-mono text-12 text-headline">${escapeHtml(plan.ref)}</span>
                <span class="inline-flex items-center h-16 px-5 rounded-full bg-foreground border border-edge text-10 text-detail uppercase tracking-wide">Plan</span>
            </div>
            <div class="flex items-center gap-6 text-11 text-detail mt-4">${dot(plan.status)}<span class="truncate">${escapeHtml(plan.price)}</span></div>
        </div>
        ${
            canChange
                ? `<button type="button" data-change-plan="${escapeHtml(plan.id)}" class="shrink-0 inline-flex items-center gap-4 h-24 px-8 rounded-4 border border-edge text-11 text-content hover:text-headline hover:bg-foreground transition-colors duration-150 cursor-pointer outline-none">${UPGRADE_ICON}<span>Change</span></button>`
                : ""
        }
    </div>`;
}

function renderResourceRow(resource) {
    return html`<div class="rounded-6 border border-edge bg-highlight overflow-hidden">
        <div class="flex items-start justify-between gap-10 px-12 py-10">
            <div class="min-w-0">
                <div class="flex items-center gap-8">
                    ${mark(resource)}
                    <span class="font-mono text-12 text-headline truncate">${escapeHtml(resource.ref)}</span>
                </div>
                <div class="flex items-center gap-8 mt-5 flex-wrap">
                    <span class="font-mono text-11 text-detail">${escapeHtml(resource.name)}</span>
                    <span class="text-11 text-disclaimer">·</span>
                    <span class="flex items-center gap-4 text-11 text-detail">${dot(resource.status)}<span>${escapeHtml(resource.tier?.label ?? resource.planRef ?? "Free")}</span></span>
                    <span class="text-11 text-disclaimer">·</span>
                    <span class="text-11 text-disclaimer">${escapeHtml(relativeTime(resource.rotatedAt ?? resource.provisionedAt))}</span>
                </div>
            </div>
            <button type="button" data-toggle-creds="${escapeHtml(resource.id)}" class="shrink-0 h-24 px-8 rounded-4 border border-edge text-11 text-content hover:text-headline hover:bg-foreground transition-colors duration-150 cursor-pointer outline-none">
                ${resource.credentials.length} var${resource.credentials.length === 1 ? "" : "s"}
            </button>
        </div>
        <div data-creds="${escapeHtml(resource.id)}" class="hidden px-12 pb-12">
            ${renderCredentialList(resource.credentials)}
            <div class="flex items-center gap-6 mt-8 flex-wrap">
                <button type="button" data-copy-env="${escapeHtml(resource.id)}" class="inline-flex items-center gap-4 h-24 px-8 rounded-4 border border-edge text-11 text-content hover:text-headline hover:bg-foreground transition-colors duration-150 cursor-pointer outline-none">Copy .env</button>
                <button type="button" data-rotate="${escapeHtml(resource.id)}" class="inline-flex items-center gap-4 h-24 px-8 rounded-4 border border-edge text-11 text-content hover:text-headline hover:bg-foreground transition-colors duration-150 cursor-pointer outline-none">${ROTATE_ICON}<span>Rotate</span></button>
                <button type="button" data-remove="${escapeHtml(resource.id)}" class="inline-flex items-center gap-4 h-24 px-8 rounded-4 border border-edge text-11 text-ruby-400 hover:bg-foreground transition-colors duration-150 cursor-pointer outline-none">${TRASH_ICON}<span>Remove</span></button>
            </div>
        </div>
    </div>`;
}

function render() {
    const { body, subtitle, count } = nodes();
    const state = store.getState();
    const resources = state.resources;
    const plans = state.plans;

    if (count) count.textContent = String(resources.length);
    if (subtitle) {
        subtitle.textContent = resources.length
            ? `${state.project.name} · ${resources.length} resource${resources.length === 1 ? "" : "s"}, ${plans.length} plan${plans.length === 1 ? "" : "s"}`
            : "Nothing provisioned yet";
    }
    if (!body || !isOpen) return;

    if (!resources.length && !plans.length) {
        body.innerHTML = html`<div class="flex flex-col items-center justify-center gap-8 py-48 text-center">
            <p class="text-14 text-content">Your stack is empty.</p>
            <p class="text-12/150 text-detail max-w-280">Pick a provider from the marketplace and provision a service. Plans, resources, and credentials will show up here.</p>
        </div>`;
        return;
    }

    const byProvider = new Map();
    for (const resource of resources) {
        const list = byProvider.get(resource.providerSlug) ?? { name: resource.providerName, resources: [] };
        list.resources.push(resource);
        byProvider.set(resource.providerSlug, list);
    }

    body.innerHTML = html`<div class="flex flex-col gap-20">
        <div class="flex items-center justify-between gap-8 px-12 py-10 rounded-6 bg-foreground border border-edge">
            <div>
                <p class="text-12 text-detail">Project</p>
                <p class="font-mono text-13 text-headline">${escapeHtml(store.getState().project.name)}</p>
            </div>
            <button type="button" data-copy-all-env class="h-28 px-10 rounded-4 border border-edge bg-highlight text-11 text-content hover:text-headline transition-colors duration-150 cursor-pointer outline-none">Copy full .env</button>
        </div>

        ${[...byProvider.entries()]
            .map(([slug, group]) => {
                const plan = plans.find((item) => item.providerSlug === slug);
                return html`<div>
                    <h3 class="text-12 text-detail uppercase tracking-wider mb-8">${escapeHtml(group.name)}</h3>
                    <div class="flex flex-col gap-8">
                        ${plan ? renderPlanRow(plan) : ""}
                        ${group.resources.map(renderResourceRow).join("")}
                    </div>
                </div>`;
            })
            .join("")}

        ${
            plans.filter((plan) => !byProvider.has(plan.providerSlug)).length
                ? html`<div>
                    <h3 class="text-12 text-detail uppercase tracking-wider mb-8">Plans without resources</h3>
                    <div class="flex flex-col gap-8">
                        ${plans.filter((plan) => !byProvider.has(plan.providerSlug)).map(renderPlanRow).join("")}
                    </div>
                </div>`
                : ""
        }
    </div>`;

    bindBody(body);
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                    */
/* -------------------------------------------------------------------------- */

function bindBody(body) {
    body.querySelector("[data-copy-all-env]")?.addEventListener("click", () => {
        copyText(api.buildEnvFile(), "Copied full .env");
    });

    body.querySelectorAll("[data-toggle-creds]").forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.toggleCreds;
            const panel = body.querySelector(`[data-creds="${id}"]`);
            const resource = store.findResource(id);
            if (!panel || !resource) return;
            const opening = panel.classList.contains("hidden");
            panel.classList.toggle("hidden", !opening);
            if (opening) bindCredentialList(panel, resource.credentials);
        });
    });

    body.querySelectorAll("[data-copy-env]").forEach((button) => {
        button.addEventListener("click", () => {
            const resource = store.findResource(button.dataset.copyEnv);
            if (resource) copyText(resourceEnvBlock(resource), `Copied ${resource.name} .env block`);
        });
    });

    body.querySelectorAll("[data-rotate]").forEach((button) => {
        button.addEventListener("click", async () => {
            const id = button.dataset.rotate;
            button.disabled = true;
            button.textContent = "Rotating…";
            try {
                const resource = await api.rotateCredentials(id);
                toast(`Rotated credentials for ${resource.name}`);
                render();
                // Reopen the panel the user was looking at.
                nodes().body?.querySelector(`[data-creds="${id}"]`)?.classList.remove("hidden");
                const reopened = store.findResource(id);
                const panel = nodes().body?.querySelector(`[data-creds="${id}"]`);
                if (panel && reopened) bindCredentialList(panel, reopened.credentials);
            } catch (error) {
                toast(error.message ?? "Rotate failed", "error");
                render();
            }
        });
    });

    body.querySelectorAll("[data-remove]").forEach((button) => {
        button.addEventListener("click", () => confirmRemove(button.dataset.remove));
    });

    body.querySelectorAll("[data-change-plan]").forEach((button) => {
        button.addEventListener("click", () => openPlanChange(button.dataset.changePlan));
    });
}

/** `provisioning remove <resource>` asks before deprovisioning. */
function confirmRemove(resourceId) {
    const resource = store.findResource(resourceId);
    if (!resource) return;

    const card = openModal(
        modalHeader({
            eyebrow: resource.providerName,
            title: `Remove ${resource.ref}?`,
            subtitle: "The resource is deprovisioned at the provider and its credentials are dropped from the project.",
        }) +
            html`<div class="px-20 py-16">
                <div class="p-12 rounded-6 border border-edge bg-foreground">
                    <p class="text-12 text-detail">Resource</p>
                    <p class="font-mono text-13 text-headline">${escapeHtml(resource.name)}</p>
                    <p class="text-11 text-detail mt-8">${resource.credentials.length} environment variable${resource.credentials.length === 1 ? "" : "s"} will be removed.</p>
                </div>
            </div>` +
            modalFooter("", secondaryButton("Cancel", "data-modal-close") + primaryButton("Remove", "data-confirm-remove data-autofocus")),
    );
    if (!card) return;

    card.querySelector("[data-confirm-remove]")?.addEventListener("click", async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        button.textContent = "Removing…";
        await api.deprovisionResource(resourceId);
        closeModal();
        toast(`${resource.ref} removed`);
        render();
    });
}

/** `provisioning upgrade` / `downgrade` on the provider's plan. */
function openPlanChange(planId) {
    const plan = store.getState().plans.find((item) => item.id === planId);
    if (!plan) return;

    // The resource records carry the plan options they were provisioned against,
    // so the drawer can offer them without the full catalog on the page.
    const resource = store.listResources(plan.providerSlug).find((item) => item.planOptions?.length);
    const options = (resource?.planOptions ?? []).filter((option) => (plan.updateableTo ?? []).includes(option.planServiceId));
    // switchOptions carries each plan's own list price; planOptions only carries
    // what the deployable costs under it, which is a different number.
    const candidates = plan.switchOptions?.length
        ? plan.switchOptions
        : options.length
          ? options
          : (plan.updateableTo ?? []).map((planServiceId) => ({ planServiceId, status: "paid", price: "See provider pricing" }));

    const rows = candidates
        .map(
            (option) => html`<label class="mkt-choice${option.planServiceId === plan.planServiceId ? " mkt-choice-active" : ""} flex items-start gap-10 p-12 rounded-6 border transition-colors duration-150 cursor-pointer" data-next-plan-row>
                <input type="radio" name="next-plan" value="${escapeHtml(option.planServiceId)}" ${option.planServiceId === plan.planServiceId ? "checked" : ""} class="mt-3 accent-primary shrink-0">
                <span class="min-w-0 flex-1">
                    <span class="flex items-center gap-8">
                        <span class="font-mono text-12 text-headline">${escapeHtml(plan.providerSlug)}/${escapeHtml(option.planServiceId)}</span>
                        ${option.planServiceId === plan.planServiceId ? `<span class="text-10 text-detail">current</span>` : ""}
                    </span>
                    <span class="flex items-center gap-6 text-11 text-detail mt-4">${dot(option.status)}<span>${escapeHtml(option.price)}</span></span>
                </span>
            </label>`,
        )
        .join("");

    const card = openModal(
        modalHeader({
            eyebrow: plan.providerName,
            title: "Change plan",
            subtitle: "Resources priced by this plan follow the change.",
        }) +
            html`<div class="px-20 py-16 flex flex-col gap-8">${rows}</div>` +
            modalFooter("", secondaryButton("Cancel", "data-modal-close") + primaryButton("Apply", "data-apply-plan data-autofocus")),
    );
    if (!card) return;

    // Without this the radio moved but the highlight stayed on the current plan.
    card.querySelectorAll("[data-next-plan-row]").forEach((label) => {
        label.addEventListener("click", () => {
            card.querySelectorAll("[data-next-plan-row]").forEach((other) => other.classList.remove("mkt-choice-active"));
            label.classList.add("mkt-choice-active");
        });
    });

    card.querySelector("[data-apply-plan]")?.addEventListener("click", async (event) => {
        const selected = card.querySelector('input[name="next-plan"]:checked')?.value;
        if (!selected || selected === plan.planServiceId) return closeModal();

        const button = event.currentTarget;
        button.disabled = true;
        button.textContent = "Applying…";
        const option = candidates.find((item) => item.planServiceId === selected);
        try {
            const updated = await api.changePlan(plan.providerSlug, {
                serviceId: selected,
                ref: `${plan.providerSlug}/${selected}`,
                description: plan.description,
                price: option?.price ?? plan.price,
                status: option?.status ?? plan.status,
            });
            closeModal();
            toast(`Plan changed to ${updated.ref}`);
            render();
        } catch (error) {
            toast(error.message ?? "Plan change failed", "error");
            closeModal();
        }
    });
}

/* -------------------------------------------------------------------------- */
/* Wiring                                                                     */
/* -------------------------------------------------------------------------- */

export function initStack() {
    document.querySelectorAll("[data-stack-open]").forEach((button) => button.addEventListener("click", openStack));
    document.querySelector("[data-stack-close]")?.addEventListener("click", closeStack);
    document.querySelector("[data-stack-backdrop]")?.addEventListener("click", closeStack);
    document.querySelector("[data-stack-reset]")?.addEventListener("click", () => {
        store.reset();
        toast("Demo reset");
        render();
    });
    // Keeps the header count and any open drawer in sync with provisioning.
    store.subscribe(() => render());
}
