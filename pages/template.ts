import { HttpResponse, SSR } from "../server/mod.ts";

export function initSSR(ssr: SSR, res: HttpResponse) {
  const [css, js, meta, dark] = [
    `href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"`,
    `src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"`,
    `name="viewport" content="width=device-width, initial-scale=1"`,
    `data-bs-theme="dark"`,
  ];
  return res.ssr(ssr)
    .htmlAttr(dark)
    .script(js)
    .meta(meta)
    .link(css)
    .link(`href="/public/cover.css" rel="stylesheet"`);
}
