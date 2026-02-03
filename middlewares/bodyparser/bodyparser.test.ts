import { assertEquals, assertExists } from "@std/assert";
import { bodyParser, BodyParserContext, BodyState } from "./bodyparser.ts";

Deno.test("bodyParser - should skip non-POST/PUT/PATCH methods", async () => {
  const req = new Request("http://localhost", { method: "GET" });
  const ctx = {} as BodyParserContext;
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
    return Promise.resolve(new Response("ok"));
  };

  await bodyParser(req, ctx, next);
  assertEquals(nextCalled, true);
  assertEquals(ctx.state, undefined);
});

Deno.test("bodyParser - should parse application/json", async () => {
  const data = { foo: "bar" };
  const req = new Request("http://localhost", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  const ctx = {} as BodyParserContext;
  const next = () => Promise.resolve(new Response("ok"));

  await bodyParser(req, ctx, next);
  assertEquals(ctx?.state?.json, data);
  assertEquals(ctx?.state?._parsed, true);
});

Deno.test("bodyParser - should parse multipart/form-data", async () => {
  const formData = new FormData();
  formData.append("username", "alice");
  const req = new Request("http://localhost", {
    method: "POST",
    body: formData,
  });
  // Request constructor handles content-type for FormData automatically
  const ctx = {} as BodyParserContext;
  const next = () => Promise.resolve(new Response("ok"));

  await bodyParser(req, ctx, next);
  assertExists(ctx?.state?.formData);
  assertEquals(ctx?.state?.formData.get("username"), "alice");
});

Deno.test("bodyParser - should parse application/x-www-form-urlencoded", async () => {
  const body = new URLSearchParams({ key: "value" });
  const req = new Request("http://localhost", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const ctx = {} as BodyParserContext;
  const next = () => Promise.resolve(new Response("ok"));

  await bodyParser(req, ctx, next);
  assertExists(ctx?.state?.formData);
  assertEquals(ctx?.state?.formData.get("key"), "value");
});

Deno.test("bodyParser - should parse text/*", async () => {
  const text = "hello world";
  const req = new Request("http://localhost", {
    method: "PUT",
    headers: { "content-type": "text/plain" },
    body: text,
  });
  const ctx = {} as BodyParserContext;
  const next = () => Promise.resolve(new Response("ok"));

  await bodyParser(req, ctx, next);
  assertEquals(ctx?.state?.text, text);
});

Deno.test("bodyParser - should parse raw bytes for unknown types", async () => {
  const bytes = new Uint8Array([1, 2, 3]);
  const req = new Request("http://localhost", {
    method: "POST",
    headers: { "content-type": "application/octet-stream" },
    body: bytes,
  });
  const ctx = {} as BodyParserContext;
  const next = () => Promise.resolve(new Response("ok"));

  await bodyParser(req, ctx, next);
  assertEquals(ctx?.state?.bytes, bytes);
});

Deno.test("bodyParser - should avoid re-parsing if _parsed is true", async () => {
  const req = new Request("http://localhost", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ a: 1 }),
  });
  const ctx = { state: { _parsed: true, json: { original: true } } } as BodyParserContext;
  const next = () => Promise.resolve(new Response("ok"));

  await bodyParser(req, ctx, next);
  const state = ctx.state as BodyState;
  const json = state.json as Record<string, boolean>;
  assertEquals(json.original, true);
});

Deno.test("bodyParser - should ignore if no content-type", async () => {
  const req = new Request("http://localhost", {
    method: "POST",
    headers: new Headers(),
    // Use undefined or null for body to avoid automatic content-type
    body: null,
  });

  const ctx = {} as BodyParserContext;
  const next = () => Promise.resolve(new Response("ok"));

  await bodyParser(req, ctx, next);
  assertEquals(ctx?.state?._parsed, undefined);
  assertEquals(ctx?.state?.json, undefined);
});

Deno.test("bodyParser - should capture error on invalid JSON", async () => {
  const req = new Request("http://localhost", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "invalid-json",
  });
  const ctx = {} as BodyParserContext;
  const next = () => Promise.resolve(new Response("ok"));

  await bodyParser(req, ctx, next);
  assertExists(ctx?.state?.bodyError);
  assertEquals(ctx?.state?._parsed, undefined);
});
