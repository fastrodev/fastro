---
title: "Tailwind CSS Middleware"
description: "Learn how to integrate Tailwind CSS with Fastro for rapid styling and development"
image: https://fastro.deno.dev/fastro.png
previous: markdown
next: static
---

The Tailwind middleware enables seamless integration of Tailwind CSS in your
Fastro application, providing utility-first CSS styling with automatic
compilation and optimization.

## Table of contents

## Basic Usage

```ts
import fastro from "https://fastro.deno.dev/mod.ts";
import { tailwind } from "https://fastro.deno.dev/middleware/tailwind/mod.ts";

const f = new fastro();
f.use(tailwind());
await f.serve();
```

## Configuration Options

You can customize the Tailwind middleware with various options:

```ts
f.use(tailwind({
  config: "./tailwind.config.js", // Custom Tailwind config file
  input: "./styles/input.css", // Input CSS file
  output: "./static/styles.css", // Output CSS file
  minify: true, // Minify output in production
  watch: true, // Watch for changes in development
}));
```

## Features

- **Automatic compilation**: CSS is compiled on-demand during development
- **Production optimization**: Automatic purging and minification in production
- **Hot reload**: Changes are reflected immediately during development
- **Custom configuration**: Support for custom Tailwind config files
- **Plugin support**: Compatible with Tailwind CSS plugins

## Example with Custom Styles

```css
/* styles/input.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
}
```

Now you can use Tailwind classes and your custom components throughout your
application templates.
