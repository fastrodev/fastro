import { h } from "https://esm.sh/preact@10.16.0";
import { VNode } from "https://esm.sh/preact@10.16.0";

export function LinkFooter(
  props: { children: VNode | string | string[]; link: string },
) {
  return (
    <a
      href={props.link}
      className="fw-light text-decoration-none text-white-50 me-2"
    >
      {props.children}
    </a>
  );
}

export function LinkHeader(
  props: {
    children: VNode | string | string[];
    link: string;
    path: string;
    activePath: string;
  },
) {
  return (
    <a
      className={`${
        props.path === props.activePath ? "active" : ""
      } nav-link fw-bold py-1 px-0`}
      href={props.link}
    >
      {props.children}
    </a>
  );
}
