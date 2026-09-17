/**
 * Builds the provider favicon tiles under src/assets/images/provider-favicons/
 * for providers whose mark had to be lifted out of their wordmark lockup.
 *
 * Run: npm run build:favicons
 *
 * WHY THIS EXISTS
 *
 * /marketplace draws provider.iconUrl and falls back to two initials when it is
 * null. Six providers had no tile, so they showed "DA", "HE", "PE", "RE", "SC",
 * "ST" among 59 real marks. None of them publishes a standalone mark that was
 * already in the repo, but five carry one inside the lockup that
 * src/_components/svg/logos/ already ships — so the mark is taken from there
 * rather than fetched, which keeps the tile and the wordmark on /providers
 * derived from the same artwork.
 *
 * The remaining 59 tiles were made by hand and are not touched. This script only
 * owns the slugs in TILES, so re-running it is safe.
 *
 * GEOMETRY
 *
 * Measured off the 64 tiles that already existed: the mark spans a median 104 of
 * the 180 box (58%) on a full-bleed brand ground, which is what MARK_SPAN below
 * reproduces. Centring is on the mark's ink rather than its declared viewBox, so
 * a lockup's internal padding does not push the mark off centre.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { inkBox } from "./lib/svg-ink-box.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENTS = join(ROOT, "src/_components/svg/logos");
const OUT_DIR = join(ROOT, "src/assets/images/provider-favicons");

/** Median mark span across the tiles that already shipped, out of 180. */
const MARK_SPAN = 104;
const TILE = 180;

/*
 * `mark` indexes the drawable elements of the component in document order, which
 * is what scripts/build-favicon-tile.mjs prints with --list. Grounds follow the
 * convention of the existing tiles: a saturated brand colour where the mark
 * carries one, and black for the monochrome brands (as vercel, agentmail, and
 * tabstack already do).
 */
const TILES = [
    {
        slug: "datadog",
        component: "logo-datadog",
        // The glyph left of the wordmark.
        mark: [7],
        /*
         * This mark's outer boundary is the square itself, with the dog as a
         * cut-out, so painting it white on a purple ground inverts it into a white
         * box. Painting the square in brand purple at full bleed instead lets the
         * ground show through the dog — which is the tile Datadog publishes, and
         * the same full-bleed treatment churnkey and athena already use.
         */
        mark_span: TILE,
        ground: "white",
        ink: "#632CA6",
    },
    {
        slug: "perplexity",
        component: "logo-perplexity",
        // The lockup splits cleanly by fill: #427e8c is the mark, #1c333a the word.
        mark: [1],
        ground: "#427E8C",
        ink: "white",
    },
    {
        slug: "herenow",
        component: "logo-herenow",
        // The only path in the component; the wordmark beside it is live <text>.
        mark: [0],
        ground: "black",
        ink: "white",
    },
    {
        slug: "schematic",
        component: "logo-schematic",
        // Two paths at x < 19, ahead of the wordmark which starts at x 27.
        mark: [9, 10],
        ground: "black",
        ink: "white",
    },
    {
        slug: "steel",
        component: "logo-steelbrowser",
        // The "S" glyph. Elements 0 and 7 are full-canvas white — mask and ground.
        mark: [1],
        ground: "black",
        ink: "white",
    },
    {
        slug: "revenuecat",
        component: "logo-revenuecat",
        /*
         * RevenueCat is the one exception: its lockup is a pure wordmark with no
         * separate glyph, so this is the leading "R" of its own type rather than
         * the mark it publishes as a favicon. Swap it if the real mark is ever
         * added to the repo.
         */
        mark: [0],
        ground: "black",
        ink: "white",
    },
];

const DRAWABLE = /<(path|polygon|circle|rect|ellipse|polyline)((?:"[^"]*"|[^>"])*?)\/?>/g;

function componentSource(component) {
    return readFileSync(join(COMPONENTS, `${component}.webc`), "utf-8")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s*webc:[a-zA-Z-]+(="[^"]*")?/g, "");
}

function drawables(source) {
    return [...source.matchAll(DRAWABLE)].map(m => ({ tag: m[1], attrs: m[2], raw: m[0] }));
}

/** Drops paint attributes so the wrapping <g fill> decides the colour. */
function stripPaint(raw) {
    return raw
        .replace(/\s(?:fill|stroke)="[^"]*"/g, "")
        .replace(/\s(?:fill|stroke)-opacity="[^"]*"/g, "")
        .replace(/\s*\/?>$/, "/>");
}

function round(n) {
    return Number(n.toFixed(4)).toString();
}

function buildTile({ slug, component, mark, ground, ink, mark_span = MARK_SPAN }) {
    const source = componentSource(component);
    const elements = drawables(source);
    const chosen = mark.map(index => {
        const element = elements[index];
        if (!element) throw new Error(`${slug}: ${component} has no drawable element at index ${index}`);
        return element;
    });

    const painted = chosen.map(element => stripPaint(element.raw));
    const probe = `<svg xmlns="http://www.w3.org/2000/svg">${chosen.map(e => e.raw).join("")}</svg>`;
    const { box, skipped } = inkBox(probe);
    if (!box) throw new Error(`${slug}: could not measure the mark (skipped: ${skipped.join(", ") || "nothing"})`);

    const scale = mark_span / Math.max(box.width, box.height);
    const tx = TILE / 2 - scale * (box.x + box.width / 2);
    const ty = TILE / 2 - scale * (box.y + box.height / 2);

    return [
        `<svg width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}" fill="none" xmlns="http://www.w3.org/2000/svg">`,
        `<path d="M${TILE} 0H0V${TILE}H${TILE}V0Z" fill="${ground}"/>`,
        `<g transform="translate(${round(tx)} ${round(ty)}) scale(${round(scale)})" fill="${ink}">`,
        ...painted,
        `</g>`,
        `</svg>`,
        "",
    ].join("\n");
}

if (process.argv[2] === "--list") {
    // Locating a mark means knowing which element it is; this prints the options.
    for (const { slug, component } of TILES) {
        const source = componentSource(component);
        const viewBox = (source.match(/viewBox="([^"]+)"/) || [])[1] ?? "";
        console.log(`${slug} (${component}, viewBox ${viewBox})`);
        drawables(source).forEach((element, index) => {
            const probe = `<svg xmlns="http://www.w3.org/2000/svg">${element.raw}</svg>`;
            const box = inkBox(probe).box;
            const fill = (element.attrs.match(/fill="([^"]+)"/) || [])[1] ?? "(inherited)";
            const where = box
                ? `x ${box.x.toFixed(1)}..${(box.x + box.width).toFixed(1)}  y ${box.y.toFixed(1)}..${(box.y + box.height).toFixed(1)}`
                : "unmeasurable";
            console.log(`  [${String(index).padStart(2)}] ${element.tag.padEnd(8)} ${fill.padEnd(14)} ${where}`);
        });
    }
    process.exit(0);
}

for (const tile of TILES) {
    writeFileSync(join(OUT_DIR, `${tile.slug}.svg`), buildTile(tile));
    console.log(`wrote src/assets/images/provider-favicons/${tile.slug}.svg  (ground ${tile.ground})`);
}
console.log(`\n${TILES.length} tiles written. Regenerate the catalog so iconUrl picks them up:`);
console.log("    stripe projects catalog --json > catalog.json");
console.log("    node scripts/build-marketplace-catalog.mjs catalog.json");
