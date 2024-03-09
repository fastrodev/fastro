---
title: "Fastro v0.83.0: renderToReadableStream"
image: https://fastro.deno.dev/fastro.png
description: "Use renderToReadableStream to improve the performance of
the page load "
author: Yanu Widodo
date: 10/26/2023
---

In this version, Fastro replace
[`renderToString`](https://react.dev/reference/react-dom/server/renderToString)
with
[`renderToReadableStream`](https://react.dev/reference/react-dom/server/renderToReadableStream).

`renderToReadableStream` is a more modern and powerful way to render React
elements to a stream. It is especially useful for streaming large or complex
elements to the client, or for elements that need to be rendered progressively.

| Feature        | renderToString | renderToReadableStream |
| -------------- | :------------: | :--------------------: |
| Streaming      |       No       |          Yes           |
| Suspense       |       No       |          Yes           |
| Error handling |  Less robust   |      More robust       |

`renderToReadableStream` renders the React element to a stream, which means that
the HTML can be sent to the client as soon as it is available, without having to
wait for the entire element to be rendered. This can improve the performance of
the page load, especially for large or complex elements.
