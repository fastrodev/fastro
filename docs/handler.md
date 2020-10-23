# Create a handler
- `fastro init` command will generate folders and files like this.
    ```
    webapp
    ├── Dockerfile
    ├── middleware
    │   └── support.ts
    ├── public
    │   ├── favicon.ico
    │   ├── index.html
    │   └── logo.svg
    └── services
        ├── hello.controller.ts
        └── hello.template.html

    3 directories, 7 files
    ```
    
    File and folder description:
    - `Dockerfile`: docker file.
    - `middleware`: Place for all middleware files.
    - `public`: Place for all static files.
    - `services`: Place for all controller and html-template files.



- Open handler file, `services/hello.controller.ts`:
    ```ts
    import type { Request } from "https://raw.fastro.dev/master/mod.ts";
    export const handler = (request: Request) => {
      // request.view("hello.template.html", { greeting: "Hello", name: "World" });
      request.send(`setup ${request.hello}`);
    };
    ```

    Please note that: 
    - the handler file name will be used as URL endpoint:

        - **hello** . *controller.ts*

    - `request.hello` variable is come from [middleware](middleware.md).
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
- [Data validation](validation.md)
- [Publishing and Deployment](deployment.md)
- [Fastro API](api.md)