/*
 * Guards the stack share path against the drift that motivated
 * src/lib/provider-directory.js.
 *
 * middleware.ts, api/og.ts, and src/s.webc each used to carry a hand-written
 * copy of the provider map. All three had stalled at 31 entries while the
 * catalog grew to 65, so a share link naming any of the other 34 providers
 * silently dropped those rows and a link naming only those providers rendered
 * "No stack found in this URL". Nothing failed loudly, which is exactly why it
 * went unnoticed — hence these assertions.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test, { describe } from "node:test";

import providers from "../src/_data/providers.js";
import {
  PROVIDER_DIRECTORY,
  PROVIDER_NAMES,
  LOGO_NEEDS_DOM,
  providerKey,
  decodeStackServices,
  groupServicesByProvider,
} from "../src/lib/provider-directory.js";

const SLUGS = providers.map(providerKey);
const LOGOS_FILE = "src/assets/js/provider-logos.js";

function loadLogos() {
  const content = readFileSync(LOGOS_FILE, "utf8");
  const marker = content.indexOf("__PROVIDER_LOGOS");
  const start = content.indexOf("{", marker === -1 ? 0 : marker);
  const end = content.lastIndexOf("}") + 1;
  return JSON.parse(content.slice(start, end));
}

describe("provider directory covers the whole catalog", () => {
  test("every provider in providers.js is shareable", () => {
    const missing = SLUGS.filter((slug) => !PROVIDER_DIRECTORY[slug]);
    assert.deepEqual(missing, [], "providers missing from PROVIDER_DIRECTORY");
    assert.equal(Object.keys(PROVIDER_DIRECTORY).length, SLUGS.length);
  });

  test("display names match providers.js, so /s and /providers agree", () => {
    for (const provider of providers) {
      assert.equal(PROVIDER_NAMES[providerKey(provider)], provider.name);
    }
  });

  test("slugs are unique, so no provider can shadow another", () => {
    assert.equal(new Set(SLUGS).size, SLUGS.length);
  });
});

describe("decodeStackServices", () => {
  test("accepts every provider in the catalog", () => {
    for (const provider of providers) {
      const slug = providerKey(provider);
      const decoded = decodeStackServices(`v1:${slug}~thing`);
      assert.deepEqual(
        decoded,
        [{ provider: slug, service: "thing" }],
        `${slug} did not survive a round trip through a share payload`,
      );
    }
  });

  test("keys that are not plain lowercase letters still decode", () => {
    /*
     * customer.io, wordpress.com, laravel_cloud, and base44_projects are real
     * slugs. A tightened "[a-z]+" guard would silently drop all four.
     */
    for (const slug of ["customer.io", "wordpress.com", "laravel_cloud", "base44_projects"]) {
      assert.ok(PROVIDER_DIRECTORY[slug], `${slug} is expected to be a catalog slug`);
      assert.deepEqual(decodeStackServices(`v1:${slug}~app`), [{ provider: slug, service: "app" }]);
    }
  });

  test("drops unknown providers rather than rendering them", () => {
    // Documented behaviour of /api/og's stack parameter, and the guard that
    // stops a crafted payload injecting text into a link unfurl.
    assert.deepEqual(decodeStackServices("v1:notaprovider~thing"), []);
    assert.deepEqual(decodeStackServices("v1:neon~postgres,notaprovider~thing"), [
      { provider: "neon", service: "postgres" },
    ]);
  });

  test("normalizes display casing and percent-encoding", () => {
    assert.deepEqual(decodeStackServices("v1:Neon~postgres"), [{ provider: "neon", service: "postgres" }]);
    assert.deepEqual(decodeStackServices("v1:neon~read%20replica"), [
      { provider: "neon", service: "read replica" },
    ]);
  });

  test("rejects anything that is not a v1 payload", () => {
    for (const bad of ["", "neon~postgres", "v2:neon~postgres", "v1:", ":neon~postgres", "v1:neon", undefined, null, 42]) {
      assert.deepEqual(decodeStackServices(bad), [], `unexpectedly accepted ${JSON.stringify(bad)}`);
    }
  });

  test("a malformed pair drops that pair, not the whole link", () => {
    assert.deepEqual(decodeStackServices("v1:neon~postgres,,broken,vercel~project"), [
      { provider: "neon", service: "postgres" },
      { provider: "vercel", service: "project" },
    ]);
    // A stray "%" makes decodeURIComponent throw for that pair only.
    assert.deepEqual(decodeStackServices("v1:neon~100%,vercel~project"), [
      { provider: "vercel", service: "project" },
    ]);
  });

  test("preserves order and collapses repeats into one row", () => {
    const grouped = groupServicesByProvider(decodeStackServices("v1:neon~postgres,vercel~project,neon~branch"));
    assert.deepEqual(grouped, [
      { provider: "neon", services: ["postgres", "branch"] },
      { provider: "vercel", services: ["project"] },
    ]);
  });
});

