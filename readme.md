![][build] ![][stats]

# Fast and simple web framework

[High performance](#perfomance) backend module. Built on top of [Deno standard library](https://deno.land/std). Written in TypeScript.

Go to [getting started](#getting-started) to try.

## Features
- [Command line interface](#command-line-interface)
- Dynamic URL parameters
- Supports `application/json`, 
- Supports `application/x-www-form-urlencoded`
- Supports cookie
- Supports `multipart/form-data`
- [Supports middleware](#middleware)
- Supports proxy
- Support query parameters
- [Support static files](#static-files)
- URL prefix
- URL redirection
- URL routing by file name
- [Template rendering](#template-rendering)

You can see the details in [the examples](https://github.com/fastrodev/fastro/blob/master/services) and [test folder](https://github.com/fastrodev/fastro/blob/master/test).

## Getting started
- Create `webapp` folder
    ```
    mkdir webapp && cd webapp
    ```
- Create `main.ts`
    ```ts
    import { Fastro } from "https://raw.fastro.dev/master/mod.ts";
    new Fastro().listen();
    ```
- Run server
    ```
    deno run -A main.ts
    ```

- Open url
    ```
    http://localhost:3000
    ```


## How to add a handler
- The structure will be like this:
    ```
    webapp
    ├── main.ts
    └── services
        └── hello.controller.ts
    ```
    
    File and folder description:
    - `main.ts`: Webapp entrypoint.
    - `services`: Default folder for all handler files. You can change it via [ServerOptions](core/types.ts).
    - `services/hello.controller.ts`: Endpoint handler. You can access it via URL: [http://localhost:3000/hello](http://localhost:3000/hello).


- Create handler `services/hello.controller.ts`
    ```ts
    import type { Request } from "https://raw.fastro.dev/master/mod.ts";
    export const handler = (request: Request) => {
      request.send("hello");
    };

    ```

    Please note that the handler file name will be used as URL endpoint:

    - **hello** . *controller.ts*

- Run server
    ```
    deno run -A main.ts
    ```
- Open url
    ```
    http://localhost:3000/hello
    ```
    

## Middleware

You can access and add additional property to the request object before the controllers process it.

- The structure will be like this
    ```
    webapp
    ├── main.ts
    ├── services
    │   └── hello.controller.ts
    └── middleware
        └── support.ts 
    ```
    - `middleware`: default middleware folder.
    - `middleware/support.ts`: middleware handler.

- Create handler `middleware/support.ts`:
    ```ts
    import type { Callback, Request } from "https://raw.fastro.dev/master/mod.ts";
    export const methods = ["GET"];
    export const handler = (request: Request, next: Callback) => {
      console.log(request.url);
      request.hello = "hello"
      next();
    };
    ```


## Static Files
You can add static files by create `public` folder. Just put your files in it. Fastro will load and save it when the server starts up. You can access directly by filename via URL.

Example: 
```
http://localhost:3000/index.html
```
```
http://localhost:3000/logo.svg
```
```
http://localhost:3000/favicon.ico
```

## Template Rendering

- Create `hello.template.html` in services folder. You can change `hello` name with other.
    ```html
    <html>
        <head>
            <title>{{title}} {{name}}</title>
        </head>
        <body>
            {{title}} {{name}}
        </body>
    </html>
    ```

- Render with `request.view(file, options)`
    ```ts
    export const handler = (request: Request) => {
      request.view("hello.template.html", { title: "Hello", name: "World" });
    };

    ```


## Command line interface

You can also run your project using fastro command line interface (fastro-cli). With this, you don't need an entrypoint file (`main.ts`) anymore.

- Install fastro-cli
    ```
    deno install -A https://raw.fastro.dev/master/cli/fastro.ts
    ```

- Create a project

    You can create a new project with command. Skip if you've already made.
    ```
    fastro init
    ```

- Run in development

    Modules will be reloaded when changes are made.

    ```
    fastro serve
    ```
- Run in production

    You can change the app port also.

    ```
    fastro serve --port 8080 --production
    ```

## Perfomance

Starting from v0.30.0, `fastro` has been rewritten to improve performance. Here are the test results for the hello-world keep-alive connection.

|Module|Req/s|Percentage|
|--|--:|--:|
|[Deno](https://github.com/fastrodev/fastro/blob/v0.30.5/benchmarks/deno_app.ts)|16384.0|100.0%|
|[Fastro](https://github.com/fastrodev/fastro/blob/v0.30.5/benchmarks/fastro_app.ts)|15291.2|93.3%|

You can see the details in [the benchmarks.](https://github.com/fastrodev/fastro/blob/master/benchmarks)

[build]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg?branch=master "fastro build"
[stats]: https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.fastro.dev%2Fstats "fastro stats"