/**
 * The provisioning flow, step for step against the CLI:
 *
 *   service selection   →  `stripe projects add <provider>` service picker
 *   plan / pricing      →  companion plan or pricing-configuration prompt
 *   review + terms      →  confirmation card, then "Accept and provision?"
 *   provisioning        →  the progress tree
 *   credentials         →  `stripe projects env` with values revealed
 */

import * as api from "./api.js";
import * as store from "./store.js";
import { bindCredentialList, renderCredentialList, resourceEnvBlock } from "./credentials.js";
import {
    cardRows,
    closeModal,
    copyText,
    createProgressTree,
    escapeHtml,
    modalFooter,
    modalHeader,
    openModal,
    primaryButton,
    secondaryButton,
    toast,
} from "./ui.js";

const html = String.raw;

function dot(status) {
    return `<span class="inline-block w-6 h-6 rounded-full ${status === "free" ? "bg-success-400" : "bg-lemon-200"} shrink-0"></span>`;
}

function pricing(status, label) {
    return `<span class="inline-flex items-center gap-6">${dot(status)}<span>${escapeHtml(label)}</span></span>`;
}

function providerMark(provider, sizeClass = "w-20 h-20") {
    if (provider.iconUrl) {
        return `<img src="${escapeHtml(provider.iconUrl)}" alt="" class="${sizeClass} shrink-0 object-contain">`;
    }
    return `<span class="${sizeClass} shrink-0 inline-flex items-center justify-center rounded-full bg-foreground border border-edge text-10 text-detail">${escapeHtml(provider.fallbackInitials)}</span>`;
}

/** Recovery guidance per error code. */
const RECOVERY = {
    TOS_NOT_ACCEPTED: "Terms acceptance is required before an account can be created.",
    PLAN_REQUIRED: "Provision the plan listed above first, then retry the service.",
    PROVIDER_NOT_LINKED: "Link the provider account, then retry.",
    UNKNOWN_ERROR: "Retry. If the failure repeats, the provider may be unavailable.",
};

/* -------------------------------------------------------------------------- */
/* Step 1 — service selection                                                 */
/* -------------------------------------------------------------------------- */

/** The picker `stripe projects add <provider>` shows when no service is named. */
export function openServicePicker(provider) {
    const rows = provider.deployables
        .map((service) => {
            const provisioned = store.hasResource(provider.slug, service.serviceId);
            return html`<button type="button" data-pick="${escapeHtml(service.serviceId)}" class="w-full flex items-start justify-between gap-12 px-12 py-10 rounded-6 border border-edge bg-highlight hover:bg-foreground hover:border-neutral-100 transition-all duration-150 text-left cursor-pointer outline-none focus-visible:shadow-focus">
                <span class="min-w-0">
                    <span class="flex items-center gap-8 flex-wrap">
                        <span class="font-mono text-12 text-headline">${escapeHtml(service.ref)}</span>
                        ${provisioned ? `<span class="text-10 text-success-400">in stack</span>` : ""}
                    </span>
                    <span class="block text-11/140 text-detail mt-3 line-clamp-2">${escapeHtml(service.description || "No description available.")}</span>
                </span>
                <span class="shrink-0 text-11 text-detail text-right max-w-160">${pricing(service.status, service.price)}</span>
            </button>`;
        })
        .join("");

    const card = openModal(
        modalHeader({
            eyebrow: provider.name,
            title: "Select a service",
            subtitle: `${provider.deployables.length} service${provider.deployables.length === 1 ? "" : "s"} available to provision`,
        }) +
            html`<div class="px-20 py-16">
                <input data-picker-search data-autofocus type="search" placeholder="Filter services…" class="w-full h-32 px-12 mb-10 bg-highlight rounded-6 shadow-inset-border text-13 text-headline placeholder:text-detail outline-none focus:shadow-focus transition-shadow duration-200">
                <div data-picker-list class="flex flex-col gap-6 max-h-320 overflow-y-auto no-scrollbar">${rows}</div>
            </div>` +
            modalFooter("", secondaryButton("Cancel", "data-modal-close")),
    );
    if (!card) return;

    const search = card.querySelector("[data-picker-search]");
    search?.addEventListener("input", () => {
        const query = search.value.toLowerCase().trim();
        card.querySelectorAll("[data-pick]").forEach((button) => {
            button.style.display = !query || button.textContent.toLowerCase().includes(query) ? "" : "none";
        });
    });

    card.querySelectorAll("[data-pick]").forEach((button) => {
        button.addEventListener("click", () => {
            const service = provider.deployables.find((item) => item.serviceId === button.dataset.pick);
            if (service) startProvisioning(provider, service);
        });
    });
}

