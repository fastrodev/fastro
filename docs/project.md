
# Create a project

1. Make a new directory
    ```
    mkdir webapp && cd webapp
    ```

2. Initiate a project
    ```
    fastro init
    ```

3. Run server locally
    ```
    fastro serve
    ```
    
    Or if you want to run server with `deno`:
    ```
    deno run -A main.ts
    ```

4. Open url
    ```
    http://localhost:3000
    ```

5. Go to [publishing and deployment](deployment.md) if you want to publish your webapp.

## What's next:
- [Create a handler](handler.md)
- [Create a middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)