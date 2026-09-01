/**
 * Render-ready rows for the /providers table.
 *
 * Joins the two sources rather than hand-maintaining a third:
 *
 *   providers.js  editorial — display name, reviewed copy, lead category
 *   catalog.js    generated from `stripe projects catalog --json` — the full
 *                 category set per provider, and the provider count per category
 *
 * A third of the catalog is multi-category (Cloudflare sits in eight), so the
 * table shows the lead chip plus one, then a `+N` chip. Filtering matches the
 * complete set from `dataCategories`, not just the visible chips.
 */
import providers from "./providers.js";
import catalog from "./catalog.js";
import { catalogSlug, categoryLabel, providerAnchor } from "../lib/categories.js";

/* Chips rendered inline before collapsing the rest into `+N`. */
const VISIBLE_CHIPS = 2;

const byCatalogSlug = new Map(catalog.providers.map((provider) => [provider.slug, provider]));

/*
 * Catalog order is by service count descending, which makes a poor lead: every
 * GitLab category has exactly one service, so a count sort surfaces "AI" for a
 * CI/CD product. The reviewed `category` from providers.js leads instead, with
 * the catalog supplying the rest in its own order.
 */
function orderedCategories(provider, catalogEntry) {
    const fromCatalog = catalogEntry?.categories ?? [];
    const all = fromCatalog.length ? fromCatalog : [provider.category];
    return [provider.category, ...all.filter((id) => id !== provider.category)];
}

/*
 * providers.js is in no particular order; the table has always read
 * alphabetically. Base sensitivity so "here.now" sorts next to "HeyGen" rather
 * than ahead of every capitalised name.
 */
const byName = (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });

const rows = [...providers].sort(byName).map((provider) => {
    const catalogEntry = byCatalogSlug.get(catalogSlug(provider.slug));
    const categories = orderedCategories(provider, catalogEntry);
    const overflow = categories.slice(VISIBLE_CHIPS);

    return {
        name: provider.name,
        url: provider.url,
        /* The anchor /#<name> deep links from the home page target. */
        anchor: providerAnchor(provider.name),
        installCommand: `stripe projects add ${provider.slug}`,
        description: provider.tableDescription || provider.longDescription || provider.description,
        /* Editorial fields the llms.txt / index.html.md sync also renders. */
        slug: provider.slug,
        longDescription: provider.longDescription || provider.description,
        /* Every category, lead first — what the docs sync lists in full. */
        categories: categories.map((id) => ({ id, label: categoryLabel(id) })),
        categoryLabels: categories.map(categoryLabel).join(", "),
        chips: categories.slice(0, VISIBLE_CHIPS).map((id) => ({ id, label: categoryLabel(id) })),
        overflowCount: overflow.length,
        /* Tooltip on the `+N` chip, so the hidden labels stay reachable. */
        overflowLabels: overflow.map(categoryLabel).join(", "),
        /* Space separated so the filter can do .split(" ").includes(id). */
        dataCategories: categories.join(" "),
        /*
         * Ids and labels both, because they diverge: "compute" displays as
         * "Hosting", so searching the word on screen has to match the row.
         */
        searchText: [provider.name, ...categories, ...categories.map(categoryLabel)]
            .join(" ")
            .toLowerCase(),
    };
});

/*
 * Filter pills, generated from the catalog so they can never drift from it. The
 * page previously hardcoded sixteen, two of which ("hosting", "ci-cd") matched
 * no live category while seven real ones had no pill at all.
 */
const pills = [
    { id: "all", label: "All", count: providers.length },
    ...catalog.categories.map((category) => ({
        id: category.id,
        label: categoryLabel(category.id),
        count: category.count,
    })),
];

/* One default export: 11ty only surfaces that as the `providerRows` global. */
export default { rows, pills };