/* -------------------------------------------------------------------------- */
/* Entry                                                                      */
/* -------------------------------------------------------------------------- */

export function startProvisioning(provider, service) {
    if (service.selectionMode === "component") return openPlanStep(provider, service);
    if (service.selectionMode === "tiered") return openTierStep(provider, service);
    return openReviewStep(provider, service, { plan: null, tier: null });
}

/* -------------------------------------------------------------------------- */
/* Step 2a — companion plan                                                   */
/* -------------------------------------------------------------------------- */

/**
 * A component-priced deployable needs a plan first. The CLI resolves this from
 * the deployable's parent_services and provisions the plan ahead of the
 * resource; picking it here is the same decision, made up front.
 */
function openPlanStep(provider, service) {
    const activePlan = store.getProviderPlan(provider.slug);
    const options = service.planOptions.map((option) => {
        const plan = provider.plans.find((item) => item.serviceId === option.planServiceId);
        return {
            ...option,
            ref: plan?.ref ?? `${provider.slug}/${option.planServiceId}`,
            description: plan?.description ?? "",
            plan,
            isActive: activePlan?.planServiceId === option.planServiceId,
        };
    });

    // Preselect what is already on the project, else the free option, else first.
    const preselected =
        options.find((option) => option.isActive) ??
        options.find((option) => option.status === "free") ??
        options[0];

    const rows = options
        .map(
            (option) => html`<label class="flex items-start gap-10 p-12 rounded-6 border ${option.planServiceId === preselected.planServiceId ? "border-primary bg-brand-25" : "border-edge bg-highlight"} hover:border-neutral-100 transition-colors duration-150 cursor-pointer" data-plan-row="${escapeHtml(option.planServiceId)}">
                <input type="radio" name="plan" value="${escapeHtml(option.planServiceId)}" ${option.planServiceId === preselected.planServiceId ? "checked" : ""} class="mt-3 accent-primary shrink-0">
                <span class="min-w-0 flex-1">
                    <span class="flex items-center gap-8 flex-wrap">
                        <span class="font-mono text-12 text-headline">${escapeHtml(option.ref)}</span>
                        ${option.isActive ? `<span class="inline-flex items-center h-18 px-6 rounded-full bg-success-100 text-success-400 text-10">Already provisioned</span>` : ""}
                    </span>
                    ${option.description ? `<span class="block text-11/140 text-detail mt-3">${escapeHtml(option.description)}</span>` : ""}
                    <span class="flex items-center gap-6 text-11 text-detail mt-5">${pricing(option.status, option.price)}</span>
                </span>
            </label>`,
        )
        .join("");

    const card = openModal(
        modalHeader({
            eyebrow: `${provider.name} · ${service.ref}`,
            title: "Select a plan",
            subtitle: "This service is priced by its plan. The plan is provisioned first, then the resource attaches to it.",
            step: "Step 1 of 3",
        }) +
            html`<div class="px-20 py-16 flex flex-col gap-8 max-h-360 overflow-y-auto no-scrollbar">${rows}</div>` +
            modalFooter(
                `<span class="text-11 text-detail">Plans can be changed later from My stack</span>`,
                secondaryButton("Cancel", "data-modal-close") + primaryButton("Continue", "data-plan-continue data-autofocus"),
            ),
    );
    if (!card) return;

    card.querySelectorAll("[data-plan-row]").forEach((label) => {
        label.addEventListener("click", () => {
            card.querySelectorAll("[data-plan-row]").forEach((other) => {
                other.className = other.className.replace("border-primary bg-brand-25", "border-edge bg-highlight");
            });
            label.className = label.className.replace("border-edge bg-highlight", "border-primary bg-brand-25");
        });
    });

    card.querySelector("[data-plan-continue]")?.addEventListener("click", () => {
        const selected = card.querySelector('input[name="plan"]:checked')?.value;
        const option = options.find((item) => item.planServiceId === selected) ?? preselected;
        openReviewStep(provider, service, { plan: option, tier: null });
    });
}

