/*
 * Asserts the machine-readable surface agents depend on survives a build.
 * Runs against dist/, so `npm run build` must come first (`npm test` does both).
 *
 * These are contract tests: each assertion maps to something an agent or crawler
 * reads. If one fails, a published protocol has broken, not just an internal detail.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import test, { describe } from "node:test";

import providers from "../src/_data/providers.js";

const DIST = new URL("../dist/", import.meta.url);

function read(relativePath) {
  const path = new URL(relativePath, DIST);
  assert.ok(existsSync(path), `dist/${relativePath} is missing — did the build run?`);
  return readFileSync(path, "utf8");
}

function readJson(relativePath) {
  const raw = read(relativePath);
  try {
    return JSON.parse(raw);
  } catch (error) {
    assert.fail(`dist/${relativePath} is not valid JSON: ${error.message}`);
  }
}

describe("404 handling", () => {
  test("404.html is emitted at the root so Vercel serves it", () => {
    const html = read("404.html");
    assert.match(html, /Page not found/i);
  });

  test("404.html points agents at recovery resources", () => {
    const html = read("404.html");
    for (const target of ["/llms.txt", "/sitemap.xml", "/skill.md", "/404.md", "/developers/"]) {
      assert.ok(html.includes(target), `404.html should link ${target}`);
    }
  });

  test("404.html is marked noindex so the error page stays out of search", () => {
    const html = read("404.html");
    assert.match(html, /<meta name="robots" content="noindex, follow">/);
  });

  test("404.md exists and lists where to look next", () => {
    const md = read("404.md");
    assert.match(md, /^# Page not found \(HTTP 404\)/m);
    for (const target of ["/providers/", "/developers/", "/llms.txt", "/sitemap.xml"]) {
      assert.ok(md.includes(target), `404.md should reference ${target}`);
    }
  });

  test("the 404 page is excluded from the sitemap", () => {
    const sitemap = read("sitemap.xml");
    assert.ok(!sitemap.includes("/404"), "sitemap must not advertise the 404 page");
  });
});

describe("JSON-LD structured data", () => {
  test("homepage emits one parseable ld+json block", () => {
    const html = read("index.html");
    const blocks = [...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    )];
    assert.equal(blocks.length, 1, "expected exactly one JSON-LD block on the homepage");

    const data = JSON.parse(blocks[0][1]);
    assert.equal(data["@context"], "https://schema.org");
    assert.equal(data["@type"], "SoftwareApplication");
    assert.equal(data.name, "Stripe Projects");
    assert.equal(data.url, "https://projects.dev/");
    assert.ok(data.description?.length > 0, "JSON-LD needs a description");
    assert.equal(data.applicationCategory, "DeveloperApplication");
    assert.equal(data.publisher["@type"], "Organization");
    assert.ok(Array.isArray(data.publisher.sameAs) && data.publisher.sameAs.length > 0);
  });

  test("the unbranded marketplace does not claim to be Stripe Projects", () => {
    const marketplace = "marketplace/bold/index.html";
    if (!existsSync(new URL(marketplace, DIST))) return; // marketplace build is optional
    assert.ok(
      !read(marketplace).includes("application/ld+json"),
      "marketplace pages ship unbranded and must not emit Stripe Projects JSON-LD",
    );
  });
});

describe("OpenAPI description", () => {
  const spec = () => readJson("api/openapi.json");

  test("is valid OpenAPI 3.1 with a semver version", () => {
    const doc = spec();
    assert.equal(doc.openapi, "3.1.0");
    assert.match(doc.info.version, /^\d+\.\d+\.\d+$/);
  });

  test("declares no authentication explicitly rather than by omission", () => {
    const doc = spec();
    assert.deepEqual(doc.security, [], "root security must be an empty array");
    assert.equal(
      doc.components.securitySchemes,
      undefined,
      "no securitySchemes should be declared — there are no protected resources",
    );
  });

  test("defines an RFC 9457 typed error model", () => {
    const problem = spec().components.schemas.Problem;
    assert.ok(problem, "components.schemas.Problem is required");
    for (const field of ["type", "title", "status", "code", "detail"]) {
      assert.ok(problem.properties[field], `Problem needs a ${field} property`);
      assert.ok(problem.required.includes(field), `Problem.${field} must be required`);
    }
    assert.ok(
      Array.isArray(problem.properties.code.enum) && problem.properties.code.enum.length > 0,
      "Problem.code must enumerate its machine-readable values",
    );
  });

  test("every 4xx/5xx response uses problem+json", () => {
    const doc = spec();
    let checked = 0;
    for (const [path, item] of Object.entries(doc.paths)) {
      for (const [method, operation] of Object.entries(item)) {
        for (const [status, response] of Object.entries(operation.responses)) {
          if (Number(status) < 400) continue;
          checked += 1;
          const resolved = response.$ref
            ? doc.components.responses[response.$ref.split("/").pop()]
            : response;
          assert.ok(
            resolved.content?.["application/problem+json"],
            `${method.toUpperCase()} ${path} ${status} must return application/problem+json`,
          );
        }
      }
    }
    assert.ok(checked > 0, "expected at least one documented error response");
  });

  test("publishes a versioning and deprecation policy", () => {
    const policy = spec()["x-deprecation-policy"];
    assert.ok(policy, "x-deprecation-policy is required");
    assert.match(policy.breakingChangeNotice, /^P\d+D$/, "notice period must be an ISO 8601 duration");
    const headers = policy.signals.map((signal) => signal.header);
    assert.ok(headers.includes("Deprecation"), "policy must signal Deprecation (RFC 9745)");
    assert.ok(headers.includes("Sunset"), "policy must signal Sunset (RFC 8594)");
  });

  test("error type URIs resolve to anchors that exist in the docs", () => {
    const doc = spec();
    const html = read("docs/api/index.html");
    const uris = new Set(
      JSON.stringify(doc)
        .match(/https:\/\/projects\.dev\/docs\/api\/#[a-z0-9-]+/g) ?? [],
    );
    assert.ok(uris.size > 0, "expected at least one problem type URI");
    for (const uri of uris) {
      const anchor = uri.split("#")[1];
      assert.ok(
        html.includes(`id="${anchor}"`),
        `${uri} does not resolve — /docs/api/ has no element with id="${anchor}"`,
      );
    }
  });
});

describe("API catalog", () => {
  test("is a valid RFC 9727 linkset anchored on the API, not a single endpoint", () => {
    const catalog = readJson(".well-known/api-catalog");
    assert.ok(Array.isArray(catalog.linkset) && catalog.linkset.length > 0);

    const [entry] = catalog.linkset;
    assert.equal(entry.anchor, "https://projects.dev/api/");
    for (const relation of ["service-desc", "service-doc", "service-meta", "status"]) {
      assert.ok(
        Array.isArray(entry[relation]) && entry[relation].length > 0,
        `linkset entry needs a ${relation} link`,
      );
      for (const link of entry[relation]) {
        assert.match(link.href, /^https:\/\/projects\.dev\//, `${relation} href must be absolute`);
      }
    }
    assert.equal(entry["service-desc"][0].type, "application/openapi+json");
  });
});

describe("agent discovery files", () => {
  test("every advertised discovery file is actually built", () => {
    for (const file of [
      "llms.txt",
      "skill.md",
      "auth.md",
      "index.html.md",
      "404.md",
      "robots.txt",
      "sitemap.xml",
      "api/openapi.json",
      ".well-known/api-catalog",
      ".well-known/agent-skills/index.json",
    ]) {
      assert.ok(
        existsSync(new URL(file, DIST)),
        `dist/${file} is advertised to agents but was not built`,
      );
    }
  });

  test("auth.md is unambiguous that no OAuth is offered", () => {
    const md = read("auth.md");
    assert.match(md, /requires no authentication/i);
    assert.match(md, /oauth-authorization-server/, "should name the endpoints that intentionally 404");
    assert.match(md, /docs\.stripe\.com/, "should point at where real auth lives");
  });

  test("robots.txt and llms.txt advertise the developer portal", () => {
    assert.match(read("robots.txt"), /^Allow: \/developers\/$/m);
    assert.ok(read("llms.txt").includes("https://projects.dev/developers/"));
  });

  /*
   * The digest lets a client verify it fetched the skill it was promised. It had
   * gone stale, so a verifying agent would have rejected /skill.md as tampered.
   * Checking the format alone did not catch that — hash the bytes.
   */
  test("the agent skill digest matches the skill it points at", () => {
    const index = readJson(".well-known/agent-skills/index.json");
    const skill = index.skills.find((entry) => entry.url === "/skill.md");
    assert.ok(skill, "expected a skill entry for /skill.md");
    assert.match(skill.digest, /^sha256:[0-9a-f]{64}$/);

    const actual = `sha256:${createHash("sha256")
      .update(readFileSync(new URL("skill.md", DIST)))
      .digest("hex")}`;
    assert.equal(
      skill.digest,
      actual,
      "digest does not match the built skill.md — run npm run sync:skill",
    );
  });
});

