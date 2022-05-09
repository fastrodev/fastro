import { Status, STATUS_TEXT } from "./deps.ts";

export async function handleStaticFile(staticUrl: string, url: string) {
  let file;
  const staticPath = "./static";

  const [, path] = url.split(staticUrl);
  if (!path) {
    return new Response(STATUS_TEXT.get(Status.NotFound), {
      status: Status.NotFound,
    });
  }

  try {
    file = await Deno.open(staticPath + path, { read: true });
  } catch {
    return new Response(STATUS_TEXT.get(Status.NotFound), {
      status: Status.NotFound,
    });
  }

  return new Response(file.readable);
}
