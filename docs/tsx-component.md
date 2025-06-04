---
title: "TSX Component"
description: "Learn how to create server-side rendered TSX components in Fastro"
image: https://fastro.deno.dev/fastro.png
previous: static
next: fn-component
---

TSX components in Fastro are server-side rendered and output static HTML without
client-side JavaScript. This makes them perfect for static content, SEO-friendly
pages, and lightweight components.

## Table of contents

## Basic Usage

```tsx
export const hello = <h1>Hello World</h1>;
```

## Features

- **No JavaScript bundle**: Components render to HTML only
- **Server-side rendering**: Executed at build time or request time
- **TypeScript support**: Full type checking and IntelliSense
- **JSX syntax**: Familiar React-like syntax

## Example Component

```tsx
interface GreetingProps {
  name: string;
  title?: string;
}

export const Greeting = ({ name, title = "Welcome" }: GreetingProps) => (
  <div className="greeting">
    <h1>{title}</h1>
    <p>Hello, {name}! Thanks for visiting our site.</p>
  </div>
);
```

## Use Cases

- Static pages and layouts
- Server-rendered components
- SEO-optimized content
- Email templates
- Documentation pages
