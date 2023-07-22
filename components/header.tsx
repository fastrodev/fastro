export default function (props: { path: string }) {
  return (
    <header className="mb-auto text-center">
      <h3 className="float-md-start mb-0">Fastro</h3>
      <nav className="nav nav-masthead justify-content-center float-md-end">
        <a
          className={`nav-link fw-bold py-1 px-0 ${
            props.path === "home" ? "active" : ""
          }`}
          aria-current="page"
          href="/"
        >
          Home
        </a>
        <a
          className={`nav-link fw-bold py-1 px-0 ${
            props.path === "benchmarks" ? "active" : ""
          }`}
          href="/benchmarks"
        >
          Benchmarks
        </a>
        <a
          className={`nav-link fw-bold py-1 px-0 ${
            props.path === "examples" ? "active" : ""
          }`}
          href="/examples"
        >
          Examples
        </a>
        <a
          className="nav-link fw-bold py-1 px-0"
          href="https://deno.land/x/fastro/mod.ts"
        >
          Docs
        </a>
      </nav>
    </header>
  );
}
