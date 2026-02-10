import { assert, assertEquals, assertExists } from "@std/assert";
import { createToken, jwt, verifyToken } from "./jwt.ts";
import Fastro from "../../mod.ts";
import { _resetForTests } from "../../core/server.ts";

const SECRET = "very-secret-key";

Deno.test("JWT - create and verify token", async () => {
  const payload = { sub: "123", name: "John Doe" };
  const token = await createToken(payload, SECRET);
  assertExists(token);

  const decoded = await verifyToken(token, SECRET);
  assertExists(decoded);
  assertEquals(decoded?.sub, "123");
  assertEquals(decoded?.name, "John Doe");
});

Deno.test("JWT - verify invalid token format", async () => {
  const decoded = await verifyToken("invalid.token", SECRET);
  assertEquals(decoded, null);
});

Deno.test("JWT - verify invalid signature", async () => {
  const payload = { sub: "123" };
  const token = await createToken(payload, SECRET);
  const tamperedToken = token.substring(0, token.lastIndexOf(".") + 1) +
    "invalid-sig";
  const decoded = await verifyToken(tamperedToken, SECRET);
  assertEquals(decoded, null);
});

Deno.test("JWT - verify expired token", async () => {
  // Expired 1 hour ago
  const payload = { sub: "123", exp: Math.floor(Date.now() / 1000) - 3600 };
  const token = await createToken(payload, SECRET);
  const decoded = await verifyToken(token, SECRET);
  assertEquals(decoded, null);
});

Deno.test("JWT - verify valid expiration", async () => {
  // Expires in 1 hour
  const payload = { sub: "123", exp: Math.floor(Date.now() / 1000) + 3600 };
  const token = await createToken(payload, SECRET);
  const decoded = await verifyToken(token, SECRET);
  assertExists(decoded);
});

Deno.test("JWT - verify invalid base64 in parts", async () => {
  // This will cause JSON.parse or decode to fail
  const token = "header.payload.signature";
  const decoded = await verifyToken(token, SECRET);
  assertEquals(decoded, null);
});

Deno.test("JWT Middleware - successful authentication", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(jwt({ secret: SECRET }));
  fastro.get("/", (_req, ctx) => {
    return ctx.state?.user;
  });

  const s = fastro.serve({ port: 3500 });
  try {
    const token = await createToken({ id: 1 }, SECRET);
    const res = await fetch("http://localhost:3500/", {
      headers: { "Authorization": `Bearer ${token}` },
    });
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data.id, 1);
  } finally {
    s.close();
  }
});

Deno.test("JWT Middleware - existing state", async () => {
  _resetForTests();
  const fastro = new Fastro();
  // Middleware to set initial state
  fastro.use((_req, ctx, next) => {
    ctx.state = { existing: true };
    return next();
  });
  fastro.use(jwt({ secret: SECRET }));
  fastro.get("/", (_req, ctx) => {
    return ctx.state ?? {};
  });

  const s = fastro.serve({ port: 3505 });
  try {
    const token = await createToken({ id: 1 }, SECRET);
    const res = await fetch("http://localhost:3505/", {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    assertEquals(data.existing, true);
    assertEquals(data.user.id, 1);
  } finally {
    s.close();
  }
});

Deno.test("JWT - verify token without exp", async () => {
  const payload = { sub: "123" };
  const token = await createToken(payload, SECRET);
  const decoded = await verifyToken(token, SECRET);
  assertExists(decoded);
});

// Helper for manual token creation in tests
function base64urlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(data),
  );
  return base64urlEncode(new Uint8Array(signature));
}

Deno.test("JWT - verify token with invalid exp type", async () => {
  const header = { alg: "HS256", typ: "JWT" };
  // exp is a string instead of a number
  const payload = { sub: "123", exp: "invalid" };

  const headerPart = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(header)),
  );
  const payloadPart = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const data = `${headerPart}.${payloadPart}`;
  const signaturePart = await sign(data, SECRET);
  const token = `${data}.${signaturePart}`;

  const decoded = await verifyToken(token, SECRET);
  assertExists(decoded);
});

