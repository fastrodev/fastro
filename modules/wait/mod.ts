import { Fastro } from "@app/mod.ts";
import pageLayout from "@app/modules/wait/wait.layout.tsx";
import pageComponent from "@app/modules/wait/wait.page.tsx";
import pageHandler, { submitHandler } from "@app/modules/wait/wait.handler.ts";

export default function (s: Fastro) {
  /** proxy for github repo */
  s.use(async (_req, ctx) => {
    if (
      ctx.url.pathname.endsWith(".ts") ||
      ctx.url.pathname.endsWith(".tsx")
    ) {
      const version = ctx.url.pathname.startsWith("/v")
        ? ""
        : ctx.url.pathname.startsWith("/canary")
        ? "/canary"
        : "/main";
      const path =
        `https://raw.githubusercontent.com/fastrodev/fastro${version}${ctx.url.pathname}`;
      const res = await fetch(path);
      const content = await res.text();
      return new Response(content);
    }
    return ctx.next();
  });
  // add page
  s.page("/", {
    folder: "modules/wait",
    component: pageComponent,
    layout: pageLayout,
    handler: pageHandler,
  });

  s.post("/api/submit", submitHandler);
  s.get("/api/get", (req, ctx) => {
    return new Response("Oke", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
  return s;
}
