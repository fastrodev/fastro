---
description: Handle all http request
---

# Create a handler
- `fastro init` command will generate folders and files like this.
    ```
    .
    ├── app.yaml
    ├── container.ts
    ├── deps.ts
    ├── Dockerfile
    ├── main.ts
    ├── middleware
    │   └── support.ts
    ├── module
    │   ├── hello.controller.ts
    │   ├── hello.template.html
    │   ├── react.page.tsx
    │   └── react.template.html
    ├── public
    │   ├── favicon.ico
    │   └── index.html
    └── readme.md

    3 directories, 13 files
    ```
    
    File and folder description:
    - `Dockerfile`: docker file.
    - `main.ts`: Webapp entrypoint.
    - `middleware`: Place for all middleware files.
    - `public`: Place for all static files.
    - `services`: Place for all controller and html-template files.



- Open handler file, `services/hello.controller.ts`:
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
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [React SSR](react.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
