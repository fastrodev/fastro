# Quickstart

*If you prefer to use `deno` only and just want to implement your entrypoint, skip these steps below. Go to [create entrypoint.](entrypoint.md)*


1. Install deno (linux/mac)
    ```
    curl -fsSL https://deno.land/x/install/install.sh | sh
    ```

    For other OS, go to [deno installation.](https://deno.land/manual/getting_started/installation)

2. Install fastro-cli

    ```
    deno install -A https://raw.fastro.dev/master/cli/fastro.ts
    ```

    Add `-f --reload` if you want to get the latest update. 
    
    Change `master` with the latest version to prevent breaking changes.


3. Make a new directory and initiate a project
    ```
    mkdir webapp
    ```

    ```
    cd webapp
    ```

    ```
    fastro init
    ```

4. Run server

    ```
    fastro serve
    ```
    By default, it will be reloaded when changes are made

5. Open url
    ```
    http://localhost:3000
    ```

## What's next:
- [Create handler](handler.md)
- [Create middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Deployment](deployment.md)
- [Fastro API](api.md)
