import * as esbuild from "https://deno.land/x/esbuild@v0.18.11/mod.js";
import {
  denoPlugins,
} from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts";
import ReactDOMServer from "https://esm.sh/react-dom@18.2.0/server?dev";
import { createElement } from "https://esm.sh/react@18.2.0?dev";
import fastro from "./mod.ts";
import App from "./pages/App.tsx";

const build = async () => {
  await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["h.tsx"],
    format: "esm",
    outfile: "static/App.js",
    bundle: true,
  });
  esbuild.stop();
};

await build();
const el = createElement(App);

const layout = ReactDOMServer.renderToString(el);

const html = `<!DOCTYPE html>
<html>
  <body>
    <div id="root">${layout}</div>
    <script src="static/App.js"></script>
  </body>
</html>`;

const f = new fastro();
f.static("/static", { folder: "static" });
f.get("/api", () => Response.json({ data: new Date() }));

f.get("/", () =>
  new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  }));

await f.serve();
