import { PageProps } from "../src/server/types.ts";

export default function Hello(props: PageProps<string>) {
  return <p>FN {props.data}</p>;
}
