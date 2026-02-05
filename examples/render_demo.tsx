import Fastro from "../mod.ts";
import { createRenderMiddleware } from "../middlewares/render/mod.ts";

const app = new Fastro();

// Use render middleware
app.use(createRenderMiddleware());

const Page = (props: { title: string }) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>This is a simple render demo using Fastro and React.</p>
    </div>
  );
};

// 1. Full Render (dengan Head, HMR, dan Doctype)
app.get("/", (_req, ctx) => {
  return ctx.render!(<Page title="Full Render" />, {
    title: "Fastro Render Demo",
    includeDoctype: true,
  });
});

// 2. Render Murni (Hanya HTML komponen saja)
app.get("/murni", (_req, ctx) => {
  return ctx.render!(<Page title="Render Murni" />, {
    includeHead: false,
  });
});

console.log("Server started at http://localhost:8000");
await app.serve({ port: 3000 });
