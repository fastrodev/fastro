# FASTRO

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

Go to [react server side rendering](https://fastro.dev/docs/react.html) to
create the react component, define props, and setup the html template in a very
simple way.

## Features

Fastro provides easy-to-use features for web development.

- [Command line interface](https://fastro.dev/docs/project.html)
- [Container based dependency injection](https://github.com/fastrojs/fastro/blob/master/container.ts)
- [Data validation](https://github.com/fastrojs/fastro/blob/master/services/options.controller.ts)
- [Dynamic url param](https://github.com/fastrojs/fastro/blob/master/services/hello/v1/params.controller.ts)
- [HTML template rendering](https://github.com/fastrojs/fastro/blob/master/services/hello/v3/hello.controller.ts)
- [Middleware](https://github.com/fastrojs/fastro/blob/master/services/middleware.controller.ts)
- [Proxy](https://github.com/fastrojs/fastro/blob/master/services/proxy.controller.ts)
- [Query params](https://github.com/fastrojs/fastro/blob/master/services/hello/v1/querybyname.controller.ts)
- [Static files](https://fastro.dev/docs/static.html)
- [Serverless deployment](https://fastro.dev/docs/deployment.html)
- [Support body handling](https://github.com/fastrojs/fastro/blob/master/services/form/post.controller.ts):
  `application/json`, `x-www-form-urlencoded`, `multipart/form-data`
- [Support cookie](https://github.com/fastrojs/fastro/blob/master/services/cookie/set.controller.ts)
- [URL prefix](https://github.com/fastrojs/fastro/blob/master/services/hello/v1/prefix.controller.ts)
- [URL redicetion](https://github.com/fastrojs/fastro/blob/master/services/hello/v1/redirect.controller.ts)
- [React remplate rendering](https://github.com/fastrojs/fastro/blob/master/services/react.template.html)
- [Routing by file system](https://fastro.dev/docs/handler.html)
- [React server side rendering](https://github.com/fastrojs/fastro/blob/master/services/react.page.tsx)

You can see more detailed examples
[here](https://github.com/fastrodev/fastro/blob/master/services).

## Serverless Demo

- [Webapp deployed on flexible google app
  engine](https://phonic-altar-274306.ue.r.appspot.com).
- [Webapp deployed on google cloud run](https://hello-6bxxicr2uq-ue.a.run.app/).

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "fastro version"
