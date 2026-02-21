import { renderBlog } from "../modules/index/render_blog.ts";
import { renderMD_Content } from "../modules/index/render_md.ts";

async function main() {
  // Check paginated blog page for prev/next
  const resp = await renderBlog(2, "");
  const html = await resp.text();
  console.log("--- Blog page (page=2) head checks ---");
  console.log("has rel=prev:", html.includes('<link rel="prev"'));
  console.log("has rel=next:", html.includes('<link rel="next"'));

  // Check a real post page for noindex (use synthetic draft content and a real post)
  try {
    const real = await Deno.readTextFile(
      new URL("../posts/eclipse.md", import.meta.url),
    );
    const realResp = await renderMD_Content(
      real,
      "posts/eclipse",
      undefined,
      "http://localhost/posts/eclipse",
    );
    const realHtml = await realResp.text();
    console.log(
      "--- Real post (eclipse) has noindex:",
      realHtml.includes('name="robots"'),
    );
  } catch (e) {
    console.log("could not read real post: ", e.message);
  }

  const draftMd =
    `---\ntitle: Draft Test\ndraft: true\n---\n# Draft Test\nThis is a draft.`;
  const draftResp = await renderMD_Content(
    draftMd,
    "posts/draft-test",
    undefined,
    "http://localhost/posts/draft-test",
  );
  const draftHtml = await draftResp.text();
  console.log(
    "--- Synthetic draft has noindex:",
    draftHtml.includes('name="robots"'),
  );
}

if (import.meta.main) {
  main();
}
