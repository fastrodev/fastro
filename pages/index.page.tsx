import React from "react";
import Footer from "../components/footer.tsx";
import Header from "../components/header.tsx";

const Index = (
  props: { version: string; path: string; title: string; description: string },
) => {
  return (
    <>
      <Header path={props.path} />
      <main className="px-3 d-flex flex-column h-100">
        <div
          className="mx-auto flex-grow-1 d-flex align-items-center"
          style={{ maxWidth: 135 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="currentColor"
            className="bi bi-hexagon-fill"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8.5.134a1 1 0 0 0-1 0l-6 3.577a1 1 0 0 0-.5.866v6.846a1 1 0 0 0 .5.866l6 3.577a1 1 0 0 0 1 0l6-3.577a1 1 0 0 0 .5-.866V4.577a1 1 0 0 0-.5-.866L8.5.134z"
            />
          </svg>
        </div>

        <div
          className="text-center mb-3 d-flex flex-column align-items-center"
          style={{ minHeight: 100 }}
        >
          <h1 className="d-sm-block fs-2 fw-bold mt-2">
            {props.title}
          </h1>
          <div className="fs-5 fw-lighter text-white mt-0 mb-3">
            {props.description}
          </div>
          <div className="d-none d-sm-flex p-2 bd-highlight justify-content-center">
            <div className="me-2">
              <a
                href="/start"
                className="p-3 btn btn-light bg-white align-middle display-3 fw-bold"
              >
                Get started
              </a>
            </div>
            <div className="p-3 bg-black border border-light rounded fw-light align-middle">
              deno run -A -r https://fastro.dev
            </div>
          </div>

          <div className="container d-block d-sm-none">
            <div className="row">
              <div className="col-sm-12">
                <div className="mb-3">
                  <a
                    href="/start"
                    className="p-3 btn btn-light bg-white w-100 display-3 fw-bold"
                  >
                    Get started
                  </a>
                </div>
                <div className="p-3 bg-black border border-light rounded fw-light w-100">
                  deno run -A -r https://fastro.dev
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer version={props.version} path="" />
    </>
  );
};

export default Index;
