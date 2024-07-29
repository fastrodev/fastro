import Server from "@app/mod.ts";
import layout from "@app/modules/web/app.layout.tsx";
import hello from "@app/modules/web/hello.page.tsx";

const s = new Server();

s.page("/", {
  component: hello,
  layout,
  handler: (_req, ctx) => ctx.render({ title: "Hello world" }),
  folder: "modules/web",
});

s.serve();
