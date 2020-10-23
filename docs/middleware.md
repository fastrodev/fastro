# Create a middleware

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
    
- You can access and add additional property to the request object before the controllers process it.

- Open middleware file, `middleware/support.ts`:
    ```ts
    import type { Callback, Request } from "https://raw.fastro.dev/master/mod.ts";
    export const options = {
      methods: ["GET, POST"],
    }
    export const handler = (request: Request, next: Callback) => {
      request.hello = "with middleware";
      next();
    };
    ```



## What's next:
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Deployment](deployment.md)
- [Fastro API](api.md)