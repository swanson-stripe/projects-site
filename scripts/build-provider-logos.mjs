/**
 * Generates src/assets/js/provider-logos.js from the logo WebC components.
 *
 * Run: npm run build:logos
 *
 * WHY THIS EXISTS
 *
 * The Stack Share page (/s) and the OG image endpoint (/api/og) are not
 * rendered by Eleventy, so they cannot use <logo-neon> and friends. They need
 * the same artwork as a plain string, keyed by provider slug. That file used to
 * be maintained by hand and had drifted: it covered 31 of 65 providers, and
 * netlify and openrouter still held artwork their components had since replaced.
 * Deriving it from src/_data/providers.js closes both gaps for good — a provider
 * added there now shows up everywhere on the next run of this script.
 *
 * WHAT IT DOES PER LOGO
 *
 *   1. Strips comments and webc:* attributes, so the result is portable SVG.
 *   2. Namespaces every id, because /s inlines several of these logos into one
 *      document and Figma exports ids like "clip0_4847_2" that only happen not
 *      to collide today.
 *   3. Crops the viewBox to the ink. Both consumers size a logo by height in a
 *      fixed box, so padding in the viewBox renders that logo smaller than the
 *      ones either side of it. See scripts/lib/svg-ink-box.mjs.
 *
 * The output shape — `window.__PROVIDER_LOGOS = {slug: "<svg…>"}` — is what the
 * existing consumers already parse, so it is deliberately unchanged. One entry
 * per line, unlike the single-line file this replaces, so a regeneration diffs
 * per provider.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import providers from "../src/_data/providers.js";
import { providerKey, LOGO_NEEDS_DOM } from "../src/lib/provider-directory.js";
import { inkBox } from "./lib/svg-ink-box.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENTS = join(ROOT, "src/_components/svg/logos");
const OUT = join(ROOT, "src/assets/js/provider-logos.js");

/**
 * How much a side has to tighten before it is worth rewriting the viewBox.
 *
 * Exact ink measurement disagrees with a hand-authored viewBox by a hundredth of
 * a unit on plenty of logos that are already cropped. Rewriting those trades a
 * large diff for no visible change, so only act on padding a reader would see.
 */
const MIN_CROP_RATIO = 0.01;

function parseViewBox(value) {
    const n = value.trim().split(/[\s,]+/).map(Number);
    if (n.length !== 4 || n.some(Number.isNaN)) return null;
    return { x: n[0], y: n[1], width: n[2], height: n[3] };
}

function formatViewBox(box, places = 2) {
    const f = 10 ** places;
    // Round outward, so rounding can never crop ink the exact box included.
    const minX = Math.floor(box.x * f) / f;
    const minY = Math.floor(box.y * f) / f;
    const maxX = Math.ceil((box.x + box.width) * f) / f;
    const maxY = Math.ceil((box.y + box.height) * f) / f;
    return [minX, minY, maxX - minX, maxY - minY]
        .map(n => n.toFixed(places).replace(/\.?0+$/, "") || "0")
        .join(" ");
}

/**
 * The tightened viewBox for a logo, or null to leave the authored one alone.
 *
 * Only ever crops inward. Exact ink can sit a hundredth of a unit outside an
 * authored viewBox, and honouring that would quietly widen artwork that renders
 * correctly today — a change with no upside and a whole marquee to regress.
 */
function cropTo(authored, ink) {
    const outer = parseViewBox(authored);
    if (!outer) return formatViewBox(ink);

    const x = Math.max(outer.x, ink.x);
    const y = Math.max(outer.y, ink.y);
    const right = Math.min(outer.x + outer.width, ink.x + ink.width);
    const bottom = Math.min(outer.y + outer.height, ink.y + ink.height);
    const width = right - x;
    const height = bottom - y;
    if (width <= 0 || height <= 0) return null;

    const tightened = Math.max(
        (outer.width - width) / outer.width,
        (outer.height - height) / outer.height,
    );
    if (tightened < MIN_CROP_RATIO) return null;
    return formatViewBox({ x, y, width, height });
}

