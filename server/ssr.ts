import ReactDOMServer from "https://esm.sh/react-dom@17.0.2/server";
import { RenderOptions, SSR } from "../server/types.ts";

function createHydrate(appPath: string) {
  return `import React from "https://esm.sh/react@17.0.2";
import ReactDOM from "https://esm.sh/react-dom@17.0.2";
import App from "${appPath}";
ReactDOM.hydrate(
  <App />,
  //@ts-ignore:
  document.getElementById("root"),
);`;
}

export default function rendering(): SSR {
  let element: JSX.Element;
  let status: 200;
  let html: string;
  let dir = "./app";

  async function createBundle() {
    const hydrateTarget = `${dir}/.hydrate.tsx`;
    const bundle = "module";
    const bundlePath = "./static/bundle.js";
    const denoBundle = "deno:///bundle.js";
    const appPath = `./app.tsx`;
    const lib = ["dom", "dom.iterable", "esnext"];

    try {
      Deno.writeTextFile(
        hydrateTarget,
        createHydrate(appPath),
      );
    } catch (err) {
      throw err;
    }

    const { files } = await Deno.emit(hydrateTarget, {
      bundle,
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
    return `<!DOCTYPE html><html><head><title>${options.title}</title>${link} ${meta} ${script} ${style}</head><body><div id="root">${component}</div><script type="module" src="/static/bundle.js"></script><body></html>`;
  }

  const instance = {
    dir: (d: string) => {
      dir = d;
      return instance;
    },
    component: (el: JSX.Element) => {
      element = el;
      return instance;
    },
    render: (options: RenderOptions) => {
      if (!html) {
        html = createHTML(element, options);
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
