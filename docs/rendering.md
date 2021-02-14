---
description: You can render html template and pass dynamic value on it.
---

# Template Rendering

- `fastro init` command will generate folders and files like this.
    ```
    .
    ├── app.yaml
    ├── container.ts
    ├── deps.ts
    ├── Dockerfile
    ├── main.ts
    ├── middleware
    │   └── support.ts
    ├── module
    │   ├── hello.controller.ts
    │   ├── hello.template.html
    │   ├── react.page.tsx
    │   └── react.template.html
    ├── public
    │   ├── favicon.ico
    │   └── index.html
    └── readme.md

    3 directories, 13 files
    ```

    You can render html template and pass dynamic value on it.

- Open `hello.template.html` in `services` folder
    ```html
    <html>
        <head>
            <title>{% raw %}{{greeting}} {{name}}{% endraw %}</title>
        </head>
        <body>
            {% raw %}{{greeting}} {{name}}{% endraw %}
        </body>
    </html>
    ```

    You can change `hello` name with other.

- Open `hello.controller.ts` handler. 

    Uncomment `request.view` and comment `request.send`.

    ```ts
    import type { Request } from "https://deno.land/x/fastro@v0.30.43/mod.ts";
    export default (request: Request) => {
      request.view("hello.template.html", { greeting: "Hello", name: "World" });
      // request.send("hello");
    };

    ```
- Open url

    ```
    http://localhost:3000/hello
    ```
    Now you see the greeting and name on the browser.


## What's next:
- [React SSR](react.md)
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
