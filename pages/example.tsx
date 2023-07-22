import React from "https://esm.sh/react@18.2.0?dev";
import Footer from "../components/footer.tsx";
import Header from "../components/header.tsx";

type Example = {
  name: string;
  ext: string;
  file: string;
};

export default function Example(
  props: { version: string; path: string; examples: Example[] },
) {
  const list = props.examples.map((e) => {
    const path =
      `https://github.com/fastrodev/fastro/blob/main/examples/${e.file}`;
    return (
      <a
        href={path}
        className="me-2 mb-2 border rounded-3"
      >
        <div style={{ padding: 20 }}>
          {e.name}
        </div>
      </a>
    );
  });
  return (
    <>
      <Header path={props.path} />
      <div className="container" style={{ marginBottom: 50, marginTop: 20 }}>
        <div className="d-flex flex-wrap flex-fill">
          {list}
        </div>
      </div>
      <Footer version={props.version} />
    </>
  );
}
