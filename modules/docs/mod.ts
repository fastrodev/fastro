import { Fastro } from "@app/mod.ts";
import posts from "@app/modules/docs/docs.json" with { type: "json" };
import component from "./docs.page.tsx";
import layout from "./docs.layout.tsx";
import { getMarkdownBody } from "../../middleware/markdown/markdown-utils.tsx";

export default function (s: Fastro) {
  s.get("/docs", () => {
    const baseUrl = Deno.env.get("BASE_URL") || "http://localhost:8000";
    const url = new URL(`${baseUrl}/docs/start`);
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.toString(),
      },
    });
  });

  s.page("/docs/:file", {
    component,
    layout,
    folder: "modules/docs",
    handler: async (req, ctx) => {
      const markdownData = await getMarkdownBody(
        "docs",
        req.params?.file || "",
        "modules/docs",
      );

      if (!markdownData) {
        return ctx.render({
          posts,
          markdown: null,
          attrs: null,
          toc: null,
        });
      }

      const [jsxElement, attrs, toc] = markdownData;

      return ctx.render({
        posts,
        title: attrs?.title || "Documentation",
        description: attrs?.description || "Documentation for Fastro",
        image: attrs?.image || "https://fastro.dev/logo.png",
        markdown: jsxElement,
        attrs,
        toc,
        url: req.url,
        baseUrl: Deno.env.get("BASE_URL") || "http://localhost:8000",
        section: req.query?.section || "",
      });
    },
  });

  return s;
}
