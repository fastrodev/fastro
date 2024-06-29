---
title: "Function Component"
description: How to setup a page with TSX
image: https://fastro.deno.dev/fastro.png
previous: tsx-component
next: ssr
---

This component will build JS script.

```tsx
export const hello = () => {
    return <h1>Hello</h1>;
};
```

You can also pass a props there.

```tsx
export const hello = (props: { name: string }) => {
    return <h1>Hello {props.name}</h1>;
};
```
