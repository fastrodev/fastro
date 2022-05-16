import * as ReactDOMServer from "https://esm.sh/react-dom@18.1.0/server";
import { RenderOptions, SSR } from "../server/types.ts";

function createHydrate() {
  return `import React from "https://esm.sh/react@18.1.0";
import { createRoot } from "https://esm.sh/react-dom@18.1.0/client";
import App from "./app.tsx";
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);`;
}

export default function rendering(el?: JSX.Element): SSR {
  let element: JSX.Element;
  let status: 200;
  let html: string;
  let dir = "./components";
  let title: string;
  let script: string;
  let style: string;
  let link: string;
  let meta: string;

  if (el) element = el;

  async function createBundle(bundle?: string) {
    const b = bundle ? bundle : "bundle";
    const hydrateTarget = `${dir}/.hydrate.tsx`;
    const bundlePath = `./static/${b}.js`;
    const denoBundle = `deno:///bundle.js`;
    const lib = ["dom", "dom.iterable", "esnext"];

    try {
      Deno.writeTextFile(hydrateTarget, createHydrate());
    } catch (err) {
      console.log(err);
      throw err;
    }

    const { files } = await Deno.emit(hydrateTarget, {
      bundle: "module",
      compilerOptions: { lib },
    });

    const js = files[denoBundle];
    await Deno.writeTextFile(bundlePath, js);
    await Deno.remove(hydrateTarget);
  }

  function createHTML(
    element: JSX.Element,
    options: RenderOptions,
  ) {
    const component = ReactDOMServer.renderToString(element);
    const link = options.link ? options.link : "";
    const meta = options.meta ? options.meta : "";
    const script = options.script ? options.script : "";
    const style = options.style ? options.style : "";
    const bundle = options.bundle ? options.bundle : "bundle";
    return `<!DOCTYPE html><html><head><title>${options.title}</title>${link} ${meta} ${script} ${style}</head><body><div id="root">${component}</div><script type="module" src="/static/${bundle}.js"></script><body></html>`;
  }

  function getBundle(req: Request) {
    const [, path] = req.url.split("://");
    const items = path.split("/");
    return items[items.length - 1];
  }

  const instance = {
    dir: (d: string) => {
      dir = d;
      return instance;
    },
    title: (t: string) => {
      title = t;
      return instance;
    },
    script: (s: string) => {
      script = s;
      return instance;
    },
    meta: (m: string) => {
      meta = m;
      return instance;
    },
    style: (s: string) => {
      style = s;
      return instance;
    },
    link: (l: string) => {
      link = l;
      return instance;
    },
    component: (el: JSX.Element) => {
      element = el;
      return instance;
    },
    render: (req?: Request) => {
      const bundle = req ? getBundle(req) : "bundle";
      const opt = {
        title,
        meta,
        script,
        link,
        style,
        bundle,
      };
      if (!html) {
        html = createHTML(element, opt);
      }
      return new Response(html, {
        status,
        headers: {
          "content-type": "text/html",
        },
      });
    },
    createBundle,
    createHydrate,
  };

  return instance;
}
