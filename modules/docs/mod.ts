import { Fastro } from "@app/mod.ts";
import posts from "@app/modules/docs/docs.json" with { type: "json" };
import component from "./docs.page.tsx";
import layout from "./docs.layout.tsx";
import { getMarkdownBody } from "../../middleware/markdown/markdown-utils.tsx";

export default function (s: Fastro) {
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

      console.log("req.query", req.query);

      return ctx.render({
        posts,
        title: attrs?.title || "Documentation",
        description: attrs?.description || "Documentation for Fastro",
        image: attrs?.image || "https://fastro.dev/logo.png",
        markdown: jsxElement,
        attrs,
        toc,
        baseUrl: Deno.env.get("BASE_URL") || "http://localhost:8000",
        section: req.query?.section || "",
      });
    },
  });

  return s;
}
