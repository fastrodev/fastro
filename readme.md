# Fastro
![][build] ![][version]

Fastro is a simple and fast web framework built on top of [deno](https://deno.land). Its speed is [close to the raw deno http library](https://fastro.dev/docs/perfomance.html). Written in typescript. 

No need to register routes, controllers, middlewares, templates, or static files. They will be loaded and saved when the server starts. 

You can see the example of deployed webapp at this link: [https://hello-6bxxicr2uq-uc.a.run.app](https://hello-6bxxicr2uq-uc.a.run.app). 

Go to [the quickstart](https://fastro.dev/docs/quickstart) to create your own.

## Features
- Body handling `application/json`
- Body handling `application/x-www-form-urlencoded`
- Body handling `multipart/form-data`
- Command line interface
- Data validation
- Dynamic URL parameters
- Serverless deployment
- Supports `cookie`
- Supports middleware
- Supports proxy
- Support querystring
- Support static files
- URL prefix
- URL redirection
- URL routing by file name
- Template rendering

You can see the details in [the examples](https://github.com/fastrodev/fastro/blob/master/services) and [test folder](https://github.com/fastrodev/fastro/blob/master/test).

## What's next:
- [Quickstart](https://fastro.dev/docs/quickstart)
- [Create a handler](https://fastro.dev/docs/handler)
- [Create a middleware](https://fastro.dev/docs/middleware)
- [Create static files](https://fastro.dev/docs/static)
- [Template rendering](https://fastro.dev/docs/rendering)
- [Data validation](https://fastro.dev/docs/validation)
- [Publishing and Deployment](https://fastro.dev/docs/deployment)
- [Fastro API](https://fastro.dev/docs/api)

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[version]: https://img.shields.io/github/v/release/fastrojs/fastro?label=version "fastro version"
