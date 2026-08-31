/*
 * Exercises the /api/health handler directly. Node 24 strips the TypeScript
 * annotations, so the source is imported as-is with no build step.
 */
import assert from "node:assert/strict";
import test, { describe } from "node:test";

import health from "../api/health.ts";

/* Minimal stand-in for the Vercel response object the handlers expect. */
function mockResponse() {
  const res = {
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
  return res;
}

describe("GET /api/health", () => {
  test("returns 200 with a well-formed health body", () => {
    const res = mockResponse();
    health({ method: "GET", url: "/api/health" }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers["content-type"], "application/json; charset=utf-8");
    assert.equal(res.headers["cache-control"], "no-store");

    const body = JSON.parse(res.body);
    assert.equal(body.status, "ok");
    assert.equal(body.service, "projects.dev");
    assert.ok(
      !Number.isNaN(Date.parse(body.time)),
      "time must be a parseable RFC 3339 timestamp",
    );
  });

  test("HEAD is allowed", () => {
    const res = mockResponse();
    health({ method: "HEAD", url: "/api/health" }, res);
    assert.equal(res.statusCode, 200);
  });
});

describe("unsupported methods on /api/health", () => {
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
    test(`${method} returns RFC 9457 problem details`, () => {
      const res = mockResponse();
      health({ method, url: "/api/health" }, res);

      assert.equal(res.statusCode, 405);
      assert.equal(
        res.headers["content-type"],
        "application/problem+json; charset=utf-8",
        "errors must not be served as plain application/json",
      );
      assert.equal(res.headers["allow"], "GET, HEAD");

      const problem = JSON.parse(res.body);
      assert.equal(problem.status, 405);
      assert.equal(problem.code, "method_not_allowed");
      assert.equal(problem.title, "Method Not Allowed");
      assert.equal(problem.instance, "/api/health");
      assert.equal(
        problem.type,
        "https://projects.dev/docs/api/#method-not-allowed",
        "type must dereference to the documented anchor",
      );
      assert.ok(
        problem.detail.includes(method),
        "detail should name the method that was rejected",
      );
    });
  }

  test("an absent method does not produce a malformed body", () => {
    const res = mockResponse();
    health({ url: "/api/health" }, res);

    assert.equal(res.statusCode, 405);
    const problem = JSON.parse(res.body);
    assert.equal(problem.code, "method_not_allowed");
    assert.ok(!problem.detail.includes("undefined"), "detail must not leak `undefined`");
  });

  test("falls back to a sane instance when the URL is missing", () => {
    const res = mockResponse();
    health({ method: "POST" }, res);
    assert.equal(JSON.parse(res.body).instance, "/api/health");
  });
});
