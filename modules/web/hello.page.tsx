import { PageProps } from "../../http/server/types.ts";

export default function Hello(
  { data }: PageProps<{ data: string; user: string; title: string }>,
) {
  return <p class="font-extralight">hello bro {data.data}</p>;
}
