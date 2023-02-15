// deno-lint-ignore-file no-explicit-any
import * as esbuild from "https://deno.land/x/esbuild@v0.15.10/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";
import { ReactDOMServer } from "./deps.ts";
import { RenderOptions, SSR } from "./types.ts";

function createHydrate(rootComponent: string, rootTSX: string) {
  return `import React from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import ${rootComponent} from "./${rootTSX}.tsx";
const props = window.__INITIAL_STATE__ || {};
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<${rootComponent}  {...props} />);`;
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
  let cdn = "/static";
  let title: string;
  let bundleName: string;
  const scriptInstance: string[] = [];
  const styleInstance: string[] = [];
  const linkInstance: string[] = [];
  const metaInstance: string[] = [];
  let props: any;

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
      Deno.writeTextFile(
        hydrateTarget,
        createHydrate(rootComponent, rootTSX),
      );
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
    initialData: any,
  ) {
    const component = ReactDOMServer.renderToString(element);
    const title = options.title ? options.title : "";
    const link = options.link ? options.link : "";
    const meta = options.meta ? options.meta : "";
    const script = options.script ? options.script : "";
    const style = options.style ? options.style : "";
    const bundle = options.bundle ? options.bundle : "bundle";
    return `<!DOCTYPE html><html><head>${title}${link}${meta}${script}${style}<script type="module" src="${cdn}/${bundle}.js"></script></head><body><div id="root">${component}</div><script>window.__INITIAL_STATE__ = ${
      JSON.stringify(initialData)
    };</script><body></html>`;
  }

  const instance = {
    dir: (d: string) => {
      dir = d;
      return instance;
    },
    title: (t: string) => {
      title = `<title>${t}</title>`;
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
    cdn: (path: string) => {
      cdn = path;
      return instance;
    },
    props: (p: any) => {
      props = p;
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
      html = createHTML(element, opt, props);
      return new Response(html, {
        status,
        headers: {
          "content-type": "text/html",
        },
      });
    },
    bundle: (name: string) => {
      bundleName = name;
      return instance;
    },
    _createBundle: createBundle,
    _getBundleName: () => bundleName,
  };

  return instance;
}
