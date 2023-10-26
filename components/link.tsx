import React from "react";

export function LinkFooter(
  props: { children: string | string[]; link: string },
) {
  return (
    <a
      href={props.link}
      className="fw-lighter text-decoration-none text-white-50 me-2"
    >
      {props.children}
    </a>
  );
}

export function LinkHeader(
  props: {
    // deno-lint-ignore no-explicit-any
    children: any;
    link: string;
    path: string;
    activePath: string;
  },
) {
  return (
    <a
      className={`${
        props.path === props.activePath ? "active text-white" : "text-white-50"
      } nav-link fw-bold py-1 px-0 text-decoration-none`}
      href={props.link}
    >
      {props.children}
    </a>
  );
}
