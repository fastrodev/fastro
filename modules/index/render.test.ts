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
title: "Custom Title"
description: "Custom Desc"
author: "Author Name"
image: "img.png"
date: 2024-01-01
tags: [tag1, tag2]
---
No H1 here`;
  const res = await renderMD_Content(content, "test.md");
  const text = await res.text();
  assertStringIncludes(text, "<title>Custom Title</title>");
  assertStringIncludes(text, "Custom Desc");
  assertStringIncludes(text, "Author Name");
  assertStringIncludes(text, "img.png");
  assertStringIncludes(text, "tag1");
});

Deno.test("renderMD_Content - invalid frontmatter", async () => {
  const content = "---\ntitle: test\n# Text";
  const res = await renderMD_Content(content, "test.md");
  const text = await res.text();
  // It shouldn't find the title because the closing --- is missing
  assertStringIncludes(text, "<title>Text</title>");
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

Deno.test("renderMD_Content - math blocks", async () => {
  const content = "Math: $$ x^2 $$ and $y$";
  const res = await renderMD_Content(content, "test.md");
  const text = await res.text();
  // The placeholders are restored to original math blocks in the final HTML
  assertStringIncludes(text, "$$ x^2 $$");
  assertStringIncludes(text, "$y$");
});

Deno.test("renderMD_Content - title fallback", async () => {
  const content = "Just content";
  const res = await renderMD_Content(content, "mypage");
  const text = await res.text();
  assertStringIncludes(text, "<title>Fastro - mypage</title>");
});

Deno.test("renderMD_Content - non-MD path", async () => {
  const content = "# Some Content";
  // Path not ending in .md and not "blog"
  const res = await renderMD_Content(content, "other.txt");
  const text = await res.text();
  assertStringIncludes(text, "Some Content");
});

Deno.test("renderBlog - generates listing", async () => {
  const res = await renderBlog();
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "Fastro Blog");
});

Deno.test("renderBlog - search in content", async () => {
  // "Deno" is likely in several posts
  const res = await renderBlog(1, "Deno");
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, 'value="Deno"');
});

Deno.test("renderBlog - search in tags", async () => {
  // "middleware" is a tag in some posts
  const res = await renderBlog(1, "middleware");
  assertEquals(res.status, 200);
  const text = await res.text();
  assertStringIncludes(text, "middleware");
});

Deno.test("renderBlog - pagination variants", async () => {
  const res1 = await renderBlog(1);
  const text1 = await res1.text();
  assertStringIncludes(text1, "Next");

  const res2 = await renderBlog(2);
  const text2 = await res2.text();
  assertStringIncludes(text2, "Prev");
  assertStringIncludes(text2, "Next");

  const res3 = await renderBlog(3);
  const text3 = await res3.text();
  assertStringIncludes(text3, "Prev");

  const res4 = await renderBlog(999); // Overflow
  assertEquals(res4.status, 200);

  const resOverflowSearch = await renderBlog(999, "fastro");
  assertEquals(resOverflowSearch.status, 200);

  const resUnderflow = await renderBlog(0);
  assertEquals(resUnderflow.status, 200);

  const res5 = await renderBlog(2, "fastro"); // search with multiple pages
  const text5 = await res5.text();
  assertStringIncludes(text5, "search=fastro");
});

Deno.test("renderBlog - edge cases", async () => {
  // Setup dummy files
  await Deno.mkdir("./posts/dummy-dir", { recursive: true });
  await Deno.writeTextFile("./posts/dummy.txt", "not a md file");
  await Deno.writeTextFile(
    "./posts/test-edge-3.md",
    "---\ntitle: test edge 3\ndate: 2030-01-01\ntags: test, edge\n---\ncontent",
  );
  await Deno.writeTextFile(
    "./posts/test-edge-4.md",
    "---\ntitle: test edge 4\ndate: 2030-01-02\ntags: [test, edge]\n---\ncontent",
  );
  await Deno.writeTextFile(
    "./posts/test-edge-5.md",
    '---\ntitle: test edge 5\ndate: 2030-01-03\ntags: ["only"]\n---\ncontent',
  );
  await Deno.writeTextFile(
    "./posts/test-edge-6.md",
    "---\nunclosed frontmatter\ncontent",
  );
  await Deno.writeTextFile(
    "./posts/test-edge-7.md",
    "no frontmatter at all",
  );

  const res = await renderBlog(1, "test edge");
  const result = await res.text();
  assertStringIncludes(result, "test edge 3");
  assertStringIncludes(result, "test edge 4");
  assertStringIncludes(result, "test edge 5");
  assertStringIncludes(result, "2030-01-01");
  assertStringIncludes(result, "only");

  const res3 = await renderBlog(1, "only");
  const result3 = await res3.text();
  assertStringIncludes(result3, "test edge 5");

  const resEmpty = await renderBlog(1, "xyz123nonexistent");
  const textEmpty = await resEmpty.text();
  assertStringIncludes(textEmpty, "No articles found");

  // Cleanup
  await Deno.remove("./posts/dummy-dir", { recursive: true });
  await Deno.remove("./posts/dummy.txt");
  await Deno.remove("./posts/test-edge-3.md");
  await Deno.remove("./posts/test-edge-4.md");
  await Deno.remove("./posts/test-edge-5.md");
  await Deno.remove("./posts/test-edge-6.md");
  await Deno.remove("./posts/test-edge-7.md");
});

Deno.test("renderMD_Content - blog post", async () => {
  const content = `---
