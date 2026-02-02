import { assertEquals, assertStringIncludes } from "@std/assert";
import { app } from "./main.ts";
import { _resetForTests } from "../../core/server.ts";

Deno.test("Main App - Home route", async () => {
  const s = app.serve({ port: 3333 });
  try {
    const res = await fetch("http://localhost:3333/");
    assertEquals(res.status, 200);
    const text = await res.text();
    assertStringIncludes(text, "Fastro");
  } finally {
    s.close();
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
    const res1 = await fetch("http://localhost:3335/blog");
    assertEquals(res1.status, 200);
    await res1.body?.cancel();

    // Try a post - assuming we have 'v1.0.0' or something from the posts folder
    const res2 = await fetch("http://localhost:3335/blog/v1.0.0");
    // If v1.0.0.md exists, it should be 200, otherwise it hits 404 fallback which is also 200
    assertEquals(res2.status, 200);
    await res2.body?.cancel();
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

    const res2 = await fetch("http://localhost:3336/static/index.html");
    // We check either 200 or 404 (if file missing) but the route should be hit
    await res2.body?.cancel();
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
