// deno-lint-ignore-file no-explicit-any
import { ComponentChild, ComponentType, h, toChildArray, VNode } from "preact";
import { renderToString } from "./deps.ts";
import { Fastro, FunctionComponent, Page } from "./types.ts";
import { checkReferer } from "./mod.ts";

export class Render {
  #server: Fastro;
  constructor(server: Fastro) {
    this.#server = server;
  }

  renderJsx = (jsx: VNode) => {
    const html = renderToString(jsx);
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  };

  #addPropsEndpoint = (key: string, data: any) => {
    const path = "/__" + key + "/props";
    this.#server.add("GET", path, (req, _ctx) => {
      const ref = checkReferer(req);
      if (ref) return ref;
      return new Response(JSON.stringify(data), {
        headers: new Headers({
          "Access-Control-Allow-Origin": "null",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        }),
      });
    });
  };

  #mutate = (app: VNode, component: FunctionComponent) => {
    (app.props.children as ComponentChild[]).push(
      h("script", {
        src: `/static/js/${component.name.toLocaleLowerCase()}.js`,
        async: true,
      }),
    );
    return app;
  };

  render = <T,>(key: string, p: Page<T>, data: T) => {
    try {
      this.#addPropsEndpoint(key, data);
      const children = typeof p.component == "function"
        ? p.component(data)
        : p.component;

      let app = p.layout({ children, data });
      if (app.props.children && typeof p.component == "function") {
        app = this.#mutate(app, p.component);
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
