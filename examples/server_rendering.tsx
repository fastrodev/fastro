import Server from "$fastro/mod.ts";
import { layout } from "$fastro/modules/web/app.layout.tsx";
import hello from "$fastro/modules/web/hello.page.tsx";

const s = new Server();

s.page("/", {
  component: hello,
  layout,
  handler: (req, ctx) => ctx.render({ title: "Hello world" }),
  folder: "modules/web",
});

s.serve();
