import React from "https://esm.sh/react@18.2.0?dev";
import Footer from "../components/footer.tsx";
import Header from "../components/header.tsx";

export type Example = {
  title: string;
  description: string;
};

export default function Example(
  props: { version: string; path: string; examples: Example[] },
) {
  return (
    <>
      <Header path={props.path} />
      Examples
      <Footer version={props.version} />
    </>
  );
}
