import { PageProps } from "./src/server/types.ts";

export default function Dear(props: PageProps<string>) {
  console.log(props);
  return (
    <>
      <p>DEAR {props.data}</p>
    </>
  );
}
