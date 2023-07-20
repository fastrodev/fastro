import { RenderOptions } from "../mod.ts";

export default function (
  props: { title: string; description: string },
): RenderOptions {
  return {
    props,
    cache: false,
    build: true,
    html: {
      class: "h-100",
      head: {
        title: props.title,
        descriptions: props.description,
        meta: [
          { charset: "utf-8" },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
          {
            name: "description",
            content: "Fast & Simple Web Application Framework",
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
          rel: "stylesheet",
        }],
        script: [{
          src:
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
          integrity:
            "sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN",
          crossorigin: "anonymous",
        }],
      },
      body: {
        class: "d-flex h-100 text-bg-dark",
        script: [],
        root: {
          class: "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column",
        },
      },
    },
  };
}
