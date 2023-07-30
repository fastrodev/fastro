import React from "https://esm.sh/react@18.2.0?dev";

// User component with props get from the server handler
export default function User(props: { data: string }) {
  return <h1>Hello {props.data}</h1>;
}
