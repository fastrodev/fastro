# Installation

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
    ```
    deno install -f --reload -A https://raw.fastro.dev/master/cli/fastro.ts
    ```
    
    Or change `master` with the latest version to prevent breaking changes.
    ```
    deno install -A https://raw.fastro.dev/v0.30.20/cli/fastro.ts
    ```

## What's next:
- [Quickstart](quickstart.md)
- [Create a handler](handler.md)
- [Create a middleware](middleware.md)
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
