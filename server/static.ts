import { Status, STATUS_TEXT } from "./deps.ts";

export async function handleStaticFile(
  baseStaticUrl: string,
  reqUrl: string,
  staticFolder: string,
) {
  let file;
  console.log("baseStaticUrl", baseStaticUrl);
  console.log("reqUrl", reqUrl);
  const [, path] = reqUrl.split(baseStaticUrl);
  if (!path) {
    console.log("emang ga ada");
    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  }

  try {
    const filePath = `${staticFolder}/${path}`;
    console.log(filePath);
    file = await Deno.open(filePath, { read: true });
  } catch (error) {
    console.log(staticFolder);
    console.log(error);
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
