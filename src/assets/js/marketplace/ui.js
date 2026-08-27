/**
 * UI primitives shared by the marketplace flows: the modal shell, the toast,
 * the provisioning progress tree, and the credential reveal.
 */

const html = String.raw;

/* -------------------------------------------------------------------------- */
/* Toast                                                                      */
/* -------------------------------------------------------------------------- */

let toastTimer = null;

export function toast(message, tone = "success") {
    const root = document.querySelector("[data-toast]");
    if (!root) return;
    const label = root.querySelector("[data-toast-label]");
    const iconWrap = root.querySelector("[data-toast-icon]");
    if (label) label.textContent = message;
    if (iconWrap) iconWrap.style.color = tone === "error" ? "#f87171" : "#4ade80";

    if (window.gsap) {
        window.gsap.killTweensOf(root);
        window.gsap.fromTo(root, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" });
    } else {
        root.style.visibility = "visible";
        root.style.opacity = "1";
    }

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        if (window.gsap) {
            window.gsap.to(root, { autoAlpha: 0, y: 8, duration: 0.25, ease: "power2.in" });
        } else {
            root.style.opacity = "0";
            root.style.visibility = "hidden";
        }
    }, 2600);
}

export async function copyText(text, message = "Copied") {
    try {
        await navigator.clipboard.writeText(text);
        toast(message);
    } catch {
        toast("Copy failed — clipboard unavailable", "error");
    }
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                      */
/* -------------------------------------------------------------------------- */

let modalState = null;

function modalNodes() {
    return {
        root: document.querySelector("[data-modal-root]"),
        card: document.querySelector("[data-modal-card]"),
        backdrop: document.querySelector("[data-modal-backdrop]"),
    };
}

function onKeydown(event) {
    if (event.key === "Escape" && modalState?.dismissible) closeModal();
}

/** Opens the modal (or swaps its contents if already open) and returns the card. */
export function openModal(content, { dismissible = true } = {}) {
    const { root, card, backdrop } = modalNodes();
    if (!root || !card) return null;

    const wasOpen = modalState !== null;
    modalState = { dismissible };
    card.innerHTML = content;
    root.classList.remove("hidden");
    root.classList.add("flex");
    document.body.style.overflow = "hidden";

    if (window.gsap && !wasOpen) {
        window.gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
        window.gsap.fromTo(card, { opacity: 0, y: 12, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" });
    } else if (!window.gsap) {
        backdrop.style.opacity = "1";
        card.style.opacity = "1";
    }

    document.addEventListener("keydown", onKeydown);
    card.querySelector("[data-autofocus]")?.focus();
    return card;
}

export function closeModal() {
    const { root, card, backdrop } = modalNodes();
    if (!root || modalState === null) return;
    modalState = null;
    document.removeEventListener("keydown", onKeydown);
    document.body.style.overflow = "";

    const finish = () => {
        root.classList.add("hidden");
        root.classList.remove("flex");
        card.innerHTML = "";
    };

    if (window.gsap) {
        window.gsap.to(backdrop, { opacity: 0, duration: 0.18, ease: "power2.in" });
        window.gsap.to(card, { opacity: 0, y: 8, duration: 0.18, ease: "power2.in", onComplete: finish });
    } else {
        finish();
    }
}

export function isModalOpen() {
    return modalState !== null;
}

/** Wires backdrop clicks once per page. */
export function initModal() {
    const { backdrop } = modalNodes();
    backdrop?.addEventListener("click", () => {
        if (modalState?.dismissible) closeModal();
    });
}

/* -------------------------------------------------------------------------- */
/* Modal chrome helpers                                                       */
/* -------------------------------------------------------------------------- */

export function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

const CLOSE_ICON = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-14 h-14"><path fill-rule="evenodd" d="M3.28 3.28a.75.75 0 0 1 1.06 0L8 6.94l3.66-3.66a.75.75 0 1 1 1.06 1.06L9.06 8l3.66 3.66a.75.75 0 1 1-1.06 1.06L8 9.06l-3.66 3.66a.75.75 0 1 1-1.06-1.06L6.94 8 3.28 4.34a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>`;

export const CHECK_ICON = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-12 h-12 shrink-0"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"/></svg>`;

export function modalHeader({ eyebrow, title, subtitle, closable = true, step }) {
    return html`<div class="flex items-start justify-between gap-16 px-20 pt-18 pb-14 border-b border-edge">
        <div class="min-w-0">
            ${eyebrow ? `<p class="text-11 uppercase tracking-wider text-detail mb-4">${escapeHtml(eyebrow)}</p>` : ""}
            <h2 class="text-16 font-normal text-headline leading-130">${escapeHtml(title)}</h2>
            ${subtitle ? `<p class="text-12/150 text-detail mt-4">${subtitle}</p>` : ""}
        </div>
        <div class="flex items-center gap-8 shrink-0">
            ${step ? `<span class="text-11 text-detail whitespace-nowrap">${escapeHtml(step)}</span>` : ""}
            ${
                closable
                    ? `<button type="button" data-modal-close aria-label="Close" class="w-28 h-28 inline-flex items-center justify-center rounded-4 text-detail hover:text-headline hover:bg-foreground transition-colors duration-150 cursor-pointer outline-none focus-visible:shadow-focus">${CLOSE_ICON}</button>`
                    : ""
            }
        </div>
    </div>`;
}

export function modalFooter(left, right) {
    return html`<div class="flex items-center justify-between gap-12 px-20 py-14 border-t border-edge bg-foreground rounded-b-8">
        <div class="flex items-center gap-8 min-w-0">${left ?? ""}</div>
        <div class="flex items-center gap-8 shrink-0">${right ?? ""}</div>
    </div>`;
}

export function primaryButton(label, attrs = "") {
    return html`<button type="button" ${attrs} class="inline-flex items-center gap-6 h-34 px-14 rounded-4 bg-primary text-highlight text-13 font-normal hover:bg-primary-hover transition-colors duration-200 cursor-pointer outline-none focus-visible:shadow-focus disabled:opacity-40 disabled:cursor-not-allowed">${label}</button>`;
}

export function secondaryButton(label, attrs = "") {
    return html`<button type="button" ${attrs} class="inline-flex items-center gap-6 h-34 px-14 rounded-4 border border-edge bg-highlight text-13 text-content hover:text-headline hover:bg-foreground transition-colors duration-200 cursor-pointer outline-none focus-visible:shadow-focus">${label}</button>`;
}

/** Label/value rows, the shape the CLI's confirmation card uses. */
export function cardRows(rows) {
    return html`<div class="flex flex-col">
        ${rows
            .map((row) => {
                if (row === null) return `<div class="h-1 bg-edge my-8"></div>`;
                return html`<div class="flex items-start gap-12 py-3">
                    <span class="w-88 shrink-0 text-12 text-detail">${escapeHtml(row.label)}</span>
                    <span class="flex-1 text-12/150 text-content min-w-0 break-words">${row.value}</span>
                </div>`;
            })
            .join("")}
    </div>`;
}

/* -------------------------------------------------------------------------- */
/* Progress tree                                                              */
/* -------------------------------------------------------------------------- */

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

/**
 * Mirrors the CLI's provisioning tree: one line per step, a spinner on the
 * active step, and a completed label once it lands.
 */
export function createProgressTree(container, steps) {
    container.innerHTML = steps
        .map(
            (step, index) => html`<div data-step="${index}" class="flex items-start gap-10 py-5">
                <span data-step-marker class="w-14 h-14 mt-2 shrink-0 flex items-center justify-center text-12 text-disclaimer font-mono leading-none">○</span>
                <span data-step-label class="text-13/140 text-disclaimer">${escapeHtml(step.label)}</span>
            </div>`,
        )
        .join("");

    const nodes = [...container.querySelectorAll("[data-step]")];
    let active = -1;
    let frame = 0;
    let timer = null;

    function paintSpinner() {
        const marker = nodes[active]?.querySelector("[data-step-marker]");
        if (!marker) return;
        marker.textContent = SPINNER_FRAMES[frame % SPINNER_FRAMES.length];
        frame += 1;
    }

    function stop() {
        clearInterval(timer);
        timer = null;
    }

    function activate(index) {
        if (index >= nodes.length) return;
        active = index;
        const node = nodes[index];
        node.querySelector("[data-step-label]").className = "text-13/140 text-headline";
        node.querySelector("[data-step-marker]").className =
            "w-14 h-14 mt-2 shrink-0 flex items-center justify-center text-12 text-primary font-mono leading-none";
        stop();
        paintSpinner();
        timer = setInterval(paintSpinner, 90);
    }

    function complete(index) {
        const node = nodes[index];
        if (!node) return;
        node.querySelector("[data-step-label]").textContent = steps[index].completedLabel ?? steps[index].label;
        node.querySelector("[data-step-label]").className = "text-13/140 text-content";
        const marker = node.querySelector("[data-step-marker]");
        marker.className = "w-14 h-14 mt-2 shrink-0 flex items-center justify-center text-success-400";
        marker.innerHTML = CHECK_ICON;
    }

    return {
        start() {
            activate(0);
        },
        /** Completes the active step and moves to the next. */
        advance() {
            stop();
            if (active >= 0) complete(active);
            activate(active + 1);
        },
        /** Completes every remaining step. */
        finish() {
            stop();
            for (let index = Math.max(active, 0); index < nodes.length; index += 1) complete(index);
            active = nodes.length;
        },
        fail(message) {
            stop();
            const node = nodes[Math.max(active, 0)];
            if (!node) return;
            node.querySelector("[data-step-label]").textContent = message;
            node.querySelector("[data-step-label]").className = "text-13/140 text-ruby-400";
            const marker = node.querySelector("[data-step-marker]");
            marker.className = "w-14 h-14 mt-2 shrink-0 flex items-center justify-center text-ruby-400 font-mono text-12 leading-none";
            marker.textContent = "×";
        },
        destroy: stop,
    };
}

/* -------------------------------------------------------------------------- */
/* Credential reveal                                                          */
/* -------------------------------------------------------------------------- */

// The glyphs the CLI scrambles secrets with while revealing them.
const NOISE_CHARS = "▓░▒█▄▀◢◣◤◥";
const REVEAL_FRAMES = 8;
const REVEAL_INTERVAL = 55;

function noise(length) {
    let out = "";
    for (let i = 0; i < length; i += 1) out += NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
    return out;
}

/** Reveals a secret by resolving noise into the real value, as the CLI does. */
export function revealSecret(node, value) {
    return new Promise((resolve) => {
        let frame = 0;
        node.classList.add("mkt-secret");
        const timer = setInterval(() => {
            const ratio = frame / REVEAL_FRAMES;
            const revealed = Math.floor(value.length * ratio);
            node.textContent = value.slice(0, revealed) + noise(value.length - revealed);
            frame += 1;
            if (frame > REVEAL_FRAMES) {
                clearInterval(timer);
                node.textContent = value;
                resolve();
            }
        }, REVEAL_INTERVAL);
    });
}

export function maskValue(value) {
    return "•".repeat(Math.min(Math.max(value.length, 12), 32));
}
