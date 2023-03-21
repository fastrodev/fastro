// deno-lint-ignore-file no-explicit-any
import * as esbuild from "https://deno.land/x/esbuild@v0.15.10/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts";
import {
  Container,
  HttpRequest,
  JSXHandler,
  RenderOptions,
  SSR,
} from "../types.d.ts";
import { EXPIRY_SECONDS } from "./constant.ts";
import { React, ReactDOMServer, Status, STATUS_TEXT } from "./deps.ts";
import { isJSX } from "./handler.ts";

export function createSSR(el: JSXHandler | JSX.Element): SSR {
  let element: JSX.Element;
  let status: 200;
  let html: string;
  let pageDir = "pages";
  let staticPath = "/public";
  let title: string;
  let bundleName: string;
  const scriptInstance: string[] = [];
  const styleInstance: string[] = [];
  const linkInstance: string[] = [];
  const metaInstance: string[] = [];
  let props: any;
  let lang: string;
  let htmlAttr: string;
  let bodyAttr: string;
  let rootAttr: string;
  let ogDescription: string;
  let ogTitle: string;
  let ogImage: string;
  let ogURL: string;
  let ogType: string;
  let ogSiteName: string;
  let twitterCard: string;
  let twitterImageAlt: string;
  let metaDesc: string;
  let httpRequest: HttpRequest;
  let cache: Container;

  if (isJSX(el)) {
    const jsxElement = <JSX.Element> el;
    bundleName = jsxElement.type.name;
    element = jsxElement;
  } else {
    const jsxElement = <JSXHandler> el;
    bundleName = jsxElement.name.toLowerCase();
    element = React.createElement(jsxElement, props);
  }

  function createHydrate(rootComponent: string, rootTSX: string) {
    rootTSX = rootTSX.toLowerCase();
    return `import React from "https://esm.sh/react@18.2.0";import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";import ${rootComponent} from "./${rootTSX}.tsx";const props = window.__INITIAL_STATE__ || {};const container = document.getElementById("root");const root = createRoot(container);root.render(<${rootComponent}  {...props} />);`;
  }

  function createMeta(meta: string) {
    return `<meta ${meta}>`;
  }

  function createScript(script: string) {
    return `<script ${script}></script>`;
  }

  function createLink(link: string) {
    return `<link ${link}>`;
  }

  function createStyle(style: string) {
    return `<style>${style}</style>`;
  }

  function createDescription(desc: string) {
    return `<meta property="og:description" content="${desc}">`;
  }

  function createMetaDescription(metaDesc: string) {
    return `<meta  name="description" content="${metaDesc}">`;
  }

  function createSiteName(siteName: string) {
    return `<meta property="og:site_name" content="${siteName}">`;
  }

  function createURL(url: string) {
    return `<meta property="og:url" content="${url}">`;
  }

  function createImage(img: string) {
    return `<meta property="og:image" content="${img}">`;
  }

  function createType(type: string) {
    return `<meta property="og:type" content="${type}">`;
  }

  function createTitle(title: string) {
    return `<meta property="og:title" content="${title}">`;
  }

  function createTwitterCard(card: string) {
    return `<meta name="twitter:card" content="${card}">`;
  }

  function createTwitterImageAlt(alt: string) {
    return `<meta name="twitter:image:alt" content="${alt}">`;
  }

  /**
   * @param bundle
   * @param rootComponent
   * @param rootTSX
   */
  function createBundle(
    bundle?: string,
    rootComponent?: string,
    rootTSX?: string,
  ) {
    const cwd = Deno.cwd();
    const b = bundle ? bundle : "bundle";
    const hydrateTarget = `${cwd}/${pageDir}/${rootTSX}.hydrate.tsx`;
    const bundlePath = `${cwd}${staticPath}/${b}.js`;

    try {
      if (!rootComponent) rootComponent = "App";
      if (!rootTSX) rootTSX = "app";
      Deno.writeTextFile(
        hydrateTarget,
        createHydrate(rootComponent, rootTSX),
      );
    } catch (err) {
      console.error(err);
      throw err;
    }

    esbuild.build({
      plugins: [denoPlugin()],
      entryPoints: [hydrateTarget],
      outfile: bundlePath,
      bundle: true,
      minify: true,
      format: "esm",
    }).then(() => {
      Deno.remove(hydrateTarget);
    });
  }

  function createHTML(
    element: JSX.Element,
    options: RenderOptions,
    initialData: any,
  ) {
    const props = initialData
      ? `<script>window.__INITIAL_STATE__ = ${
        JSON.stringify(initialData)
      };</script>`
      : "";
    const htmlLang = lang ? ` lang =${lang}` : "";
    const initAttr = htmlAttr ? htmlAttr : ``;
    const initBodyAttr = bodyAttr ? ` ${bodyAttr}` : ``;
    const initRootAttr = rootAttr ? ` ${rootAttr}` : ``;
    const component = ReactDOMServer.renderToString(element);
    const title = options.title ? options.title : "";
    const link = options.link ? options.link : "";
    const meta = options.meta ? options.meta : "";
    const script = options.script ? options.script : "";
    const style = options.style ? options.style : "";
    const bundle = options.bundle ? options.bundle : "bundle";
    const description = ogDescription ? createDescription(ogDescription) : "";
    const initOgTitle = ogTitle ? createTitle(ogTitle) : "";
    const initOgImage = ogImage ? createImage(ogImage) : "";
    const initOgSiteName = ogSiteName ? createSiteName(ogSiteName) : "";
    const initOgType = ogType ? createType(ogType) : "";
    const initOgURL = ogURL ? createURL(ogURL) : "";
    const initTwitterCard = twitterCard ? createTwitterCard(twitterCard) : "";
    const alt = twitterImageAlt ? createTwitterImageAlt(twitterImageAlt) : "";
    const initMetaDesc = metaDesc ? createMetaDescription(metaDesc) : "";
    return `<!DOCTYPE html><html ${initAttr} ${htmlLang}><head><meta charset="UTF-8">${meta}${initMetaDesc}${description}${initOgTitle}${initOgImage}${initOgSiteName}${initOgType}${initOgURL}${initTwitterCard}${alt}${title}${link}${style}${props}</head><body${initBodyAttr}><div id="root" ${initRootAttr}>${component}</div><script type="module" src="${staticPath}/${bundle}.js"></script>${script}<body></html>`;
  }

  const instance = {
    dir: (d: string) => {
      pageDir = d;
      return instance;
    },
    title: (t: string) => {
      title = `<title>${t}</title>`;
      return instance;
    },
    script: (s: string) => {
      const script = createScript(s);
      const found = scriptInstance.find((v) => {
        return v === script;
      });
      if (found) return instance;
      scriptInstance.push(script);
      return instance;
    },
    htmlAttr: (a: string) => {
      htmlAttr = a;
      return instance;
    },
    bodyAttr: (b: string) => {
      bodyAttr = b;
      return instance;
    },
    rootAttr: (r: string) => {
      rootAttr = r;
      return instance;
    },
    ogDesc: (d: string) => {
      ogDescription = d;
      return instance;
    },
    ogTitle: (t: string) => {
      ogTitle = t;
      return instance;
    },
    ogType: (t: string) => {
      ogType = t;
      return instance;
    },
    ogImage: (i: string) => {
      ogImage = i;
      return instance;
    },
    ogURL: (u: string) => {
      ogURL = u;
      return instance;
    },
    ogSiteName: (name: string) => {
      ogSiteName = name;
      return instance;
    },
    twitterCard: (c: string) => {
      twitterCard = c;
      return instance;
    },
    metaDesc: (d: string) => {
      metaDesc = d;
      return instance;
    },
    meta: (m: string) => {
      const meta = createMeta(m);
      const found = metaInstance.find((v) => {
        return v === meta;
      });
      if (found) return instance;
      metaInstance.push(meta);
      return instance;
    },
    style: (s: string) => {
      const style = createStyle(s);
      const found = styleInstance.find((v) => {
        return v === style;
      });
      if (found) return instance;
      styleInstance.push(style);
      return instance;
    },
    link: (l: string) => {
      const link = createLink(l);
      const found = linkInstance.find((v) => {
        return v === link;
      });
      if (found) return instance;
      linkInstance.push(link);
      return instance;
    },
    cdn: (path: string) => {
      staticPath = path;
      return instance;
    },
    props: (p: any) => {
      props = p;
      return instance;
    },
    lang: (l: string) => {
      lang = l;
      return instance;
    },
    request: (r: HttpRequest) => {
      httpRequest = r;
      return instance;
    },
    cache: (c: Container) => {
      cache = c;
      return instance;
    },
    render: () => {
      const bundle = bundleName;
      const meta = metaInstance.length > 0 ? metaInstance.join("") : "";
      const script = scriptInstance.length > 0 ? scriptInstance.join("") : "";
      const link = linkInstance.length > 0 ? linkInstance.join("") : "";
      const style = styleInstance.length > 0 ? styleInstance.join("") : "";
      const opt = {
        title,
        meta,
        script,
        link,
        style,
        bundle,
      };

      const pageID = "ssr-" + httpRequest.url;
      if (cache.get(pageID)) {
        html = <string> cache.get(pageID);
      } else {
        html = createHTML(element, opt, props);
        cache.set(pageID, html, {
          isExpired: true,
          expirySeconds: EXPIRY_SECONDS,
        });
      }

      return new Response(html, {
        status,
        statusText: STATUS_TEXT[<Status> status],
        headers: {
          "Cache-Control": "max-age=0",
          "content-type": "text/html",
        },
      });
    },
    bundle: (name: string) => {
      bundleName = name;
      return instance;
    },
    _createBundle: createBundle,
    _getBundleName: () => bundleName,
  };

  return instance;
}
