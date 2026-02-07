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
  // kasih warning di middleware jika harus install createRenderMiddleware dulu.
  // sebelum pake ctx.renderToString
  const html = ctx.renderToString!(<Page title="Full Render" />, {
    title: "Fastro Render Demo",
    includeDoctype: true,
  });
  return new Response(html, { headers: { "Content-Type": "text/html" } });
});

// 2. Render Murni (Hanya HTML komponen saja)
app.get("/murni", (_req, ctx) => {
  const html = ctx.renderToString!(<Page title="Render Murni" />, {
    includeHead: false,
  });
  return new Response(html, { headers: { "Content-Type": "text/html" } });
});

console.log("Server started at http://localhost:8000");
await app.serve({ port: 3000 });
