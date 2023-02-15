// deno-lint-ignore-file no-explicit-any
import React from "https://esm.sh/react@18.2.0";

// you can access injected props from server directly
export default (props: any) => (
  <div>
    <h1>
      <a href={props.data + "/count"}>Hello {props.data}</a>
    </h1>
  </div>
);
