import { contentType, extname, Status, STATUS_TEXT } from "./deps.ts";
import { Row } from "./types.ts";

export async function handleStaticFile(
  reqUrl: string,
  staticURL: string,
  maxAge: number,
  cache: Row,
) {
  let file;
  const path = getPathUrl(reqUrl, staticURL);
  if (!path) {
    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  }

  const ext = extname(path);
  const txtExt = [".js", ".css", ".html", ".txt", ".xml", ".svg", ".ts", ""];
  const r = txtExt.find((val) => val === ext);

  if (r || r === "") {
    return handleTextFile(ext, maxAge, path, cache, reqUrl);
  }

  try {
    file = await Deno.open(`.${path}`, { read: true });
  } catch (err) {
    console.error(err);
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

function handleTextFile(
  ext: string,
  maxAge: number,
  path: string,
  cache: Row,
  url: string,
) {
  let text;
  const txtID = "txt" + url;

  if (cache[txtID]) {
    text = cache[txtID];
  } else {
    try {
      text = Deno.readTextFileSync(`.${path}`);
      cache[txtID] = text;
    } catch {
      return handleIndex(path, url, cache);
    }
  }

  return new Response(text, {
    headers: {
      "Content-Type": contentType(ext) || "text/plain; charset=UTF-8",
      "Cache-Control": `max-age=${maxAge}`,
    },
  });
}

function handleIndex(path: string, url: string, cache: Row) {
  let text;
  const idxID = "index" + url;

  if (cache[idxID]) {
    text = cache[idxID];
    if (text === STATUS_TEXT[Status.NotFound]) {
      return new Response(text, {
        status: Status.NotFound,
      });
    }
  } else {
    try {
      text = Deno.readTextFileSync(`.${path}/index.html`);
      cache[idxID] = text;
    } catch (err) {
      console.error(err);
      text = STATUS_TEXT[Status.NotFound];
      cache[idxID] = text;
      return new Response(text, {
        status: Status.NotFound,
      });
    }
  }

  return new Response(text, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

function getPathUrl(url: string, staticURL: string) {
  const res = <RegExpMatchArray> url.match(/^https?:\/\/[^/]+/);
  const [baseUrl] = res;
  if (staticURL !== "/") {
    const p = `${staticURL}/:file*`;
    const pattern = new URLPattern(p, baseUrl);
    if (!pattern.test(url)) return null;
  }
  return url.substring(baseUrl.length);
}
