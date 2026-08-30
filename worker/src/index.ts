interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
}

interface HitCountRow {
  count: number;
}

const visitorIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function allowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  const origins = env.ALLOWED_ORIGINS.split(",").map((value) => value.trim());
  return origins.includes(origin) ? origin : null;
}

function responseHeaders(origin: string | null): Headers {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    Vary: "Origin",
  });
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }
  return headers;
}

function json(data: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders(origin),
  });
}

async function hitCount(database: D1Database): Promise<number> {
  const row = await database
    .prepare("SELECT COUNT(*) AS count FROM portfolio_hits")
    .first<HitCountRow>();
  return Number(row?.count ?? 0);
}

async function parseVisitorId(request: Request): Promise<string | null> {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || !("visitorId" in body)) return null;
    const visitorId = (body as { visitorId?: unknown }).visitorId;
    return typeof visitorId === "string" && visitorIdPattern.test(visitorId) ? visitorId : null;
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = allowedOrigin(request, env);
    const suppliedOrigin = request.headers.get("Origin");

    if (suppliedOrigin && !origin) return json({ error: "Origin not allowed" }, 403, null);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: responseHeaders(origin) });
    }
    if (url.pathname !== "/api/hits") return json({ error: "Not found" }, 404, origin);

    try {
      if (request.method === "GET") {
        return json({ count: await hitCount(env.DB) }, 200, origin);
      }

      if (request.method === "POST") {
        const visitorId = await parseVisitorId(request);
        if (!visitorId) return json({ error: "Invalid visitor ID" }, 400, origin);

        await env.DB
          .prepare("INSERT OR IGNORE INTO portfolio_hits (visitor_id) VALUES (?1)")
          .bind(visitorId)
          .run();
        return json({ count: await hitCount(env.DB) }, 200, origin);
      }

      return json({ error: "Method not allowed" }, 405, origin);
    } catch {
      return json({ error: "Database unavailable" }, 503, origin);
    }
  },
} satisfies ExportedHandler<Env>;