describe("provider logos", () => {
  test("src/assets/js/provider-logos.js has an entry per provider", () => {
    const logos = loadLogos();
    const missing = SLUGS.filter((slug) => !logos[slug]);
    assert.deepEqual(missing, [], `run \`npm run build:logos\`; missing from ${LOGOS_FILE}`);
  });

  test("each logo is a self-contained svg with a viewBox", () => {
    const logos = loadLogos();
    for (const slug of SLUGS) {
      const svg = logos[slug];
      assert.match(svg, /^<svg[\s>]/, `${slug} logo does not start with <svg>`);
      assert.match(svg, /<\/svg>$/, `${slug} logo does not end with </svg>`);
      assert.match(svg, /\sxmlns="http:\/\/www\.w3\.org\/2000\/svg"/, `${slug} logo has no xmlns`);
      assert.match(svg, /\sviewBox="[-\d.\s,]+"/, `${slug} logo has no viewBox`);
      assert.ok(!svg.includes("webc:"), `${slug} logo still carries a webc: attribute`);
      assert.ok(!svg.includes("<!--"), `${slug} logo still carries a comment`);
    }
  });

  test("logo ids are namespaced, since /s inlines several into one document", () => {
    const logos = loadLogos();
    const owners = new Map();
    for (const slug of SLUGS) {
      for (const match of logos[slug].matchAll(/\sid="([^"]+)"/g)) {
        const id = match[1];
        assert.ok(
          id.startsWith(`${slug.replace(/[^a-z0-9]+/gi, "-")}-`),
          `${slug} defines un-namespaced id "${id}"`,
        );
        assert.ok(!owners.has(id), `id "${id}" is defined by both ${owners.get(id)} and ${slug}`);
        owners.set(id, slug);
      }
    }
  });

  test("every id a logo references is one it also defines", () => {
    const logos = loadLogos();
    for (const slug of SLUGS) {
      const defined = new Set([...logos[slug].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
      for (const match of logos[slug].matchAll(/url\(#([^)]+)\)/g)) {
        assert.ok(defined.has(match[1]), `${slug} references #${match[1]} but does not define it`);
      }
    }
  });

  test("LOGO_NEEDS_DOM names real providers and matches what the artwork needs", () => {
    const logos = loadLogos();
    for (const slug of LOGO_NEEDS_DOM) {
      assert.ok(PROVIDER_DIRECTORY[slug], `${slug} in LOGO_NEEDS_DOM is not a catalog slug`);
      assert.match(
        logos[slug],
        /<text|<image/,
        `${slug} no longer needs a DOM — drop it from LOGO_NEEDS_DOM so /api/og draws its logo`,
      );
    }
    /*
     * The inverse direction is what actually protects the OG card: a logo that
     * needs a font or a fetched asset must be listed, or it rasterises with its
     * name missing — or, for an <image>, as nothing at all.
     */
    const unlisted = SLUGS.filter(
      (slug) => /<text|<image/.test(logos[slug]) && !LOGO_NEEDS_DOM.includes(slug),
    );
    assert.deepEqual(unlisted, [], "logos needing a DOM that /api/og would try to rasterise");
  });

  test("an <image> a logo depends on is present in the repo", () => {
    const logos = loadLogos();
    for (const slug of SLUGS) {
      for (const match of logos[slug].matchAll(/(?:xlink:)?href="(\/[^"]+)"/g)) {
        const asset = `src${match[1]}`;
        assert.ok(existsSync(asset), `${slug} references ${match[1]}, which is not at ${asset}`);
      }
    }
  });
});

describe("dark theme can tell wordmark ink from brand colour", () => {
  /*
   * retintLogos() in src/s.webc lifts near-black ink so it is not invisible on
   * the dark card, and leaves dark brand colour alone so Fly.io's #24175b and
   * Datadog's #632ca6 survive. It splits the two on channel spread, with the
   * threshold at 38. That only works while real logo colours stay clear of it —
   * this asserts they do, so a new logo landing in the gap is a test failure
   * rather than an invisible or recoloured mark.
   */
  const SPREAD_THRESHOLD = 38;
  const AMBIGUOUS = 8; // margin either side of the threshold
  const NAMED = { black: "#000000", white: "#ffffff" };

  function toRgb(value) {
    const named = NAMED[value.toLowerCase()];
    let hex = (named ?? value).replace("#", "");
    if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }

  function luminance(rgb) {
    const linear = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }

  function darkColors() {
    const logos = loadLogos();
    const found = [];
    for (const slug of SLUGS) {
      for (const match of logos[slug].matchAll(/\s(?:fill|stroke)="([^"]+)"/g)) {
        const value = match[1];
        if (value === "none" || value === "currentColor" || value.startsWith("url(")) continue;
        const rgb = toRgb(value);
        if (!rgb) continue;
        if (luminance(rgb) >= 0.2) continue;
        found.push({ slug, value, spread: Math.max(...rgb) - Math.min(...rgb) });
      }
    }
    return found;
  }

  test("no dark logo colour sits near the neutral/brand threshold", () => {
    const ambiguous = darkColors()
      .filter((c) => Math.abs(c.spread - SPREAD_THRESHOLD) < AMBIGUOUS)
      .map((c) => `${c.slug} ${c.value} (spread ${c.spread})`);
    assert.deepEqual(
      [...new Set(ambiguous)],
      [],
      "these could be classified either way; confirm how they render on the dark card and adjust the threshold in src/s.webc",
    );
  });

  test("the anchors the threshold was chosen around still classify correctly", () => {
    const colors = darkColors();
    const spreadOf = (slug, value) => colors.find((c) => c.slug === slug && c.value.toLowerCase() === value)?.spread;

    // Wordmark ink: must be lifted, or it is invisible on the dark card.
    for (const [slug, value] of [["exa", "black"], ["supermemory", "#1c2026"], ["clerk", "#131316"]]) {
      const spread = spreadOf(slug, value);
      assert.notEqual(spread, undefined, `${slug} no longer uses ${value}`);
      assert.ok(spread <= SPREAD_THRESHOLD, `${slug} ${value} would be left dark on the dark card`);
    }

    // Brand colour: must survive, or the logo is recoloured.
    for (const [slug, value] of [["flyio", "#24175b"], ["datadog", "#632ca6"], ["netlify", "#014847"]]) {
      const spread = spreadOf(slug, value);
      assert.notEqual(spread, undefined, `${slug} no longer uses ${value}`);
      assert.ok(spread > SPREAD_THRESHOLD, `${slug} ${value} is brand colour and would be overwritten`);
    }
  });

  test("s.webc no longer selects ink by hardcoded hex", () => {
    const source = readFileSync("src/s.webc", "utf8");
    assert.ok(
      !/\.stack-logo svg \[fill="#/.test(source),
      "hex attribute selectors miss `black` and the other ink spellings in the catalog; retintLogos handles them",
    );
    assert.match(source, /function retintLogos/);
  });
});

describe("no stale copies of the provider map survive", () => {
  /*
   * The whole point of the shared module. A literal map of provider names in any
   * of these files is a copy that will fall behind providers.js again.
   */
  const CONSUMERS = ["middleware.ts", "api/og.ts", "src/s.webc"];

  for (const file of CONSUMERS) {
    test(`${file} derives its provider list rather than hardcoding one`, () => {
      const source = readFileSync(file, "utf8");
      /*
       * Catches both shapes this replaced: middleware.ts and api/og.ts held
       * `agentmail: 'AgentMail',` while s.webc held
       * `agentmail: { name: 'AgentMail', desc: … },`. Filtering to keys that are
       * real catalog slugs is what keeps it from firing on ordinary object
       * literals.
       */
      const literalPairs = [...source.matchAll(/\b([a-z][a-z0-9_.]{2,})\s*:\s*(?:['"][A-Z]|\{)/g)].map((m) => m[1]);
      const catalogSlugs = [...new Set(literalPairs.filter((key) => PROVIDER_DIRECTORY[key]))];
      assert.deepEqual(
        catalogSlugs,
        [],
        `${file} hardcodes provider names (${catalogSlugs.join(", ")}); read them from src/lib/provider-directory.js instead`,
      );
    });
  }

  test("the built Stack Share page carries all 65 providers", () => {
    const built = "dist/s/index.html";
    if (!existsSync(built)) return; // unit runs happen before a build
    const html = readFileSync(built, "utf8");
    const match = html.match(/data-provider-directory=(["'])([\s\S]*?)\1/);
    assert.ok(match, "dist/s/index.html has no injected provider directory");
    const decoded = match[2]
      .replaceAll("&quot;", '"')
      .replaceAll("&#39;", "'")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&amp;", "&");
    const directory = JSON.parse(decoded);
    const missing = SLUGS.filter((slug) => !directory[slug]);
    assert.deepEqual(missing, [], "providers missing from the built Stack Share page");
  });
});
