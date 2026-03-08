import { assertEquals } from "@std/assert";
import { staticFiles } from "./static.ts";
import { Context } from "../../core/types.ts";

Deno.test("staticFiles Extra - polite behavior: router takes precedence", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/index.html`, "static content");
  try {
    const middleware = staticFiles("/", tempDir);
    const req = new Request("http://localhost/");
    const ctx = {} as Context;
    const next = () =>
      Promise.resolve(new Response("route content", { status: 200 }));

    const resp = await middleware(req, ctx, next);
    assertEquals(await resp.text(), "route content");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles Extra - empty indexFile with fallback works for root", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/index.html`, "static home");
  try {
    const middleware = staticFiles("/", tempDir, {
      indexFile: "",
      fallback: "index.html",
    });
    const req = new Request("http://localhost/");
    const ctx = {} as Context;
    const next = () =>
      Promise.resolve(new Response("Not found", { status: 404 }));

    const resp = await middleware(req, ctx, next);
    // Pathname becomes "/", relative "", readFile fails, fallback "index.html" is served.
    assertEquals(await resp.text(), "static home");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles Extra - explicit fallback takes precedence over indexFile on 404", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/index.html`, "index");
  await Deno.writeTextFile(`${tempDir}/fallback.html`, "fallback");
  try {
    const middleware = staticFiles("/", tempDir, {
      indexFile: "index.html",
      fallback: "fallback.html",
    });
    const req = new Request("http://localhost/non-existent");
    const ctx = {} as Context;
    const next = () =>
      Promise.resolve(new Response("Not found", { status: 404 }));

    const resp = await middleware(req, ctx, next);
    assertEquals(await resp.text(), "fallback");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
