import React from "https://esm.sh/react@18.2.0?dev";

export default function (props: { version: string }) {
  return (
    <footer className="mt-auto text-center text-white-50">
      <p className="fw-lighter">
        Made with{" "}
        <a
          href="https://deno.land/x/fastro"
          className="text-decoration-none text-white "
        >
          Fastro {props.version}
        </a>
      </p>
    </footer>
  );
}
