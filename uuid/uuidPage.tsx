import { useState } from "https://esm.sh/preact@10.17.1/hooks";
import { h } from "https://esm.sh/preact@10.17.1";

export default function uuidPage(props: { data: string }) {
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
