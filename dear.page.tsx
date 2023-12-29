import { PageProps } from "./src/server/types.ts";

export default function Dear({ data }: PageProps<string>) {
  return <p>DEAR {data}</p>;
}
