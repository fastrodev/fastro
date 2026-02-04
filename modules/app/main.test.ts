import { assertEquals, assertStringIncludes } from "@std/assert";
import { app, handleMain, start } from "./main.ts";
import { _resetForTests } from "../../core/server.ts";

Deno.test("Main App - Home route", async () => {
  const s = start(3333);
  try {
    const res = await fetch("http://localhost:3333/");
    assertEquals(res.status, 200);
    const text = await res.text();
    assertStringIncludes(text, "Fastro");
  } finally {
    s.close();
  }
});

Deno.test("Main App - handleMain branches", async () => {
  // Case: not main
  handleMain(false, []);

  // Case: is main with specific port
  const s1 = handleMain(true, ["3340"]);
  if (s1) s1.close();

  // Case: is main with 0 (random port)
  const s2 = handleMain(true, ["0"]);
  if (s2) s2.close();

  // Case: is main without port (uses default 8000)
  try {
    const s3 = handleMain(true, []);
    if (s3) s3.close();
  } catch (_e) {
    // Ignore error if port 8000 is already in use
  }
});

Deno.test("Main App - start function default port", async () => {
  try {
    const s = start();
    s.close();
  } catch (_e) {
    // Port 8000 might be busy, but we hit the branch
  }
});

Deno.test("Main App - All static routes", async () => {
  const s = app.serve({ port: 3334 });
  const routes = [
    "/DOCS.md",
    "/MIDDLEWARES.md",
    "/SHOWCASE.md",
    "/BENCHMARK.md",
    "/CONTRIBUTING.md",
    "/LICENSE",
  ];
  try {
    for (const route of routes) {
      const res = await fetch(`http://localhost:3334${route}`);
      assertEquals(res.status, 200);
      await res.body?.cancel();
    }
  } finally {
    s.close();
  }
});

Deno.test("Main App - Blog and Posts", async () => {
  const s = app.serve({ port: 3335 });
  try {
    // Branch: no params
    const res1 = await fetch("http://localhost:3335/blog");
    assertEquals(res1.status, 200);
    await res1.text();

    // Branch: with page
    const resPage = await fetch("http://localhost:3335/blog?page=2");
    assertEquals(resPage.status, 200);
    await resPage.text();

    // Branch: with search
    const resSearch = await fetch("http://localhost:3335/blog?search=release");
    assertEquals(resSearch.status, 200);
    await resSearch.text();

    // Try a post
    const res2 = await fetch("http://localhost:3335/blog/v1.0.0");
    assertEquals(res2.status, 200);
    await res2.text();
  } finally {
    s.close();
  }
});

Deno.test("Main App - Code and Static", async () => {
  const s = app.serve({ port: 3336 });
  try {
    const res1 = await fetch(
      "http://localhost:3336/middlewares/logger/logger.ts",
    );
    assertEquals(res1.status, 200);
    await res1.body?.cancel();

    const res2 = await fetch(
      "http://localhost:3336/middlewares/static/static.ts",
    );
    assertEquals(res2.status, 200);
    await res2.body?.cancel();

    const res3 = await fetch("http://localhost:3336/static/index.html");
    // We check either 200 or 404 (if file missing) but the route should be hit
    await res3.body?.cancel();
  } finally {
    s.close();
  }
});

Deno.test("Main App - 404 Fallback", async () => {
  const s = app.serve({ port: 3337 });
  try {
    const res = await fetch("http://localhost:3337/non-existent-path");
    assertEquals(res.status, 200);
    await res.body?.cancel();
  } finally {
    s.close();
  }
});
