---
description: You can access and add additional property to the request object before the controllers process it.
---

# Create a middleware

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
    
- You can access and add additional property to the request object before the controllers process it.

- Open middleware file, `middleware/support.ts`:
    ```ts
    import type { Callback, Request } from "../deps.ts";
    export const options = {
      methods: ["GET", "POST"],
    };
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
