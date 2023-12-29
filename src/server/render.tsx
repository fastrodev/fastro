import { ComponentChild, ComponentType, h, VNode } from "preact";
import { renderToString } from "./deps.ts";
import { Page } from "./types.ts";

export class Render {
  renderJsx = (jsx: VNode) => {
    const html = renderToString(jsx);
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  };

  render = <T,>(p: Page<T>, data: T) => {
    try {
      const children = typeof p.component == "function"
        ? h(p.component as ComponentType<{ data: T }>, { data })
        : p.component;
      const app = p.layout({ children, data });

      if (app.props.children && typeof p.component == "function") {
        (app.props.children as ComponentChild[]).push(
          h("script", {
            type: "",
            src: `/static/js/${p.component.name.toLocaleLowerCase()}.js`,
            async: true,
          }),
        );
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
