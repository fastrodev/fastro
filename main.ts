import Index from "./pages/index.tsx";
import fastro, {
  Context,
  HttpRequest,
  Next,
  RenderOptions,
} from "./server/mod.ts";

const f = fastro();

f.use((req: HttpRequest, _ctx: Context, next: Next) => {
  console.log(`${new Date().getTime()}: ${req.url}`);
  return next();
});

f.get("/res", () => new Response("res"));
f.get("/txt", () => "Text");
f.get("/json", () => ({ status: true }));
f.get("/array", () => [1, 2, 3, 4, 5]);
f.get("/api", () => {
  return Response.json({ time: new Date().getTime() });
});

f.static("/static", { folder: "static" });
f.page(
  "/",
  Index,
  (_req: HttpRequest, ctx: Context) => {
    const options: RenderOptions = {
      build: false,
      html: {
        class: "h-100",
        head: {
          title: "Fastro | Web Application Framework",
          descriptions: "Fast & Simple Web Application Framework",
          meta: [{ charset: "utf-8" }, {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          }, {
            name: "description",
            content: "Fast & Simple Web Application Framework",
          }, {
            property: "og:image",
            content: "https://fastro.dev/static/image.png",
          }],
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
          class: "d-flex h-100 text-center text-bg-dark",
          rootClass:
            "cover-container d-flex w-100 h-100 p-3 mx-auto flex-column",
        },
      },
    };
    return ctx.render(options);
  },
);

f.onListen(({ port, hostname }) => {
  console.log(`Listening on http://${hostname}:${port}`);
});

f.serve();
