---
title: "Fastro v0.79.3: Preact and Encrypted Props"
description: Fastro v0.79.3 uses preact and encryption for its props
image: https://fastro.dev/static/image.png
author: Fastro
date: 16/08/2023
---

Previously, `Fastro` used `React` for server-side-rendering (SSR).

The author of this framework is very happy with it. Applications become faster
and directly generate HTML syntax to the browser without waiting.

## Table of contents

## Errors in React

Until the time I started building a fullstack apps, there were some really
annoying issues in development and production mode.

In development mode: when I put my cursor to an input and leave from the cursor,
it always produce error like this.

![](/static//react_input_error.png)

In production mode: `useContext` and `useState` always produce errors like this.

![](/static/react_error.png)

I've been looking for a solution, but haven't found satisfactory answers yet.
Existing solutions are usually related to Node.js and Next.js.

## Try Preact

Instead of waiting for a long time, I finally tried another alternative:
`Preact`.

The result makes me very happy.

With JSX which is almost similar to React, all the errors above are gone.

And one more thing, the minimal bundle file is only 6kB!

> In React, bundle files in production are at least 40 kB. The size will
> increase if there are additional modules.

![](/static/preact_result.png)