Deno.test("JWT - verify token with invalid JSON payload", async () => {
  const header = base64urlEncode(
    new TextEncoder().encode(JSON.stringify({ alg: "HS256" })),
  );
  const payload = base64urlEncode(new TextEncoder().encode("not-a-json"));
  const data = `${header}.${payload}`;
  const signature = await sign(data, SECRET);
  const token = `${data}.${signature}`;

  const decoded = await verifyToken(token, SECRET);
  assertEquals(decoded, null);
});

Deno.test("JWT - verify token with data that triggers all base64url replacements", async () => {
  // Payloads that result in +, / and = in base64
  // We use values that are known to produce these characters after JSON stringify + base64
  const payload = { data: ">>>>????" };
  const token = await createToken(payload, SECRET);
  // Verify it doesn't contain forbidden chars and it is decodable
  assert(!token.includes("+"));
  assert(!token.includes("/"));
  assert(!token.includes("="));

  const decoded = await verifyToken<{ data: string }>(token, SECRET);
  assertEquals(decoded?.data, payload.data);
});

Deno.test("JWT - verify token with exp 0", async () => {
  const token = await createToken({ exp: 0 }, SECRET);
  const payload = await verifyToken(token, SECRET);
  // payload.exp is 0, payload.exp && typeof payload.exp === "number" is false
  // so it returns the payload. This is a bit weird but follows the current logic.
  assertExists(payload);
});

Deno.test("JWT - verify token with exp in past", async () => {
  const token = await createToken(
    { exp: Math.floor(Date.now() / 1000) - 10 },
    SECRET,
  );
  const payload = await verifyToken(token, SECRET);
  assertEquals(payload, null);
});

Deno.test("JWT Middleware - missing header", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(jwt({ secret: SECRET }));
  fastro.get("/", () => "ok");

  const s = fastro.serve({ port: 3501 });
  try {
    const res = await fetch("http://localhost:3501/");
    assertEquals(res.status, 401);
    assertEquals(await res.text(), "Unauthorized");
  } finally {
    s.close();
  }
});

Deno.test("JWT Middleware - invalid prefix", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(jwt({ secret: SECRET }));
  fastro.get("/", () => "ok");

  const s = fastro.serve({ port: 3502 });
  try {
    const res = await fetch("http://localhost:3502/", {
      headers: { "Authorization": "Basic text" },
    });
    assertEquals(res.status, 401);
    await res.text();
  } finally {
    s.close();
  }
});

Deno.test("JWT Middleware - invalid token", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(jwt({ secret: SECRET }));
  fastro.get("/", () => "ok");

  const s = fastro.serve({ port: 3503 });
  try {
    const res = await fetch("http://localhost:3503/", {
      headers: { "Authorization": "Bearer invalid.token" },
    });
    assertEquals(res.status, 401);
    await res.text();
  } finally {
    s.close();
  }
});

Deno.test("JWT Middleware - token in cookie", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(jwt({ secret: SECRET }));
  fastro.get("/", (_req, ctx) => ctx.state?.user ?? {});

  const s = fastro.serve({ port: 3510 });
  try {
    const token = await createToken({ id: 42 }, SECRET);
    const res = await fetch("http://localhost:3510/", {
      headers: { "Cookie": `other=1; token=${encodeURIComponent(token)};` },
    });
    assertEquals(res.status, 200);
    const data = await res.json();
    assertEquals(data.id, 42);
  } finally {
    s.close();
  }
});

Deno.test("JWT Middleware - cookie without token should 401", async () => {
  _resetForTests();
  const fastro = new Fastro();
  fastro.use(jwt({ secret: SECRET }));
  fastro.get("/", () => "ok");

  const s = fastro.serve({ port: 3511 });
  try {
    const res = await fetch("http://localhost:3511/", {
      headers: { "Cookie": "session=abc;" },
    });
    assertEquals(res.status, 401);
    assertEquals(await res.text(), "Unauthorized");
  } finally {
    s.close();
  }
});
