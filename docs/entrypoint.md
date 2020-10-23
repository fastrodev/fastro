
# Create entrypoint

- The structure will be like this:
    ```
    webapp
    └── main.ts
    ```

- Create webapp folder
    ```
    mkdir webapp && cd webapp
    ```
    
- Create entrypoint, `main.ts`
    ```ts
    import { Fastro } from "https://raw.fastro.dev/master/mod.ts";
    new Fastro().listen();
    ```

- Run server
    ```
    deno run -A main.ts
    ```

- Open url
    ```
    http://localhost:3000
    ```
    

## What's next:
- [Create a handler](handler.md)
- [Create a middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Publishing and Deployment](deployment.md)
- [Fastro API](api.md)