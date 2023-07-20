import React, { useState } from "https://esm.sh/react@18.2.0?dev";

export default function pp(props: { data: string }) {
  const [data, setD] = useState({
    uuid: "e90d45df-4132-41ad-aec8-e0e19f7647a9",
  });

  const handleClick = async () => {
    const res = await fetch("/api");
    setD(await res.json());
  };

  return (
    <>
      <h1>Hello {props.data}</h1>
      <button onClick={handleClick}>
        Click me to get the fresh UUID from API: {data.uuid}
      </button>
    </>
  );
}
