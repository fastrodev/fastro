import Hello from "../pages/hello.tsx";
import { assertExists } from "./deps.ts";
import { fastro } from "./server.ts";
import { createSSR } from "./ssr.ts";
import { HttpRequest, HttpResponse, SSR } from "./types.ts";

const host = "http://localhost:9000";

Deno.test({
  name: "page",
  fn: async () => {
    const f = fastro();
    const hello = createSSR(<Hello />);

    f.static("/public")
      .page("/", hello, (_req: HttpRequest, res: HttpResponse) => {
        const data = "data";
        return initSSR(res, hello)
          .title(`Hello ${data}`)
          .ogTitle(`Hello ${data}`)
          .ogURL("https://fastro.deno.dev")
          .metaDesc("description")
          .ogDesc("description")
          .ogImage("https://deno.land/images/artwork/v1.png")
          .ogSiteName("example.com")
          .twitterCard("card")
          .bodyAttr("style")
          .ogType("type")
          .lang("EN")
          .bundle("hello")
          .cdn("cdn")
          .dir("../pages")
          .style("h1 {color:red;}")
          .style("h2 {color:red;}")
          .script("script1")
          .script("script2")
          .props({ data })
          .meta('name="route-pattern" content="/"')
          .link(
            'rel="alternate icon" class="js-site-favicon" type="image/png" href="https://github.githubassets.com/favicons/favicon.png"',
          )
          .render();
      });

    const server = f.serve();

    const response = await fetch(host, { method: "GET" });
    const r = await response.text();
    assertExists(r, "Hello");

    f.close();
    await server;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});

function initSSR(res: HttpResponse, ssr: SSR) {
  const [css, js, meta, center, dark] = [
    `href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"`,
    `src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"`,
    `name="viewport" content="width=device-width, initial-scale=1"`,
    `class="container d-flex align-items-center" style="height: 100vh;"`,
    `data-bs-theme="dark"`,
  ];
  return res.ssr(ssr)
    .htmlAttr(dark)
    .rootAttr(center)
    .link(css)
    .script(js)
    .meta(meta);
}
