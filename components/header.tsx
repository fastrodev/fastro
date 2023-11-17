import React from "react";
import { LinkHeader } from "$fastro/components/link.tsx";

export default function (
  props: { path: string; version: string; avatar?: string },
) {
  return (
    <header className="mb-auto text-center">
      <h3 className="float-md-start mb-2 fs-3 ">
        <a href="/" style={{ textDecoration: "none", color: "#fff" }}>
          <span className="fw-bold">Fastro</span>{" "}
          <span className="fw-lighter">
            {props.version}
          </span>
        </a>
      </h3>
      <div className="nav-scroller justify-content-end">
        <nav className="nav nav-masthead justify-content-center justify-content-md-end">
          <LinkHeader
            activePath="benchmarks"
            link="/benchmarks"
            path={props.path}
          >
            Benchmarks
          </LinkHeader>
          <LinkHeader activePath="manual" link="/manual" path={props.path}>
            Manual
          </LinkHeader>
          <LinkHeader activePath="examples" link="/examples" path={props.path}>
            Examples
          </LinkHeader>
          <LinkHeader activePath="blog" link="/blog" path={props.path}>
            Blog
          </LinkHeader>
          <LinkHeader activePath="store" link="/store" path={props.path}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-cart4"
              viewBox="0 0 16 16"
            >
              <title>Shop</title>
              <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
            </svg>
          </LinkHeader>
          {props.avatar === ""
            ? (
              <LinkHeader
                activePath=""
                link="/signin"
                path={props.path}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <title>Signin</title>
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              </LinkHeader>
            )
            : (
              <LinkHeader
                activePath=""
                link="/signout"
                path={props.path}
              >
                <img src={props.avatar} width={24} className="rounded-circle" />
              </LinkHeader>
            )}
        </nav>
      </div>
    </header>
  );
}
