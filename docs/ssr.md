---
title: "Server Side Rendering"
description: Setup Server Side Rendering (SSR) Page
image: https://fastro.deno.dev/fastro.png
previous: fn-component
next: oauth
---

Fastro provides built-in Server-Side Rendering (SSR) capabilities that allow you
to render React components on the server and hydrate them on the client.

## Table of contents

## Overview

To create SSR pages, you need three main components:

1. **Component** - The React component to render
2. **Layout** - The HTML wrapper that includes head tags and structure
3. **Handler** - The server-side logic that provides data to the component

Fastro automatically handles the build process, bundling, and hydration for you.

## Basic Example

### Create a Component

Create your React component in `modules/web/hello.tsx`:

```tsx
export default function Hello() {
  return <h1>Hello, World!</h1>;
}
```

### Create a Layout

Create the HTML layout in `modules/web/app.layout.tsx`:

```tsx
import { LayoutProps } from "https://fastro.deno.dev/http/server/types.ts";

export function layout({ data, children }: LayoutProps<{ title: string }>) {
  return (
    <html>
      <head>
        <title>{data.title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
```

### Setup the Route

Create your main server file `main.ts`:

```ts
import fastro from "https://fastro.deno.dev/mod.ts";
import { layout } from "./modules/web/app.layout.tsx";
import Hello from "./modules/web/hello.tsx";

const f = new fastro();

f.page("/", {
  component: Hello,
  layout,
  handler: (_req, ctx) => ctx.render({ title: "Hello World" }),
  folder: "modules/web",
});

await f.serve({ port: 8000 });
```

## Interactive Example

Here's a more complete example with client-side interactivity:

### Interactive Component

```tsx
// modules/web/counter.tsx
import { useState } from "react";

export default function Counter(
  { initialCount = 0 }: { initialCount?: number },
) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}
```

### Route with Data

```ts
// main.ts
f.page("/counter", {
  component: Counter,
  layout,
  handler: (_req, ctx) => {
    const initialCount = Math.floor(Math.random() * 10);
    return ctx.render({
      title: "Counter App",
      props: { initialCount },
    });
  },
  folder: "modules/web",
});
```

## Benefits

- **SEO Friendly**: Content is rendered server-side for better search engine
  indexing
- **Fast Initial Load**: Users see content immediately without waiting for
  JavaScript
- **Progressive Enhancement**: Pages work without JavaScript and enhance with it
- **Automatic Hydration**: Client-side interactivity is automatically enabled

## Template

You can find a complete SSR example in
[the template repository](https://github.com/fastrodev/template).
