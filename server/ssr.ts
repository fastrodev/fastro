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

function createMeta(meta: string) {
  return `<meta ${meta} /> `;
}

function createScript(script: string) {
  return `<script> ${script} </script>`;
}

function createLink(link: string) {
  return `<link ${link} />`;
}

function createStyle(style: string) {
  return `<style>${style}</style>`;
}

export default function rendering(el?: JSX.Element): SSR {
  let element: JSX.Element;
  let status: 200;
  let html: string;
  let dir = "./components";
  let title: string;
  const scriptInstance: string[] = [];
  const styleInstance: string[] = [];
  const linkInstance: string[] = [];
  const metaInstance: string[] = [];
  let reqInstance: Request;

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
      scriptInstance.push(createScript(s));
      return instance;
    },
    meta: (m: string) => {
      metaInstance.push(createMeta(m));
      return instance;
    },
    style: (s: string) => {
      styleInstance.push(createStyle(s));
      return instance;
    },
    link: (l: string) => {
      linkInstance.push(createLink(l));
      return instance;
    },
    component: (el: JSX.Element) => {
      element = el;
      return instance;
    },
    render: () => {
      const bundle = reqInstance ? getBundle(reqInstance) : "bundle";
      const meta = metaInstance.length > 0 ? metaInstance.join("") : "";
      const script = scriptInstance.length > 0 ? scriptInstance.join("") : "";
      const link = linkInstance.length > 0 ? linkInstance.join("") : "";
      const style = styleInstance.length > 0 ? styleInstance.join("") : "";
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
    _createBundle: createBundle,
    _setRequest: (req: Request) => {
      reqInstance = req;
    },
  };

  return instance;
}
