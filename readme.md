![][build] ![][stats]

# Fast and simple web framework
Built on top of [Deno standard library](https://deno.land/std@0.74.0). Written in [TypeScript](https://www.typescriptlang.org/). 

## High performance

With all [the ready to use features](#features), the speed is still around 93% of the raw Deno HTTP library. Check [this](docs/perfomance.md).

## Getting started
No need to add or register route declarations, controllers, middlewares, templates, or static files manually. 

Just init the project:
```
fastro init
```
And `fastro` will automatically load and save the generated files when the server starts:
```
fastro serve
```
You can modify existing files or add new ones if needed.

Go to [quickstart](docs/quickstart.md) for details.

## Features
- Body handling `application/json`, 
- Body handling `application/x-www-form-urlencoded`
- Body handling `multipart/form-data`
- Command line interface
- Data validation
- Dynamic URL parameters
- Supports `cookie`
- Supports middleware
- Supports proxy
- Support query parameters
- Support static files
- URL prefix
- URL redirection
- URL routing by file name
- Template rendering

You can see the details in [the examples](https://github.com/fastrodev/fastro/blob/master/services) and [test folder](https://github.com/fastrodev/fastro/blob/master/test).

## What's next:
- [Quickstart](docs/quickstart.md)
- [Create handler](docs/handler.md)
- [Create middleware](docs/middleware.md)
- [Create static files](docs/static.md)
- [Template rendering](docs/rendering.md)
- [Data validation](docs/validation.md)
- [Deployment](docs/deployment.md)
- [Fastro API](docs/api.md)

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[stats]: https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.fastro.dev%2Fstats "fastro stats"