# Static Files

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
- You can add static files by put your files in `public` folder. Fastro will load and save it when the server starts up. You can access directly by filename via URL.

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


## What's next:
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Deployment](deployment.md)
- [Fastro API](api.md)