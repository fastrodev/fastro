---
description: You can access and add additional property to the request object before the controllers process it.
---

# Create a middleware

- `fastro init` command will generate folders and files like this.
    ```
    webapp
    ├── Dockerfile
    ├── main.ts
    ├── middleware
    │   └── support.ts
    ├── public
    │   ├── favicon.ico
    │   └── index.html
    └── module
        ├── hello.controller.ts
        ├── hello.template.html
        ├── react.page.tsx
        └── react.template.html

    3 directories, 9 files
    ```
    
- You can access and add additional property to the request object before the controllers process it.

- Open middleware file, `middleware/support.ts`:
    ```ts
    import type { Callback, Request } from "https://deno.land/x/fastro@v0.30.34/mod.ts";
    export const options = {
      methods: ["GET, POST"],
    }
    export default (request: Request, next: Callback) => {
      request.hello = "with middleware";
      next();
    };
    ```



## What's next:
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [React SSR](react.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
