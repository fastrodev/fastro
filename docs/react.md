---
description: Deno React Server Side Rendering
image: https://reactjs.org/logo-og.png
---

# Deno React Server Side Rendering
- `fastro init` command will generate folders and files like this.
    ```
    webapp
    ├── Dockerfile
    ├── main.ts
    ├── middleware
    │   └── support.ts
    ├── public
    │   ├── favicon.ico
    │   └── index.html
    └── services
        ├── hello.controller.ts
        ├── hello.template.html
        ├── react.page.tsx
        └── react.template.html

    3 directories, 9 files
    ```

- Open handler file, `services/react.page.tsx`:
    ```tsx
    import React from "https://esm.sh/react";

    export const config = {
        // Define custom html template
        template: "react.template.html",
        // Define html title
        title: "Hello Deno Land!",
    };

    // Define react props: https://reactjs.org/docs/components-and-props.html
    export const props = { msg: "Hello Deno Land!" };

    const App = (props: { msg: string }) => {
        const [count, setCount] = React.useState(0);
        return (
          <div>
            <h2>{props.msg}</h2>
            <p>
                This page was created using Deno, Fastro and React's server-side
                rendering (SSR). Click to try the react hook.
            </p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
            <p>You clicked me {count} times </p>
          </div>
        );
    };

    export default App;

    ```
- Run server

    ```
    fastro serve
    ```

- Open url to access the react page
    ```
    http://localhost:3000/react
    ```

## What's next:
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
