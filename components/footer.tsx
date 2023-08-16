import { h } from "https://esm.sh/preact@10.16.0";

export default function (props: { version: string }) {
  return (
    <footer className="mt-auto text-center fw-lighter text-white-50">
      {
        /* <nav className="nav nav-mastfoot justify-content-center">
      </nav> */
      }
      <span className="fw-lighter">
        Made with{"  "}
        <a
          href="https://deno.land/x/fastro"
          className="fw-lighter text-decoration-none text-white "
        >
          Fastro {props.version}
        </a>
      </span>
    </footer>
  );
}
