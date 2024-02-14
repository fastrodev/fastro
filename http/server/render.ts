// deno-lint-ignore-file no-explicit-any
import { ComponentChild, h, JSX, renderToString } from "./deps.ts";
import { Fastro, FunctionComponent, Page } from "./types.ts";
import { BUILD_ID, getDevelopment } from "./mod.ts";

export class Render {
  #server: Fastro;
  constructor(server: Fastro) {
    this.#server = server;
    if (getDevelopment()) {
      this.#handleDevelopment();
      this.#addRefreshEndPoint();
    }
  }

  renderJsx = (jsx: JSX.Element) => {
    const html = renderToString(jsx);
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  };

  #refreshJs = (refreshUrl: string, buildId: string) => {
    return `const es = new EventSource('${refreshUrl}');
window.addEventListener("beforeunload", (event) => {
  es.close();
});
es.onmessage = function(e) {
  if (e.data !== "${buildId}") {
    location.reload();
  };
};`;
  };

  #handleDevelopment = () => {
    this.#server.add(
      "GET",
      "/js/refresh.js",
      () =>
        new Response(this.#refreshJs(`/___refresh___`, BUILD_ID), {
          headers: {
            "Content-Type": "application/javascript",
          },
        }),
    );
  };

  #addPropData = (key: string, data: any): Promise<void> => {
    const k = key === "/" ? "" : key;
    const path = "/__" + k + "/props";
    this.#server.serverOptions[path] = data;
    return Promise.resolve();
  };

  #addRefreshEndPoint = () => {
    const refreshStream = (_req: Request) => {
      let timerId: number | undefined = undefined;
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(`data: ${BUILD_ID}\nretry: 100\n\n`);
          timerId = setInterval(() => {
            controller.enqueue(`data: ${BUILD_ID}\n\n`);
          }, 500);
        },
        cancel() {
          if (timerId !== undefined) {
            clearInterval(timerId);
          }
        },
      });
      return new Response(body.pipeThrough(new TextEncoderStream()), {
        headers: {
          "content-type": "text/event-stream",
        },
      });
    };
    const refreshPath = `/___refresh___`;
    this.#server.add("GET", refreshPath, refreshStream);
  };

  #mutate = (app: any, component: FunctionComponent) => {
    (app.props.children as ComponentChild[]).push(
      h("script", {
        src:
          `/js/${component.name.toLocaleLowerCase()}.${this.#server.getNonce()}.js`,
        async: true,
        type: "module",
        blocking: "render",
      }),
    );
    if (getDevelopment()) {
      (app.props.children as ComponentChild[]).push(
        h("script", {
          src: `/js/refresh.js`,
          async: true,
        }),
      );
    }
    return app;
  };

  render = async <T = any>(key: string, p: Page, data: T, nonce: string) => {
    try {
      await this.#addPropData(key, data);
      const children = typeof p.component == "function"
        ? h(p.component as FunctionComponent, { data, nonce })
        : p.component;
      let app = h(p.layout as FunctionComponent, {
        children,
        data,
        nonce,
      }) as any;
      if (app.props.children && typeof p.component == "function") {
        app = this.#mutate(p.layout({ children, data, nonce }), p.component);
      }
      const html = "<!DOCTYPE html>" + renderToString(app);
      return new Response(html, {
        headers: { "content-type": "text/html" },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
