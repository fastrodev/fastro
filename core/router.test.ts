import { assert, assertEquals, assertThrows } from "@std/assert";
import { createRouter } from "./router.ts";
import type { Context, Handler, Middleware } from "./types.ts";

Deno.test("createRouter forwards GET to server", () => {
  const calls: Array<
    { method: string; path: string; handler: Handler; mws: Middleware[] }
  > = [];
  const mock = {
    get: (p: string, h: Handler, ...m: Middleware[]) => {
      calls.push({ method: "GET", path: p, handler: h, mws: m });
      return undefined;
    },
    post: () => undefined,
    put: () => undefined,
    delete: () => undefined,
    patch: () => undefined,
    head: () => undefined,
    options: () => undefined,
    use: () => undefined,
    serve: () => ({ close: () => undefined }),
  } as Parameters<typeof createRouter>[0];

  const r = createRouter(mock);
  r.get("/ping", () => new Response("pong"));

  assertEquals(calls.length, 1);
  assertEquals(calls[0].path, "/ping");
  assert(calls[0].handler instanceof Function);
});

Deno.test("builder.build returns noop middleware", async () => {
  const mock = {
    get: () => undefined,
    post: () => undefined,
    put: () => undefined,
    delete: () => undefined,
    patch: () => undefined,
    head: () => undefined,
    options: () => undefined,
    use: () => undefined,
    serve: () => ({ close: () => undefined }),
  } as Parameters<typeof createRouter>[0];
  const r = createRouter(mock);
  const mw = r.build();
  const res = await mw(
    new Request("http://localhost/"),
    {} as unknown as Context,
    () => new Response("ok"),
  );
  assertEquals(await res.text(), "ok");
});

Deno.test("createRouter forwards all methods to server", () => {
  const called: string[] = [];
  const mock = {
    get: (_p: string, _h: Handler, ..._m: Middleware[]) => called.push("get"),
    post: () => called.push("post"),
    put: () => called.push("put"),
    delete: () => called.push("delete"),
    patch: () => called.push("patch"),
    head: () => called.push("head"),
    options: () => called.push("options"),
    use: () => undefined,
    serve: () => ({ close: () => undefined }),
  } as Parameters<typeof createRouter>[0];

  const r = createRouter(mock);
  r.get("/a", () => new Response("a"));
  r.post("/b", () => new Response("b"));
  r.put("/c", () => new Response("c"));
  r.delete("/d", () => new Response("d"));
  r.patch("/e", () => new Response("e"));
  r.head("/f", () => new Response("f"));
  r.options("/g", () => new Response("g"));

  assertEquals(called, [
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "head",
    "options",
  ]);
});

Deno.test("createRouter throws without server", () => {
  assertThrows(() => {
    // bypass TS by casting to any
    // @ts-ignore - intentional runtime assertion
    // deno-lint-ignore no-explicit-any
    (createRouter as any)(null);
  }, Error);
});
