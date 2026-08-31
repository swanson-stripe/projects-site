/*
 * Exercises the terminal 404 handler directly. Node 24 strips the TypeScript
 * annotations, so the source is imported with no build step.
 *
 * This handler is only reachable via the catch-all rewrites in vercel.json, which
 * cannot be exercised locally — the Eleventy dev server knows nothing about them.
 * So the routing order is asserted separately against vercel.json itself.
 */
import assert from "node:assert/strict";
import test, { describe } from "node:test";

import notFound from "../api/not-found.ts";

function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    end(body) {
      this.body = body;
      return this;
    },
  };
}

const call = (query) => {
  const res = mockResponse();
  notFound({ query, url: "/api/not-found" }, res);
  return res;
};

describe("JSON mode (unknown /api/ paths)", () => {
  test("returns 404 with an RFC 9457 problem document", () => {
    const res = call({ path: "/api/does-not-exist" });

    assert.equal(res.statusCode, 404);
    assert.equal(res.headers["content-type"], "application/problem+json; charset=utf-8");

    const problem = JSON.parse(res.body);
    assert.equal(problem.status, 404);
    assert.equal(problem.code, "not_found");
    assert.equal(problem.title, "Not Found");
    assert.equal(problem.instance, "/api/does-not-exist");
    assert.equal(problem.type, "https://projects.dev/docs/api/#not-found");
  });

  test("the detail gives a resolution hint, not just a restatement", () => {
    const problem = JSON.parse(call({ path: "/api/nope" }).body);
    assert.match(problem.detail, /\/api\/health/, "should name a real endpoint");
    assert.match(problem.detail, /openapi\.json/, "should point at the description");
    assert.ok(problem.documentation, "should link human documentation");
    assert.ok(problem.openapi, "should link the machine description");
  });

  test("is never cached and never content-sniffed", () => {
    const res = call({ path: "/api/nope" });
    assert.equal(res.headers["cache-control"], "no-store");
    assert.equal(res.headers["x-content-type-options"], "nosniff");
    assert.equal(res.headers["vary"], "Accept", "body varies by Accept");
  });

  test("advertises recovery resources in a Link header", () => {
    const link = call({ path: "/api/nope" }).headers["link"];
    assert.match(link, /<\/404\.md>; rel="alternate"; type="text\/markdown"/);
    assert.match(link, /<\/sitemap\.xml>; rel="sitemap"/);
  });
});

describe("markdown mode (Accept: text/markdown)", () => {
  test("returns 404 with a markdown body, not HTML", () => {
    const res = call({ path: "/whatever", format: "md" });

    assert.equal(res.statusCode, 404, "must be a real 404, not a 200");
    assert.equal(res.headers["content-type"], "text/markdown; charset=utf-8");
    assert.match(res.body, /^# Not found \(HTTP 404\)/);
    assert.ok(!res.body.includes("<html"), "body must not be HTML");
  });

  test("points at the sitemap, llms.txt, and a docs index", () => {
    const body = call({ path: "/whatever", format: "md" }).body;
    for (const target of ["/sitemap.xml", "/llms.txt", "/developers/", "/docs/api/", "/providers/"]) {
      assert.ok(body.includes(target), `markdown 404 should reference ${target}`);
    }
  });

  test("states that a 404 here is authoritative", () => {
    assert.match(call({ path: "/x", format: "md" }).body, /does not exist/);
  });
});

describe("path handling", () => {
  test("normalises a path that arrives without a leading slash", () => {
    assert.equal(JSON.parse(call({ path: "api/foo" }).body).instance, "/api/foo");
  });

  test("falls back to / when no path is supplied", () => {
    assert.equal(JSON.parse(call({}).body).instance, "/");
  });

  test("takes the first value when a param repeats", () => {
    assert.equal(JSON.parse(call({ path: ["/api/a", "/api/b"] }).body).instance, "/api/a");
  });
});
