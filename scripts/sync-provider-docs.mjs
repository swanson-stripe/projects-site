/**
 * Regenerates the provider lists in src/llms.txt and public/index.html.md from
 * src/_data/providers.js, which mirrors what /providers renders.
 *
 * These two files previously drifted badly — llms.txt listed 37 providers and
 * index.html.md 16, against 63 on the site. Rather than hand-maintaining three
 * copies, run this after changing the provider data:
 *
 *     npm run sync:providers
 *
 * Replaces the body of a named markdown section in place, leaving surrounding
 * prose untouched. `npm test` fails if the files fall out of sync.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import providers from "../src/_data/providers.js";
import catalog from "../src/_data/catalog.js";
import providerRows from "../src/_data/providerRows.js";
import { KNOWN_CATEGORIES, categoryLabel } from "../src/lib/categories.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/*
 * Labels and the full per-provider category set both come from the shared
 * taxonomy, so llms.txt lists the same categories as /providers rather than a
 * single one. This script used to keep its own copy of the label map and a
 * hand-ordered category list, both of which had drifted from the catalog.
 */
const rowsBySlug = new Map(providerRows.rows.map((row) => [row.slug, row]));

/* Most-populated category first — the order the catalog already computes. */
const CATEGORY_ORDER = catalog.categories.map((category) => category.id);

function label(category) {
  if (!KNOWN_CATEGORIES.has(category)) {
    throw new Error(
      `Unknown provider category "${category}". Add it to CATEGORY_LABELS in src/lib/categories.js.`,
    );
  }
  return categoryLabel(category);
}

/* Every category the provider is in, not just the editorial lead. */
function allCategories(provider) {
  const row = rowsBySlug.get(provider.slug);
  if (!row) throw new Error(`No catalog row for ${provider.slug}`);
  for (const { id } of row.categories) label(id);
  return row.categoryLabels;
}

function byName(a, b) {
  return a.name.localeCompare(b.name, "en");
}

/* Escape pipes so a description can never break out of a markdown table cell. */
function cell(value) {
  return String(value).replaceAll("|", "\\|");
}

/** Flat alphabetical table — compact, for llms.txt. */
function renderTable() {
  const rows = [...providers].sort(byName).map(
    (provider) =>
      `| ${cell(provider.name)} | ${cell(provider.slug)} | ${cell(allCategories(provider))} |`,
  );
  return [
    `Stripe Projects currently supports ${providers.length} providers. Provision any of them with`,
    "`stripe projects add <provider>/<service>`. Many providers span several categories; the",
    "first listed is the primary one.",
    "",
    "| Provider | Service slug | Categories |",
    "|---|---|---|",
    ...rows,
    "",
    "Browse the same catalog on the web at https://projects.dev/providers/, or from the CLI",
    "with `stripe projects catalog`.",
  ].join("\n");
}

/** Grouped by category with descriptions — for index.html.md. */
function renderGrouped() {
  const grouped = new Map();
  for (const provider of providers) {
    if (!grouped.has(provider.category)) grouped.set(provider.category, []);
    grouped.get(provider.category).push(provider);
  }

  const categories = [...grouped.keys()].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    return (ia < 0 ? Number.MAX_SAFE_INTEGER : ia) - (ib < 0 ? Number.MAX_SAFE_INTEGER : ib);
  });

  const sections = categories.map((category) => {
    const entries = grouped
      .get(category)
      .sort(byName)
      .map((provider) => {
        const description = provider.longDescription || provider.description;
        return `- **${provider.name}** — \`${provider.slug}\` — ${description} ${provider.url}`;
      });
    return [`### ${label(category)}`, "", ...entries].join("\n");
  });

  return [
    `Stripe Projects provisions services from ${providers.length} providers across the categories`,
    "below. Every service is addressed as `<provider>/<service>` and added with",
    "`stripe projects add <provider>/<service>`.",
    "",
    ...sections.flatMap((section) => [section, ""]),
    "The complete catalog is also browsable at https://projects.dev/providers/ and from the",
    "CLI with `stripe projects catalog`.",
  ]
    .join("\n")
    .trimEnd();
}

/**
 * Replace the body of `## <heading>` up to the next heading at the same level,
 * keeping any trailing `---` rule that belongs to the surrounding document.
 */
function replaceSection(source, heading, body) {
  const escaped = heading.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^## ${escaped}\\n)([\\s\\S]*?)(?=^---$|^## )`, "m");

  if (!pattern.test(source)) {
    throw new Error(`Section "## ${heading}" not found — cannot sync.`);
  }
  return source.replace(pattern, `$1\n${body}\n\n`);
}

function write(relativePath, heading, body) {
  const absolute = path.join(ROOT, relativePath);
  const before = fs.readFileSync(absolute, "utf8");
  const after = replaceSection(before, heading, body);

  if (before === after) {
    console.log(`unchanged: ${relativePath}`);
    return;
  }
  fs.writeFileSync(absolute, after);
  console.log(`synced:    ${relativePath} (${providers.length} providers)`);
}

write("src/llms.txt", "Supported Providers", renderTable());
write("public/index.html.md", "Ecosystem — Supported Services", renderGrouped());
