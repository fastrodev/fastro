export const root = `
<div id="root">{{root}}</div>
<script type="module">
  import React from "https://esm.sh/react";
  import ReactDOM from "https://esm.sh/react-dom";
  ReactDOM.hydrate(React.createElement({{element}}, {{props}}), document.getElementById('root'))
</script>
`;
export const react = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{title}}</title>
</head>

<body>
    <div id="root"></div>
</body>

</html>
`;
export const component = `import { Container, React, Request } from "../deps.ts";

export const options = {
  // Define custom html template
  template: "react.template.html",
  // Define html title
  title: "React Demo",
};

// Define react props: https://reactjs.org/docs/components-and-props.html
export const props = async (request: Request) => {
  // You can access container and its type defined in deps.ts with this way
  const c: Container = request.container;
  return {
    params: request.getParams(),
    header: "Hello, Deno land!",
    db: await c.db,
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

`;
