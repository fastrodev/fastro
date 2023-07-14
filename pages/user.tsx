import React from "https://esm.sh/react@18.2.0?dev";

// you can access injected props from server directly
const User = (props: { data: string }) => (
  <div className="row align-items-center" style={{ height: "100vh" }}>
    <div className="mx-auto col-3">
      <h1>
        Hello {props.data}
      </h1>
    </div>
  </div>
);

export default User;
