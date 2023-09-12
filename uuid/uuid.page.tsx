import { useState } from "preact/hooks";
import { h } from "preact";

export default function UUID(props: { data: string }) {
  const [data, setD] = useState({
    uuid: "e90d45df-4132-41ad-aec8-e0e19f7647a9",
  });

  const handleClick = async () => {
    const res = await fetch("/api");
    setD(await res.json());
  };

  return (
    <div>
      <h1>Hello {props.data}</h1>
      <button onClick={handleClick}>
        Click me to get the fresh UUID from API: {data.uuid}
      </button>
    </div>
  );
}
