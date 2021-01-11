# Installation

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
    deno install -A --no-check https://deno.land/x/fastro@v0.30.31/cli/fastro.ts
    ```
4. [Create a project](project.md)

## What's next:
- [Create a handler](handler.md)
- [Create a middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
