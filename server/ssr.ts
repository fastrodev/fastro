import ReactDOMServer from "https://esm.sh/react-dom@17.0.2/server";
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
    let js = `(() => {})();`;
    const { hydratePath, title } = options;

    const { files } = await Deno.emit(hydratePath, {
      bundle: "module",
      compilerOptions: { lib: ["dom", "dom.iterable", "esnext"] },
    });
    js = files["deno:///bundle.js"];

    const html = `<!DOCTYPE html>
      <html>
      <head><title>${title}</title></head>
      <body><div id="root">${component}</div><script>${js}</script><body>
      </html>`;

    return html;
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
