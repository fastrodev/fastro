import { createSSR, Fastro, HttpRequest, HttpResponse } from "../server/mod.ts";
import Index from "./index.tsx";
import { initSSR } from "./template.ts";

const index = createSSR(Index);

export function createPage(f: Fastro) {
  return f.static("/public")
    .build(<boolean> <unknown> Deno.env.get("BUILD"))
    .page("/", index, (_req: HttpRequest, res: HttpResponse) => {
      const desc = "Fast and simple web application framework for deno";
      const title = "Fastro";
      return initSSR(index, res)
        .ogImage("https://deno.land/images/artwork/v1.png")
        .metaDesc(desc)
        .title(title)
        .htmlAttr(`class="h-100"`)
        .bodyAttr(`class="d-flex h-100 text-center text-bg-dark"`)
        .rootAttr(
          `class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column"`,
        )
        .lang("EN")
        .render();
    });
}