/* -------------------------------------------------------------------------- */
/* Step 2b — pricing configuration                                            */
/* -------------------------------------------------------------------------- */

/** The CLI's pricing-configuration picker for inline-priced deployables. */
function openTierStep(provider, service) {
    const preselected = service.tiers.find((tier) => tier.isDefault) ?? service.tiers[0];

    const rows = service.tiers
        .map(
            (tier) => html`<label class="flex items-start gap-10 p-12 rounded-6 border ${tier.id === preselected.id ? "border-primary bg-brand-25" : "border-edge bg-highlight"} hover:border-neutral-100 transition-colors duration-150 cursor-pointer" data-tier-row="${escapeHtml(tier.id)}">
                <input type="radio" name="tier" value="${escapeHtml(tier.id)}" ${tier.id === preselected.id ? "checked" : ""} class="mt-3 accent-primary shrink-0">
                <span class="min-w-0 flex-1">
                    <span class="flex items-center gap-8 flex-wrap">
                        <span class="text-12 text-headline capitalize">${escapeHtml(tier.label)}</span>
                        ${tier.isDefault ? `<span class="text-10 text-detail">default</span>` : ""}
                    </span>
                    ${tier.description ? `<span class="block text-11/140 text-detail mt-3">${escapeHtml(tier.description)}</span>` : ""}
                    <span class="flex items-center gap-6 text-11 text-detail mt-5">${pricing(tier.status, tier.price)}</span>
                </span>
            </label>`,
        )
        .join("");

    const card = openModal(
        modalHeader({
            eyebrow: `${provider.name} · ${service.ref}`,
            title: "Select pricing configuration",
            subtitle: "This service carries its own pricing options.",
            step: "Step 1 of 3",
        }) +
            html`<div class="px-20 py-16 flex flex-col gap-8 max-h-360 overflow-y-auto no-scrollbar">${rows}</div>` +
            modalFooter("", secondaryButton("Cancel", "data-modal-close") + primaryButton("Continue", "data-tier-continue data-autofocus")),
    );
    if (!card) return;

    card.querySelectorAll("[data-tier-row]").forEach((label) => {
        label.addEventListener("click", () => {
            card.querySelectorAll("[data-tier-row]").forEach((other) => {
                other.className = other.className.replace("border-primary bg-brand-25", "border-edge bg-highlight");
            });
            label.className = label.className.replace("border-edge bg-highlight", "border-primary bg-brand-25");
        });
    });

    card.querySelector("[data-tier-continue]")?.addEventListener("click", () => {
        const selected = card.querySelector('input[name="tier"]:checked')?.value;
        const tier = service.tiers.find((item) => item.id === selected) ?? preselected;
        openReviewStep(provider, service, { plan: null, tier });
    });
}

/* -------------------------------------------------------------------------- */
/* Step 3 — review, terms acceptance                                          */
/* -------------------------------------------------------------------------- */

/**
 * The confirmation card, with the same rows the CLI prints. When the provider is
 * not yet linked the confirmation *is* the terms prompt — the CLI collapses the
 * two into a single "Accept and provision?" so the card is never confirmed twice.
 */
