import React from "https://esm.sh/react@17.0.2";
import ReactDOM from "https://esm.sh/react-dom@17.0.2";
import App from "./app.tsx";
ReactDOM.hydrate(
  <App />,
  //@ts-ignore:
  document.getElementById("root"),
);