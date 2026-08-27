/**
 * Credential list with per-value reveal and copy — the UI equivalent of
 * `provisioning env` (values redacted) plus `--pull` (write them out).
 */

import { copyText, escapeHtml, maskValue, revealSecret } from "./ui.js";

const html = String.raw;

const EYE = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-13 h-13"><path d="M8 3C4.5 3 1.7 5.4 1 8c.7 2.6 3.5 5 7 5s6.3-2.4 7-5c-.7-2.6-3.5-5-7-5Zm0 8.5A3.5 3.5 0 1 1 8 4.5a3.5 3.5 0 0 1 0 7Z"/><circle cx="8" cy="8" r="1.75"/></svg>`;
const EYE_OFF = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-13 h-13"><path d="M2.28 1.22 1.22 2.28l2.2 2.2C2.3 5.35 1.42 6.58 1 8c.7 2.6 3.5 5 7 5 1.2 0 2.34-.28 3.34-.78l2.38 2.38 1.06-1.06-12.5-12.5ZM8 11.5a3.5 3.5 0 0 1-3.2-4.92l1.3 1.3A1.75 1.75 0 0 0 8.12 9.7l1.3 1.3c-.44.32-.96.5-1.42.5Z"/><path d="M8 3c-.7 0-1.38.09-2.02.26l1.3 1.3A3.5 3.5 0 0 1 11.44 9.7l1.63 1.63c.9-.9 1.55-1.98 1.93-3.33-.7-2.6-3.5-5-7-5Z" opacity=".5"/></svg>`;
const COPY = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-13 h-13"><path d="M13 0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1.5v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5.25c0-.97.78-1.75 1.75-1.75a.75.75 0 0 1 0 1.5.25.25 0 0 0-.25.25V14c0 .28.22.5.5.5h6.5a.5.5 0 0 0 .5-.5v-1H6.5a2 2 0 0 1-2-2V2c0-1.1.9-2 2-2zM6.5 1.5A.5.5 0 0 0 6 2v9c0 .28.22.5.5.5H13a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5z"/></svg>`;

/** Values start masked; the browser only ever holds mock secrets. */
export function renderCredentialList(credentials) {
    return html`<div data-credentials class="flex flex-col rounded-6 border border-edge overflow-hidden">
        ${credentials
            .map(
                (credential, index) => html`<div class="flex items-center gap-8 px-10 py-8 ${index === 0 ? "" : "border-t border-edge"}">
                    <span class="font-mono text-11 text-detail w-1/3 shrink-0 truncate" title="${escapeHtml(credential.envKey)}">${escapeHtml(credential.envKey)}</span>
                    <span data-secret="${index}" data-revealed="false" class="flex-1 min-w-0 font-mono text-11 text-content truncate select-all">${escapeHtml(maskValue(credential.value))}</span>
                    <button type="button" data-reveal="${index}" aria-label="Reveal value" title="Reveal value" class="w-24 h-24 shrink-0 inline-flex items-center justify-center rounded-4 text-detail hover:text-headline hover:bg-foreground transition-colors duration-150 cursor-pointer outline-none focus-visible:shadow-focus">${EYE}</button>
                    <button type="button" data-copy-secret="${index}" aria-label="Copy value" title="Copy value" class="w-24 h-24 shrink-0 inline-flex items-center justify-center rounded-4 text-detail hover:text-headline hover:bg-foreground transition-colors duration-150 cursor-pointer outline-none focus-visible:shadow-focus">${COPY}</button>
                </div>`,
            )
            .join("")}
    </div>`;
}

/** Wires reveal/copy inside `scope` for the given credential set. */
export function bindCredentialList(scope, credentials) {
    const container = scope.querySelector("[data-credentials]");
    if (!container) return;

    container.querySelectorAll("[data-reveal]").forEach((button) => {
        button.addEventListener("click", async () => {
            const index = Number(button.dataset.reveal);
            const node = container.querySelector(`[data-secret="${index}"]`);
            const credential = credentials[index];
            if (!node || !credential) return;

            if (node.dataset.revealed === "true") {
                node.dataset.revealed = "false";
                node.textContent = maskValue(credential.value);
                button.innerHTML = EYE;
                button.setAttribute("aria-label", "Reveal value");
                button.title = "Reveal value";
                return;
            }

            node.dataset.revealed = "true";
            button.innerHTML = EYE_OFF;
            button.setAttribute("aria-label", "Hide value");
            button.title = "Hide value";
            await revealSecret(node, credential.value);
        });
    });

    container.querySelectorAll("[data-copy-secret]").forEach((button) => {
        button.addEventListener("click", () => {
            const credential = credentials[Number(button.dataset.copySecret)];
            if (credential) copyText(credential.value, `${credential.envKey} copied`);
        });
    });
}

/** The `.env` block for a single resource. */
export function resourceEnvBlock(resource) {
    return resource.credentials.map((credential) => `${credential.envKey}=${credential.value}`).join("\n");
}
