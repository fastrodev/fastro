// deno-lint-ignore-file no-explicit-any
import { useState } from "https://esm.sh/preact@10.16.0/hooks";
import { h } from "https://esm.sh/preact@10.16.0";

const Hello = () => {
  const [link, setLink] = useState("Guest");

  return (
    <div className="row align-items-center" style={{ height: "100vh" }}>
      <div className="mx-auto col-3">
        <form
          className="row column-gap-2"
          action={`/${link}`}
        >
          <input
            className="form-control form-control-md col"
            type="text"
            placeholder="Hello guest"
            aria-label="Guest"
            onChange={(e: any) => {
              setLink(e.target.value);
            }}
          />
          <button
            className="btn btn-primary col-2"
            style={{ width: "50px" }}
            type="submit"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hello;
