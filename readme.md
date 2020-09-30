# Table of Contents
- [Getting started](#getting-started)
- [How to add a handler](#how-to-add-a-handler)
- [Command line interface](#command-line-interface)
- [Examples](#examples)
- [Perfomance](#perfomance)

## Getting started
- Create `main.ts`
    ```ts
    import { Fastro } from "https://raw.githubusercontent.com/fastrodev/fastro/master/mod.ts";
    new Fastro().listen();
    ```
- Run with command
    ```
    deno run -A main.ts
    ```
- Output
    ```
    HTTP webserver running.  Access it at:  http://localhost:3000
    ```


## How to add a handler
- Create a new folder with command `mkdir webapp`

    The structure will be like this:
    ```
    webapp
    ├── main.ts
    └── services
        └── hello.ts
    ```
    
    File and folder description:
    - `main.ts`: Webapp entrypoint.
    - `services`: Default folder for all handler files. You can change it via [ServerOptions](core/types.ts).
    - `services/hello.ts`: Endpoint handler. You can access it via URL: [http://localhost:3000/hello](http://localhost:3000/hello).

- Create entrypoint `main.ts`
    ```ts
    import { Fastro } from "https://raw.githubusercontent.com/fastrodev/fastro/master/mod.ts";
    const server = new Fastro();
    server.listen();
    ```
    - You can add [ServerOptions](core/types.ts) on Fastro construtor to change default service folder, add url prefix, or enable cors.
    - You can pass [ListenOptions](core/types.ts) on listen function to change default port.

- Create handler `services/hello.ts`
    ```ts
    import type { Request } from "https://raw.githubusercontent.com/fastrodev/fastro/master/mod.ts";

    export const handler = (request: Request) => {
      request.send("hello");
    };

    ```

    **Please note that the handler file name will be used as URL endpoint.**

- Run server
    ```
    deno run -A main.ts
    ```
- Open url
    ```
    http://localhost:3000/hello
    ```


## Command Line Interface

You can also run your project using fastro command line interface (fastro-cli). 

With this, you don't need an entrypoint file (`main.ts`) anymore.

- Install fastro-cli
    ```
    deno install -A https://raw.githubusercontent.com/fastrodev/fastro/master/cli/fastro.ts
    ```

- Run in development

    All modules will be reloaded again if there are changes.

    ```
    fastro serve
    ```
- Run in production

    You can change the app port also.

    ```
    fastro serve --port 8080 --production
    ```

## Examples

You can find other examples [here](services).

## Perfomance

|Module|Version|Req/s|Percentage|
|--|--:|--:|--:|
|[Deno](benchmarks/deno_app.ts)|0.71.0|16962.8|100.00%|
|[Fastro](benchmarks/fastro_app.ts)|0.30.0|16027.2|94.48%|

You can see the details [here](benchmarks/readme.md).