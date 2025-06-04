---
title: "Markdown Middleware"
description: "Learn how to use the markdown middleware to serve markdown files as web pages"
image: https://fastro.deno.dev/fastro.png
previous: route-middleware
next: tailwind
---

The markdown middleware enables you to serve markdown files as HTML pages with
automatic frontmatter parsing and syntax highlighting.

## Table of contents

## Setup

```ts
import fastro from "https://fastro.deno.dev/mod.ts";
import markdown from "https://fastro.deno.dev/middleware/markdown/mod.tsx";

const f = new fastro();
f.use(markdown());

await f.serve();
```

## Creating Markdown Files

Create a `post/hello.md` file in your project:

````md
---
title: "Hello"
description: "Hello markdown"
image: https://fastro.deno.dev/fastro.png
author: Fastro
date: 11/15/2023
tags: ["hello", "hi"]
---

# Hello, world!

This is a sample markdown file that demonstrates the capabilities of Fastro's
markdown middleware.

## Features

The middleware supports tables, code blocks, and more:

| Type | Value |
| ---- | ----- |
| x    | 42    |
| y    | 24    |

```js
console.log("Hello, world!");
```

## Frontmatter Support

All frontmatter fields are automatically parsed and made available to your
application.
````

## Accessing Your Content

Your markdown file will be served at: http://localhost:8000/post/hello

## Frontmatter Fields

The middleware supports the following frontmatter fields:

- title: Page title
- description: Page description
- image: Social media preview image
- author: Content author
- date: Publication date
- tags: Array of content tags