/*
 * index.html.md is what `/` returns under `Accept: text/markdown`, so an agent may
 * follow its commands verbatim. It drifted once into documenting a CLI that did not
 * exist (`projects create`, `projects service add`); these tests pin it to llms.txt,
 * which is the authoritative command reference.
 */
describe("markdown homepage command reference", () => {
  const subcommands = (source) =>
    new Set(
      [...source.matchAll(/stripe projects ([a-z][a-z-]*)/g)].map((match) => match[1]),
    );

  test("documents no CLI subcommand that llms.txt does not list", () => {
    const documented = subcommands(read("index.html.md"));
    const authoritative = subcommands(read("llms.txt"));
    assert.ok(documented.size > 0, "expected some commands to be documented");

    const invented = [...documented].filter((name) => !authoritative.has(name));
    assert.deepEqual(
      invented,
      [],
      `index.html.md documents command(s) absent from llms.txt: ${invented.join(", ")}`,
    );
  });

  test("tells agents to install the plugin, not just the CLI", () => {
    assert.match(read("index.html.md"), /stripe plugin install projects/);
  });

  test("addresses services as provider/service", () => {
    const md = read("index.html.md");
    assert.match(md, /stripe projects add <provider>\/<service>/);
    assert.ok(
      !/projects service add/.test(md),
      "`projects service add` is not a real command",
    );
  });

  test("carries no slash commands or retired promotions", () => {
    const md = read("index.html.md");
    for (const dead of ["/contest", "Mac Mini", "openclaw"]) {
      assert.ok(!md.includes(dead), `index.html.md still references ${dead}`);
    }
    assert.ok(
      !/^\| `\/[a-z]+`/m.test(md),
      "slash commands are not part of the CLI surface",
    );
  });

  test("points at projects.dev rather than a stale marketing URL", () => {
    const md = read("index.html.md");
    assert.match(md, /\*\*Website:\*\* https:\/\/projects\.dev/);
    assert.ok(
      !md.includes("https://stripe.com/projects"),
      "https://stripe.com/projects is not the product site",
    );
  });
});

