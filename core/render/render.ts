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
  #uglifiedCache = new Map<string, string>();

  constructor(server: Fastro) {
    this.#server = server;
    if (getDevelopment()) {
      this.#handleDevelopment();
    }
  }

  renderJsx = (jsx: JSX.Element, headers?: Headers) => {
    const html = renderToString(jsx);
    const responseHeaders = headers || new Headers();
    if (!responseHeaders.has("content-type")) {
      responseHeaders.set("content-type", "text/html");
    }
    return new Response(html, {
      headers: responseHeaders,
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
  #minifyScript = (src: string) => {
    // remove block comments
    src = src.replace(/\/\*[\s\S]*?\*\//g, "");
    // remove line comments
    src = src.replace(/\/\/[^\n\r]*/g, "");
    // collapse whitespace/newlines to single spaces
    src = src.replace(/[\r\n]+/g, " ");
    src = src.replace(/\s+/g, " ");
    // remove spaces around common punctuation to shrink further
    src = src.replace(/\s*([=+\-*/{}();:,<>])\s*/g, "$1");
    return src.trim();
  };
  // also uglify the variable/function names to avoid exposing internal details
  #uglifyScript = (src: string) => {
    let s = this.#minifyScript(src);
    const renameMap: Record<string, string> = {
      recordReload: "a",
      clearReloads: "b",
      fetchWithRetry: "c",
      key: "d",
      raw: "e",
      arr: "f",
      now: "g",
      url: "u",
      count: "k",
      org: "o",
    };
    for (const [from, to] of Object.entries(renameMap)) {
      s = s.replace(new RegExp(`\\b${from}\\b`, "g"), to);
    }
    return s;
  };
  #createLoaderScript = (nonce: string, scriptPath: string) => {
    return `(function(){
  function recordReload() {
    try {
      var key = '__fastro_reload_times__';
      var raw = sessionStorage.getItem(key) || '[]';
      var arr = JSON.parse(raw);
      var now = Date.now();
      arr = arr.filter(function(t){ return now - t < 10000; });
      arr.push(now);
      sessionStorage.setItem(key, JSON.stringify(arr));
      return arr.length;
    } catch (e) { return 0; }
  }
  function clearReloads() {
    try { sessionStorage.removeItem('__fastro_reload_times__'); } catch (e) {}
  }
  function fetchWithRetry(url){
    fetch(url)
      .then(function(res){ return res.text(); })
      .then(function(text){
        if (text === "Not Found") {
          var count = recordReload();
          if (count > 3) { console.warn('Too many reloads, aborting'); return; }
          return setTimeout(function(){ location.reload(); }, 500);
        }
        clearReloads();
        var s = document.createElement('script');
        s.defer = true;
        s.type = 'module';
        s.nonce = '${nonce}';
        s.textContent = text;
        document.body.appendChild(s);
      })
      .catch(function(){
        var count = recordReload();
        if (count > 3) { console.warn('Too many reloads, aborting'); return; }
        setTimeout(function(){ location.reload(); }, 500);
      });
  }
  var org = window.location.origin.replace(/\\/$/, '');
  var url = org + '/${scriptPath}';
  fetchWithRetry(url);
})();`;
  };

  #loadJs = (name: string, nonce: string) => {
    const scriptPath = `js/${name}.${this.#server.getNonce()}.js`;
    const cacheKey = name;

    if (getDevelopment()) {
      return this.#createLoaderScript(nonce, scriptPath);
    }

    if (this.#uglifiedCache.has(cacheKey)) {
      return this.#uglifiedCache.get(cacheKey)!
        .replace("${nonce}", nonce)
        .replace("${scriptPath}", scriptPath);
    }

    const template = this.#createLoaderScript("${nonce}", "${scriptPath}");
    const uglified = this.#uglifyScript(template);
    this.#uglifiedCache.set(cacheKey, uglified);

    return uglified
      .replace("${nonce}", nonce)
      .replace("${scriptPath}", scriptPath);
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

    this.#server.add("GET", `/___refresh___`, this.#createRefreshStream);
  };

  #createRefreshStream = (_req: Request) => {
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
