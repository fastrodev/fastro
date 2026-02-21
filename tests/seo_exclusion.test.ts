import { assert, assertStringIncludes } from "@std/assert";

Deno.test("seo generator excludes draft and noindex posts", async () => {
  // Setup temp workspace
  const tmp = await Deno.makeTempDir();
  const postsDir = `${tmp}/posts`;
  await Deno.mkdir(postsDir, { recursive: true });

  // Published post
  const pub =
    `---\ntitle: Published\ndate: 2026-02-01\nimage: https://example.com/img.jpg\n---\nPublished content`;
  await Deno.writeTextFile(`${postsDir}/published.md`, pub);

  // Draft post
  const draft =
    `---\ntitle: Draft\ndraft: true\ndate: 2026-02-02\n---\nDraft content`;
  await Deno.writeTextFile(`${postsDir}/draft.md`, draft);

  // Noindex post
  const noindex =
    `---\ntitle: Noindex\nnoindex: true\ndate: 2026-02-03\n---\nNoindex content`;
  await Deno.writeTextFile(`${postsDir}/noindex.md`, noindex);

  // Run the seo generator as a subprocess with cwd set to tmp so it reads ./posts
  const modPath = new URL("../modules/index/seo.ts", import.meta.url).pathname;
  const cmd = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "--allow-read",
      "--allow-write",
      modPath,
      "http://example.test",
    ],
    cwd: tmp,
  });
  const { code, stderr } = await cmd.output();
  assert(
    code === 0,
    `seo generator failed: ${new TextDecoder().decode(stderr)}`,
  );

  // Read generated files
  const sitemap = await Deno.readTextFile(`${tmp}/public/sitemap.xml`);
  const feed = await Deno.readTextFile(`${tmp}/public/feed.json`);

  // Published should be present
  assertStringIncludes(sitemap, "/posts/published");
  assertStringIncludes(feed, "/posts/published");

  // Draft and noindex should NOT be present
  assert(!sitemap.includes("/posts/draft"), "draft found in sitemap");
  assert(!feed.includes("/posts/draft"), "draft found in feed");
  assert(!sitemap.includes("/posts/noindex"), "noindex found in sitemap");
  assert(!feed.includes("/posts/noindex"), "noindex found in feed");

  // Image entry should be present for published post in sitemap
  assertStringIncludes(sitemap, "https://example.com/img.jpg");
});
