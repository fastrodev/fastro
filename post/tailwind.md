---
title: "Set up Tailwind on Deno"
description: "Integrating Tailwind CSS into a Deno Project"
image: https://fastro.deno.dev/tailwind.png
author: Yanu Widodo
date: 01/26/2024
---

Tailwind CSS is popular due to its utility-first approach. You can create a TSX
component and apply Tailwind CSS utility classes to it, effectively managing the
component's style without worrying about large CSS classes anymore.

Inspired by [Fresh](https://fresh.deno.dev), the official Deno web framework,
you can now style your web app with Tailwind CSS in a super easy way.

Create `tailwind.config.ts` file.

```ts
import { type Config } from "npm:tailwindcss@3.3.5";
export default {
  content: [
    "./modules/**/*.tsx",
    "./components/**/*.tsx",
  ],
} satisfies Config;
```

> You can find the detail instruction of this configuration in
> [the Tailwind docs.](https://tailwindcss.com/docs/configuration)

Create default `tailwind.css` file.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

This file will be seamlessly transformed into `style.css`. Therefore, you must
include it in your HTML layout.

```jsx
<link href="styles.css" rel="stylesheet" />;
```

> You can find how to custom the CSS in the
> [Using CSS and @layer page.](https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer)

Import tailwind middleware and attach it to the entry point file `main.ts`:

```ts
import Server from "fastro/mod.ts";
import { tailwind } from "fastro/middleware/tailwind/mod.ts";

const s = new Server();
s.use(tailwind());
s.serve();
```

And of course, you must adjust the `deno.json` file too.

```json
{
  "lock": false,
  "tasks": {
    "start": "ENV=DEVELOPMENT deno run -A --watch main.ts"
  },
  "imports": {
    "std/": "jsr:@std/",
    "fastro/": "https://fastro.deno.dev/v0.90.0/",
    "$app/": "./",
    "preact": "npm:preact@10.22.0",
    "preact/": "npm:/preact@10.22.0/"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "nodeModulesDir": true
}
```

You can find the complete example in
[the template source code.](https://github.com/fastrodev/template/blob/main/main.ts)
