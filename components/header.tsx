export default function (props: { path: string }) {
  return (
    <header className="mb-auto text-center">
      <h3 className="float-md-start mb-0">Fastro</h3>
      <div className="nav-scroller justify-content-center">
        <nav className="nav nav-masthead float-md-end overflow-x-auto">
          <a
            className={`${
              props.path === "home" ? "active" : ""
            } nav-link fw-bold py-1 px-0 `}
            aria-current="page"
            href="/"
          >
            Home
          </a>

          <a
            className={`${
              props.path === "benchmarks" ? "active" : ""
            } nav-link fw-bold py-1 px-0`}
            href="/benchmarks"
          >
            Benchmarks
          </a>
          <a
            className={`${
              props.path === "examples" ? "active" : ""
            } nav-link fw-bold py-1 px-0`}
            href="/examples"
          >
            Examples
          </a>
          <a
            className={`${
              props.path === "manual" ? "active" : ""
            } nav-link fw-bold py-1 px-0`}
            href="/manual"
          >
            Manual
          </a>
          <a
            className={`nav-link fw-bold py-1 px-0`}
            href="#"
          >
            Blog
          </a>
          <a
            className={`nav-link fw-bold py-1 px-0`}
            href="https://replix.co"
          >
            Showcase
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
      </div>
    </header>
  );
}
