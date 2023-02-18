import { Status, STATUS_TEXT } from "./deps.ts";

export async function handleStaticFile(
  reqUrl: string,
  staticFolder: string,
) {
  let file;
  const r = getPathUrl(reqUrl);
  if (!r) {
    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  }

  try {
    const filePath = `${staticFolder}${r}`;
    file = await Deno.open(filePath, { read: true });
  } catch (error) {
    console.error(error);
    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  }

  let options = {};
  if (r.includes(".js")) {
    options = {
      headers: {
        "content-type": "text/javascript",
      },
    };
  }

  return new Response(file.readable, options);
}

function getPathUrl(url: string) {
  const res = url.match(/^https?:\/\/[^/]+/);
  if (!res) return null;
  const [baseUrl] = res;
  return url.substring(baseUrl.length);
}
