import { ReactDOMServer } from "$fastro/server/deps.ts";
import { RenderOptions, SSR } from "$fastro/server/types.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.15.10/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";

function createHydrate(rootComponent: string, rootTSX: string) {
  return `import React from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import ${rootComponent} from "./${rootTSX}.tsx";
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<${rootComponent} />);`;
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

export function render(el?: JSX.Element): SSR {
  let element: JSX.Element;
  let status: 200;
  let html: string;
  let dir = "./";
  let title: string;
  let bundleName: string;
  const scriptInstance: string[] = [];
  const styleInstance: string[] = [];
  const linkInstance: string[] = [];
  const metaInstance: string[] = [];
  let reqInstance: Request;

  if (el) element = el;

  /**
   * @param bundle
   * @param rootComponent
   * @param rootTSX
   */
  function createBundle(
    bundle?: string,
    rootComponent?: string,
    rootTSX?: string,
  ) {
    const b = bundle ? bundle : "bundle";
    const hydrateTarget = `${dir}/${rootTSX}.hydrate.tsx`;
    const bundlePath = `./public/${b}.js`;

    try {
      if (!rootComponent) rootComponent = "App";
      if (!rootTSX) rootTSX = "app";
      Deno.writeTextFile(hydrateTarget, createHydrate(rootComponent, rootTSX));
    } catch (err) {
      console.error(err);
      throw err;
    }

    esbuild.build({
      plugins: [denoPlugin()],
      entryPoints: [hydrateTarget],
      outfile: bundlePath,
      bundle: true,
      minify: true,
      format: "esm",
    }).then(() => {
      Deno.remove(hydrateTarget);
    });
  }

  function createHTML(
    element: JSX.Element,
    options: RenderOptions,
  ) {
    const component = ReactDOMServer.renderToString(element);
    const title = options.title ? options.title : "";
    const link = options.link ? options.link : "";
    const meta = options.meta ? options.meta : "";
    const script = options.script ? options.script : "";
    const style = options.style ? options.style : "";
    const bundle = options.bundle ? options.bundle : "bundle";
    return `<!DOCTYPE html><html><head><title>${title}</title>${link}${meta}${script}${style}</head><body><div id="root">${component}</div><script type="module" src="/static/${bundle}.js"></script><body></html>`;
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
    render: () => {
      const bundle = bundleName;
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
    setBundleName: (name: string) => {
      bundleName = name;
      return instance;
    },
    _createBundle: createBundle,
    _setRequest: (req: Request) => {
      reqInstance = req;
    },
    _getBundleName: () => bundleName,
  };

  return instance;
}
