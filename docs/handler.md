---
description: Handle all http request
---

# Create a handler
- `fastro init` command will generate folders and files like this.
   ![](https://raw.githubusercontent.com/fastrojs/fastro/gh-pages/public/tree.svg)
    
- Open handler file, `module/hello.controller.ts`:
    ```ts
    import type { Request } from "../deps.ts";
    export default (request: Request) => {
      // request.view("hello.template.html", { greeting: "Hello", name: "World" });
      request.send(`setup ${request.hello}`);
    };

    ```

    Please note that: 
    - the handler file name will be used as URL endpoint: ***hello***.*controller.ts*
    - `request.hello` variable is come from [middleware setup](middleware.md).
    - You can find another handler examples on [services folder](../services/readme.md).


- Run server

    With fastro-cli
    ```
    fastro serve
    ```
    Or with entrypoint
    ```
    deno run -A main.ts
    ```

- Open url to access the handler
    ```
    http://localhost:3000/hello
    ```

## What's next:
- [Create a middleware](middleware.md)
