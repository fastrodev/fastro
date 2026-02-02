import { assertEquals, assertStringIncludes } from "@std/assert";
import {
  renderBlog,
  renderCode,
  renderMD,
  renderMD_Content,
  renderStatic,
} from "./render.ts";

Deno.test("renderStatic - success", async () => {
  // Use a file that exists in the repo
  const res = await renderStatic("README.md");
  assertEquals(res.status, 200);
  assertEquals(res.headers.get("content-type"), "text/html");
  const text = await res.text();
  assertStringIncludes(text, "Fastro");
});

Deno.test("renderStatic - failure", async () => {
  const res = await renderStatic("non_existent_file.html");
  assertEquals(res.status, 404);
  assertEquals(await res.text(), "Not found");
});

Deno.test("renderMD - success", async () => {
  const res = await renderMD("README.md");
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "<!DOCTYPE html>");
  assertStringIncludes(text, "Fastro");
});

Deno.test("renderMD - failure", async () => {
  const res = await renderMD("non-existent-file.md");
  assertEquals(res.status, 200); // Redirects to index.html which is 200
  await res.body?.cancel();
});

Deno.test("renderCode - success", async () => {
  const res = await renderCode("main.ts");
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "highlight");
  assertStringIncludes(text, "main.ts");
});

Deno.test("renderCode - failure", async () => {
  const res = await renderCode("non-existent-src.ts");
  assertEquals(res.status, 200); // Redirects to index.html
  await res.body?.cancel();
});

Deno.test("renderMD_Content - frontmatter variants", async () => {
  const content = `---
author: "Author Name"
image: "img.png"
---
No H1 here`;
  const res = await renderMD_Content(content, "test.md");
  const text = await res.text();
  assertStringIncludes(text, "Author Name");
  assertStringIncludes(text, "img.png");
});

Deno.test("renderMD_Content - blog path", async () => {
  const content = "Blog content";
  const res = await renderMD_Content(content, "blog");
  const text = await res.text();
  assertStringIncludes(text, "Blog content");
});

Deno.test("renderMD_Content - isBlogPost", async () => {
  const content = "# Post Title\nPost content";
  // Path starting with posts/ triggers isBlogPost styles
  const res = await renderMD_Content(content, "posts/post1.md");
  const text = await res.text();
  assertStringIncludes(text, "blog-post-content");
});

Deno.test("renderBlog - generates listing", async () => {
  const res = await renderBlog();
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "Fastro Blog");
});
