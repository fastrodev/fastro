---
description: You can add static files by put your files in public folder. Fastro will load and save it when the server starts up. You can access directly by filename via URL.
---

# Static Files

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
    └── services
        ├── hello.controller.ts
        ├── hello.template.html
        ├── react.page.tsx
        └── react.template.html

    3 directories, 7 files
    ```
    
- You can add static files by put your files in `public` folder. Fastro will load and save it when the server starts up. You can access directly by filename via URL.

    Example: 
    ```
    http://localhost:3000/index.html
    ```
    ```
    http://localhost:3000/favicon.ico
    ```


## What's next:
- [React SSR](react.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
