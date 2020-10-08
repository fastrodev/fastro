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
  const ctrlPath = `${SERVICE_DIR}/hello.controller.ts`;
  await Deno.writeFile(ctrlPath, ctrl);

  await Deno.mkdir(STATIC_DIR, { recursive: true });
  const logo = encoder.encode(svg);
  const logoPath = `${STATIC_DIR}/logo.svg`;
  await Deno.writeFile(logoPath, logo);

  const icon = await getFavicon();
  const iconPath = `${STATIC_DIR}/favicon.ico`;
  await Deno.writeFile(iconPath, icon);

  const idx = encoder.encode(html);
  const idxPath = `${STATIC_DIR}/index.html`;
  await Deno.writeFile(idxPath, idx);
}

async function getFavicon() {
  const url =
    `https://raw.githubusercontent.com/fastrodev/fastro/master/public/favicon.ico`;
  const res = await fetch(url);
  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();
  const unit8arr = new Deno.Buffer(buffer).bytes();
  return unit8arr;
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
  `<svg version="1.1" viewBox="0.0 0.0 80.0 50.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l80.0 0l0 50.0l-80.0 0l0 -50.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#000000" fill-opacity="0.0" d="m0 0l80.0 0l0 50.0l-80.0 0z" fill-rule="evenodd"/><path fill="#000000" fill-opacity="0.0" d="m-1.8740157 0l83.74803 0l0 44.188976l-83.74803 0z" fill-rule="evenodd"/><path fill="#000000" d="m62.89427 31.478867l-11.875 0l-6.546875 17.015625l-13.9375 0l17.8125 -45.828125l28.59375 0l-6.375 11.734375l-12.90625 0l-2.34375 6.15625l11.890625 0l-4.3125 10.921875zm-34.5 16.796875l-30.390625 -3.296875l31.671875 0l-1.28125 3.296875zm5.5 -14.15625l-30.40625 -3.296875l31.6875 0l-1.28125 3.296875zm2.734375 -7.03125l-30.390625 -3.3125l31.671875 0l-1.28125 3.3125zm2.75 -7.046875l-30.390625 -3.296875l31.671875 0l-1.28125 3.296875zm2.734375 -7.03125l-30.375 -3.3125l31.59375 0l-1.21875 3.3125zm-10.96875 28.15625l-30.375 -3.296875l31.671875 0l-1.296875 3.296875zm13.65625 -35.203125l-30.34375 -3.296875l31.609375 0l-1.265625 3.296875z" fill-rule="nonzero"/></g></svg>`;

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
      const data = await fetch("/controller");
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
