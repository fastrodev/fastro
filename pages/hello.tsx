// deno-lint-ignore-file no-explicit-any
import React, { useState } from "https://esm.sh/react@18.2.0";

const Hello = () => {
  const [link, setLink] = useState("Guest");

  const handleChange = (e: any) => {
    setLink(e.target.value);
  };

  return (
    <div className="container">
      <form
        className="row row-cols-lg-auto g-3 align-items-center"
        action={`/${link}`}
      >
        <input
          className="ms-2 w-25 form-control form-control-md"
          type="text"
          placeholder="Hello Guest"
          aria-label="Guest"
          onChange={handleChange}
        />
        <button className="btn btn-primary ms-2" type="submit">
          Go
        </button>
      </form>
    </div>
  );
};

export default Hello;
