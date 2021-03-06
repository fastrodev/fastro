---
description: You can access and add additional property to the request object before the controllers process it.
---

# Create a middleware

- `fastro init` command will generate folders and files like this.
   ![](https://raw.githubusercontent.com/fastrojs/fastro/gh-pages/public/tree.svg)
    
- You can access and add additional property to the request object before the controllers process it.

- Open middleware file, `middleware/support.ts`:
    ```ts
    import type { Callback, Request } from "../deps.ts";
    export const options = {
      methods: ["GET", "POST"],
    };
    export default (request: Request, next: Callback) => {
      request.hello = "with middleware";
      next();
    };

    ```

## What's next:
- [Create static files](static.md)
- [Template rendering](rendering.md)
- [React SSR](react.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
