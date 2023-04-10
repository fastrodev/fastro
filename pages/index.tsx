import React from "https://esm.sh/react@18.2.0";

const Index = (props: { data: string }) => (
  <>
    <header className="mb-auto">
      <div>
        <h3 className="float-md-start mb-0">Fastro</h3>
        <nav className="nav nav-masthead justify-content-center float-md-end">
          <a
            className="nav-link fw-bold py-1 px-0 active"
            aria-current="page"
            href="#"
          >
            Home
          </a>
          <a
            className="nav-link fw-bold py-1 px-0"
            href="https://deno.land/x/fastro/bench/result.md?source"
          >
            Benchmarks
          </a>
        </nav>
      </div>
    </header>

    <main className="px-3">
      <h1 className="display-4 fw-bold">Fastro framework</h1>
      <p className="lead">
        Introducing the ultimate solution for developers seeking speed and
        simplicity in web development - a fast and simple web framework that
        will revolutionize your workflow.
      </p>
      <p className="lead">
        <a
          href="https://deno.land/x/fastro#getting-started"
          className="btn btn-lg btn-light fw-bold border-white bg-white"
        >
          Get started
        </a>
      </p>
    </main>

    <footer className="mt-auto text-white-50">
      <p>
        Powered by{"  "}
        <a href="https://deno.land/x/fastro" className="text-white">
          Fastro framework
        </a>
        {" & "}
        <a href="https://deno.com/deploy" className="text-white">
          Deno deploy
        </a>
      </p>
    </footer>
  </>
);

export default Index;
