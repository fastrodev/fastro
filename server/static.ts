import { contentType, extname, Status, STATUS_TEXT } from "./deps.ts";

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

  return new Response(file.readable, {
    headers: {
      "Content-Type": contentType(extname(path)) || "application/octet-stream",
      "Cache-Control": `max-age=${maxAge}`,
    },
  });
}

function getPathUrl(url: string, staticURL: string) {
  const s = staticURL === "/" ? "" : staticURL;
  const res = <RegExpMatchArray> url.match(/^https?:\/\/[^/]+/);
  const [baseUrl] = res;
  const p = `${s}/:file`;
  const pattern = new URLPattern(p, baseUrl);
  if (!pattern.test(url)) return null;
  return url.substring(baseUrl.length);
}
