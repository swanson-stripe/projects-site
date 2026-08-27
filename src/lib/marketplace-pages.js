/**
 * HTML renderers for the /marketplace/ demo pages.
 *
 * Follows the same approach as lib/template-pages.js: pages are plain HTML
 * strings (inline SVG rather than WebC components) rendered by .11ty.js
 * templates, so the listing and the generated provider pages share markup.
 */

/*
 * The marketplace is published on provisioning.dev, not on the main site, and
 * projects.dev redirects /marketplace/* over to it. The layout derives canonical
 * and og:url from base.siteOrigin (projects.dev), which would therefore point at
 * a redirect — so every marketplace page overrides them with this origin.
 */
export const MARKETPLACE_ORIGIN = "https://provisioning.dev";

/**
 * The listing provisioning.dev serves at its root, per the redirect in
 * vercel.json. The wordmark points here rather than at "/" so that nothing in
 * the marketplace chrome links out to the main site.
 */
export const MARKETPLACE_HOME = "/marketplace/bold/";

export function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

const CATEGORY_LABELS = {
    ai: "AI",
    "ci-cd": "CI/CD",
    ci: "CI",
    cdn: "CDN",
    feature_flags: "Feature flags",
};

export function categoryLabel(category) {
    return CATEGORY_LABELS[category] ?? category.charAt(0).toUpperCase() + category.slice(1);
}

/* -------------------------------------------------------------------------- */
/* Primitives                                                                 */
/* -------------------------------------------------------------------------- */

const ICONS = {
    arrowRight:
        '<path fill-rule="evenodd" d="M5.47 3.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06L8.94 8 5.47 4.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>',
    check: '<path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"/>',
    search:
        '<path fill-rule="evenodd" d="M7 2.5a4.5 4.5 0 1 0 2.83 8L12.97 13.66a.75.75 0 1 0 1.06-1.06l-3.13-3.13A4.5 4.5 0 0 0 7 2.5Zm-3 4.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" clip-rule="evenodd"/>',
    copy: '<path d="M13 0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1.5v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5.25c0-.97.78-1.75 1.75-1.75a.75.75 0 0 1 0 1.5.25.25 0 0 0-.25.25V14c0 .28.22.5.5.5h6.5a.5.5 0 0 0 .5-.5v-1H6.5a2 2 0 0 1-2-2V2c0-1.1.9-2 2-2zM6.5 1.5A.5.5 0 0 0 6 2v9c0 .28.22.5.5.5H13a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5z"/>',
    close: '<path fill-rule="evenodd" d="M3.28 3.28a.75.75 0 0 1 1.06 0L8 6.94l3.66-3.66a.75.75 0 1 1 1.06 1.06L9.06 8l3.66 3.66a.75.75 0 1 1-1.06 1.06L8 9.06l-3.66 3.66a.75.75 0 1 1-1.06-1.06L6.94 8 3.28 4.34a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>',
    layers: '<path d="M8 1 1 4.5 8 8l7-3.5L8 1Z"/><path d="M1 8l7 3.5L15 8l-1.8-.9L8 9.7 2.8 7.1 1 8Z" opacity=".55"/><path d="M1 11.5 8 15l7-3.5-1.8-.9L8 13.2l-5.2-2.6-1.8.9Z" opacity=".3"/>',
    eye: '<path d="M8 3C4.5 3 1.7 5.4 1 8c.7 2.6 3.5 5 7 5s6.3-2.4 7-5c-.7-2.6-3.5-5-7-5Zm0 8.5A3.5 3.5 0 1 1 8 4.5a3.5 3.5 0 0 1 0 7Z"/><circle cx="8" cy="8" r="1.75"/>',
    eyeOff: '<path d="M2.28 1.22 1.22 2.28l2.2 2.2C2.3 5.35 1.42 6.58 1 8c.7 2.6 3.5 5 7 5 1.2 0 2.34-.28 3.34-.78l2.38 2.38 1.06-1.06-12.5-12.5ZM8 11.5a3.5 3.5 0 0 1-3.2-4.92l1.3 1.3A1.75 1.75 0 0 0 8.12 9.7l1.3 1.3c-.44.32-.96.5-1.42.5Z"/><path d="M8 3c-.7 0-1.38.09-2.02.26l1.3 1.3A3.5 3.5 0 0 1 11.44 9.7l1.63 1.63c.9-.9 1.55-1.98 1.93-3.33-.7-2.6-3.5-5-7-5Z" opacity=".5"/>',
    refresh:
        '<path fill-rule="evenodd" d="M8 3.5a4.5 4.5 0 0 0-4.24 3 .75.75 0 0 1-1.41-.5A6 6 0 0 1 13.5 6.2V4.75a.75.75 0 0 1 1.5 0V8a.75.75 0 0 1-.75.75h-3.25a.75.75 0 0 1 0-1.5h1.62A4.5 4.5 0 0 0 8 3.5Zm-6.25 4A.75.75 0 0 1 2.5 8.25h3.25a.75.75 0 0 1 0 1.5H4.13A4.5 4.5 0 0 0 12.24 9.5a.75.75 0 0 1 1.41.5A6 6 0 0 1 2.5 9.8v1.45a.75.75 0 0 1-1.5 0V8Z" clip-rule="evenodd"/>',
    trash: '<path d="M6.5 1a1 1 0 0 0-1 1v.5H3a.75.75 0 0 0 0 1.5h10a.75.75 0 0 0 0-1.5h-2.5V2a1 1 0 0 0-1-1h-3Z"/><path d="M4 5.5h8l-.6 8.07A1.5 1.5 0 0 1 9.9 15H6.1a1.5 1.5 0 0 1-1.5-1.43L4 5.5Z"/>',
    upgrade:
        '<path fill-rule="evenodd" d="M8 1.5a.75.75 0 0 1 .53.22l4 4a.75.75 0 1 1-1.06 1.06L8.75 4.06v9.19a.75.75 0 0 1-1.5 0V4.06L4.53 6.78a.75.75 0 1 1-1.06-1.06l4-4A.75.75 0 0 1 8 1.5Z" clip-rule="evenodd"/>',
    link: '<path d="M6.35 9.65a.75.75 0 0 1 0-1.06l2.24-2.24a.75.75 0 1 1 1.06 1.06L7.41 9.65a.75.75 0 0 1-1.06 0Z"/><path d="M9.3 3.4a2.75 2.75 0 0 1 3.89 3.89l-1.6 1.6a.75.75 0 0 1-1.06-1.06l1.6-1.6a1.25 1.25 0 0 0-1.77-1.77l-1.6 1.6A.75.75 0 0 1 7.7 5l1.6-1.6Zm-2.6 7.2a.75.75 0 0 1 0 1.06l-1.6 1.6a2.75 2.75 0 0 1-3.89-3.89l1.6-1.6A.75.75 0 0 1 3.87 8.83l-1.6 1.6a1.25 1.25 0 0 0 1.77 1.77l1.6-1.6a.75.75 0 0 1 1.06 0Z"/>',
};

