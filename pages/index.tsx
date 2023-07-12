import React from "https://esm.sh/react@18.2.0";

const Index = (props: { version: string }) => {
  return (
    <>
      <header className="mb-auto">
        <h3 className="float-md-start mb-0">Fastro</h3>
        <nav className="nav nav-masthead justify-content-center float-md-end">
          <a
            className="nav-link fw-bold py-1 px-0 active"
            aria-current="page"
            href="#"
          >
            Home
          </a>
          <a className="nav-link fw-bold py-1 px-0" href="/benchmarks">
            Benchmarks
          </a>
          <a
            className="nav-link fw-bold py-1 px-0"
            href="https://deno.land/x/fastro/mod.ts"
          >
            Docs
          </a>
          <a
            className="nav-link py-1 px-0"
            href="https://github.com/fastrodev/fastro"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-github text-white"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </nav>
      </header>

      <main className="px-3">
        <h1 className="display-5 fw-bold">
          Fast and Simple Web Application Framework
        </h1>
        <p className="lead text-white-50">
          Handle thousands of requests per second with a minimalistic API
        </p>
        <div className="d-none d-sm-flex p-2 bd-highlight justify-content-center">
          <div className="me-2">
            <a
              href="/start"
              className="btn btn-lg btn-light fw-light bg-white align-middle"
            >
              Get started
            </a>
          </div>
          <div className="pt-2 pb-2 ps-3 pe-3 bg-black border border-light rounded fw-lighter align-middle">
            deno run -A -r https://fastro.dev
          </div>
        </div>

        <div className="container d-block d-sm-none">
          <div className="row">
            <div className="col-sm-12">
              <div className="mb-3">
                <a
                  href="/start"
                  className="btn btn-lg btn-light fw-light bg-white w-100"
                >
                  Get started
                </a>
              </div>
              <div className="pt-2 pb-2 ps-3 pe-3 bg-black border border-light rounded fw-lighter w-100">
                deno run -A -r https://fastro.dev
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto text-white-50">
        <p>
          Made with{" "}
          <a
            href="https://deno.land/x/fastro"
            className="text-decoration-none text-white "
          >
            Fastro {props.version}
          </a>
        </p>
      </footer>
    </>
  );
};

export default Index;
