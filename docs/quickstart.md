# Quickstart

## Installation

1. Install deno (linux/mac)
    ```
    curl -fsSL https://deno.land/x/install/install.sh | sh
    ```

    For other OS, go to [deno installation.](https://deno.land/manual/getting_started/installation)
    
2. Install git (debian/ubuntu)
   ```
   sudo apt-get install git-all
   ```
   For other OS, go to [install-git](https://github.com/git-guides/install-git)

3. Install fastro-cli
    ```
    deno install -A https://raw.fastro.dev/master/cli/fastro.ts
    ```

    Add `-f --reload` if you want to get the latest update. 
    ```
    deno install -f --reload -A https://raw.fastro.dev/master/cli/fastro.ts
    ```
    
    Or change `master` with the latest version to prevent breaking changes.
    ```
    deno install -A https://raw.fastro.dev/v0.30.20/cli/fastro.ts
    ```

## Create a project

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
