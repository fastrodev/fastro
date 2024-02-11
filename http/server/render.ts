// deno-lint-ignore-file no-explicit-any
import { ComponentChild, h, JSX, renderToString } from "./deps.ts";
import { Fastro, FunctionComponent, Page } from "./types.ts";
import { BUILD_ID, checkReferer, getDevelopment } from "./mod.ts";

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

  #addPropsEndpoint = (key: string, data: any): Promise<Fastro> => {
    const k = key === "/" ? "" : key;
    const path = "/__" + k + "/props";
    const f = this.#server.add("GET", path, (req, _ctx) => {
      const ref = checkReferer(req);
      if (!getDevelopment() && ref) {
        return ref;
      }
      return new Response(JSON.stringify(data), {
        headers: new Headers({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "null",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        }),
      });
    });
    return Promise.resolve(f);
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
        src: `/js/${component.name.toLocaleLowerCase()}.js`,
        async: true,
        type: "module",
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

  render = async <T = any>(key: string, p: Page, data: T) => {
    try {
      await this.#addPropsEndpoint(key, data);
      const children = typeof p.component == "function"
        ? h(p.component as FunctionComponent, { data })
        : p.component;
      let app = h(p.layout as FunctionComponent, { children, data }) as any;
      if (app.props.children && typeof p.component == "function") {
        app = this.#mutate(p.layout({ children, data }), p.component);
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
