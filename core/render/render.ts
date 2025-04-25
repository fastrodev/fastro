// deno-lint-ignore-file no-explicit-any
import {
  h,
  JSX,
  renderToString,
  renderToStringAsync,
  VNode,
} from "../server/deps.ts";
import { Fastro, FunctionComponent, Page } from "../server/types.ts";
import { BUILD_ID, getDevelopment } from "../server/mod.ts";

export class Render {
  #server: Fastro;
  constructor(server: Fastro) {
    this.#server = server;
    if (getDevelopment()) {
      this.#handleDevelopment();
      this.#addRefreshEndPoint();
    }
  }

  renderJsx = (jsx: JSX.Element, headers?: Headers) => {
    const html = renderToString(jsx);
    if (!headers) {
      return new Response(html, {
        headers: new Headers({
          "content-type": "text/html",
          "x-request-id": new Date().getTime().toString(),
          "Content-Security-Policy":
            `default-src 'self'; script-src 'self' 'strict-dynamic'; style-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self'`,
        }),
      });
    }

    return new Response(html, {
      headers,
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
  #loadJs = (name: string, nonce: string) => {
    return `function fetchWithRetry(t){fetch(t).then(t=>t.text()).then(t=>{if("Not Found"===t)return setTimeout(()=>{location.reload()},500);const e=document.createElement("script");e.defer = true;e.type = "module";e.nonce = '${nonce}';e.textContent=t,document.body.appendChild(e)})};const origin=new URL(window.location.origin),url=origin+"js/${name}.${this.#server.getNonce()}.js";fetchWithRetry(url);`;
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

  #mutate = (
    layout: VNode,
    component: FunctionComponent,
    script = "",
    nonce: string,
    id?: string,
  ) => {
    const customScript = this.#loadJs(component.name.toLowerCase(), nonce) +
      script;

    const children = layout.props.children as any;
    const head = children[0] as any;
    if (head && head.type === "head") {
      const c = head.props.children as any;
      c.push(h("meta", {
        name: "x-request-id",
        content: id,
      }));
    }

    children.push(
      h("script", {
        defer: true,
        type: "module",
        dangerouslySetInnerHTML: {
          __html: customScript,
        },
        nonce,
      }),
    );
    if (getDevelopment()) {
      children.push(
        h("script", {
          src: `/js/refresh.js`,
          async: true,
          nonce,
        }),
      );
    }
    return layout;
  };

  render = async <T = any>(
    _key: string,
    p: Page,
    data: T,
    nonce: string,
    hdr?: Headers,
  ) => {
    const id = Date.now().toString();
    this.#server.serverOptions[id] = data;

    const children = typeof p.component == "function"
      ? h(p.component as FunctionComponent, { data, nonce })
      : p.component;
    let app = h(p.layout as FunctionComponent, {
      children,
      data,
      nonce,
    }) as any;
    if (app.props.children && typeof p.component == "function") {
      app = this.#mutate(
        p.layout({ children, data, nonce }),
        p.component,
        p.script,
        nonce,
        id,
      );
    }
    const html = "<!DOCTYPE html>" + await renderToStringAsync(app);
    const headers = hdr ? hdr : new Headers({
      "content-type": "text/html",
      "x-request-id": id,
      "Content-Security-Policy":
        `script-src 'self' 'unsafe-inline' 'nonce-${nonce}' https: http: ; object-src 'none'; base-uri 'none';`,
    });
    return new Response(html, { headers });
  };
}
