function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderLogo(item, sizeClass = "w-16 h-16") {
  if (item.iconUrl) {
    return `<img src="${escapeHtml(item.iconUrl)}" alt="" class="${sizeClass} shrink-0 object-contain" loading="lazy">`;
  }

  return `<span class="${sizeClass} shrink-0 inline-flex items-center justify-center rounded-full bg-highlight text-[10px] font-medium text-detail">${escapeHtml(item.fallbackInitials)}</span>`;
}

function renderMetaPill(label) {
  return `<span class="inline-flex items-center h-28 px-10 rounded-full bg-highlight text-12 text-detail whitespace-nowrap">${escapeHtml(label)}</span>`;
}

function renderServiceBadge(service) {
  return `<span class="inline-flex items-center gap-6 px-10 h-32 rounded-full border border-edge bg-highlight text-12 text-content whitespace-nowrap">${renderLogo(service, "w-14 h-14")}<span>${escapeHtml(service.slug)}</span></span>`;
}

function renderLinkButton(href, label) {
  return `<a href="${escapeHtml(href)}" class="inline-flex items-center gap-6 px-12 h-36 rounded-4 border border-edge text-13 text-primary hover:text-primary-hover hover:bg-highlight transition-all duration-200 outline-none">
    <span>${escapeHtml(label)}</span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-14 h-14"><path fill-rule="evenodd" d="M5.47 3.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06L8.94 8 5.47 4.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>
  </a>`;
}

function renderCopyButton(command, label = "Copy command") {
  return `<button type="button" data-copy-command="${escapeHtml(command)}" data-copy-label="${escapeHtml(label)}" class="inline-flex items-center gap-6 px-12 h-36 rounded-4 bg-headline text-highlight text-13 font-normal hover:opacity-85 focus-visible:shadow-focus transition-all duration-200 outline-none cursor-pointer">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-14 h-14 shrink-0">
      <path d="M13 0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1.5v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5.25c0-.97.78-1.75 1.75-1.75a.75.75 0 0 1 0 1.5.25.25 0 0 0-.25.25V14c0 .28.22.5.5.5h6.5a.5.5 0 0 0 .5-.5v-1H6.5a2 2 0 0 1-2-2V2c0-1.1.9-2 2-2zM6.5 1.5A.5.5 0 0 0 6 2v9c0 .28.22.5.5.5H13a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5z"/>
    </svg>
    <span>${escapeHtml(label)}</span>
  </button>`;
}

function renderHeader({ backHref, backLabel, rightHref, rightLabel }) {
  const left = backHref
    ? `<a href="${escapeHtml(backHref)}" class="flex items-center gap-6 text-14 font-normal text-primary hover:text-primary-hover transition-colors duration-200 group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-14 h-14 rotate-180"><path fill-rule="evenodd" d="M5.47 3.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06L8.94 8 5.47 4.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>
        <span>${escapeHtml(backLabel)}</span>
      </a>`
    : "<div></div>";
  const right = rightHref
    ? `<a href="${escapeHtml(rightHref)}" class="hidden sm:flex items-center justify-end gap-6 text-14 font-normal text-primary hover:text-primary-hover transition-colors duration-200 group">
        <span>${escapeHtml(rightLabel)}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-14 h-14"><path fill-rule="evenodd" d="M5.47 3.47a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06L8.94 8 5.47 4.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>
      </a>`
    : "<div></div>";

  return `<header class="relative w-full flex items-center justify-center px-16 z-50">
    <div class="w-full max-w-1266 relative pt-24 pb-12 grid grid-cols-3 items-center">
      ${left}
      <a href="/" class="relative flex items-center justify-center h-40 gap-4">
        <div class="relative flex items-center gap-8 h-full px-10 whitespace-nowrap">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="h-[1em] w-auto text-headline shrink-0">
            <path d="M15.8074 0L0.195312 3.31818V16L15.8074 12.6818V0Z"></path>
          </svg>
          <span class="text-16 font-normal text-headline">Stripe Projects</span>
        </div>
      </a>
      ${right}
    </div>
  </header>`;
}

