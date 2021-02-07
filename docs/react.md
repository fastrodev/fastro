---
description: Deno React Server Side Rendering (SSR)
image: https://reactjs.org/logo-og.png
---

# Deno React Server Side Rendering (SSR)

1. Install fastro command line interface (cli):
    ```
    deno install -A https://deno.land/x/fastro@v0.30.35/cli/fastro.ts
    ```

2. Create webapp folder, generate initial folders and files:
    ```
    mkdir webapp && fastro init
    ```
    It will create folders and files like this:
    ```
    .
    ├── app.yaml
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

    3 directories, 10 files
    ```

3. Open `services/react.page.tsx`:

   - You can change the react template and the html title with your own via `config`
   - You can define react props via `props`  

   ```tsx
   import React from "https://esm.sh/react";

    export const config = {
        template: "react.template.html",
        title: "Hello Deno Land!",
    };

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
                <p>You clicked me {count} times</p>
            </div>
        );
    };

    export default App;

   ```

4. Open `react.template.html`:
   - This is the usual react template.
   - You can change it as needed.

   ```html
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{\title}}</title>
    </head>

    <body>
        <div id="root"></div>
    </body>

    </html>
   ```

5. Run your webapp:
    ```
    deno run -A main.ts
    ```
    Or if you want to monitor any changes and automatically restart:
    ```
    fastro serve
    ```

6. Open the react page
    ```
    http://localhost:3000/react
    ```
    You can see the live demo at this link: [https://phonic-altar-274306.ue.r.appspot.com/react](https://phonic-altar-274306.ue.r.appspot.com/react)


## What's next:
- [Data validation](validation.md)
- [Publishing and deployment](deployment.md)
- [Fastro API](api.md)
