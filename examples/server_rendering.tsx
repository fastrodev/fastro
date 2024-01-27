import Server from "$fastro/mod.ts";
import { layout } from "$fastro/modules/web/app.layout.tsx";

const s = new Server();
const component = <div>Hello world</div>;

s.page("/", {
  component,
  layout,
  handler: (req, ctx) => ctx.render({ title: "Hello world" }),
});

s.serve();
