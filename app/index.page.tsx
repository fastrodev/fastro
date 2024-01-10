import { PageProps } from "../src/server/types.ts";

export default function Index(
  { data }: PageProps<
    { user: string; title: string; description: string }
  >,
) {
  return <p class="font-extralight">hello bro</p>;
}
