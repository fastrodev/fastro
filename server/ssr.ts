import ReactDOMServer from "https://esm.sh/react-dom@17.0.2/server";
import { minify } from "https://esm.sh/terser@5.13.1";
import { SSR } from "../server/types.ts";

export default function ssr(): SSR {
  let element: JSX.Element;
  let hydratePath: string;
  let title: string;
  let status: 200;
  let html: string;

  async function createHTML(
    element: JSX.Element,
    options: {
      hydratePath: string;
      title: string;
    },
  ) {
    const component = ReactDOMServer.renderToString(element);
    const { hydratePath, title } = options;

    const { files } = await Deno.emit(hydratePath, {
      bundle: "module",
      compilerOptions: { lib: ["dom", "dom.iterable", "esnext"] },
    });

    const result = await minify(files["deno:///bundle.js"], { toplevel: true });
    return `<!DOCTYPE html><html><head><title>${title}</title></head><body><div id="root">${component}</div><script>${result.code}</script><body></html>`;
  }

  const instance = {
    title: (arg: string) => {
      title = arg;
      return instance;
    },
    hydrate: (path: string) => {
      hydratePath = path;
      return instance;
    },
    component: (el: JSX.Element) => {
      element = el;
      return instance;
    },
    render: async () => {
      if (!html) {
        html = await createHTML(element, {
          hydratePath,
          title,
        });
      }
      // console.log("html", html);
      return new Response(html, {
        status,
        headers: {
          "content-type": "text/html",
        },
      });
    },
  };

  return instance;
}
