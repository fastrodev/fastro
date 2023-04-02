import { Row } from "../types.d.ts";
import { contentType, extname, Status, STATUS_TEXT } from "./deps.ts";

export function handleStaticFile(
  reqUrl: string,
  staticURL: string,
  maxAge: number,
  cache: Row,
) {
  const staticID = "static" + reqUrl;
  const extID = "ext" + staticID + reqUrl;
  let path;
  let extName = "";

  if (cache[staticID]) {
    path = cache[staticID];
  } else {
    path = getPathUrl(reqUrl, staticURL);
    cache[staticID] = path;
  }

  if (cache[extID]) {
    extName = cache[extID];
  } else {
    extName = extname(path ?? "");
    cache[extID] = extName;
  }

  const txtExt = [".js", ".css", ".html", ".txt", ".xml", ".svg", ".ts", ""];
  const r = txtExt.find((val) => val === extName);

  if (r || r === "") {
    return handleTextFile(extName, maxAge, path, cache, reqUrl);
  }

  return handleNonText(path, maxAge);
}

async function handleNonText(
  path: string,
  maxAge: number,
) {
  let file;
  try {
    file = await Deno.open(`.${path}`, { read: true });
  } catch (err) {
    console.error(err);
    return new Response(STATUS_TEXT[Status.NotFound], {
      status: Status.NotFound,
    });
  }

  const ct = contentType(extname(path)) || "application/octet-stream";
  console.log("CT", ct);
  return new Response(file.readable, {
    headers: {
      "Content-Type": ct,
      "Cache-Control": `max-age=${maxAge}`,
    },
  });
}

async function handleTextFile(
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
      text = await Deno.readTextFile(`.${path}`);
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

async function handleIndex(path: string, url: string, cache: Row) {
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
      path = path === "/" ? "" : path;
      text = await Deno.readTextFile(`.${path}/index.html`);
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
    const r = pattern.test(url);
    if (!r) return null;
  }
  return url.substring(baseUrl.length);
}
