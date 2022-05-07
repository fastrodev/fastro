import React from "https://esm.sh/react@17.0.2";

const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>Hello Deno Land!</h1>
      <button onClick={() => setCount(count + 1)}>Click</button>
      <p>You clicked {count} times</p>
    </div>
  );
};

export default App;
