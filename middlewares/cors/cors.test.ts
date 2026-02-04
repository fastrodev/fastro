import { assertEquals, assertNotEquals } from "@std/assert";
import { cors, corsMiddleware } from "./cors.ts";

const next = () => Promise.resolve(new Response("ok"));

Deno.test("cors - should skip if no Origin header", async () => {
    const req = new Request("http://localhost");
    let nextCalled = false;
    const n = () => {
        nextCalled = true;
        return next();
    };
    await corsMiddleware(req, {} as any, n);
    assertEquals(nextCalled, true);
});

Deno.test("cors - should skip if origin is not allowed", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://malicious.com" }
    });
    const middleware = cors({ origin: "http://trusted.com" });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), null);
});

Deno.test("cors - should allow all origins by default", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://anything.com" }
    });
    const res = await corsMiddleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "*");
});

Deno.test("cors - should allow origin matching string", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://trusted.com" }
    });
    const middleware = cors({ origin: "http://trusted.com" });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "http://trusted.com");
    assertEquals(res.headers.get("Vary"), "Origin");
});

Deno.test("cors - should allow origin matching array", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://b.com" }
    });
    const middleware = cors({ origin: ["http://a.com", "http://b.com"] });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "http://b.com");
});

Deno.test("cors - should allow origin matching regex", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "https://foo.trusted.com" }
    });
    const middleware = cors({ origin: /\.trusted\.com$/ });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "https://foo.trusted.com");
});

Deno.test("cors - should allow origin based on function returning true", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://test.com" }
    });
    const middleware = cors({ origin: (o) => o?.includes("test") || false });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "http://test.com");
});

Deno.test("cors - should allow origin based on function returning string", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://test.com" }
    });
    const middleware = cors({ origin: () => "http://explicit.com" });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "http://explicit.com");
});

Deno.test("cors - should allow origin based on function returning truthy", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://test.com" }
    });
    const middleware = cors({ origin: () => ({}) as any });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "http://test.com");
});

Deno.test("cors - should deny origin based on function returning false", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://test.com" }
    });
    const middleware = cors({ origin: () => false });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), null);
});

Deno.test("cors - should reflect origin and set Vary when credentials is true and origin is *", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://test.com" }
    });
    const middleware = cors({ credentials: true, origin: "*" });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "http://test.com");
    assertEquals(res.headers.get("Access-Control-Allow-Credentials"), "true");
    assertEquals(res.headers.get("Vary"), "Origin");
});

Deno.test("cors - should handle exposeHeaders", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://test.com" }
    });
    const middleware = cors({ exposeHeaders: ["X-Custom-Header"] });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Expose-Headers"), "X-Custom-Header");
});

Deno.test("cors - should handle preflight request with success status", async () => {
    const req = new Request("http://localhost", {
        method: "OPTIONS",
        headers: {
            "Origin": "http://test.com",
            "Access-Control-Request-Method": "POST"
        }
    });
    const middleware = cors({ optionsSuccessStatus: 200 });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.status, 200);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "*");
    assertEquals(res.headers.get("Access-Control-Allow-Methods"), "GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS");
});

Deno.test("cors - should handle preflight request with custom methods and headers", async () => {
    const req = new Request("http://localhost", {
        method: "OPTIONS",
        headers: {
            "Origin": "http://test.com",
            "Access-Control-Request-Method": "PUT",
            "Access-Control-Request-Headers": "X-Requested-With"
        }
    });
    const middleware = cors({ allowMethods: ["PUT"], allowHeaders: ["X-Header"] });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Methods"), "PUT");
    assertEquals(res.headers.get("Access-Control-Allow-Headers"), "X-Header");
});

Deno.test("cors - should reflect Access-Control-Request-Headers in preflight if allowHeaders not provided", async () => {
    const req = new Request("http://localhost", {
        method: "OPTIONS",
        headers: {
            "Origin": "http://test.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "X-Requested-With, Content-Type"
        }
    });
    const res = await corsMiddleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Headers"), "X-Requested-With, Content-Type");
    assertEquals(res.headers.get("Vary"), "Access-Control-Request-Headers");
});

Deno.test("cors - should handle maxAge in preflight", async () => {
    const req = new Request("http://localhost", {
        method: "OPTIONS",
        headers: {
            "Origin": "http://test.com",
            "Access-Control-Request-Method": "POST"
        }
    });
    const middleware = cors({ maxAge: 3600 });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Max-Age"), "3600");
});

Deno.test("cors - should continue to next middleware in preflight if preflightContinue is true", async () => {
    const req = new Request("http://localhost", {
        method: "OPTIONS",
        headers: {
            "Origin": "http://test.com",
            "Access-Control-Request-Method": "POST"
        }
    });
    let nextCalled = false;
    const n = () => {
        nextCalled = true;
        return Promise.resolve(new Response("preflight next", { headers: { "X-From-Next": "true" } }));
    };
    const middleware = cors({ preflightContinue: true });
    const res = await middleware(req, {} as any, n);
    assertEquals(nextCalled, true);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "*");
    assertEquals(res.headers.get("X-From-Next"), "true");
});

Deno.test("cors - should return null if origin type is unexpected", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://test.com" }
    });
    const middleware = cors({ origin: {} as any });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), null);
});

Deno.test("cors - should deny origin if array doesn't include it", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://c.com" }
    });
    const middleware = cors({ origin: ["http://a.com", "http://b.com"] });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), null);
});

Deno.test("cors - should deny origin if regex doesn't match", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://untrusted.com" }
    });
    const middleware = cors({ origin: /\.trusted\.com$/ });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), null);
});

Deno.test("cors - should not set Allow-Headers if both provided and requested are missing", async () => {
    const req = new Request("http://localhost", {
        method: "OPTIONS",
        headers: {
            "Origin": "http://test.com",
            "Access-Control-Request-Method": "POST"
        }
    });
    const middleware = cors({ allowHeaders: [] });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Headers"), null);
});

Deno.test("cors - should handle credentials true with specific origin", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://trusted.com" }
    });
    const middleware = cors({ credentials: true, origin: "http://trusted.com" });
    const res = await middleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Allow-Origin"), "http://trusted.com");
    assertEquals(res.headers.get("Access-Control-Allow-Credentials"), "true");
    assertEquals(res.headers.get("Vary"), "Origin");
});

Deno.test("cors - should not set Access-Control-Expose-Headers if missing", async () => {
    const req = new Request("http://localhost", {
        headers: { "Origin": "http://test.com" }
    });
    const res = await corsMiddleware(req, {} as any, next);
    assertEquals(res.headers.get("Access-Control-Expose-Headers"), null);
});
