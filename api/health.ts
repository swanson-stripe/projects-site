import type { IncomingMessage, ServerResponse } from "http";

/*
 * `end` is inherited from ServerResponse rather than redeclared — narrowing it to
 * `(body?: string)` conflicts with the base signature and is a type error.
 */
interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  setHeader(name: string, value: string): this;
}

const SERVICE = "projects.dev";
const DOCS = "https://projects.dev/docs/api/";

/*
 * RFC 9457 problem details. `code` is the stable, machine-readable identifier
 * agents should branch on; `title` and `detail` are for humans. Kept in sync
 * with the Problem schema in public/api/openapi.json.
 */
function problem(
  res: VercelResponse,
  status: number,
  code: string,
  title: string,
  detail: string,
  instance: string,
) {
  res.setHeader("Content-Type", "application/problem+json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(status).end(
    JSON.stringify({
      type: `${DOCS}#${code.replaceAll("_", "-")}`,
      title,
      status,
      code,
      detail,
      instance,
    }),
  );
}

export default function handler(req: IncomingMessage, res: VercelResponse) {
  const instance = req.url ?? "/api/health";

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    problem(
      res,
      405,
      "method_not_allowed",
      "Method Not Allowed",
      `This endpoint only supports GET and HEAD. Received ${req.method ?? "an unknown method"}.`,
      instance,
    );
    return;
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).end(
    JSON.stringify({
      status: "ok",
      service: SERVICE,
      time: new Date().toISOString(),
    }),
  );
}
