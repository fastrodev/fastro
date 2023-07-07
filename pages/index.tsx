import React from "https://esm.sh/react@18.2.0";

const Index = () => (
  <>
    <header className="mb-auto">
    </header>

    <main className="px-3">
      <h1 className="display-4 fw-bold">
        Fast & Simple Web Application Framework
      </h1>
      <p className="lead">
        Built on top of Deno. Handle thousands of requests per second. Easy to
        learn and use. Has a minimal API, so you don't have to worry about
        learning a lot of complex concepts.
      </p>
      <p className="lead">
        <a
          href="/start"
          className="btn btn-lg btn-light fw-bold border-white bg-white"
        >
          Get started
        </a>
      </p>
    </main>

    <footer className="mt-auto text-white-50">
      <p>
        Powered by{" "}
        <a href="https://deno.com/deploy" className="text-white">
          Deno deploy
        </a>
      </p>
    </footer>
  </>
);

export default Index;
