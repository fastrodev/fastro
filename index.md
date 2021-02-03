---
title: High performance deno web framework
description: Fastro is a simple and fast web framework built on top of deno. Its speed is close to the raw deno http library. Written in typescript
image: public/fastro.png
layout: default
---

# High performance deno web framework
![][build] ![][version]

Fastro is a simple and fast web framework built on top of [deno](https://deno.land). Its speed is [close to the raw deno http library](https://fastro.dev/benchmarks). 

|Deno Req/s avg|23078.19|100.00%|
|Fastro Req/s avg|21344.37|92.48%|

Written in typescript. No need to register routes, controllers, middlewares, templates, or static files. They will be loaded and saved when the server starts. 

## Getting Started
Go to [the quickstart](https://fastro.dev/docs/quickstart) to install command line interface and create a project.

## Features
Fastro provides easy-to-use features for web development.

|[application/json](https://github.com/fastrojs/fastro/blob/master/services/form/post.controller.ts)|[x-www-form-urlencoded](https://github.com/fastrojs/fastro/blob/master/services/form/post.controller.ts)|
|[multipart/form-data](https://github.com/fastrojs/fastro/blob/master/services/form/post.controller.ts)|[command line interface](https://fastro.dev/docs/project.html)|
|[data validation](https://github.com/fastrojs/fastro/blob/master/services/options.controller.ts)|[dynamic url param](https://github.com/fastrojs/fastro/blob/master/services/hello/v1/params.controller.ts)|
|[serverless deployment](https://fastro.dev/docs/deployment.html)|[cookie](https://github.com/fastrojs/fastro/blob/master/services/cookie/set.controller.ts)|
|[middleware](https://github.com/fastrojs/fastro/blob/master/services/middleware.controller.ts)|[proxy](https://github.com/fastrojs/fastro/blob/master/services/proxy.controller.ts)|
|[query param](https://github.com/fastrojs/fastro/blob/master/services/hello/v1/querybyname.controller.ts)|[static files](https://fastro.dev/docs/static.html)|
|[url prefix](https://github.com/fastrojs/fastro/blob/master/services/hello/v1/prefix.controller.ts)|[url redirection](https://github.com/fastrojs/fastro/blob/master/services/hello/v1/redirect.controller.ts)|
|[url routing by file system](https://fastro.dev/docs/handler.html)|[template rendering](https://github.com/fastrojs/fastro/blob/master/services/hello/v3/hello.controller.ts)|

You can see detailed examples [here](https://github.com/fastrodev/fastro/blob/master/services).

## Serverless Demo
- [Webapp deployed on flexible google app engine](https://phonic-altar-274306.ue.r.appspot.com).
- [Webapp deployed on google cloud run](https://hello-6bxxicr2uq-ue.a.run.app).

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "fastro version"
