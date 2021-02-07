# Fastro

![][build] ![][version]

Fastro is a simple and fast web framework built on top of
[deno](https://deno.land). Its speed is
[close to the raw deno http library](https://fastro.dev/benchmarks).

| Module | Req/s avg | Percentage |
| ------ | --------: | ---------: |
| Deno   |  23078.19 |    100.00% |
| Fastro |  21344.37 |     92.48% |

Written in typescript. No need to register routes, controllers, middlewares,
templates, or static files. They will be loaded and saved when the server
starts.

## Getting Started

Go to [the quickstart](https://fastro.dev/docs/quickstart) to install command
line interface and create a project.

## React Server Side Rendering
Go to [react ssr](https://fastro.dev/docs/react.html) to create react server side rendering and template.

## Features

Fastro provides easy-to-use features for web development.

<table>
  <tbody>
    <tr>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/form/post.controller.ts">application/json</a></td>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/form/post.controller.ts">x-www-form-urlencoded</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/form/post.controller.ts">multipart/form-data</a></td>
      <td><a href="https://fastro.dev/docs/project.html">command line interface</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/options.controller.ts">data validation</a></td>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/hello/v1/params.controller.ts">dynamic url param</a></td>
    </tr>
    <tr>
      <td><a href="https://fastro.dev/docs/deployment.html">serverless deployment</a></td>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/cookie/set.controller.ts">cookie</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/middleware.controller.ts">middleware</a></td>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/proxy.controller.ts">proxy</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/hello/v1/querybyname.controller.ts">query param</a></td>
      <td><a href="https://fastro.dev/docs/static.html">static files</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/hello/v1/prefix.controller.ts">url prefix</a></td>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/hello/v1/redirect.controller.ts">url redirection</a></td>
    </tr>
    <tr>
      <td><a href="https://fastro.dev/docs/handler.html">url routing by file name</a></td>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/hello/v3/hello.controller.ts">template rendering</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/react.page.tsx">react server side rendering (ssr)</a></td>
      <td><a href="https://github.com/fastrojs/fastro/blob/master/services/react.template.html">seo ready react html template</a></td>
    </tr>
  </tbody>
</table>

You can see detailed examples [here](https://github.com/fastrodev/fastro/blob/master/services).

## Serverless Demo

- [Webapp deployed on flexible google app
  engine](https://phonic-altar-274306.ue.r.appspot.com).
- [Webapp deployed on google cloud run](https://hello-6bxxicr2uq-ue.a.run.app/).

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "fastro version"
