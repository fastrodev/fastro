import React from "https://esm.sh/react@18.2.0?dev";
import Footer from "../components/footer.tsx";
import Header from "../components/header.tsx";

const Index = (
  props: { version: string; path: string; title: string; description: string },
) => {
  return (
    <>
      <Header path={props.path} />
      <main className="px-3 text-center">
        <h1 className="display-6 fw-bold">
          {props.title}
        </h1>
        <p className="lead text-white-50">
          {props.description}
        </p>
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
            deno run -A -r https://fastro.deno.dev
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
                deno run -A -r https://fastro.deno.dev
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer version={props.version} />
    </>
  );
};

export default Index;
