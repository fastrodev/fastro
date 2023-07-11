import React from "https://esm.sh/react@18.2.0";

const Index = (props: { version: string }) => {
  return (
    <>
      <header className="mb-auto">
      </header>

      <main className="px-3">
        <h1 className="display-4 fw-bold">
          Fast and Simple Web Application Framework
        </h1>
        <p className="lead text-white-50">
          Handle thousands of requests per second with a minimalistic API
        </p>
        <div className="container" style={{ maxWidth: 450 }}>
          <div className="row">
            <div className="col-5">
              <a
                href="/start"
                className="btn btn-lg btn-light fw-normal bg-white align-middle"
              >
                Get started
              </a>
            </div>
            <div className="col-7 pt-2 bg-black border border-light rounded fw-lighter align-middle">
              deno run -A -r https://fastro.dev
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