function namespaceIds(svg, prefix) {
    const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    let out = svg;
    for (const id of new Set(ids)) {
        const q = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        out = out
            .replace(new RegExp(`(\\sid=")${q}(")`, "g"), `$1${prefix}-${id}$2`)
            .replace(new RegExp(`url\\(#${q}\\)`, "g"), `url(#${prefix}-${id})`)
            .replace(new RegExp(`((?:xlink:)?href=")#${q}(")`, "g"), `$1#${prefix}-${id}$2`);
    }
    return out;
}

function extractSvg(source, slug) {
    let svg = source
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s*webc:[a-zA-Z-]+(="[^"]*")?/g, "");

    const open = svg.indexOf("<svg");
    const close = svg.lastIndexOf("</svg>");
    if (open === -1 || close === -1) throw new Error(`no <svg> element found for ${slug}`);
    svg = svg.slice(open, close + "</svg>".length);

    if (!/\sxmlns="/.test(svg)) {
        svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    return namespaceIds(svg, slug.replace(/[^a-z0-9]+/gi, "-"));
}

function compact(svg) {
    return svg
        .replace(/>\s+</g, "><")
        .replace(/\s*\n\s*/g, " ")
        .replace(/\s{2,}/g, " ")
        .replace(/\s+\/>/g, "/>")
        .trim();
}

const logos = {};
const needsDom = [];
const report = [];

for (const provider of providers) {
    const slug = providerKey(provider);
    const file = join(COMPONENTS, `${provider.logoTag}.webc`);
    if (!existsSync(file)) {
        throw new Error(`${slug}: logoTag "${provider.logoTag}" has no component at ${file}`);
    }

    let svg = extractSvg(readFileSync(file, "utf-8"), slug);
    const authored = (svg.match(/\sviewBox="([^"]+)"/) || [])[1] ?? null;
    const { box, skipped } = inkBox(svg);

    /*
     * A logo whose extent depends on a font or a fetched asset cannot be
     * measured here, and cropping to the part that IS measurable would cut the
     * wordmark off. Keep the artwork as authored and let the consumers know.
     */
    if (skipped.length > 0 || !box) {
        needsDom.push(slug);
        report.push(`  ${slug.padEnd(18)} kept authored viewBox — needs a DOM (${skipped.join(", ") || "nothing measurable"})`);
    } else if (authored === null) {
        svg = svg.replace("<svg", `<svg viewBox="${formatViewBox(box)}"`);
        report.push(`  ${slug.padEnd(18)} added viewBox ${formatViewBox(box)}`);
    } else {
        const cropped = cropTo(authored, box);
        if (cropped !== null) {
            svg = svg.replace(/(\sviewBox=")[^"]+(")/, `$1${cropped}$2`);
            report.push(`  ${slug.padEnd(18)} viewBox ${authored} -> ${cropped}`);
        }
    }

    logos[slug] = compact(svg);
}

/*
 * The consumers behave differently for these, so a new one must not slip in
 * unnoticed: /s inlines the SVG into the page, where a font and a same-origin
 * asset are both available, while /api/og rasterises it standalone and would
 * paint a logo with its name missing — or nothing at all.
 */
const expected = [...LOGO_NEEDS_DOM].sort().join(",");
const actual = [...needsDom].sort().join(",");
if (expected !== actual) {
    throw new Error(
        `LOGO_NEEDS_DOM in src/lib/provider-directory.js is out of date.\n` +
        `  expected: ${expected || "(empty)"}\n` +
        `  detected: ${actual || "(empty)"}\n` +
        `Update the constant, and check that /api/og still renders those providers acceptably.`,
    );
}

const body = Object.entries(logos)
    .map(([slug, svg]) => `${JSON.stringify(slug)}: ${JSON.stringify(svg)}`)
    .join(",\n");

writeFileSync(
    OUT,
    "/* GENERATED by scripts/build-provider-logos.mjs — do not edit. Run `npm run build:logos`. */\n" +
    `window.__PROVIDER_LOGOS = {\n${body}\n};\n`,
);

console.log(`wrote ${Object.keys(logos).length} logos to src/assets/js/provider-logos.js`);
if (report.length) console.log(report.join("\n"));
