import { PageProps } from "../src/server/types.ts";

export default function Dear(
  { data }: PageProps<{ data: string; user: string; title: string }>,
) {
  return (
    <>
      <p class="top-0">DEAR {data.data} {data.user} {data.title}</p>
    </>
  );
}