export function icon(name, className = "w-14 h-14") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="${className} shrink-0" aria-hidden="true">${ICONS[name]}</svg>`;
}

/** Provider mark: SVG asset when we have one, initials disc otherwise. */
export function providerMark(provider, sizeClass = "w-24 h-24") {
    if (provider.iconUrl) {
        return `<img src="${escapeHtml(provider.iconUrl)}" alt="" class="${sizeClass} shrink-0 object-contain" loading="lazy">`;
    }
    return `<span class="${sizeClass} shrink-0 inline-flex items-center justify-center rounded-full bg-foreground border border-edge text-10 font-normal text-detail">${escapeHtml(provider.fallbackInitials)}</span>`;
}

export function pill(label, extra = "") {
    return `<span class="inline-flex items-center h-24 px-8 rounded-full bg-foreground border border-edge text-11 text-detail whitespace-nowrap ${extra}">${escapeHtml(label)}</span>`;
}

/** Free/paid dot, mirroring the CLI's pricing indicator. */
export function pricingDot(status) {
    const color = status === "free" ? "bg-success-400" : "bg-lemon-200";
    return `<span class="inline-block w-6 h-6 rounded-full ${color} shrink-0"></span>`;
}

/** True when anything about the provider can be had for nothing. */
function hasFreeTier(provider) {
    return (
        provider.plans.some((plan) => plan.status === "free")
        || provider.deployables.some((service) => service.status === "free")
    );
}

export function pricingLine(status, label) {
    return `<span class="inline-flex items-center gap-6 text-12 text-detail">${pricingDot(status)}<span>${escapeHtml(label)}</span></span>`;
}

/* -------------------------------------------------------------------------- */
/* Chrome                                                                     */
/* -------------------------------------------------------------------------- */

/** Treatment switch, shown only on the listing pages. */
function renderVariantToggle(variant) {
    if (!variant) return "";
    const item = (label, href, active) =>
        `<a href="${href}" class="inline-flex items-center h-24 px-10 rounded-full text-12 transition-colors duration-150 outline-none ${
            active ? "mkt-variant-active bg-headline text-highlight" : "text-detail hover:text-headline"
        }">${label}</a>`;

    return `<div class="flex items-center gap-2 p-2 rounded-full border border-edge bg-foreground shrink-0">
      ${item("Classic", "/marketplace/", variant === "classic")}
      ${item("Plaza", "/marketplace/bold/", variant === "bold")}
      ${item("Dark", "/marketplace/dark/", variant === "dark")}
      ${item("Dev", "/marketplace/dev/", variant === "dev")}
    </div>`;
}

function renderHeader({ backHref, backLabel, variant }) {
    // data-back-* let the provider pages retarget this at the variant you came from.
    const left = backHref
        ? `<a href="${escapeHtml(backHref)}" data-back-link class="flex items-center gap-6 text-14 font-normal text-primary hover:text-primary-hover transition-colors duration-200 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-14 h-14 rotate-180">${ICONS.arrowRight}</svg>
        <span data-back-label class="hidden sm:inline">${escapeHtml(backLabel)}</span>
      </a>`
        : "<div></div>";

    /*
     * The wordmark is absolutely centred on the viewport rather than living in a
     * grid cell, so neither the back link nor the right-hand controls can pull it
     * off centre. The demo badge is likewise absolute against the wordmark's
     * right edge — in flow it would shift the wordmark by half its width.
     */
    return `<header class="relative w-full flex items-center justify-center px-16 z-40">
    <div class="w-full max-w-1266 relative pt-24 pb-12 flex items-center justify-between gap-16">
      ${left}

      <div class="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center">
        <a href="${MARKETPLACE_HOME}" class="relative flex items-center justify-center h-40">
          <span class="text-16 font-normal text-headline whitespace-nowrap">Provisioning API</span>
        </a>
        <span class="absolute left-full ml-8">${renderDemoBadge()}</span>
      </div>

      <div class="flex items-center justify-end gap-8 ml-auto">
        ${renderVariantToggle(variant)}
        <button type="button" data-stack-open class="relative flex items-center gap-8 h-32 px-12 rounded-full border border-edge bg-foreground text-13 text-headline hover:bg-highlight transition-colors duration-150 cursor-pointer outline-none focus-visible:shadow-focus shrink-0">
          ${icon("layers", "w-14 h-14 text-detail")}
          <span class="hidden sm:inline">My stack</span>
          <span data-stack-count class="inline-flex items-center justify-center min-w-18 h-18 px-5 rounded-full bg-primary text-highlight text-11 leading-none">0</span>
        </button>
      </div>
    </div>
  </header>`;
}

function renderFooter(year) {
    return `<footer class="w-full flex items-center justify-center flex-col px-16">
    <div class="w-full max-w-1266 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-16 py-24 border-t border-edge">
      <p class="text-14/150 text-detail">Provisioning API · Marketplace demo · ${year}</p>
    </div>
  </footer>`;
}

/**
 * Quiet disclosure that nothing here reaches a real provider. Sits beside the
 * wordmark and reveals the full explanation on hover or keyboard focus, so the
 * disclaimer stays available without occupying a banner.
 */
function renderDemoBadge() {
    return `<span class="group relative shrink-0">
      <button type="button" aria-describedby="demo-note" class="inline-flex items-center gap-4 h-20 px-8 rounded-full border border-edge bg-foreground text-10 uppercase tracking-wider text-detail hover:text-headline hover:border-neutral-100 transition-colors duration-150 cursor-help outline-none focus-visible:shadow-focus">
        <span class="w-4 h-4 rounded-full bg-lemon-200"></span>
        <span>Demo</span>
      </button>
      <span id="demo-note" role="tooltip" class="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-8 w-300 p-12 rounded-6 bg-highlight border border-edge shadow-lg text-12/150 text-detail text-left normal-case tracking-normal opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-50">
        Mock marketplace UI for the provisioning API flows. Accounts, plans, resources, and credentials are simulated in your browser — nothing is provisioned and no provider is contacted.
      </span>
    </span>`;
}

/** Shared containers the flow JS renders into. Present on every page. */
function renderOverlays() {
    return `<!-- Modal root: provisioning flow steps render here -->
  <div data-modal-root class="fixed inset-0 z-90 hidden items-center justify-center px-16 py-24">
    <div data-modal-backdrop class="absolute inset-0 bg-neutral-990/45 backdrop-blur-[2px]" style="opacity:0"></div>
    <div data-modal-card role="dialog" aria-modal="true" class="relative w-full max-w-520 max-h-full overflow-y-auto no-scrollbar rounded-8 bg-highlight border border-edge shadow-lg" style="opacity:0"></div>
  </div>

  <!-- My stack drawer -->
  <div data-stack-root class="fixed inset-0 z-80 hidden">
    <div data-stack-backdrop class="absolute inset-0 bg-neutral-990/35" style="opacity:0"></div>
    <!-- No inline transform: GSAP would read it as a pixel base and never
         animate the panel back to 0. The root stays hidden until opened. -->
    <aside data-stack-panel class="absolute top-0 right-0 h-full w-full sm:w-480 bg-highlight border-l border-edge flex flex-col">
      <div class="flex items-center justify-between gap-16 px-20 py-16 border-b border-edge shrink-0">
        <div>
          <h2 class="text-16 font-normal text-headline">My stack</h2>
          <p data-stack-subtitle class="text-12 text-detail">Nothing provisioned yet</p>
        </div>
        <div class="flex items-center gap-6">
          <button type="button" data-stack-reset class="h-28 px-10 rounded-4 border border-edge text-12 text-detail hover:text-headline hover:bg-foreground transition-colors duration-150 cursor-pointer outline-none focus-visible:shadow-focus">Reset demo</button>
          <button type="button" data-stack-close aria-label="Close" class="w-28 h-28 inline-flex items-center justify-center rounded-4 text-detail hover:text-headline hover:bg-foreground transition-colors duration-150 cursor-pointer outline-none focus-visible:shadow-focus">${icon("close")}</button>
        </div>
      </div>
      <div data-stack-body class="flex-1 overflow-y-auto px-20 py-16"></div>
    </aside>
  </div>

  <!-- Toast -->
  <div data-toast class="fixed bottom-24 left-1/2 -translate-x-1/2 z-100 flex items-center gap-8 px-16 h-40 bg-headline text-highlight rounded-8 text-14 font-normal shadow-lg pointer-events-none" style="opacity:0;visibility:hidden;">
    <span data-toast-icon class="text-[#4ade80] flex">${icon("check")}</span>
    <span data-toast-label>Copied</span>
  </div>`;
}