function openReviewStep(provider, service, { plan, tier }) {
    const state = store.getState();
    const linked = store.isProviderLinked(provider.slug);
    const isPaid = (tier?.status ?? plan?.status ?? service.status) === "paid";
    const billing = state.billing;

    const rows = [
        { label: "Provider", value: `<span class="text-primary">${escapeHtml(provider.name)}</span>` },
        null,
        { label: "Service", value: `<span class="font-mono text-primary">${escapeHtml(service.ref)}</span>` },
        { label: "Description", value: escapeHtml(service.description || "No description available.") },
    ];

    if (tier) {
        rows.push({ label: "Pricing", value: pricing(tier.status, tier.price) });
    } else if (service.status !== "free" && !plan) {
        rows.push({ label: "Pricing", value: pricing(service.status, service.price) });
    }

    if (plan) {
        rows.push(null);
        rows.push({ label: "Plan", value: `<span class="font-mono text-primary">${escapeHtml(plan.ref)}</span>` });
        if (plan.description) rows.push({ label: "Description", value: escapeHtml(plan.description) });
        rows.push({ label: "Pricing", value: pricing(plan.status, plan.price) });
    }

    if (isPaid && billing) {
        rows.push(null);
        rows.push({
            label: "Billing",
            value: `${escapeHtml(billing.brand)} •••• ${escapeHtml(billing.last4)} · exp ${billing.expMonth}/${String(billing.expYear).slice(-2)}`,
        });
    }

    const tosBlock = linked
        ? ""
        : html`<div class="px-20 pb-16">
            <div class="p-12 rounded-6 border border-edge bg-foreground">
                <p class="text-12/150 text-content">
                    By proceeding, you accept the
                    <a href="${escapeHtml(provider.tosUrl)}" target="_blank" rel="noopener" class="font-normal text-primary hover:text-primary-hover underline">${escapeHtml(provider.name)} Terms of Service</a>,
                    <a href="${escapeHtml(provider.privacyUrl)}" target="_blank" rel="noopener" class="font-normal text-primary hover:text-primary-hover underline">Privacy Policy</a>,
                    and agree to share your name, email, country, and phone number with ${escapeHtml(provider.name)} to provision and manage your resources.
                </p>
                <p class="text-12 text-detail mt-8">Accepting as <span class="text-headline">${escapeHtml(state.identity.email)}</span></p>
            </div>
            <label class="flex items-center gap-8 mt-10 cursor-pointer">
                <input data-accept-tos type="checkbox" class="accent-primary">
                <span class="text-12 text-content">I accept these terms</span>
            </label>
        </div>`;

    const card = openModal(
        modalHeader({
            eyebrow: linked ? "Review" : `Link ${provider.name} account`,
            title: linked ? "Provision this service" : `Accept terms and link ${provider.name}`,
            subtitle: linked
                ? "The resource is created in your provider account and credentials are synced to your project."
                : "A provider account is created on your behalf, then the resource is provisioned into it.",
            step: "Step 2 of 3",
        }) +
            html`<div class="px-20 py-16">
                <div class="flex items-center gap-8 mb-12">
                    ${providerMark(provider)}
                    <span class="font-mono text-13 text-headline">${escapeHtml(service.ref)}</span>
                </div>
                ${cardRows(rows)}
                <div class="mt-14 pt-12 border-t border-edge">
                    <label class="block text-11 text-detail mb-4" for="mkt-resource-name">Resource name <span class="text-disclaimer">— sets the env var prefix</span></label>
                    <input id="mkt-resource-name" data-resource-name type="text" value="${escapeHtml(service.defaultResourceName)}" class="w-full h-32 px-10 bg-highlight rounded-6 shadow-inset-border font-mono text-12 text-headline outline-none focus:shadow-focus transition-shadow duration-200">
                    <p class="text-11 text-disclaimer mt-4 font-mono" data-env-preview></p>
                </div>
            </div>
            ${tosBlock}` +
            modalFooter(
                "",
                secondaryButton("Cancel", "data-modal-close") +
                    primaryButton(linked ? "Provision" : "Accept and provision", `data-confirm ${linked ? "" : "disabled"}`),
            ),
    );
    if (!card) return;

    const nameInput = card.querySelector("[data-resource-name]");
    const preview = card.querySelector("[data-env-preview]");
    const confirmButton = card.querySelector("[data-confirm]");

    const envToken = (value) =>
        String(value).toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");

    function paintPreview() {
        const name = nameInput.value.trim() || service.defaultResourceName;
        preview.textContent = `${envToken(provider.slug)}_${envToken(name)}_${service.credentialKeys[0]}`;
        confirmButton.disabled = !nameInput.value.trim() || (!linked && !card.querySelector("[data-accept-tos]")?.checked);
    }
    paintPreview();
    nameInput.addEventListener("input", paintPreview);
    card.querySelector("[data-accept-tos]")?.addEventListener("change", paintPreview);

    confirmButton.addEventListener("click", () => {
        runProvisioning(provider, service, {
            plan,
            tier,
            resourceName: nameInput.value.trim() || service.defaultResourceName,
            acceptedTos: linked || card.querySelector("[data-accept-tos]")?.checked === true,
        });
    });
}

