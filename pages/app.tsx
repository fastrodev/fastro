import React, { useState } from "https://esm.sh/react@18.2.0?dev";

// import ReactProd, {
//   useState as useStateProd,
// } from "https://esm.sh/react@18.2.0";

// import ReactDev, {
//   useState as useStateDev,
// } from "https://esm.sh/react@18.2.0?dev";

// declare global {
//   interface Window {
//     __ENV__: string;
//   }
// }

// let dev = false;
// try {
//   dev = Deno.run !== undefined;
// } catch {
//   dev = window.__ENV__ === "DEVELOPMENT";
// }

// const React = dev ? ReactDev : ReactProd;
// const useState = dev ? useStateDev : useStateProd;

type D = { time: string };

const App = (props: { data: string }) => {
  const data: D = { time: "___" };
  const [d, setD] = useState(data);

  const handleClick = async () => {
    const res = await fetch("/api");
    const jsonData = await res.json();
    setD(jsonData);
  };

  return (
    <div className="row align-items-center" style={{ height: "100vh" }}>
      <div className="mx-auto col-3">
        <div className="container">
          <h1>Hello {props.data}</h1>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClick}
          >
            Hit API
          </button>
          <pre className="mt-2">Response {JSON.stringify(d)}</pre>
        </div>
      </div>
    </div>
  );
};

export default App;
