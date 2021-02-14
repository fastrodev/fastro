---
description: Init folders and files for your project
---
# Create a project

1. Make a new directory
    ```
    mkdir webapp && cd webapp
    ```

2. Initiate a project
    ```
    fastro init
    ```
    This command will generate folders and files like this:
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

3. Run server locally
    ```
    deno run -A main.ts
    ```
    
    Or if you want to monitor any changes and automatically restart:
    ```
    fastro serve
    ```

4. Open url
    ```
    http://localhost:8080
    ```

5. Go to [publishing and deployment](deployment.md) if you want to publish your webapp.

## What's next:
- [Create a handler](handler.md)
- [Create a middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [React SSR](react.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
