import React from "https://esm.sh/react@18.2.0";

const Index = (props: { version: string }) => {
  return (
    <>
      <header className="mb-auto">
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