function page({ head = "", body, year, backHref, backLabel, variant, theme = "" }) {
    // Theme classes (.mkt-dark, .mkt-devsite) re-point the semantic colour
    // tokens for the whole subtree, chrome and overlays included.
    return `<div class="relative w-full${theme ? ` ${theme}` : ""}">
  ${renderHeader({ backHref, backLabel, variant })}
  <main id="main">
    ${head}
    ${body}
  </main>
  ${renderFooter(year)}
  ${renderOverlays()}
  <script webc:keep type="module" src="/assets/js/marketplace/index.js"></script>
</div>`;
}

/* -------------------------------------------------------------------------- */
/* Listing                                                                    */
/* -------------------------------------------------------------------------- */

function serviceCountLabel(count, noun) {
    return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function renderTile(provider) {
    const categories = provider.categories
        .slice(0, 3)
        .map((category) => pill(categoryLabel(category)))
        .join("");
    const hasFree = hasFreeTier(provider);

    // Up to two real service slugs, then an overflow count.
    const slugChips = provider.deployables
        .slice(0, 2)
        .map((service) => `<span class="mkt-slug">${escapeHtml(service.ref)}</span>`)
        .join("");
    const overflow = provider.deployables.length - 2;
    const domain = provider.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

    const counts = `${serviceCountLabel(provider.deployables.length, "service")}${provider.plans.length ? ` · ${serviceCountLabel(provider.plans.length, "plan")}` : ""}`;

    /*
     * The whole tile links to the provider page via a stretched overlay anchor,
     * so the Provision button can sit above it without nesting a button inside
     * an anchor. Content is pointer-events-none so clicks fall through to the
     * overlay; the button opts back in.
     */
    return `<div
    data-tile
    data-slug="${escapeHtml(provider.slug)}"
    data-categories="${escapeHtml(provider.categories.join(" "))}"
    data-search="${escapeHtml(provider.searchText)}"
    data-name="${escapeHtml(provider.name.toLowerCase())}"
    data-services="${provider.deployables.length}"
    data-free="${hasFree ? "1" : "0"}"
    style="--brand:${escapeHtml(provider.brandColor)}"
    class="mkt-tile${provider.brandIsMono ? " mkt-tile-mono" : ""} group flex flex-col rounded-6 border border-edge bg-highlight transition-colors duration-150 focus-within:shadow-focus">

    <span class="mkt-glow" data-hover-follow aria-hidden="true"></span>
    <a href="${escapeHtml(provider.pageUrl)}" class="absolute inset-0 z-1 outline-none" aria-label="${escapeHtml(provider.name)}"></a>

    <!-- flex-1 so tiles in a row keep their footers on one line -->
    <div class="relative z-2 flex flex-1 flex-col gap-10 p-16 pointer-events-none">
      <div class="flex items-start justify-between gap-10">
        <div class="flex items-center gap-10 min-w-0">
          <span class="mkt-tile-mark w-32 h-32 rounded-6 flex items-center justify-center shrink-0">
            ${providerMark(provider, "w-18 h-18")}
          </span>
          <span class="min-w-0">
            <span class="block text-15 font-normal text-headline truncate leading-130">${escapeHtml(provider.name)}</span>
            ${domain ? `<span class="block text-11 text-disclaimer truncate">${escapeHtml(domain)}</span>` : ""}
          </span>
        </div>
        <span data-tile-badge class="hidden items-center gap-4 h-20 px-8 rounded-full bg-success-100 text-success-400 text-10 whitespace-nowrap shrink-0">${icon("check", "w-10 h-10")}<span data-tile-badge-label>Provisioned</span></span>
      </div>

      <p class="text-13/140 text-content line-clamp-2">${escapeHtml(provider.description)}</p>

      <div class="flex flex-wrap items-center gap-4">
        ${slugChips}
        ${overflow > 0 ? `<span class="text-10 text-disclaimer">+${overflow}</span>` : ""}
      </div>

      <div class="mt-auto flex flex-wrap items-center gap-4 pt-2">${categories}</div>
    </div>

    <div class="relative z-2 flex items-center justify-between gap-8 mx-16 py-10 border-t border-edge pointer-events-none">
      <span class="flex items-center gap-6 min-w-0">
        ${pricingDot(provider.entry.status)}
        <span data-tile-state class="text-11 text-detail truncate">${escapeHtml(provider.entry.label)}</span>
      </span>
      <span data-tile-counts class="text-11 text-disclaimer whitespace-nowrap transition-opacity duration-150 group-hover:opacity-0 group-focus-within:opacity-0">${escapeHtml(counts)}</span>
      <!-- Only clickable while visible, so it is not a phantom tap target on touch -->
      <button type="button" data-tile-provision="${escapeHtml(provider.slug)}"
        class="absolute right-0 inline-flex items-center gap-4 h-24 px-10 rounded-4 bg-headline text-highlight text-11 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-150 cursor-pointer outline-none focus-visible:shadow-focus">
        <span>Provision</span>
        ${icon("arrowRight", "w-10 h-10")}
      </button>
    </div>
  </div>`;
}

export function renderMarketplaceIndex(data) {
    const catalog = data.catalog;
    const year = data.base?.currentYear?.() ?? new Date().getFullYear();

    const categoryPills = [
        `<button type="button" data-category="all" class="mkt-pill mkt-pill-active">All</button>`,
        ...catalog.categories.map(
            (category) =>
                `<button type="button" data-category="${escapeHtml(category.id)}" class="mkt-pill">${escapeHtml(category.label)} <span class="opacity-60">${category.count}</span></button>`,
        ),
    ].join("");

    const head = `<section class="relative w-full flex items-center justify-center px-16">
    <div class="w-full max-w-1266 pt-24 sm:pt-40 pb-24">
      <h1 class="text-36/110 sm:text-48/110 tracking-tighter text-headline mb-8">Marketplace</h1>
      <p class="text-16 sm:text-18/150 text-content max-w-720">Provision accounts, plans, and resources from ${catalog.providerCount} providers — and get your credentials back — without leaving the page.</p>
      <div class="flex flex-wrap items-center gap-16 mt-20">
        <span class="text-13 text-detail">${catalog.providerCount} providers</span>
        <span class="w-1 h-12 bg-edge"></span>
        <span class="text-13 text-detail">${catalog.deployableCount} services</span>
        <span class="w-1 h-12 bg-edge"></span>
        <span class="text-13 text-detail">${catalog.serviceCount - catalog.deployableCount} plans</span>
      </div>
    </div>
  </section>`;

    const body = `<section class="relative w-full flex items-center justify-center px-16">
    <div class="w-full max-w-1266 pt-24 pb-64">

      <div class="flex flex-col gap-12 mb-20">
        <div class="flex flex-col sm:flex-row gap-12">
          <div class="relative w-full sm:w-320">
            <span class="absolute left-12 top-1/2 -translate-y-1/2 text-detail pointer-events-none">${icon("search")}</span>
            <input data-search type="search" placeholder="Search providers, services, categories…" class="w-full h-36 pl-32 pr-12 bg-highlight rounded-6 shadow-inset-border text-14 text-headline placeholder:text-detail outline-none focus:shadow-focus transition-shadow duration-200">
          </div>
          <div class="flex items-center gap-8">
            <label class="flex items-center gap-6 h-36 px-12 rounded-6 border border-edge text-13 text-content cursor-pointer hover:bg-foreground transition-colors duration-150">
              <input data-filter-free type="checkbox" class="accent-primary">
              <span>Free tier</span>
            </label>
            <label class="flex items-center gap-6 h-36 px-12 rounded-6 border border-edge text-13 text-content cursor-pointer hover:bg-foreground transition-colors duration-150">
              <input data-filter-provisioned type="checkbox" class="accent-primary">
              <span>In my stack</span>
            </label>
            <select data-sort class="h-36 px-10 rounded-6 border border-edge bg-highlight text-13 text-content outline-none focus:shadow-focus cursor-pointer">
              <option value="name">A–Z</option>
              <option value="services">Most services</option>
            </select>
          </div>
        </div>
        <div data-categories class="flex items-center gap-6 flex-wrap">${categoryPills}</div>
      </div>

      <p data-result-count class="text-12 text-detail mb-12"></p>

      <div data-grid class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        ${catalog.providers.map(renderTile).join("\n")}
      </div>

      <div data-empty class="hidden flex-col items-center justify-center gap-8 py-64 text-center">
        <p class="text-14 text-content">No providers match those filters.</p>
        <button type="button" data-clear-filters class="text-13 text-primary hover:text-primary-hover cursor-pointer outline-none">Clear filters</button>
      </div>

    </div>
  </section>`;

    return page({ head, body, year, variant: "classic" });
}

/* -------------------------------------------------------------------------- */
/* Listing — bold variant                                                     */
/* -------------------------------------------------------------------------- */

/*
 * The favicons are full-bleed app icons — an opaque background rect plus a
 * glyph — so a knockout filter flattens them into a solid square, and letting
 * them sit bare makes them vanish whenever the icon's backing matches the brand
 * it was sampled from. A light chip keeps every mark legible on any flood.
 */
function boldMark(provider) {
    const inner = provider.iconUrl
        ? `<img src="${escapeHtml(provider.iconUrl)}" alt="" loading="lazy" class="w-full h-full object-contain rounded-6">`
        : `<span class="w-full h-full flex items-center justify-center text-16 text-headline">${escapeHtml(provider.fallbackInitials)}</span>`;

    return `<span class="mkt-block-mark w-52 h-52 p-4 rounded-8 shrink-0 overflow-hidden">${inner}</span>`;
}

function renderBoldTile(provider) {
    const hasFree = hasFreeTier(provider);
    const primary = provider.deployables.length === 1
        ? provider.deployables[0].ref
        : `${provider.deployables.length} services`;

    /*
     * Same data hooks as the classic tile, so search, filtering, sorting, stack
     * badges, and tile-level provisioning all work without touching the JS.
     */
    return `<div
    data-tile
    data-slug="${escapeHtml(provider.slug)}"
    data-categories="${escapeHtml(provider.categories.join(" "))}"
    data-search="${escapeHtml(provider.searchText)}"
    data-name="${escapeHtml(provider.name.toLowerCase())}"
    data-services="${provider.deployables.length}"
    data-free="${hasFree ? "1" : "0"}"
    data-ink="${provider.brandInk === "dark" ? "dark" : "light"}"
    style="--brand:${escapeHtml(provider.brandColor)}"
    class="mkt-block${provider.brandIsPale ? " mkt-block-pale" : ""} group flex flex-col rounded-8 min-h-232">

    <!-- ?from carries the variant so the provider page can send you back here -->
    <a href="${escapeHtml(provider.pageUrl)}?from=bold" class="absolute inset-0 z-1 outline-none" aria-label="${escapeHtml(provider.name)}"></a>

    <div class="relative z-2 flex flex-1 flex-col p-18 pointer-events-none">
      <div class="flex items-start justify-between gap-10">
        ${boldMark(provider)}
        <span data-tile-badge class="hidden items-center gap-4 h-20 px-8 rounded-full mkt-block-chip text-10 whitespace-nowrap shrink-0">${icon("check", "w-10 h-10")}<span data-tile-badge-label>Provisioned</span></span>
      </div>

      <div class="mt-auto pt-16">
        <h3 class="text-22 leading-110 tracking-tight uppercase font-normal">${escapeHtml(provider.name)}</h3>
        <p class="mkt-block-dim text-12/140 mt-4 line-clamp-2">${escapeHtml(provider.description)}</p>
      </div>
    </div>

    <div class="relative z-2 mx-18 py-12 border-t mkt-block-rule flex items-center justify-between gap-8 pointer-events-none">
      <span class="flex flex-col min-w-0">
        <span class="font-mono text-11 truncate">${escapeHtml(primary)}</span>
        <span data-tile-state class="mkt-block-dim text-10 truncate">${escapeHtml(provider.entry.label)}</span>
      </span>
      <span data-tile-counts class="shrink-0 transition-opacity duration-150 group-hover:opacity-0 group-focus-within:opacity-0">
        ${icon("arrowRight", "w-14 h-14")}
      </span>
      <button type="button" data-tile-provision="${escapeHtml(provider.slug)}"
        class="absolute right-0 bottom-12 inline-flex items-center gap-4 h-26 px-10 rounded-4 mkt-block-btn text-11 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-150 cursor-pointer outline-none">
        <span>Provision</span>
        ${icon("arrowRight", "w-10 h-10")}
      </button>
    </div>
  </div>`;
}

export function renderMarketplaceBold(data) {
    const catalog = data.catalog;
    const year = data.base?.currentYear?.() ?? new Date().getFullYear();

    const categoryPills = [
        `<button type="button" data-category="all" class="mkt-pill mkt-pill-active">All</button>`,
        ...catalog.categories.map(
            (category) =>
                `<button type="button" data-category="${escapeHtml(category.id)}" class="mkt-pill">${escapeHtml(category.label)} <span class="opacity-60">${category.count}</span></button>`,
        ),
    ].join("");

    // Colour strip previewing the palette the grid is built from.
    const strip = catalog.providers
        .map((provider) => `<span class="flex-1 h-6" style="background:${escapeHtml(provider.brandColor)}"></span>`)
        .join("");

    const head = `<section class="relative w-full flex items-center justify-center px-16">
    <div class="w-full max-w-1266 pt-24 sm:pt-40 pb-20">
      <h1 class="text-48/100 sm:text-72/90 tracking-tighter uppercase text-headline">Provisioning Plaza</h1>
      <p class="text-16 sm:text-20/140 text-content max-w-620 mt-12">${catalog.deployableCount} services. ${catalog.serviceCount - catalog.deployableCount} plans. ${catalog.providerCount} providers, each in its own colour.</p>
      <div class="flex mt-24 rounded-full overflow-hidden">${strip}</div>
    </div>
  </section>`;

    const body = `<section class="relative w-full flex items-center justify-center px-16">
    <div class="w-full max-w-1266 pt-24 pb-64">

      <div class="flex flex-col gap-12 mb-20">
        <div class="flex flex-col sm:flex-row gap-12">
          <div class="relative w-full sm:w-320">
            <span class="absolute left-12 top-1/2 -translate-y-1/2 text-detail pointer-events-none">${icon("search")}</span>
            <input data-search type="search" placeholder="Search providers, services, categories…" class="w-full h-40 pl-32 pr-12 bg-highlight rounded-6 shadow-inset-border text-14 text-headline placeholder:text-detail outline-none focus:shadow-focus transition-shadow duration-200">
          </div>
          <div class="flex items-center gap-8">
            <label class="flex items-center gap-6 h-40 px-12 rounded-6 border border-edge text-13 text-content cursor-pointer hover:bg-foreground transition-colors duration-150">
              <input data-filter-free type="checkbox" class="accent-primary">
              <span>Free tier</span>
            </label>
            <label class="flex items-center gap-6 h-40 px-12 rounded-6 border border-edge text-13 text-content cursor-pointer hover:bg-foreground transition-colors duration-150">
              <input data-filter-provisioned type="checkbox" class="accent-primary">
              <span>In my stack</span>
            </label>
            <select data-sort class="h-40 px-10 rounded-6 border border-edge bg-highlight text-13 text-content outline-none focus:shadow-focus cursor-pointer">
              <option value="name">A–Z</option>
              <option value="services">Most services</option>
            </select>
          </div>
        </div>
        <div data-categories class="flex items-center gap-6 flex-wrap">${categoryPills}</div>
      </div>

      <p data-result-count class="text-12 text-detail mb-12"></p>

      <div data-grid class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        ${catalog.providers.map(renderBoldTile).join("\n")}
      </div>

      <div data-empty class="hidden flex-col items-center justify-center gap-8 py-64 text-center">
        <p class="text-14 text-content">No providers match those filters.</p>
        <button type="button" data-clear-filters class="text-13 text-primary hover:text-primary-hover cursor-pointer outline-none">Clear filters</button>
      </div>

    </div>
  </section>`;

    return page({ head, body, year, variant: "bold" });
}

/* -------------------------------------------------------------------------- */
/* Listing — dark variant                                                     */
/* -------------------------------------------------------------------------- */

function renderGlassTile(provider) {
    const hasFree = hasFreeTier(provider);
    const primary = provider.deployables.length === 1
        ? provider.deployables[0].ref
        : `${provider.deployables.length} services`;

    // On a dark surface a monochrome brand has no glow to give, so those tiles
    // borrow the page's ink instead of rendering an invisible near-black edge.
    const accent = provider.brandIsMono ? "#8fa3c8" : provider.brandColor;

    return `<div
    data-tile
    data-slug="${escapeHtml(provider.slug)}"
    data-categories="${escapeHtml(provider.categories.join(" "))}"
    data-search="${escapeHtml(provider.searchText)}"
    data-name="${escapeHtml(provider.name.toLowerCase())}"
    data-services="${provider.deployables.length}"
    data-free="${hasFree ? "1" : "0"}"
    style="--brand:${escapeHtml(accent)}"
    class="mkt-glass group flex flex-col rounded-8 min-h-200">

    <a href="${escapeHtml(provider.pageUrl)}?from=dark" class="absolute inset-0 z-1 outline-none" aria-label="${escapeHtml(provider.name)}"></a>

    <div class="relative z-2 flex flex-1 flex-col gap-10 p-16 pointer-events-none">
      <div class="flex items-start justify-between gap-10">
        <span class="mkt-glass-mark w-40 h-40 rounded-8 flex items-center justify-center shrink-0 p-6">
          ${providerMark(provider, "w-24 h-24")}
        </span>
        <span data-tile-badge class="hidden items-center gap-4 h-20 px-8 rounded-full mkt-glass-slug text-10 whitespace-nowrap shrink-0">${icon("check", "w-10 h-10")}<span data-tile-badge-label>Provisioned</span></span>
      </div>

      <div class="mt-auto">
        <h3 class="text-16 leading-130 text-headline">${escapeHtml(provider.name)}</h3>
        <p class="text-12/140 text-detail mt-4 line-clamp-2">${escapeHtml(provider.description)}</p>
      </div>
    </div>

    <div class="relative z-2 mx-16 py-10 border-t border-edge flex items-center justify-between gap-8 pointer-events-none">
      <span class="flex items-center gap-6 min-w-0">
        ${pricingDot(provider.entry.status)}
        <span data-tile-state class="text-11 text-detail truncate">${escapeHtml(provider.entry.label)}</span>
      </span>
      <span data-tile-counts class="mkt-glass-slug inline-flex items-center h-20 px-6 rounded-4 text-10 text-content whitespace-nowrap transition-opacity duration-150 group-hover:opacity-0 group-focus-within:opacity-0">${escapeHtml(primary)}</span>
      <button type="button" data-tile-provision="${escapeHtml(provider.slug)}"
        class="absolute right-0 bottom-8 inline-flex items-center gap-4 h-24 px-10 rounded-4 bg-headline text-highlight text-11 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-150 cursor-pointer outline-none">
        <span>Provision</span>
        ${icon("arrowRight", "w-10 h-10")}
      </button>
    </div>
  </div>`;
}

export function renderMarketplaceDark(data) {
    const catalog = data.catalog;
    const year = data.base?.currentYear?.() ?? new Date().getFullYear();

    const categoryPills = [
        `<button type="button" data-category="all" class="mkt-pill mkt-pill-active">All</button>`,
        ...catalog.categories.map(
            (category) =>
                `<button type="button" data-category="${escapeHtml(category.id)}" class="mkt-pill">${escapeHtml(category.label)} <span class="opacity-60">${category.count}</span></button>`,
        ),
    ].join("");

    const head = `<section class="relative w-full flex items-center justify-center px-16">
    <div class="w-full max-w-1266 relative pt-24 sm:pt-32 pb-24">
      <!-- Bloom-wave shader behind the hero, with a still fallback underneath -->
      <div class="relative w-full h-260 sm:h-300 rounded-8 overflow-hidden border border-edge">
        <div class="absolute inset-0 pointer-events-none">
          <div data-js-target="nouveau-bloom-wave" class="relative w-full h-full"
            data-position-x="500" data-position-y="120" data-blur="0" data-camera-zoom="1.6"
            data-wave-rotation="-85" data-color-offset="0" data-dither-gradient="2"
            data-dither-scale="3" data-dither-full="true"></div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-highlight via-highlight/70 to-transparent"></div>
        <div class="relative h-full flex flex-col justify-end p-20 sm:p-28">
          <h1 class="text-40/100 sm:text-56/100 tracking-tighter text-headline">Marketplace</h1>
          <p class="text-14 sm:text-16/150 text-content max-w-620 mt-8">${catalog.deployableCount} services and ${catalog.serviceCount - catalog.deployableCount} plans across ${catalog.providerCount} providers. Provision, then take your credentials.</p>
        </div>
      </div>
    </div>
  </section>`;

    const body = `<section class="relative w-full flex items-center justify-center px-16">
    <div class="w-full max-w-1266 pb-64">

      <div class="flex flex-col gap-12 mb-20">
        <div class="flex flex-col sm:flex-row gap-12">
          <div class="relative w-full sm:w-320">
            <span class="absolute left-12 top-1/2 -translate-y-1/2 text-detail pointer-events-none">${icon("search")}</span>
            <input data-search type="search" placeholder="Search providers, services, categories…" class="w-full h-36 pl-32 pr-12 bg-foreground rounded-6 border border-edge text-14 text-headline placeholder:text-disclaimer outline-none focus:shadow-focus transition-shadow duration-200">
          </div>
          <div class="flex items-center gap-8">
            <label class="flex items-center gap-6 h-36 px-12 rounded-6 border border-edge text-13 text-content cursor-pointer hover:bg-foreground transition-colors duration-150">
              <input data-filter-free type="checkbox" class="accent-primary">
              <span>Free tier</span>
            </label>
            <label class="flex items-center gap-6 h-36 px-12 rounded-6 border border-edge text-13 text-content cursor-pointer hover:bg-foreground transition-colors duration-150">
              <input data-filter-provisioned type="checkbox" class="accent-primary">
              <span>In my stack</span>
            </label>
            <select data-sort class="h-36 px-10 rounded-6 border border-edge bg-foreground text-13 text-content outline-none focus:shadow-focus cursor-pointer">
              <option value="name">A–Z</option>
              <option value="services">Most services</option>
            </select>
          </div>
        </div>
        <div data-categories class="flex items-center gap-6 flex-wrap">${categoryPills}</div>
      </div>

      <p data-result-count class="text-12 text-detail mb-12"></p>

      <div data-grid class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        ${catalog.providers.map(renderGlassTile).join("\n")}
      </div>

      <div data-empty class="hidden flex-col items-center justify-center gap-8 py-64 text-center">
        <p class="text-14 text-content">No providers match those filters.</p>
        <button type="button" data-clear-filters class="text-13 text-primary hover:text-primary-hover cursor-pointer outline-none">Clear filters</button>
      </div>

    </div>
  </section>`;

    return page({ head, body, year, variant: "dark", theme: "mkt-dark" });
}

/* -------------------------------------------------------------------------- */
/* Listing — dev variant (stripe.dev treatment)                               */
/* -------------------------------------------------------------------------- */

/*
 * stripe.dev's feed is a table, not a grid: `/Date /Name /Type` column labels
 * over a hairline, one row per item, the title swiped with a lime highlighter on
 * hover. This variant borrows that whole apparatus — mono uppercase labels,
 * dotted tag chips, plus-mark dividers, a statistics marquee, `[ Fig. n ]`
 * window chrome — and keeps every data hook the other listings use, so the
 * filtering, sorting, badge painting, and provisioning JS is untouched.
 */

/** A `/LABEL` column header, mono uppercase with a dimmed slash. */
function devColumnLabel(label, extra = "") {
    return `<span class="mkt-dev-label flex items-center gap-4 ${extra}"><span class="text-disclaimer">/</span>${escapeHtml(label)}</span>`;
}

/** Row of plus marks the site uses to break sections apart. */
function devPlusRule(count) {
    const plus = `<svg viewBox="0 0 10 10" class="w-8 h-8" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 0v10M0 5h10"/></svg>`;
    return `<div class="mkt-dev-plus flex items-center justify-between" aria-hidden="true">${plus.repeat(count)}</div>`;
}

/**
 * Statistics marquee. The set is emitted three times and the track slides by
 * exactly one third, so the loop is seamless; only the first copy is exposed to
 * assistive tech.
 */
function devTicker(items) {
    const set = (hidden) =>
        `<div class="flex items-center shrink-0"${hidden ? ' aria-hidden="true"' : ""}>${items
            .map(
                (item) =>
                    `<span class="mkt-dev-label flex items-center gap-6 px-16 whitespace-nowrap"><span class="text-detail">${escapeHtml(item.label)}</span><span class="mkt-dev-tag mkt-dev-label">${escapeHtml(item.value)}</span></span>`,
            )
            .join("")}</div>`;

    return `<div class="mkt-dev-ticker mt-24 py-10">
    <div class="mkt-dev-ticker-track flex items-center">${set(false)}${set(true)}${set(true)}</div>
  </div>`;
}

/**
 * Decorative line-art figure in window chrome, standing in for the generative
 * art panels on stripe.dev. Deterministic so the build output stays stable.
 */
function devFigure() {
    const rings = Array.from({ length: 20 }, (_, index) => {
        const t = index / 19;
        const rx = (18 + t * 122).toFixed(1);
        const ry = (10 + t * 58).toFixed(1);
        const angle = (-20 + index * 4.5).toFixed(1);
        const lime = index === 13;
        return `<ellipse cx="150" cy="78" rx="${rx}" ry="${ry}" transform="rotate(${angle} 150 78)" fill="none" stroke="${
            lime ? "var(--dev-lime)" : "currentColor"
        }" stroke-width="${lime ? "1.6" : "0.7"}" opacity="${lime ? "1" : (0.16 + t * 0.44).toFixed(2)}"/>`;
    }).join("");

    return `<figure class="mkt-dev-frame hidden md:block rounded-2 px-10 pt-4 pb-10">
    <div class="mkt-dev-chrome">
      <span class="mkt-dev-dragline"></span>
      <figcaption class="mkt-dev-fig text-detail">[ Fig. 1 ]</figcaption>
      <span class="mkt-dev-dragline"></span>
    </div>
    <svg viewBox="0 0 300 156" class="w-full h-auto text-headline" aria-hidden="true">${rings}</svg>
  </figure>`;
}

function renderDevRow(provider) {
    const hasFree = hasFreeTier(provider);
    const primary = provider.deployables.length === 1
        ? provider.deployables[0].ref
        : `${provider.deployables.length} services`;
    const tags = provider.categories
        .slice(0, 2)
        .map((category) => `<span class="mkt-dev-tag mkt-dev-label">${escapeHtml(categoryLabel(category))}</span>`)
        .join("");
    const overflow = provider.categories.length - 2;
    const domain = provider.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

    /*
     * Same stretched-anchor trick as the other listings: the row is covered by a
     * link, its contents opt out of pointer events, and the Provision button
     * opts back in so it can sit above the anchor without nesting inside it.
     */
    return `<div
    data-tile
    data-slug="${escapeHtml(provider.slug)}"
    data-categories="${escapeHtml(provider.categories.join(" "))}"
    data-search="${escapeHtml(provider.searchText)}"
    data-name="${escapeHtml(provider.name.toLowerCase())}"
    data-services="${provider.deployables.length}"
    data-free="${hasFree ? "1" : "0"}"
    style="--brand:${escapeHtml(provider.brandColor)}"
    class="mkt-dev-row mkt-dev-cols group">

    <!-- ?from carries the variant so the provider page can send you back here -->
    <a href="${escapeHtml(provider.pageUrl)}?from=dev" class="absolute inset-0 z-1 outline-none focus-visible:shadow-focus" aria-label="${escapeHtml(provider.name)}"></a>

    <div class="relative z-2 flex items-center gap-10 min-w-0 pointer-events-none">
      <span class="mkt-dev-square"></span>
      <span class="min-w-0">
        <span class="flex items-baseline gap-8 min-w-0">
          <span class="mkt-dev-mark text-20/100 md:text-22/100 font-light tracking-tight truncate">${escapeHtml(provider.name)}</span>
          <!-- The dotted chip is spelled out in utilities rather than reusing
               .mkt-dev-tag: that class sets display, which would win over the
               "hidden" class the badge painter toggles. -->
          <span data-tile-badge class="hidden items-center gap-4 shrink-0 px-5 py-2 rounded-3 border border-dotted border-edge mkt-dev-fig text-detail">${icon("check", "w-8 h-8")}<span data-tile-badge-label>Provisioned</span></span>
        </span>
        <span class="hidden sm:block text-12/140 text-detail truncate mt-4">${escapeHtml(provider.description)}</span>
      </span>
    </div>

    <div class="relative z-2 mkt-dev-label text-content truncate pointer-events-none">${escapeHtml(primary)}</div>

    <div class="relative z-2 mkt-dev-label truncate pointer-events-none">
      <span data-tile-state class="text-detail">${escapeHtml(provider.entry.label)}</span>
    </div>

    <div class="relative z-2 flex items-center gap-4 min-w-0 pointer-events-none">
      ${tags}
      ${overflow > 0 ? `<span class="mkt-dev-fig text-disclaimer">+${overflow}</span>` : ""}
    </div>

    <div class="relative z-2 hidden md:flex items-center justify-end">
      <span data-tile-counts class="text-detail transition-opacity duration-150 group-hover:opacity-0 group-focus-within:opacity-0" title="${escapeHtml(domain)}">${icon("arrowRight", "w-12 h-12")}</span>
      <!-- Only clickable while visible, so it is not a phantom tap target -->
      <button type="button" data-tile-provision="${escapeHtml(provider.slug)}"
        class="mkt-dev-btn mkt-dev-btn-fill mkt-dev-label absolute right-0 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-150">
        <span>Provision</span>
      </button>
    </div>
  </div>`;
}

export function renderMarketplaceDevsite(data) {
    const catalog = data.catalog;
    const year = data.base?.currentYear?.() ?? new Date().getFullYear();
    const planCount = catalog.serviceCount - catalog.deployableCount;
    const freeCount = catalog.providers.filter(hasFreeTier).length;

    /*
     * The listing JS toggles .mkt-pill-active on whichever category is selected,
     * so these carry that class name even though the rest of their styling comes
     * from .mkt-dev-tag.
     */
    const categoryFilters = [
        `<button type="button" data-category="all" class="mkt-dev-tag mkt-dev-label mkt-pill-active">All <span class="opacity-60">${catalog.providerCount}</span></button>`,
        ...catalog.categories.map(
            (category) =>
                `<button type="button" data-category="${escapeHtml(category.id)}" class="mkt-dev-tag mkt-dev-label">${escapeHtml(category.label)} <span class="opacity-60">${category.count}</span></button>`,
        ),
    ].join("");

    const head = `<section class="relative w-full flex items-center justify-center px-16">
    <div class="w-full max-w-1266 pt-12 pb-16">
      ${devPlusRule(9)}
      <div class="pt-24 pb-28">
        <p class="mkt-dev-label text-detail flex items-center gap-4 mb-20"><span class="text-disclaimer">/</span>Provisioning API</p>
        <h1 class="mkt-dev-hero text-headline">Provisioning<br>Plaza<span class="mkt-dev-hero-dot">.dev</span></h1>
        <p class="mkt-dev-lede text-content max-w-720 mt-24">${catalog.deployableCount} services and ${planCount} plans across ${catalog.providerCount} providers. Link an account, accept the terms, pick a plan, take your credentials.</p>
      </div>
      ${devPlusRule(9)}
      ${devTicker([
          { label: "Providers", value: String(catalog.providerCount) },
          { label: "Services", value: String(catalog.deployableCount) },
          { label: "Plans", value: String(planCount) },
          { label: "Categories", value: String(catalog.categories.length) },
          { label: "Free to start", value: String(freeCount) },
      ])}
    </div>
  </section>`;

    const body = `<section class="relative w-full flex items-center justify-center px-16">
    <div class="w-full max-w-1266 pt-32 pb-64">
      <div class="grid grid-cols-1 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] gap-32 md:gap-40">

        <aside class="flex flex-col gap-28 self-start md:sticky md:top-16">
          <div>
            <div class="mkt-dev-thead flex items-center justify-between gap-8">
              ${devColumnLabel("Filter")}
              <button type="button" data-clear-filters class="mkt-dev-label text-detail hover:text-headline transition-colors duration-150 cursor-pointer outline-none">Clear</button>
            </div>
            <div class="pt-16 flex flex-col gap-14">
              <input data-search type="search" placeholder="Search…" class="mkt-dev-field w-full text-headline">
              <label class="flex items-center gap-8 cursor-pointer">
                <input data-filter-free type="checkbox">
                <span class="mkt-dev-label text-content">Free tier <span class="opacity-60">${freeCount}</span></span>
              </label>
              <label class="flex items-center gap-8 cursor-pointer">
                <input data-filter-provisioned type="checkbox">
                <span class="mkt-dev-label text-content">In my stack</span>
              </label>
            </div>
          </div>

          <div>
            <div class="mkt-dev-thead">${devColumnLabel("Sort")}</div>
            <div class="pt-14">
              <select data-sort class="mkt-dev-select w-full text-content">
                <option value="name">A–Z</option>
                <option value="services">Most services</option>
              </select>
            </div>
          </div>

          <div>
            <div class="mkt-dev-thead">${devColumnLabel("Category")}</div>
            <div data-categories class="pt-14 flex flex-wrap gap-4">${categoryFilters}</div>
          </div>

          ${devFigure()}
        </aside>

        <div>
          <div class="flex items-baseline justify-between gap-16 mb-16">
            <h2 class="mkt-dev-title text-headline">Directory<sup class="mkt-dev-sup text-detail">(${catalog.providerCount})</sup></h2>
            <p data-result-count class="mkt-dev-label text-detail"></p>
          </div>

          <div class="mkt-dev-thead mkt-dev-cols">
            ${devColumnLabel("Provider")}
            ${devColumnLabel("Services", "hidden md:flex")}
            ${devColumnLabel("Entry", "hidden md:flex")}
            ${devColumnLabel("Categories", "hidden md:flex")}
            <span class="hidden md:block"></span>
          </div>

          <div data-grid>
            ${catalog.providers.map(renderDevRow).join("\n")}
          </div>

          <div data-empty class="hidden flex-col items-center justify-center gap-8 py-64 text-center">
            <p class="mkt-dev-label text-content">No providers match those filters.</p>
            <button type="button" data-clear-filters class="mkt-dev-btn mkt-dev-label text-headline">Clear filters</button>
          </div>
        </div>

      </div>
    </div>
  </section>`;

    return page({ head, body, year, variant: "dev", theme: "mkt-devsite" });
}

/* -------------------------------------------------------------------------- */
/* Provider detail                                                            */
/* -------------------------------------------------------------------------- */

function selectionModeNote(service) {
    if (service.selectionMode === "component") {
        return `Requires a plan · ${service.planOptions.length} available`;
    }
    if (service.selectionMode === "tiered") {
        return `${service.tiers.length} pricing options`;
    }
    return "No plan required";
}

function renderServiceRow(provider, service) {
    return `<div data-service="${escapeHtml(service.serviceId)}" class="flex flex-col gap-12 p-16 rounded-6 border border-edge bg-highlight">
    <div class="flex items-start justify-between gap-16">
      <div class="min-w-0">
        <div class="flex items-center gap-8 flex-wrap">
          <span class="font-mono text-13 text-headline">${escapeHtml(service.ref)}</span>
          ${pill(service.scope === "account" ? "Account scope" : "Project scope")}
          <span data-service-badge class="hidden items-center gap-4 h-20 px-8 rounded-full bg-success-100 text-success-400 text-10 whitespace-nowrap">${icon("check", "w-10 h-10")}<span data-service-badge-label>Provisioned</span></span>
        </div>
        <p class="text-13/140 text-content mt-6">${escapeHtml(service.description || "No description available.")}</p>
        <div class="flex items-center gap-10 mt-8 flex-wrap">
          ${pricingLine(service.status, service.price)}
          <span class="text-12 text-detail">·</span>
          <span class="text-12 text-detail">${escapeHtml(selectionModeNote(service))}</span>
        </div>
      </div>
      <button type="button" data-provision="${escapeHtml(service.serviceId)}" class="shrink-0 inline-flex items-center gap-6 h-32 px-12 rounded-4 bg-headline text-highlight text-13 font-normal hover:opacity-85 transition-all duration-200 cursor-pointer outline-none focus-visible:shadow-focus">
        <span>Provision</span>
        ${icon("arrowRight", "w-12 h-12")}
      </button>
    </div>
    <div class="flex items-center gap-8 pt-10 border-t border-edge">
      <span class="text-11 text-detail">Env vars <span class="font-mono text-content">${escapeHtml(service.envPrefix)}_*</span></span>
    </div>
  </div>`;
}

function renderPlanRow(plan) {
    return `<div class="flex items-start justify-between gap-16 p-14 rounded-6 border border-edge bg-highlight">
    <div class="min-w-0">
      <div class="flex items-center gap-8 flex-wrap">
        <span class="font-mono text-13 text-headline">${escapeHtml(plan.ref)}</span>
        <span data-plan-badge="${escapeHtml(plan.serviceId)}" class="hidden items-center gap-4 h-20 px-8 rounded-full bg-success-100 text-success-400 text-10 whitespace-nowrap">${icon("check", "w-10 h-10")}<span>Active</span></span>
      </div>
      <p class="text-12/140 text-content mt-4">${escapeHtml(plan.description || "No description available.")}</p>
    </div>
    <div class="shrink-0 text-right max-w-200">${pricingLine(plan.status, plan.price)}</div>
  </div>`;
}

export function renderMarketplaceProvider(data) {
    const provider = data.marketplaceProvider;
    const year = data.base?.currentYear?.() ?? new Date().getFullYear();

    const categories = provider.categories.map((category) => pill(categoryLabel(category))).join("");

    const head = `<section class="relative w-full flex items-center justify-center px-16">
    <div class="w-full max-w-1266 pt-24 sm:pt-32 pb-8">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-16">
        <div class="flex items-start gap-14 min-w-0">
          ${providerMark(provider, "w-40 h-40")}
          <div class="min-w-0">
            <h1 class="text-28/120 sm:text-36/110 tracking-tight text-headline">${escapeHtml(provider.name)}</h1>
            <p class="text-14/150 text-content mt-6 max-w-720">${escapeHtml(provider.description)}</p>
            <div class="flex items-center gap-6 flex-wrap mt-10">${categories}</div>
          </div>
        </div>
        <div class="flex flex-col items-start sm:items-end gap-8 shrink-0">
          <button type="button" data-open-picker class="inline-flex items-center gap-6 h-36 px-14 rounded-4 bg-primary text-highlight text-13 font-normal hover:bg-primary-hover transition-colors duration-200 cursor-pointer outline-none focus-visible:shadow-focus">
            <span>Provision a service</span>
            ${icon("arrowRight", "w-12 h-12")}
          </button>
          <div data-account-status class="flex items-center gap-6 h-28 px-10 rounded-full border border-edge bg-foreground text-12 text-detail">
            ${icon("link", "w-12 h-12")}
            <span data-account-status-label>Account not linked</span>
          </div>
          ${
              provider.url
                  ? `<a href="${escapeHtml(provider.url)}" target="_blank" rel="noopener" class="flex items-center gap-4 text-12 text-primary hover:text-primary-hover transition-colors duration-150">
            <span>${escapeHtml(provider.url.replace(/^https?:\/\//, ""))}</span>
            ${icon("arrowRight", "w-10 h-10")}
          </a>`
                  : ""
          }
        </div>
      </div>
    </div>
  </section>`;

    const body = `<section class="relative w-full flex items-center justify-center px-16">
    <div class="w-full max-w-1266 pt-16 pb-64 flex flex-col gap-32">

      <div>
        <div class="flex items-baseline justify-between gap-16 mb-12">
          <h2 class="text-18 font-normal text-headline">Services</h2>
          <span class="text-12 text-detail">Resources you can provision into a project</span>
        </div>
        <div class="flex flex-col gap-10">
          ${provider.deployables.map((service) => renderServiceRow(provider, service)).join("\n")}
        </div>
      </div>

      ${
          provider.plans.length
              ? `<div>
        <div class="flex items-baseline justify-between gap-16 mb-12">
          <h2 class="text-18 font-normal text-headline">Plans</h2>
          <span class="text-12 text-detail">Entitlements that carry pricing and limits for a service</span>
        </div>
        <div class="flex flex-col gap-8">
          ${provider.plans.map(renderPlanRow).join("\n")}
        </div>
      </div>`
              : ""
      }

    </div>
  </section>`;

    /*
     * Only this provider's slice of the catalog is inlined — the full catalog is
     * far too large to ship on every page. Tier `configuration` is dropped: it is
     * an empty object for every service in the catalog and nothing renders it, so
     * shipping it would put dead weight in the page source.
     */
    const payload = `<script webc:keep type="application/json" data-marketplace-provider>${JSON.stringify(
        provider,
        (key, value) => (key === "configuration" ? undefined : value),
    ).replaceAll("<", "\\u003c")}</script>`;

    return payload + page({ head, body, year, backHref: "/marketplace/", backLabel: "Marketplace" });
}
