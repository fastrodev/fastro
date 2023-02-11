import { Status, STATUS_TEXT } from "./deps.ts";

export async function handleStaticFile(
  baseStaticUrl: string,
  reqUrl: string,
  staticFolder: string,
) {
  let file;
  const [, path] = reqUrl.split(baseStaticUrl);
  if (!path) {
    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  }

  try {
    const filePath = `${staticFolder}/${path}`;
    file = await Deno.open(filePath, { read: true });
  } catch {
    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  }

  let options = {};
  if (path.includes(".js")) {
    options = {
      headers: {
        "content-type": "text/javascript",
      },
    };
  }

  return new Response(file.readable, options);
}