/*
 * llms.txt and index.html.md both list the provider catalog, and both had drifted
 * (37 and 16 entries against 63 on /providers). They are now generated by
 * `npm run sync:providers`; these tests fail if the data changes without a re-sync.
 */
/*
 * The home page's "Get started" button is the canonical install command. Every
 * agent-facing surface that tells someone how to install must agree with it —
 * /developers advertised brew-only plus a retired `install <url>` skill form, and
 * llms.txt and index.html.md had their own third and fourth variants.
 */
describe("install command parity", () => {
  const canonicalSteps = () => {
    const attribute = read("index.html").match(/data-copy-expand="([^"]*)"/);
    assert.ok(attribute, "home page should expose the canonical command");
    return attribute[1]
      .replaceAll("&amp;", "&")
      .split("&&")
      .map((part) => part.trim())
      .filter(Boolean);
  };

  test("the home page command covers CLI, plugin, and skill", () => {
    const steps = canonicalSteps();
    assert.equal(steps.length, 3, `expected 3 steps, got: ${steps.join(" | ")}`);
    assert.match(steps[0], /^npm install -g @stripe\/cli/);
    assert.match(steps[1], /^stripe plugin install projects$/);
    assert.match(steps[2], /^npx skills add /);
  });

  for (const file of ["developers/index.html", "llms.txt", "index.html.md"]) {
    test(`${file} matches every step of the home page command`, () => {
      const source = read(file);
      const missing = canonicalSteps().filter((step) => !source.includes(step));
      assert.deepEqual(missing, [], `${file} is missing: ${missing.join(" | ")}`);
    });

    test(`${file} does not use the retired skill install form`, () => {
      assert.ok(
        !read(file).includes("install https://projects.dev/skill.md"),
        `${file} still tells agents to run \`install <url>\`; the skill uses npx skills add`,
      );
    });
  }

  test("skill.md offers a command on every platform, not just macOS", () => {
    const skill = read("skill.md");
    assert.match(skill, /npm install -g @stripe\/cli@latest/);
    assert.match(skill, /brew install stripe\/stripe-cli\/stripe/);
  });
});

