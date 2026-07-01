import type { IncomingMessage, ServerResponse } from "http";

interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  end(body?: string): VercelResponse;
  setHeader(name: string, value: string): this;
}

export default function handler(_req: IncomingMessage, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).end(
    JSON.stringify({
      status: "ok",
      service: "projects.dev",
      time: new Date().toISOString(),
    }),
  );
}
