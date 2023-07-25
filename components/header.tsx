export default function (props: { path: string }) {
  return (
    <header className="mb-auto text-center">
      <h3 className="float-md-start mb-0">Fastro</h3>
      <nav className="nav nav-masthead justify-content-center float-md-end">
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
          className={`nav-link fw-bold py-1 px-0`}
          href="#"
        >
          Showcase
        </a>
        <a
          className={`${
            props.path === "manual" ? "active" : ""
          } nav-link fw-bold py-1 px-0`}
          href="/manual"
        >
          Manual
        </a>
      </nav>
    </header>
  );
}
