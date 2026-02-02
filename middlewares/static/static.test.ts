import { assertEquals } from "@std/assert";
import { FakeTime } from "@std/testing/time";
import { staticFiles } from "./static.ts";
import { Context } from "../../core/types.ts";

async function createTestFiles(dir: string) {
  await Deno.writeTextFile(
    `${dir}/index.html`,
    "<html><body>index</body></html>",
  );
  await Deno.writeTextFile(`${dir}/test.txt`, "hello world");
  await Deno.mkdir(`${dir}/subdir`);
  await Deno.writeTextFile(`${dir}/subdir/sub.html`, "sub content");
}

Deno.test("staticFiles - serve index.html for root", async () => {
  const tempDir = await Deno.makeTempDir();
  await createTestFiles(tempDir);

  try {
    const middleware = staticFiles("/", tempDir);
    const req = new Request("http://localhost/");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    const resp = await middleware(req, ctx, next);
    assertEquals(resp.status, 200);
    assertEquals(await resp.text(), "<html><body>index</body></html>");
    assertEquals(resp.headers.get("Content-Type"), "text/html");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - serve specific file", async () => {
  const tempDir = await Deno.makeTempDir();
  await createTestFiles(tempDir);

  try {
    const middleware = staticFiles("/static", tempDir);
    const req = new Request("http://localhost/static/test.txt");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    const resp = await middleware(req, ctx, next);
    assertEquals(resp.status, 200);
    assertEquals(await resp.text(), "hello world");
    assertEquals(resp.headers.get("Content-Type"), "text/plain");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - serve file in subdirectory", async () => {
  const tempDir = await Deno.makeTempDir();
  await createTestFiles(tempDir);

  try {
    const middleware = staticFiles("/", tempDir);
    const req = new Request("http://localhost/subdir/sub.html");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    const resp = await middleware(req, ctx, next);
    assertEquals(resp.status, 200);
    assertEquals(await resp.text(), "sub content");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - ignore non-GET method", async () => {
  const tempDir = await Deno.makeTempDir();
  try {
    const middleware = staticFiles("/", tempDir);
    const req = new Request("http://localhost/", { method: "POST" });
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    const resp = await middleware(req, ctx, next);
    assertEquals(await resp.text(), "next");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - ignore non-matching prefix", async () => {
  const tempDir = await Deno.makeTempDir();
  try {
    const middleware = staticFiles("/static", tempDir);
    const req = new Request("http://localhost/other/test.txt");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    const resp = await middleware(req, ctx, next);
    assertEquals(await resp.text(), "next");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - spaFallback serves index.html on missing files", async () => {
  const tempDir = await Deno.makeTempDir();
  await createTestFiles(tempDir);
  try {
    const middleware = staticFiles("/", tempDir, { spaFallback: true });
    const req = new Request("http://localhost/any-route");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    const resp = await middleware(req, ctx, next);
    assertEquals(resp.status, 200);
    assertEquals(await resp.text(), "<html><body>index</body></html>");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - production cache behavior", async () => {
  const tempDir = await Deno.makeTempDir();
  const filePath = `${tempDir}/cache-test.txt`;
  await Deno.writeTextFile(filePath, "initial content");

  // Set production environment to enable cache
  const originalEnv = Deno.env.get("ENV");
  Deno.env.set("ENV", "production");

  try {
    const middleware = staticFiles("/", tempDir);
    const req = new Request("http://localhost/cache-test.txt");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    // First request: loads from disk and caches
    const resp1 = await middleware(req, ctx, next);
    assertEquals(await resp1.text(), "initial content");

    // Modify file on disk
    await Deno.writeTextFile(filePath, "modified content");

    // Second request: should still return cached initial content
    const resp2 = await middleware(req, ctx, next);
    assertEquals(await resp2.text(), "initial content");
    assertEquals(resp2.headers.get("Cache-Control"), "public, max-age=3600");
  } finally {
    if (originalEnv) Deno.env.set("ENV", originalEnv);
    else Deno.env.delete("ENV");
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - unknown mime type", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/data.unknown`, "unknown");
  try {
    const middleware = staticFiles("/", tempDir);
    const req = new Request("http://localhost/data.unknown");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    const resp = await middleware(req, ctx, next);
    assertEquals(resp.status, 200);
    assertEquals(resp.headers.get("Content-Type"), "application/octet-stream");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - custom index file", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/main.html`, "main");
  try {
    const middleware = staticFiles("/", tempDir, { indexFile: "main.html" });
    const req = new Request("http://localhost/");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    const resp = await middleware(req, ctx, next);
    assertEquals(await resp.text(), "main");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - normalized path and prefix", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/test.txt`, "test");
  try {
    // Test dirPath with ./ and urlPrefix with trailing slash
    const middleware = staticFiles("/static/", `./${tempDir}`);
    const req = new Request("http://localhost/static/test.txt");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    const resp = await middleware(req, ctx, next);
    assertEquals(await resp.text(), "test");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - spa fallback cache in production", async () => {
  const tempDir = await Deno.makeTempDir();
  const indexContent = "<html><body>fallback</body></html>";
  await Deno.writeTextFile(`${tempDir}/index.html`, indexContent);

  const originalEnv = Deno.env.get("ENV");
  Deno.env.set("ENV", "production");

  try {
    const middleware = staticFiles("/", tempDir, { spaFallback: true });
    const req = new Request("http://localhost/missing");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    // First request: loads fallback and caches
    const resp1 = await middleware(req, ctx, next);
    assertEquals(await resp1.text(), indexContent);

    // Modify file
    await Deno.writeTextFile(`${tempDir}/index.html`, "changed");

    // Second request: served from cache
    const resp2 = await middleware(req, ctx, next);
    assertEquals(await resp2.text(), indexContent);
  } finally {
    if (originalEnv) Deno.env.set("ENV", originalEnv);
    else Deno.env.delete("ENV");
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - LRU eviction", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalEnv = Deno.env.get("ENV");
  Deno.env.set("ENV", "production");

  try {
    const middleware = staticFiles("/", tempDir);
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    // Create and request 101 files (over the limit of 100)
    for (let i = 0; i < 101; i++) {
      const path = `${tempDir}/file${i}.txt`;
      await Deno.writeTextFile(path, `content ${i}`);
      await middleware(new Request(`http://localhost/file${i}.txt`), ctx, next);
    }

    // Attempting to request file0.txt should now be a cache miss/re-read from disk
    await Deno.writeTextFile(`${tempDir}/file0.txt`, "new content");
    const resp = await middleware(
      new Request(`http://localhost/file0.txt`),
      ctx,
      next,
    );
    assertEquals(await resp.text(), "new content");
  } finally {
    if (originalEnv) Deno.env.set("ENV", originalEnv);
    else Deno.env.delete("ENV");
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - complete failure", async () => {
  const tempDir = await Deno.makeTempDir();
  try {
    const middleware = staticFiles("/", tempDir, { spaFallback: true });
    const req = new Request("http://localhost/not-found");
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    // index.html for fallback also doesn't exist
    const resp = await middleware(req, ctx, next);
    assertEquals(await resp.text(), "next");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - cache expiry", async () => {
  const time = new FakeTime();
  try {
    const tempDir = await Deno.makeTempDir();
    const filePath = `${tempDir}/expire.txt`;
    await Deno.writeTextFile(filePath, "initial");

    const originalEnv = Deno.env.get("ENV");
    Deno.env.set("ENV", "production");

    try {
      const middleware = staticFiles("/", tempDir);
      const req = new Request("http://localhost/expire.txt");
      const ctx = {} as Context;
      const next = () => Promise.resolve(new Response("next"));

      // First load (caches it)
      await middleware(req, ctx, next);

      // Modify file
      await Deno.writeTextFile(filePath, "expired");

      // Advance time by 2 hours
      time.tick(3600000 * 2);

      // Second load should notice expiry and re-read from disk
      const resp = await middleware(req, ctx, next);
      assertEquals(await resp.text(), "expired");
    } finally {
      if (originalEnv) Deno.env.set("ENV", originalEnv);
      else Deno.env.delete("ENV");
      await Deno.remove(tempDir, { recursive: true });
    }
  } finally {
    time.restore();
  }
});

Deno.test("staticFiles - spa fallback cache expiry", async () => {
  const time = new FakeTime();
  try {
    const tempDir = await Deno.makeTempDir();
    const indexPath = `${tempDir}/index.html`;
    await Deno.writeTextFile(indexPath, "initial fallback");

    const originalEnv = Deno.env.get("ENV");
    Deno.env.set("ENV", "production");

    try {
      const middleware = staticFiles("/", tempDir, { spaFallback: true });
      const req = new Request("http://localhost/missing-page");
      const ctx = {} as Context;
      const next = () => Promise.resolve(new Response("next"));

      // First load (caches fallback)
      await middleware(req, ctx, next);

      // Modify index
      await Deno.writeTextFile(indexPath, "expired fallback");

      // Advance time
      time.tick(3600000 * 2);

      // Second load should re-read fallback
      const resp = await middleware(req, ctx, next);
      assertEquals(await resp.text(), "expired fallback");
    } finally {
      if (originalEnv) Deno.env.set("ENV", originalEnv);
      else Deno.env.delete("ENV");
      await Deno.remove(tempDir, { recursive: true });
    }
  } finally {
    time.restore();
  }
});

Deno.test("staticFiles - spa fallback LRU eviction", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalEnv = Deno.env.get("ENV");
  Deno.env.set("ENV", "production");

  try {
    const middleware = staticFiles("/", tempDir, { spaFallback: true });
    const ctx = {} as Context;
    const next = () => Promise.resolve(new Response("next"));

    // Fill cache with 100 dummy files
    for (let i = 0; i < 100; i++) {
      const path = `${tempDir}/dummy${i}.txt`;
      await Deno.writeTextFile(path, "dummy");
      await middleware(
        new Request(`http://localhost/dummy${i}.txt`),
        ctx,
        next,
      );
    }

    // Trigger fallback (index.html), which should trigger eviction since size is 100
    await Deno.writeTextFile(`${tempDir}/index.html`, "fallback");
    const resp = await middleware(
      new Request("http://localhost/missing"),
      ctx,
      next,
    );
    assertEquals(await resp.text(), "fallback");
  } finally {
    if (originalEnv) Deno.env.set("ENV", originalEnv);
    else Deno.env.delete("ENV");
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - subdirectory with trailing slash", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.mkdir(`${tempDir}/sub`);
  await Deno.writeTextFile(`${tempDir}/sub/index.html`, "sub index");
  try {
    const middleware = staticFiles("/", tempDir);
    const resp = await middleware(
      new Request("http://localhost/sub/"),
      {} as Context,
      () => Promise.resolve(new Response("next")),
    );
    assertEquals(await resp.text(), "sub index");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - empty pathname result", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/index.html`, "empty path");
  try {
    const middleware = staticFiles("/static", tempDir);
    const resp = await middleware(
      new Request("http://localhost/static"),
      {} as Context,
      () => Promise.resolve(new Response("next")),
    );
    assertEquals(await resp.text(), "empty path");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});

Deno.test("staticFiles - file without extension", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/noext`, "no extension");
  try {
    const middleware = staticFiles("/", tempDir);
    const resp = await middleware(
      new Request("http://localhost/noext"),
      {} as Context,
      () => Promise.resolve(new Response("next")),
    );
    assertEquals(await resp.text(), "no extension");
  } finally {
    await Deno.remove(tempDir, { recursive: true });
  }
});
