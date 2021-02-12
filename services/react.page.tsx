import React from "https://esm.sh/react";
import type { Request } from "../mod.ts";

export const options = {
  // Define custom html template
  template: "react.template.html",
  // Define html title
  title: "React SSR",
};

// Define react props: https://reactjs.org/docs/components-and-props.html
export const props = (request: Request) => {
  return {
    params: request.getParams(),
    header: "Click me!",
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
