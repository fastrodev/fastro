import { PageProps } from "../http/server/types.ts";

export default function Dear(
  { data }: PageProps<{ data: string; user: string; title: string }>,
) {
  return (
    <p class="font-extralight">Dear {data.data} {data.user} {data.title}</p>
  );
}
