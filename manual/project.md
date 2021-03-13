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
    ![](https://raw.githubusercontent.com/fastrojs/fastro/gh-pages/public/tree.svg)

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
