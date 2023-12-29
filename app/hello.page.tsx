import { PageProps } from "../src/server/types.ts";

export default function Hello({ data }: PageProps<string>) {
  return <p>FN {data}</p>;
}
