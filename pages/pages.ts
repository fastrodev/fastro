import { createSSR, Fastro, HttpRequest, HttpResponse } from "../server/mod.ts";
import Index from "./index.tsx";
import { initSSR } from "./template.ts";

const index = createSSR(Index);

export function createPage(f: Fastro) {
  return f.static("/public")
    .flash(<boolean> <unknown> Deno.env.get("FLASH"))
    .build(<boolean> <unknown> Deno.env.get("BUILD"))
    .page("/", index, (_req: HttpRequest, res: HttpResponse) => {
      const desc = "Fast and simple web application framework for deno";
      const title = "Fastro";
      return initSSR(index, res)
        .ogImage("https://deno.land/images/artwork/v1.png")
        .metaDesc(desc)
        .title(title)
        .props({ data: "world" })
        .lang("EN")
        .render();
    });
}
