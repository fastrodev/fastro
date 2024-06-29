---
title: "Server Side Rendering"
description: Setup Server Side Rendering (SSR) Page
image: https://fastro.deno.dev/fastro.png
previous: fn-component
next: oauth
---

To create SSR (Server-Side Rendering), we have four main steps:

1. Create the TSX or function component.
2. Build the components with esbuild.
3. Attach the built component to the HTML layout (hydration).
4. Render the final HTML layout and component from the server.

We've already crafted all these steps seamlessly. All you need to do is prepare
the component, layout, and entry point.

Create component `modules/web/hello.tsx`

```tsx
export const hello = <h1>Hello</h1>;
```

Create layout `modules/web/app.layout.tsx`

```tsx
import { LayoutProps } from "https://fastro.deno.dev/http/server/types.ts";

export function layout(
    { data, children }: LayoutProps<{ title: string }>,
) {
    return (
        <html>
            <head>
                <title>{data.title}</title>
            </head>
            <body id="root">
                {children}
            </body>
        </html>
    );
}
```

Create entry point `main.ts`

```ts
import fastro from "https://fastro.deno.dev/mod.ts";
import { layout } from "$fastro/modules/web/app.layout.tsx";
import hello from "$fastro/modules/web/hello.page.tsx";

const f = new fastro();

f.page("/", {
    component: hello,
    layout,
    handler: (_req, ctx) => ctx.render({ title: "Hello world" }),
    folder: "modules/web",
});

f.serve();
```

You can find a more complete example in
[the template repository](https://github.com/fastrodev/template).