/* -------------------------------------------------------------------------- */
/* Step 4 — provisioning                                                      */
/* -------------------------------------------------------------------------- */

async function runProvisioning(provider, service, { plan, tier, resourceName, acceptedTos }) {
    const needsLink = !store.isProviderLinked(provider.slug);
    const existingPlan = plan ? store.findPlan(provider.slug, plan.planServiceId) : null;

    // Mirrors the CLI's tree: account link and companion plan appear as extra
    // steps ahead of the four resource steps.
    const steps = [];
    if (needsLink) {
        steps.push({ label: `Linking ${provider.name} account`, completedLabel: `${provider.name} account linked` });
    }
    if (plan) {
        steps.push(
            existingPlan
                ? { label: `${plan.ref} already provisioned`, completedLabel: `${plan.ref} already provisioned` }
                : { label: `Provisioning ${plan.ref}`, completedLabel: `${plan.ref} provisioned` },
        );
    }
    steps.push(
        { label: "Requesting resource", completedLabel: "Resource requested" },
        { label: "Waiting for provisioning", completedLabel: "Resource provisioned" },
        { label: "Syncing credentials", completedLabel: "Credentials synced" },
        { label: "Updating project configuration", completedLabel: "Project updated" },
    );

    const card = openModal(
        modalHeader({
            eyebrow: provider.name,
            title: `Provisioning ${service.ref}`,
            subtitle: "This usually takes a few seconds.",
            closable: false,
            step: "Step 3 of 3",
        }) + html`<div data-tree class="px-20 py-18"></div>`,
        { dismissible: false },
    );
    if (!card) return;

    const tree = createProgressTree(card.querySelector("[data-tree]"), steps);
    tree.start();

    try {
        if (needsLink) {
            await api.linkProvider(provider, { acceptedTos });
            tree.advance();
        }
        if (plan) {
            const planService = provider.plans.find((item) => item.serviceId === plan.planServiceId);
            await api.provisionPlan(provider, planService ?? { ...plan, serviceId: plan.planServiceId, updateableTo: [] });
            tree.advance();
        }

        const resource = await api.provisionResource(provider, service, {
            planServiceId: plan?.planServiceId ?? null,
            tier,
            resourceName,
            onStep: () => tree.advance(),
        });
        tree.finish();

        // Let the last check land before swapping the step out.
        await new Promise((resolve) => setTimeout(resolve, 450));
        openSuccessStep(provider, service, resource);
    } catch (error) {
        tree.destroy();
        openErrorStep(provider, service, error, { plan, tier, resourceName });
    }
}

