import { RenderOptions } from "../http/server.ts";

const createHTML = (
  props: unknown,
  title: string,
  description: string,
): RenderOptions => {
  return {
    props,
    html: {
      lang: "EN",
      class: "h-100",
      head: {
        title: `${title} | Fastro Framework`,
        descriptions: description,
        meta: [
          { charset: "utf-8" },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
          {
            name: "description",
            content: description,
          },
          {
            name: "author",
            content: "Fastro Software",
          },
          {
            property: "og:image",
            content: "https://fastro.dev/static/image.png",
          },
        ],
        link: [{
          href:
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
          rel: "stylesheet",
          integrity:
            "sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD",
          crossorigin: "anonymous",
        }, {
          href: "/static/cover.css",
          rel: "preload",
          as: "style",
          onload: `this.onload=null;this.rel='stylesheet'`,
        }],
        noScriptLink: { href: "/static/cover.css", rel: "stylesheet" },
        script: [],
      },
      body: {
        class: "d-flex h-100 text-bg-dark",
        root: {
          class: "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column",
          style: { maxWidth: "42em" },
        },
      },
    },
  };
};

export { createHTML };
