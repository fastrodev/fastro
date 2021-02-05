---
description: Fastro command line interface (cli) installation
---

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
    deno install -A https://deno.land/x/fastro@v0.30.34/cli/fastro.ts
    ```
4. Go to [create a project page](project.md) to init folders and files

## What's next:
- [Create a handler](handler.md)
- [Create a middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [React SSR](react.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