title: Blog Title
date: 2024-01-01
---
# Content`;
  const res = await renderMD_Content(content, "posts/test.md");
  const result = await res.text();
  assertStringIncludes(result, "Blog Title");
  assertStringIncludes(result, "2024-01-01");
});

Deno.test("renderMD_Content - frontmatter variants 2", async () => {
  const content = `---
title: Single Quotes
description: 'Single'
tags: tag1, tag2
---
# Content`;
  const res = await renderMD_Content(content, "test.md");
  const text = await res.text();
  assertStringIncludes(text, "<title>Single Quotes</title>");
  assertStringIncludes(text, "Single");
  assertStringIncludes(text, "tag1");
});

Deno.test("renderMD_Content - frontmatter variants 3", async () => {
  const content = `---
tags: [tag3, tag4]
---
# Content`;
  const res = await renderMD_Content(content, "test.md");
  const text = await res.text();
  assertStringIncludes(text, "tag3");
  assertStringIncludes(text, "tag4");
});

Deno.test("renderMD_Content - missing frontmatter fields", async () => {
  const content = `---
title: Test
---
# Content`;
  const res = await renderMD_Content(content, "test.md");
  const text = await res.text();
  assertStringIncludes(text, "Test");
});

Deno.test("renderMD_Content - title from H1", async () => {
  const content = `# H1 Title
Body content`;
  const res = await renderMD_Content(content, "test.md");
  const text = await res.text();
  assertStringIncludes(text, "<title>H1 Title</title>");
  // Ensure H1 is removed from body (it's in the title, and GFM would render it if not removed)
  // Actually GFM render(md) will render the md.
});

Deno.test("renderMD_Content - no title fallback", async () => {
  const content = `Body content`;
  const res = await renderMD_Content(content, "some-path");
  const text = await res.text();
  assertStringIncludes(text, "<title>Fastro - some-path</title>");
});

Deno.test("renderMD_Content - non-MD path", async () => {
  const content = "plain text";
  const res = await renderMD_Content(content, "plain");
  const text = await res.text();
  assertStringIncludes(text, "plain text");
});

Deno.test("renderMD_Content - extra frontmatter", async () => {
  const content = `---
title: Title
description: Desc
image: img.png
---
# Content`;
  const res = await renderMD_Content(content, "test.md");
  const text = await res.text();
  assertStringIncludes(text, "Title");
  assertStringIncludes(text, "Desc");
  assertStringIncludes(text, "img.png");
});

Deno.test("renderMD_Content - empty tags", async () => {
  const content = `---
tags:
---
# Content`;
  const res = await renderMD_Content(content, "test.md");
  const text = await res.text();
  assertStringIncludes(text, "Content");
});

Deno.test("renderBlog - match content only", async () => {
  const content = "---\ntitle: unique title\n---\nmatchme content";
  await Deno.writeTextFile("./posts/matchme.md", content);
  try {
    const res = await renderBlog(1, "matchme");
    const html = await res.text();
    assertStringIncludes(html, "unique title");
  } finally {
    await Deno.remove("./posts/matchme.md");
  }
});

Deno.test("renderBlog - complex tags", async () => {
  const content = `---
tags: ["complex tag", 'another one']
---
content`;
  await Deno.writeTextFile("./posts/complex-tags.md", content);
  try {
    const res = await renderBlog(1, "complex");
    const html = await res.text();
    assertStringIncludes(html, "complex tag");
    assertStringIncludes(html, "another one");
  } finally {
    await Deno.remove("./posts/complex-tags.md");
  }
});
Deno.test("renderMD_Content - blog post variants", async () => {
  const content = `---
title: blog post
date: 2024-01-01
author: fastro
tags: [test, blog]
---
# h1 title
content`;
  const res = await renderMD_Content(content, "posts/blog.md");
  const html = await res.text();
  assertStringIncludes(html, "blog-post-content");
  assertStringIncludes(html, "blog post");
  assertStringIncludes(html, "fastro");
  assertStringIncludes(html, "2024-01-01");
});

Deno.test("renderBlog - pagination next", async () => {
  // Create 5 more dummy posts to have > 4 posts total
  for (let i = 6; i <= 10; i++) {
    await Deno.writeTextFile(
      `./posts/test-edge-${i}.md`,
      `---\ntitle: test edge ${i}\n---\ncontent`,
    );
  }

  try {
    const res = await renderBlog(1);
    const html = await res.text();
    assertStringIncludes(html, "Next");
    assertStringIncludes(html, "page=2");

    const res2 = await renderBlog(2);
    const html2 = await res2.text();
    assertStringIncludes(html2, "Prev");
    assertStringIncludes(html2, "page=1");
  } finally {
    for (let i = 6; i <= 10; i++) {
      try {
        await Deno.remove(`./posts/test-edge-${i}.md`);
      } catch (_) {
        // Ignore
      }
    }
  }
});
