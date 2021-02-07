import React from "https://esm.sh/react";

export const options = {
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
      <p>You clicked me {count} times</p>
    </div>
  );
};

export default App;