function renderFooter() {
  return `<footer class="w-full flex items-center justify-center flex-col px-16">
    <div class="w-full max-w-1266 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-16 py-24 border-t border-edge">
      <p class="text-14/150 text-detail">© ${new Date().getFullYear()} Stripe</p>
      <div class="flex flex-col sm:flex-row sm:items-center gap-16 sm:gap-24">
        <a href="https://stripe.com/privacy" class="text-14/150 font-normal text-primary hover:text-primary-hover transition-colors duration-250 outline-none">Privacy &amp; Terms</a>
        <a href="https://stripe.com" class="text-14/150 font-normal text-primary hover:text-primary-hover transition-colors duration-250 outline-none">Go to Stripe</a>
      </div>
    </div>
  </footer>`;
}

function renderCopySupport() {
  return `<div data-copy-toast class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-16 h-40 bg-headline text-highlight rounded-8 text-14 font-normal shadow-lg pointer-events-none" style="opacity:0;visibility:hidden;">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-14 h-14 text-[#4ade80] shrink-0"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"/></svg>
    <span data-copy-toast-label>Command copied</span>
  </div>
  <script webc:keep>
  (function templateCopySetup() {
    const toast = document.querySelector('[data-copy-toast]');
    const label = document.querySelector('[data-copy-toast-label]');
    if (!toast || !label || !navigator.clipboard) return;
    let timeoutId;

    function showToast(message) {
      label.textContent = message;
      toast.style.opacity = '1';
      toast.style.visibility = 'visible';
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.visibility = 'hidden';
      }, 1600);
    }

    document.querySelectorAll('[data-copy-command]').forEach((button) => {
      button.addEventListener('click', async () => {
        const command = button.getAttribute('data-copy-command');
        if (!command) return;
        try {
          await navigator.clipboard.writeText(command);
          showToast(button.getAttribute('data-copy-label') || 'Command copied');
        } catch {}
      });
    });
  })();
  </script>`;
}

export function renderTemplatesIndex(templates) {
  const cards = templates.families
    .map((family) => {
      const services = family.services.slice(0, 6);
      const extraServices = family.services.length - services.length;

      return `<article class="rounded-12 border border-edge bg-foreground p-20 sm:p-24 flex flex-col gap-16">
        <div class="flex items-start justify-between gap-16">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-8 mb-8">
              <span class="text-12 uppercase tracking-wider text-detail">${escapeHtml(family.owner)}</span>
              ${renderMetaPill(family.categoryLabel)}
              ${renderMetaPill(family.frameworkLabel)}
            </div>
            <h2 class="text-22/120 tracking-[-0.02em] text-headline mb-8">${escapeHtml(family.name)}</h2>
            <p class="text-15/150 text-content">${escapeHtml(family.description)}</p>
          </div>
          ${renderMetaPill(`${family.variantCount} variant${family.variantCount === 1 ? "" : "s"}`)}
        </div>

        <div class="flex flex-wrap gap-8">
          ${services.map(renderServiceBadge).join("")}
          ${extraServices > 0 ? renderMetaPill(`+${extraServices} more`) : ""}
        </div>

        <div class="rounded-8 bg-highlight border border-edge p-14">
          <p class="text-12 uppercase tracking-wider text-detail mb-8">Default command</p>
          <code class="block font-mono text-13 leading-150 text-content break-all">${escapeHtml(family.buildCommand)}</code>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-10 pt-4">
          <p class="text-13 text-detail">${escapeHtml(family.variantDescription || "Browse variants and providers")}</p>
          <div class="flex items-center gap-8">
            ${renderCopyButton(family.buildCommand)}
            ${renderLinkButton(family.url, "View template")}
          </div>
        </div>
      </article>`;
    })
    .join("");

  return `<div class="relative w-full">
    ${renderHeader({ backHref: "/", backLabel: "Home", rightHref: templates.registryUrl, rightLabel: "Registry repo" })}

    <main id="main">
      <section class="relative z-10 flex items-center justify-center px-16">
        <div class="w-full max-w-1266 pt-24 sm:pt-48 pb-24">
          <div class="max-w-768">
            <h1 class="text-36/110 sm:text-48/110 tracking-tighter text-headline mb-12">Templates</h1>
            <p class="text-16 sm:text-18/150 text-content mb-20">Browse every starter currently published in the public Stripe Projects template registry. Each template page shows its variants, included services, and the exact <code>stripe projects build</code> command to run.</p>
            <div class="flex flex-wrap items-center gap-8">
              ${renderMetaPill(`${templates.families.length} families`)}
              ${renderMetaPill(`${templates.variants.length} variants`)}
              <a href="${escapeHtml(templates.registryUrl)}" class="text-14 font-normal text-primary hover:text-primary-hover transition-colors duration-200">View public registry</a>
            </div>
          </div>
        </div>
      </section>

      <section class="relative z-10 flex items-center justify-center px-16 pb-64">
        <div class="w-full max-w-1266 grid gap-16 lg:grid-cols-2">
          ${cards}
        </div>
      </section>
    </main>

    ${renderFooter()}
    ${renderCopySupport()}
  </div>`;
}

