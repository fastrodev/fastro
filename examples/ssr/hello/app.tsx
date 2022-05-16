// @deno-types="https://cdn.esm.sh/v78/@types/react@18.0.9/react.d.ts"
import React from "https://esm.sh/react@18.1.0";

const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>Hello World</h1>
      <button onClick={() => setCount(count + 1)}>Click the 🦕</button>
      <p>You clicked the 🦕 {count} times</p>
    </div>
  );
};

export default App;
