---
title: "Fastro v0.80.0: Preact Integration and Secure Server Side Props"
description: "Switching from React to Preact for faster performance and implementing robust encryption for server-side props"
image: https://fastro.deno.dev/fastro.png
author: Admin
date: 08/16/2023
---

Previously, `Fastro` used `React` for server-side-rendering (SSR).

The author of this framework is very happy with it. Applications become faster
and directly generate HTML syntax to the browser without waiting.

## Table of contents

## Errors in React

Until the time I started building a fullstack apps, there were some really
annoying issues in development and production mode.

In development mode: when I put my cursor to an input and leave from the input,
it always produce error like this.

![](/static/react_input_error.png)

In production mode: `useContext` and `useState` always produce errors like this.

![](/static/react_error.png)

I've been looking for a solution, but haven't found satisfactory answers yet.
Existing solutions are usually related to Node.js and Next.js.

## First try with Preact

Instead of waiting for a long time, I finally tried another alternative:
`Preact`.

The result makes me very happy.

With JSX which is almost similar to React, all the errors above are gone.

And one more thing, the minimal bundle file is only 6.5kB!

> In React, bundle files in production are at least 40 kB. The size will
> increase if there are additional modules.

![](/static/preact_result.png)

## Server Side Props Encryption

This version also adds server-side props encryption for JSX using
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

This feature makes sensitive data sent from servers difficult to see from the
browser.

![](/static/preact_encrypt.png)
