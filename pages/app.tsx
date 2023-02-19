import React, { useState } from "https://esm.sh/react@18.2.0";

const App = (props: { data: string }) => {
  const [count, setCount] = useState(0);
  return (
    <div className="container">
      <h1>Hello {props.data}</h1>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setCount(count + 1)}
      >
        Click the 🦕
      </button>
      <p>You clicked the 🦕 {count} times</p>
    </div>
  );
};

export default App;