/* -------------------------------------------------------------------------- */
/* Step 5 — credentials                                                       */
/* -------------------------------------------------------------------------- */

function openSuccessStep(provider, service, resource) {
    const summary = [
        { label: "Provider", value: escapeHtml(provider.name) },
        { label: "Service", value: `<span class="font-mono">${escapeHtml(resource.ref)}</span>` },
        { label: "Resource", value: `<span class="font-mono">${escapeHtml(resource.name)}</span>` },
    ];
    if (resource.planRef) {
        summary.push({ label: "Plan", value: `<span class="font-mono">${escapeHtml(resource.planRef)}</span> ${pricing(resource.planStatus ?? "free", resource.planPrice ?? "Free")}` });
    }
    if (resource.tier) {
        summary.push({ label: "Tier", value: `<span class="capitalize">${escapeHtml(resource.tier.label)}</span> ${pricing(resource.tier.status, resource.tier.price)}` });
    }
    summary.push({ label: "Env vars", value: `<span class="font-mono text-11">${resource.credentials.map((credential) => escapeHtml(credential.envKey)).join("<br>")}</span>` });

    const card = openModal(
        modalHeader({
            eyebrow: "Provisioned",
            title: `${service.ref} is ready`,
            subtitle: `Credentials are synced to <span class="font-mono text-content">.env</span> in ${escapeHtml(store.getState().project.name)}.`,
        }) +
            html`<div class="px-20 py-16">
                ${cardRows(summary)}
                <div class="flex items-center justify-between gap-8 mt-16 mb-8">
                    <h3 class="text-12 text-detail uppercase tracking-wider">Credentials</h3>
                    <button type="button" data-copy-env class="flex items-center gap-4 text-11 text-primary hover:text-primary-hover cursor-pointer outline-none">Copy as .env</button>
                </div>
                ${renderCredentialList(resource.credentials)}
                <p class="text-11/150 text-disclaimer mt-8">Values are hidden by default. Reveal to copy an individual value.</p>
            </div>` +
            modalFooter(
                `<span class="text-11 text-detail">Manage this resource from My stack</span>`,
                secondaryButton("Provision another", "data-another") + primaryButton("Done", "data-modal-close data-autofocus"),
            ),
    );
    if (!card) return;

    bindCredentialList(card, resource.credentials);
    card.querySelector("[data-copy-env]")?.addEventListener("click", () => {
        copyText(resourceEnvBlock(resource), "Copied .env block");
    });
    card.querySelector("[data-another]")?.addEventListener("click", () => openServicePicker(provider));
    toast(`${resource.ref} provisioned`);
}

/* -------------------------------------------------------------------------- */
/* Failure                                                                    */
/* -------------------------------------------------------------------------- */

function openErrorStep(provider, service, error, context) {
    const code = error?.code ?? "UNKNOWN_ERROR";
    const card = openModal(
        modalHeader({
            eyebrow: provider.name,
            title: "Provisioning stopped",
            subtitle: `Error code <span class="font-mono text-content">${escapeHtml(code)}</span>`,
        }) +
            html`<div class="px-20 py-16">
                <div class="p-12 rounded-6 border border-edge bg-foreground">
                    <p class="text-13/150 text-headline">${escapeHtml(error?.message ?? "Unexpected failure.")}</p>
                    <p class="text-12/150 text-detail mt-6">${escapeHtml(RECOVERY[code] ?? RECOVERY.UNKNOWN_ERROR)}</p>
                </div>
            </div>` +
            modalFooter(
                "",
                secondaryButton("Close", "data-modal-close") + primaryButton("Back to review", "data-retry data-autofocus"),
            ),
    );
    if (!card) return;

    card.querySelector("[data-retry]")?.addEventListener("click", () => {
        openReviewStep(provider, service, { plan: context.plan, tier: context.tier });
    });
}
