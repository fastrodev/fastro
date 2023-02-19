import React from "https://esm.sh/react@18.2.0";

// you can access injected props from server directly
const User = (props: { data: string }) => (
  <div className="container">
    <h1>
      <a href={props.data + "/count"}>Hello {props.data}</a>
    </h1>
  </div>
);

export default User;
