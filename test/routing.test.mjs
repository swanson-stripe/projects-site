/*
 * Guards the rewrite order in vercel.json.
 *
 * Vercel matches rewrites top-down, first win, and only reaches them after static
 * files and named functions fail to resolve. Two catch-alls now sit at the bottom
 * (`/api/:path*` and `/:path*`). Anything appended after them is dead, and any
 * proxy that drifts below them stops working — the leaderboard is proxied through
 * six /api/* rewrites, so this is not hypothetical.
 *
 * JSON cannot carry comments, so the invariant lives here instead.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test, { describe } from "node:test";

const config = JSON.parse(
  readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
);
const rewrites = config.rewrites;
const indexOf = (source) => rewrites.findIndex((rule) => rule.source === source);

describe("vercel.json rewrites", () => {
  test("every entry is a well-formed rule", () => {
    rewrites.forEach((rule, i) => {
      assert.equal(typeof rule, "object", `rewrite ${i} is not an object`);
      assert.ok(rule.source, `rewrite ${i} has no source`);
      assert.ok(rule.destination, `rewrite ${i} has no destination`);
    });
  });

  test("the two catch-alls are the last two rules, in order", () => {
    assert.equal(rewrites.at(-2).source, "/api/:path*", "/api catch-all must be second-to-last");
    assert.equal(rewrites.at(-1).source, "/:path*", "site-wide catch-all must be last");
  });

  test("every leaderboard proxy stays ahead of the /api catch-all", () => {
    const catchAll = indexOf("/api/:path*");
    const proxied = rewrites
      .map((rule, i) => ({ ...rule, i }))
      .filter((rule) => rule.destination.includes("stripe-projects-leaderboard"));

    assert.ok(proxied.length >= 6, "expected the leaderboard proxies to still be present");
    for (const rule of proxied) {
      assert.ok(
        rule.i < catchAll,
        `${rule.source} sits below the /api catch-all and would never fire`,
      );
    }
  });

  test("the v1 aliases resolve before the catch-all swallows them", () => {
    const catchAll = indexOf("/api/:path*");
    for (const source of ["/api/v1/health", "/api/v1/og"]) {
      const at = indexOf(source);
      assert.ok(at >= 0, `${source} rewrite is missing`);
      assert.ok(at < catchAll, `${source} must precede the /api catch-all`);
    }
  });

  test("v1 aliases point at the real handlers", () => {
    assert.equal(rewrites[indexOf("/api/v1/health")].destination, "/api/health");
    assert.equal(rewrites[indexOf("/api/v1/og")].destination, "/api/og");
  });

  test("the /api catch-all forwards the original path for `instance`", () => {
    const rule = rewrites[indexOf("/api/:path*")];
    assert.match(rule.destination, /^\/api\/not-found\?path=/);
    assert.match(rule.destination, /:path\*/, "must interpolate the matched path");
  });

  /*
   * Without the Accept condition this rule would swallow every 404 on the site and
   * turn each one into a function invocation. Gating it keeps browser traffic on the
   * static 404.html.
   */
  test("the site-wide catch-all only fires for markdown requests", () => {
    const rule = rewrites.at(-1);
    assert.ok(Array.isArray(rule.has) && rule.has.length === 1, "must be conditional");

    const [condition] = rule.has;
    assert.equal(condition.type, "header");
    assert.equal(condition.key, "accept");
    assert.match(condition.value, /text\/markdown/);
    assert.match(rule.destination, /format=md/);
  });

  test("nothing shadows the two real API functions", () => {
    for (const path of ["/api/health", "/api/og"]) {
      assert.equal(
        indexOf(path),
        -1,
        `${path} must stay a filesystem function, not a rewrite source`,
      );
    }
  });
});
