---
description: Render a React element to its initial HTML. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.
image: https://reactjs.org/logo-og.png
---

# React SSR

1. Install fastro command line interface (cli):
    ```
    deno install -A https://deno.land/x/fastro@v0.30.53/cli/fastro.ts
    ```

2. Create webapp folder, generate initial folders and files:
    ```
    mkdir webapp && cd webapp && fastro init
    ```
    It will create folders and files like this:
    ![](https://raw.githubusercontent.com/fastrojs/fastro/gh-pages/public/tree.svg)

3. Open `module/react.page.tsx`:

   - You can change the react template and the html title with your own via `options`
   - You can define react props via `props`  

   ```tsx
    import { Container } from "../container.ts";
    import { React, Request } from "../deps.ts";

    export const options = {
      // Define custom html template
      template: "react.template.html",
      // Define html title
      title: "React Demo",
    };

    // Define react props: https://reactjs.org/docs/components-and-props.html
    export const props = async (request: Request) => {
      // You can access container and its type defined in container.ts with this way
      const c: Container = request.container;
      return {
        params: request.getParams(),
        header: "Hello, Deno land!",
        repository: await c.repository,
      };
    };

    // Define component: https://reactjs.org/docs/components-and-props.html
    const App = (props: { params: string[]; header: string }) => {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <h2>{props.header}</h2>
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
        <title>{% raw %}{{title}}{% endraw %}</title>
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
