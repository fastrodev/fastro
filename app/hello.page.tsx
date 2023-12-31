import { PageProps } from "../src/server/types.ts";

export default function Hello(
  { data }: PageProps<{ data: string; user: string; title: string }>,
) {
  return <p>hello bro {data.data}</p>;
}