export function renderTemplateFamilyPage(family) {
  const variants = family.variants
    .map((variant) => {
      const services = variant.services.map(renderServiceBadge).join("");
      const nextSteps = variant.nextSteps.length
        ? `<div class="flex flex-col gap-8">
            <p class="text-12 uppercase tracking-wider text-detail">Next steps</p>
            ${variant.nextSteps
              .map(
                (step) => `<div class="rounded-6 bg-highlight border border-edge p-12">
                  <p class="text-13 font-medium text-headline mb-6">${escapeHtml(step.label)}</p>
                  <code class="block font-mono text-12 leading-150 text-content break-all">${escapeHtml(step.command)}</code>
                </div>`,
              )
              .join("")}
          </div>`
        : "";

      return `<article class="rounded-12 border border-edge bg-foreground p-20 sm:p-24 flex flex-col gap-16">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-12">
          <div>
            <div class="flex flex-wrap items-center gap-8 mb-8">
              ${variant.isDefault ? renderMetaPill("Default") : ""}
              ${renderMetaPill(variant.variantId)}
            </div>
            <h2 class="text-22/120 tracking-[-0.02em] text-headline mb-8">${escapeHtml(variant.variantDescription || variant.variantId)}</h2>
            <p class="text-14 text-detail">Template selector: <code>${escapeHtml(variant.fullTemplateId)}</code></p>
          </div>
          ${renderCopyButton(variant.buildCommand)}
        </div>

        <div class="rounded-8 bg-highlight border border-edge p-14">
          <p class="text-12 uppercase tracking-wider text-detail mb-8">Build command</p>
          <code class="block font-mono text-13 leading-150 text-content break-all">${escapeHtml(variant.buildCommand)}</code>
        </div>

        <div class="flex flex-wrap gap-8">
          ${services}
        </div>

        <div class="grid gap-12 lg:grid-cols-2">
          <div class="rounded-8 border border-edge p-14">
            <p class="text-12 uppercase tracking-wider text-detail mb-8">Source</p>
            <p class="text-14 text-content mb-6"><a href="${escapeHtml(variant.repoUrl)}" class="text-primary hover:text-primary-hover transition-colors duration-200">${escapeHtml(variant.repoRootUrl)}</a></p>
            <p class="text-13 text-detail">Pinned ref: <code>${escapeHtml(variant.ref || "Unpinned")}</code></p>
          </div>
          <div class="rounded-8 border border-edge p-14">
            <p class="text-12 uppercase tracking-wider text-detail mb-8">Setup</p>
            <p class="text-13 text-content mb-6">Install command</p>
            <code class="block font-mono text-12 leading-150 text-content break-all">${escapeHtml(variant.installCommand)}</code>
          </div>
        </div>

        ${nextSteps}

        <div class="flex items-center justify-end gap-8 pt-4">
          ${renderLinkButton(variant.url, "Open variant page")}
        </div>
      </article>`;
    })
    .join("");

  const tags = family.tags.length ? `<div class="flex flex-wrap gap-8">${family.tags.map(renderMetaPill).join("")}</div>` : "";

  return `<div class="relative w-full">
    ${renderHeader({ backHref: "/templates/", backLabel: "All templates", rightHref: family.defaultVariant.repoUrl, rightLabel: "Source repo" })}

    <main id="main">
      <section class="relative z-10 flex items-center justify-center px-16">
        <div class="w-full max-w-896 pt-24 sm:pt-48 pb-24">
          <div class="flex flex-wrap items-center gap-8 mb-12">
            ${renderMetaPill(family.owner)}
            ${renderMetaPill(family.categoryLabel)}
            ${renderMetaPill(family.frameworkLabel)}
            ${renderMetaPill(`${family.variantCount} variant${family.variantCount === 1 ? "" : "s"}`)}
          </div>

          <h1 class="text-36/110 sm:text-48/110 tracking-tighter text-headline mb-12">${escapeHtml(family.name)}</h1>
          <p class="text-16 sm:text-18/150 text-content mb-20 max-w-768">${escapeHtml(family.description)}</p>

          <div class="flex flex-wrap gap-8 mb-20">
            ${family.services.map(renderServiceBadge).join("")}
          </div>

          ${tags}

          <div class="mt-24 rounded-12 border border-edge bg-foreground p-20 flex flex-col gap-14">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12">
              <div>
                <p class="text-12 uppercase tracking-wider text-detail mb-8">Default build command</p>
                <code class="block font-mono text-13 leading-150 text-content break-all">${escapeHtml(family.buildCommand)}</code>
              </div>
              ${renderCopyButton(family.buildCommand)}
            </div>
            <p class="text-13 text-detail">This uses the registry’s default variant for <code>${escapeHtml(family.templateId)}</code>. Use the variant-specific commands below to target a particular stack.</p>
          </div>
        </div>
      </section>

      <section class="relative z-10 flex items-center justify-center px-16 pb-64">
        <div class="w-full max-w-896 flex flex-col gap-16">
          ${variants}
        </div>
      </section>
    </main>

    ${renderFooter()}
    ${renderCopySupport()}
  </div>`;
}

