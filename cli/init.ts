// Copyright 2020 the Fastro author. All rights reserved. MIT license.

import { MIDDLEWARE_DIR, SERVICE_DIR, STATIC_DIR } from "../core/types.ts";

// deno-lint-ignore no-explicit-any
export async function init(args?: any) {
  const encoder = new TextEncoder();

  await Deno.mkdir(MIDDLEWARE_DIR, { recursive: true });
  const mid = encoder.encode(middleware);
  const midPath = `${MIDDLEWARE_DIR}/support.ts`;
  await Deno.writeFile(midPath, mid);

  await Deno.mkdir(SERVICE_DIR, { recursive: true });
  const ctrl = encoder.encode(controller);
  const ctrlPath = `${SERVICE_DIR}/hello.ts`;
  await Deno.writeFile(ctrlPath, ctrl);

  await Deno.mkdir(STATIC_DIR, { recursive: true });
  const logo = encoder.encode(svg);
  const logoPath = `${STATIC_DIR}/logo.svg`;
  await Deno.writeFile(logoPath, logo);

  const idx = encoder.encode(html);
  const idxPath = `${STATIC_DIR}/index.html`;
  await Deno.writeFile(idxPath, idx);
}

const controller =
  `import type { Request } from "https://raw.fastro.dev/master/mod.ts";
export const handler = (request: Request) => {
  request.send("setup complete");
};
`;

const middleware =
  `import type { Callback, Request } from "https://raw.fastro.dev/master/mod.ts";
export const methods = ["GET", "POST"];
export const handler = (request: Request, next: Callback) => {
  if (request.url === "/middleware") request.hello = "middleware";
  next();
};
`;

const svg =
  `<svg version="1.1" viewBox="0.0 0.0 320.0 160.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l320.0 0l0 160.0l-320.0 0l0 -160.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#000000" fill-opacity="0.0" d="m0 0l320.0 0l0 160.0l-320.0 0z" fill-rule="evenodd"/><g filter="url(#shadowFilter-p.1)"><use xlink:href="#p.1" transform="matrix(1.0 0.0 0.0 1.0 0.7071068631069554 0.7071068631069554)"/></g><defs><filter id="shadowFilter-p.1" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceAlpha" stdDeviation="1.0" result="blur"/><feComponentTransfer in="blur" color-interpolation-filters="sRGB"><feFuncR type="linear" slope="0" intercept="0.0"/><feFuncG type="linear" slope="0" intercept="0.0"/><feFuncB type="linear" slope="0" intercept="0.0"/><feFuncA type="linear" slope="0.92" intercept="0"/></feComponentTransfer></filter></defs><g id="p.1"><path fill="#000000" fill-opacity="0.0" d="m0 6.0l320.0 0l0 124.97638l-320.0 0z" fill-rule="evenodd"/><path fill="#000000" d="m232.44708 98.380066l-37.578125 0l-20.71875 53.828125l-44.078125 0l56.34375 -145.0l90.484375 0l-20.203125 37.125l-40.828125 0l-7.390625 19.484375l37.578125 0l-13.609375 34.5625zm-109.17187 53.125l-96.15625 -10.4375l100.21875 0l-4.0625 10.4375zm17.390617 -44.765625l-96.14062 -10.4375l100.21874 0l-4.078125 10.4375zm8.6875 -22.28125l-96.15624 -10.4375l100.23437 0l-4.078125 10.4375zm8.671875 -22.265625l-96.14062 -10.4375l100.21874 0l-4.078125 10.4375zm8.671875 -22.265625l-96.14062 -10.453125l99.99999 0l-3.859375 10.453125zm-34.703125 89.078125l-96.15624 -10.4375l100.23437 0l-4.078125 10.4375zm43.15625 -111.359375l-95.92187 -10.4375l99.99999 0l-4.078125 10.4375z" fill-rule="nonzero"/></g></g></svg>`;

const html = `<html>

  <head>
    <style>
      html,
      body {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        background: #ECEFF1;
        color: rgba(0, 0, 0, 0.87);
      }
  
      div {
        position: relative;
        height: 100%;
        width: 100%;
      }
  
      div #ctnr {
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 200;
        height: 90;
        border-radius: 3px;
        background-color: white;
        padding: 20;
      }
  
      #ctnr {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      }
  
      .loader {
        font-size: 10px;
        margin: auto auto;
        text-indent: -9999em;
        width: 5em;
        height: 5em;
        border-radius: 50%;
        background: #ffffff;
        background: -moz-linear-gradient(left, #000000 10%, rgba(255, 255, 255, 0) 42%);
        background: -webkit-linear-gradient(left, #000000 10%, rgba(255, 255, 255, 0) 42%);
        background: -o-linear-gradient(left, #000000 10%, rgba(255, 255, 255, 0) 42%);
        background: -ms-linear-gradient(left, #000000 10%, rgba(255, 255, 255, 0) 42%);
        background: linear-gradient(to right, #000000 10%, rgba(255, 255, 255, 0) 42%);
        position: relative;
        -webkit-animation: load3 1.4s infinite linear;
        animation: load3 1.4s infinite linear;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
      }
  
      .loader:before {
        width: 50%;
        height: 50%;
        background: #000000;
        border-radius: 100% 0 0 0;
        position: absolute;
        top: 0;
        left: 0;
        content: '';
      }
  
      .loader:after {
        background: #ffffff;
        width: 75%;
        height: 75%;
        border-radius: 50%;
        content: '';
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }
  
      @-webkit-keyframes load3 {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
  
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
  
      @keyframes load3 {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
  
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
    </style>
  </head>
  
  <body>
    <div>
      <div id="ctnr">
        <div id="ldr" class="loader">Loading...</div>
        <img id="logo" src="logo.svg" width="100" style="margin: auto;">
        <div id="msg" style="margin-top:10">Loading ... </div>
      </div>
    </div>
  </body>
  <script>
    document.getElementById("logo").style.display = "none";
    async function get() {
      const data = await fetch("/api/controller");
      const d = await data.text()
      if (d) {
        document.getElementById("ldr").remove()
        document.getElementById("logo").style.display = "block";
        document.getElementById("msg").innerHTML = d
      }
    }
    get();
  </script>
  
  </html>
  `;