describe("provider catalog coverage", () => {
  const slugs = providers.map((provider) => provider.slug);

  for (const file of ["llms.txt", "index.html.md"]) {
    test(`${file} lists every provider in the catalog`, () => {
      const source = read(file);
      const missing = slugs.filter((slug) => !source.includes(slug));
      assert.deepEqual(
        missing,
        [],
        `${file} is ${missing.length} provider(s) behind — run npm run sync:providers`,
      );
    });

    test(`${file} states the correct provider count`, () => {
      assert.ok(
        read(file).includes(`${providers.length} providers`),
        `${file} should state a count of ${providers.length}`,
      );
    });

    test(`${file} advertises no slug outside the catalog`, () => {
      const known = new Set(slugs);
      const used = [...read(file).matchAll(/projects add ([a-z0-9_.-]+\/[a-z0-9_.-]+)/g)]
        .map((match) => match[1])
        .filter((slug) => !slug.includes("<"));
      const invented = [...new Set(used)].filter((slug) => !known.has(slug));
      assert.deepEqual(invented, [], `${file} references non-existent service(s)`);
    });
  }

  test("the catalog matches what /providers renders", () => {
    const rendered = new Set(
      [...read("providers/index.html").matchAll(
        /stripe projects add ([a-z0-9_.-]+\/[a-z0-9_.-]+)/g,
      )].map((match) => match[1]),
    );
    assert.deepEqual(
      slugs.filter((slug) => !rendered.has(slug)),
      [],
      "provider data contains entries the /providers page does not render",
    );
    assert.equal(rendered.size, providers.length);
  });

  test("every provider entry has the fields the docs render", () => {
    for (const provider of providers) {
      for (const field of ["name", "slug", "category", "url"]) {
        assert.ok(provider[field], `provider ${provider.slug ?? "?"} is missing ${field}`);
      }
      assert.match(provider.slug, /^[a-z0-9_.-]+\/[a-z0-9_.-]+$/, `bad slug: ${provider.slug}`);
      assert.ok(
        provider.longDescription || provider.description,
        `provider ${provider.slug} needs a description`,
      );
    }
  });
});

describe("markdown homepage framing", () => {
  test("describes provisioning, not app scaffolding", () => {
    const md = read("index.html.md");
    assert.match(md, /Provision and manage services from the CLI/);
    for (const stale of [
      "scaffolds production-ready",
      "Run one command and get a working app",
      "generates a complete, working full-stack application",
    ]) {
      assert.ok(!md.includes(stale), `stale framing still present: "${stale}"`);
    }
  });

  test("is consistent with the llms.txt positioning", () => {
    assert.match(read("index.html.md"), /plugin for the Stripe CLI/);
  });
});

describe("developer portal", () => {
  test("is built at /developers/ with the product name in title and h1", () => {
    const html = read("developers/index.html");
    assert.match(html, /<title>[^<]*Stripe Projects[^<]*<\/title>/);
    assert.match(html, /<h1[^>]*>Stripe Projects for developers<\/h1>/);
  });

  test("names its developer resources so they are findable", () => {
    const html = read("developers/index.html");
    for (const resource of [
      "/skill.md",
      "/api/openapi.json",
      "/.well-known/api-catalog",
      "/auth.md",
      "/providers/",
      "stripe plugin install projects",
    ]) {
      assert.ok(html.includes(resource), `/developers/ should name ${resource}`);
    }
  });

  test("offers the macOS install the home page uses on Mac", () => {
    assert.match(
      read("developers/index.html"),
      /brew install stripe\/stripe-cli\/stripe &amp;&amp; stripe plugin install projects/,
    );
  });

  test("documents the error format and the deprecation policy", () => {
    const html = read("developers/index.html");
    assert.match(html, /problem\+json/);
    assert.match(html, /Deprecation/);
    assert.match(html, /Sunset/);
  });

  test("is linked from the branded footers", () => {
    for (const page of ["index.html", "providers/index.html", "docs/api/index.html"]) {
      if (!existsSync(new URL(page, DIST))) continue;
      assert.ok(
        read(page).includes('href="/developers/"'),
        `${page} footer should link /developers/`,
      );
    }
  });

  test("appears in the sitemap", () => {
    assert.ok(read("sitemap.xml").includes("https://projects.dev/developers/"));
  });
});
