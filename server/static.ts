import { Status, STATUS_TEXT } from "./deps.ts";

export async function handleStaticFile(
  reqUrl: string,
  staticURL: string,
  maxAge: number,
) {
  let file;
  const path = getPathUrl(reqUrl, staticURL);
  if (!path) {
    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  }

  try {
    file = await Deno.open(`.${path}`, { read: true });
  } catch (error) {
    console.error(error);
    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  }

  let options = {};
  if (path.includes(".js")) {
    options = {
      headers: {
        "content-type": "text/javascript",
        "Cache-Control": `max-age=${maxAge}`,
      },
    };
  }

  return new Response(file.readable, options);
}

function getPathUrl(url: string, staticURL: string) {
  const s = staticURL === "/" ? "" : staticURL;
  const res = url.match(/^https?:\/\/[^/]+/);
  if (!res) return null;
  const [baseUrl] = res;
  const p = `${s}/:file`;
  const pattern = new URLPattern(p, baseUrl);
  if (!pattern.test(url)) return null;
  return url.substring(baseUrl.length);
}
