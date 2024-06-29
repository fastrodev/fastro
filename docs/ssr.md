---
title: "Server Side Rendering"
description: Setup Server Side Rendering (SSR) Page
image: https://fastro.deno.dev/fastro.png
previous: fn-component
next: oauth
---

To create SSR (Server-Side Rendering), we have four main steps:

1. Create the TSX or function component.
2. Create a hydration file for the component and build it with esbuild.
3. Attach the built component to the HTML layout.
4. Render the final HTML layout and component from the server.

We've already streamlined these steps. All you need to prepare are the
component, layout, and entry point.

Create component `modules/web/hello.tsx`

```tsx
export const hello = () => {
    return <h1>Hello</h1>;
};
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
