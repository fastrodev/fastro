import { h } from "https://esm.sh/preact@10.16.0";
import { LinkHeader } from "./link.tsx";

export default function (props: { path: string }) {
  return (
    <header className="mb-auto text-center">
      <h3 className="float-md-start mb-0 fs-3 ">
        <a href="/" style={{ textDecoration: "none", color: "#fff" }}>
          <span className="fw-bold">Fastro</span>{" "}
          <span className="fw-lighter">
            Framework
          </span>
        </a>
      </h3>
      <div className="nav-scroller justify-content-end">
        <nav className="nav nav-masthead justify-content-center justify-content-md-end">
          <LinkHeader activePath="manual" link="/manual" path={props.path}>
            Manual
          </LinkHeader>
          <LinkHeader activePath="examples" link="/examples" path={props.path}>
            Examples
          </LinkHeader>
          <LinkHeader activePath="blog" link="/blog" path={props.path}>
            Blog
          </LinkHeader>
        </nav>
      </div>
    </header>
  );
}