export function renderTemplateVariantPage(variant) {
  const nextSteps = variant.nextSteps.length
    ? `<section class="rounded-12 border border-edge bg-foreground p-20 sm:p-24">
        <p class="text-12 uppercase tracking-wider text-detail mb-12">Next steps</p>
        <div class="grid gap-10">
          ${variant.nextSteps
            .map(
              (step) => `<div class="rounded-8 bg-highlight border border-edge p-14">
                <p class="text-13 font-medium text-headline mb-6">${escapeHtml(step.label)}</p>
                <code class="block font-mono text-12 leading-150 text-content break-all">${escapeHtml(step.command)}</code>
              </div>`,
            )
            .join("")}
        </div>
      </section>`
    : "";

  const siblingVariants = variant.siblingVariants.length
    ? `<section class="rounded-12 border border-edge bg-foreground p-20 sm:p-24">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-12 mb-14">
          <div>
            <p class="text-12 uppercase tracking-wider text-detail mb-8">Other variants</p>
            <p class="text-14 text-content">Browse the other stacks published under <code>${escapeHtml(variant.templateId)}</code>.</p>
          </div>
          ${renderLinkButton(variant.familyUrl, "View all variants")}
        </div>
        <div class="flex flex-wrap gap-8">
          ${variant.siblingVariants
            .map((sibling) =>
              sibling.url === variant.url
                ? `<span class="inline-flex items-center gap-6 px-10 h-32 rounded-full bg-headline text-highlight text-12 whitespace-nowrap">${escapeHtml(sibling.variantDescription || sibling.variantId)}${sibling.isDefault ? " • Default" : ""}</span>`
                : `<a href="${escapeHtml(sibling.url)}" class="inline-flex items-center gap-6 px-10 h-32 rounded-full border border-edge bg-highlight text-12 text-primary hover:text-primary-hover transition-colors duration-200 whitespace-nowrap">${escapeHtml(sibling.variantDescription || sibling.variantId)}${sibling.isDefault ? " • Default" : ""}</a>`,
            )
            .join("")}
        </div>
      </section>`
    : "";

  return `<div class="relative w-full">
    ${renderHeader({ backHref: variant.familyUrl, backLabel: "All variants", rightHref: variant.repoUrl, rightLabel: "Source repo" })}

    <main id="main">
      <section class="relative z-10 flex items-center justify-center px-16">
        <div class="w-full max-w-896 pt-24 sm:pt-48 pb-24">
          <div class="flex flex-wrap items-center gap-8 mb-12">
            ${renderMetaPill(variant.metadata.owner)}
            ${renderMetaPill(variant.categoryLabel)}
            ${renderMetaPill(variant.frameworkLabel)}
            ${variant.isDefault ? renderMetaPill("Default variant") : ""}
          </div>

          <h1 class="text-36/110 sm:text-48/110 tracking-tighter text-headline mb-12">${escapeHtml(variant.metadata.name)}</h1>
          <p class="text-16 sm:text-18/150 text-content mb-12 max-w-768">${escapeHtml(variant.metadata.description)}</p>
          <p class="text-15 text-detail mb-20">Variant: <code>${escapeHtml(variant.fullTemplateId)}</code></p>

          <div class="flex flex-wrap gap-8 mb-20">
            ${variant.services.map(renderServiceBadge).join("")}
          </div>

          <div class="grid gap-16">
            <section class="rounded-12 border border-edge bg-foreground p-20 sm:p-24 flex flex-col gap-14">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12">
                <div>
                  <p class="text-12 uppercase tracking-wider text-detail mb-8">Build command</p>
                  <code class="block font-mono text-13 leading-150 text-content break-all">${escapeHtml(variant.buildCommand)}</code>
                </div>
                ${renderCopyButton(variant.buildCommand)}
              </div>
              <p class="text-13 text-detail">This targets the specific <code>${escapeHtml(variant.variantId)}</code> variant directly.</p>
            </section>

            <section class="grid gap-12 lg:grid-cols-2">
              <div class="rounded-12 border border-edge bg-foreground p-20 sm:p-24">
                <p class="text-12 uppercase tracking-wider text-detail mb-8">Source</p>
                <p class="text-14 text-content mb-6"><a href="${escapeHtml(variant.repoUrl)}" class="text-primary hover:text-primary-hover transition-colors duration-200">${escapeHtml(variant.repoRootUrl)}</a></p>
                <p class="text-13 text-detail">Pinned ref: <code>${escapeHtml(variant.ref || "Unpinned")}</code></p>
              </div>
              <div class="rounded-12 border border-edge bg-foreground p-20 sm:p-24">
                <p class="text-12 uppercase tracking-wider text-detail mb-8">Setup</p>
                <p class="text-13 text-content mb-6">Install command</p>
                <code class="block font-mono text-12 leading-150 text-content break-all">${escapeHtml(variant.installCommand)}</code>
              </div>
            </section>

            ${nextSteps}
            ${siblingVariants}
          </div>
        </div>
      </section>
    </main>

    ${renderFooter()}
    ${renderCopySupport()}
  </div>`;
}
