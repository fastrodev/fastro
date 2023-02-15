import React, { useState } from "https://esm.sh/react@18.2.0";

const App = (props: any) => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Hello {props.data}</h1>
      <button onClick={() => setCount(count + 1)}>Click the 🦕</button>
      <p>You clicked the 🦕 {count} times</p>
    </div>
  );
};

export default App;
