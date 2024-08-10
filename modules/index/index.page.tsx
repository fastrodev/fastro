import { PageProps } from "@app/http/server/types.ts";
import { InlineNav } from "@app/components/inline-nav.tsx";
import { Footer } from "@app/components/footer.tsx";
import { VNode } from "preact";
import Header from "@app/components/header.tsx";

function DenoSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 5120 5120"
    >
      <title>Deno logo</title>
      <path d="M2560 0a2560 2560 0 1 1 0 5120 2560 2560 0 0 1 0-5120z" />
      <path
        fill="#fff"
        d="M2460 1449c-744 0-1324 469-1324 1052 0 550 533 901 1359 884l25-1 91-3-23 60 3 6a668 668 0 0 1 18 47l2 6 3 10 4 14 3 9 4 10 3 11 4 16 5 17 3 11 5 18 5 19 4 19 5 20 4 14 5 22 5 22 7 30 3 16 5 24 5 25 6 26 7 37 6 30 8 42 4 21 7 33 6 34 8 46 9 48 8 50 9 51 9 52 9 54 9 56 7 43 11 73 5 30 12 77 9 63 8 48 9 66 5 33c549-73 1037-339 1393-728l11-12-51-190-135-505-84-314-74-276-46-168-29-106-17-64-16-56-6-24-4-13-2-7-2-6c-78-251-229-473-435-634-242-189-549-288-907-288zm-654 2669c-65-18-133 20-152 85l-1 3-112 416a2287 2287 0 0 0 215 93l17 7 121-451 1-3c16-66-23-133-89-150zm697-305c-66-18-134 20-153 85l-1 3-170 630v3a125 125 0 0 0 241 65l1-3 170-630v-3l3-14 1-5-4-21-6-29-4-18a125 125 0 0 0-78-63zm-1185-649-8 19-1 4-170 630-1 3a125 125 0 0 0 241 66l1-3 154-572c-80-42-153-92-216-147zm-405-725c-66-17-134 21-153 85l-1 3-170 630v3a125 125 0 0 0 241 66l1-3 170-630v-3c16-66-23-133-88-151zm3811-143c-65-17-133 21-152 85l-1 3-170 630-1 3a125 125 0 0 0 242 66v-3l171-630v-4c16-65-23-132-89-150zM542 1455a2284 2284 0 0 0-267 838 124 124 0 0 0 62 38c65 17 133-21 152-85l1-3 170-630 1-3c16-66-23-133-89-151a127 127 0 0 0-30-4zm3752 4c-66-17-133 21-153 85v3l-170 630-1 3a125 125 0 0 0 241 66l1-3 170-630 1-3c16-66-24-133-89-151z"
      />
      <path d="M2620 1870a160 160 0 1 1 0 320 160 160 0 0 1 0-320z" />
      <path
        fill="#fff"
        d="M1282 860c-65-17-133 21-152 85l-1 3-170 630-1 3a125 125 0 0 0 241 66l1-3 170-630 1-4c16-65-23-132-89-150zm2185 119c-66-17-134 21-153 85l-1 3-114 424a1399 1399 0 0 1 211 128l11 9 134-495v-3c16-66-23-133-88-151zM2355 269a2299 2299 0 0 0-238 34l-17 3-158 587-1 3a125 125 0 0 0 241 65l1-3 170-630 1-3a124 124 0 0 0 1-56zm1564 435-33 124-1 3a125 125 0 0 0 241 65l1-3 4-13a2312 2312 0 0 0-197-165l-15-11zm-989-414-60 223-1 3a125 125 0 0 0 241 65l1-3 63-235a2286 2286 0 0 0-226-50l-18-3z"
      />
    </svg>
  );
}

function TypeScriptSvg() {
  return (
    <svg
      fill="none"
      height="100%"
      width="100%"
      viewBox="0 0 26 26"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="m.975 0h24.05c.5385 0 .975.436522.975.975v24.05c0 .5385-.4365.975-.975.975h-24.05c-.538478 0-.975-.4365-.975-.975v-24.05c0-.538478.436522-.975.975-.975zm13.4782 13.8324v-2.1324h-9.2532v2.1324h3.30357v9.4946h2.62983v-9.4946zm1.0485 9.2439c.4241.2162.9257.3784 1.5048.4865.579.1081 1.1893.1622 1.8309.1622.6253 0 1.2193-.0595 1.782-.1784.5628-.1189 1.0562-.3149 1.4803-.5879s.7598-.6297 1.0072-1.0703.3711-.9852.3711-1.6339c0-.4703-.0707-.8824-.212-1.2365-.1414-.3541-.3453-.669-.6117-.9447s-.5859-.523-.9583-.7419c-.3725-.2189-.7925-.4257-1.2601-.6203-.3425-.1406-.6497-.2771-.9216-.4095-.2718-.1324-.5029-.2676-.6932-.4054-.1903-.1379-.3371-.2838-.4404-.4379-.1033-.154-.155-.3284-.155-.523 0-.1784.0463-.3392.1387-.4824.0924-.1433.2229-.2663.3915-.369.1685-.1027.3751-.1824.6198-.2392.2447-.0567.5165-.0851.8156-.0851.2174 0 .4472.0162.6891.0486.242.0325.4853.0825.7299.15.2447.0676.4826.1527.7137.2555.2311.1027.4445.2216.6402.3567v-2.4244c-.3969-.1514-.8305-.2636-1.3008-.3365-.4704-.073-1.01-.1095-1.6189-.1095-.6199 0-1.2071.0662-1.7617.1987-.5546.1324-1.0425.3392-1.4639.6203s-.7544.6392-.9991 1.0743c-.2447.4352-.367.9555-.367 1.5609 0 .7731.2243 1.4326.6729 1.9785.4485.546 1.1295 1.0082 2.043 1.3866.3588.146.6932.2892 1.0031.4298.3099.1405.5777.2865.8033.4378.2257.1514.4037.3162.5342.4946s.1958.3811.1958.6082c0 .1676-.0408.323-.1224.4662-.0815.1433-.2052.2676-.371.373-.1659.1054-.3725.1879-.6199.2473-.2474.0595-.5369.0892-.8686.0892-.5654 0-1.1254-.0986-1.68-.2959s-1.0684-.4933-1.5415-.8879z"
        fill="#fff"
        fill-rule="evenodd"
      >
      </path>
    </svg>
  );
}

function PreactSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 256 296"
      preserveAspectRatio="xMidYMid"
    >
      <path fill="#673AB8" d="M128 0l128 73.9v147.8l-128 73.9L0 221.7V73.9z" />
      <path
        d="M34.865 220.478c17.016 21.78 71.095 5.185 122.15-34.704 51.055-39.888 80.24-88.345 63.224-110.126-17.017-21.78-71.095-5.184-122.15 34.704-51.055 39.89-80.24 88.346-63.224 110.126zm7.27-5.68c-5.644-7.222-3.178-21.402 7.573-39.253 11.322-18.797 30.541-39.548 54.06-57.923 23.52-18.375 48.303-32.004 69.281-38.442 19.922-6.113 34.277-5.075 39.92 2.148 5.644 7.223 3.178 21.403-7.573 39.254-11.322 18.797-30.541 39.547-54.06 57.923-23.52 18.375-48.304 32.004-69.281 38.441-19.922 6.114-34.277 5.076-39.92-2.147z"
        fill="#FFF"
      />
      <path
        d="M220.239 220.478c17.017-21.78-12.169-70.237-63.224-110.126C105.96 70.464 51.88 53.868 34.865 75.648c-17.017 21.78 12.169 70.238 63.224 110.126 51.055 39.889 105.133 56.485 122.15 34.704zm-7.27-5.68c-5.643 7.224-19.998 8.262-39.92 2.148-20.978-6.437-45.761-20.066-69.28-38.441-23.52-18.376-42.74-39.126-54.06-57.923-10.752-17.851-13.218-32.03-7.575-39.254 5.644-7.223 19.999-8.261 39.92-2.148 20.978 6.438 45.762 20.067 69.281 38.442 23.52 18.375 42.739 39.126 54.06 57.923 10.752 17.85 13.218 32.03 7.574 39.254z"
        fill="#FFF"
      />
      <path
        d="M127.552 167.667c10.827 0 19.603-8.777 19.603-19.604 0-10.826-8.776-19.603-19.603-19.603-10.827 0-19.604 8.777-19.604 19.603 0 10.827 8.777 19.604 19.604 19.604z"
        fill="#FFF"
      />
    </svg>
  );
}

function TailwindSvg() {
  return (
    <svg
      height="100%"
      preserveAspectRatio="xMidYMid"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 153.6"
    >
      <linearGradient id="a" x1="-2.778%" y1="32%" y2="67.556%">
        <stop offset="0" stop-color="#2298bd" />
        <stop offset="1" stop-color="#0ed7b5" />
      </linearGradient>
      <path
        d="M128 0C93.867 0 72.533 17.067 64 51.2 76.8 34.133 91.733 27.733 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 76.8 192 76.8c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.743 159.725 0 128 0zM64 76.8C29.867 76.8 8.533 93.867 0 128c12.8-17.067 27.733-23.467 44.8-19.2 9.737 2.434 16.697 9.499 24.401 17.318C81.751 138.857 96.275 153.6 128 153.6c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.543 95.725 76.8 64 76.8z"
        fill="url(#a)"
      />
    </svg>
  );
}

function SocialSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-social"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M19 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M12 14m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M12 7l0 4" />
      <path d="M6.7 17.8l2.8 -2" />
      <path d="M17.3 17.8l-2.8 -2" />
    </svg>
  );
}

function StoreSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-building-store"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 21l18 0" />
      <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
      <path d="M5 21l0 -10.15" />
      <path d="M19 21l0 -10.15" />
      <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
    </svg>
  );
}

function LoyalSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-reload"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
      <path d="M20 4v5h-5" />
    </svg>
  );
}

function AttendanceSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-report"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
      <path d="M18 14v4h4" />
      <path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" />
      <path d="M8 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
      <path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <path d="M8 11h4" />
      <path d="M8 15h3" />
    </svg>
  );
}

function PurchaseSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-package"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
      <path d="M12 12l8 -4.5" />
      <path d="M12 12l0 9" />
      <path d="M12 12l-8 -4.5" />
      <path d="M16 5.25l-8 4.5" />
    </svg>
  );
}

function WareHouseSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-building-warehouse"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 21v-13l9 -4l9 4v13" />
      <path d="M13 13h4v8h-10v-6h6" />
      <path d="M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3" />
    </svg>
  );
}

function SalesSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-target"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    </svg>
  );
}

function AdsSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-ad"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      <path d="M7 15v-4a2 2 0 0 1 4 0v4" />
      <path d="M7 13l4 0" />
      <path d="M17 9v6h-1.5a1.5 1.5 0 1 1 1.5 -1.5" />
    </svg>
  );
}

function AdminSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-cpu"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
      <path d="M9 9h6v6h-6z" />
      <path d="M3 10h2" />
      <path d="M3 14h2" />
      <path d="M10 3v2" />
      <path d="M14 3v2" />
      <path d="M21 10h-2" />
      <path d="M21 14h-2" />
      <path d="M14 21v-2" />
      <path d="M10 21v-2" />
    </svg>
  );
}

function SeoSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-seo"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 8h-3a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-3" />
      <path d="M14 16h-4v-8h4" />
      <path d="M11 12h2" />
      <path d="M17 8m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
    </svg>
  );
}

function BoltSvg(props: { height?: string; width?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={props.height || "24px"}
      viewBox="0 -960 960 960"
      width={props.width || "24px"}
      fill="#e8eaed"
    >
      <path d="m320-80 40-280H160l360-520h80l-40 320h240L400-80h-80Z" />
    </svg>
  );
}

function UxSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-ux-circle"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M7 10v2a2 2 0 1 0 4 0v-2" />
      <path d="M14 10l3 4" />
      <path d="M14 14l3 -4" />
    </svg>
  );
}

function BlogSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-network"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0" />
      <path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6" />
      <path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6" />
      <path d="M6 9h12" />
      <path d="M3 20h7" />
      <path d="M14 20h7" />
      <path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M12 15v3" />
    </svg>
  );
}

function WwwSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-world-www"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4" />
      <path d="M11.5 3a16.989 16.989 0 0 0 -1.826 4" />
      <path d="M12.5 3a16.989 16.989 0 0 1 1.828 4" />
      <path d="M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4" />
      <path d="M11.5 21a16.989 16.989 0 0 1 -1.826 -4" />
      <path d="M12.5 21a16.989 16.989 0 0 0 1.828 -4" />
      <path d="M2 10l1 4l1.5 -4l1.5 4l1 -4" />
      <path d="M17 10l1 4l1.5 -4l1.5 4l1 -4" />
      <path d="M9.5 10l1 4l1.5 -4l1.5 4l1 -4" />
    </svg>
  );
}

function RepeatSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-repeat"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
      <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" />
    </svg>
  );
}

function ScaleSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-chart-arrows-vertical"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 21v-14" />
      <path d="M9 15l3 -3l3 3" />
      <path d="M15 10l3 -3l3 3" />
      <path d="M3 21l18 0" />
      <path d="M12 21l0 -9" />
      <path d="M3 6l3 -3l3 3" />
      <path d="M6 21v-18" />
    </svg>
  );
}

function SettingSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-settings-2"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    </svg>
  );
}

function StackSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-stack-front"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 4l-8 4l8 4l8 -4l-8 -4" fill="currentColor" />
      <path d="M8 14l-4 2l8 4l8 -4l-4 -2" />
      <path d="M8 10l-4 2l8 4l8 -4l-4 -2" />
    </svg>
  );
}

function LogisticSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-tir"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M7 18h8m4 0h2v-6a5 7 0 0 0 -5 -7h-1l1.5 7h4.5" />
      <path d="M12 18v-13h3" />
      <path d="M3 17l0 -5l9 0" />
    </svg>
  );
}

function NoteSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-notes"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
      <path d="M9 7l6 0" />
      <path d="M9 11l6 0" />
      <path d="M9 15l4 0" />
    </svg>
  );
}

function FormSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-forms"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a3 3 0 0 0 -3 3v12a3 3 0 0 0 3 3" />
      <path d="M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3" />
      <path d="M13 7h7a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-7" />
      <path d="M5 7h-1a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h1" />
      <path d="M17 12h.01" />
      <path d="M13 12h.01" />
    </svg>
  );
}

function HtmlSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-html"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M13 16v-8l2 5l2 -5v8" />
      <path d="M1 16v-8" />
      <path d="M5 8v8" />
      <path d="M1 12h4" />
      <path d="M7 8h4" />
      <path d="M9 8v8" />
      <path d="M20 8v8h3" />
    </svg>
  );
}

function SurveySvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-checkbox"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 11l3 3l8 -8" />
      <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
    </svg>
  );
}

function ProjectBox(
  props: { children: VNode[]; active?: boolean; url?: string },
) {
  const ready = props.active ? "bg-green-700 cursor-pointer" : "";

  return (
    <a
      href={props.url}
      class={`p-3 border border-white rounded-xl ${ready} flex justify-center`}
    >
      <div class={`flex flex-col items-center gap-1`}>
        {props.children}
      </div>
    </a>
  );
}

function WhatApps() {
  return (
    <div
      class={`flex flex-col p-6 bg-gray-900 rounded-2xl`}
    >
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <ProjectBox active={true} url="/admin">
          <AdminSvg />
          <p>Admin</p>
        </ProjectBox>
        <ProjectBox>
          <AdsSvg />
          <p>Advertising</p>
        </ProjectBox>
        <ProjectBox>
          <AttendanceSvg />
          <p>Attendance</p>
        </ProjectBox>
        <ProjectBox>
          <BlogSvg />
          <p>Blog</p>
        </ProjectBox>
        <ProjectBox>
          <HtmlSvg />
          <p>Landing Page</p>
        </ProjectBox>
        <ProjectBox>
          <LogisticSvg />
          <p>Logistic</p>
        </ProjectBox>
        <ProjectBox>
          <LoyalSvg />
          <p>Loyalty</p>
        </ProjectBox>
        <ProjectBox>
          <NoteSvg />
          <p>Medical Record</p>
        </ProjectBox>
        <ProjectBox>
          <PurchaseSvg />
          <p>Purchasing</p>
        </ProjectBox>
        <ProjectBox>
          <FormSvg />
          <p>Registration</p>
        </ProjectBox>
        <ProjectBox>
          <SalesSvg />
          <p>Sales</p>
        </ProjectBox>
        <ProjectBox>
          <SocialSvg />
          <p>Social Media</p>
        </ProjectBox>
        <ProjectBox>
          <StoreSvg />
          <p>Store</p>
        </ProjectBox>
        <ProjectBox>
          <SurveySvg />
          <p>Survey</p>
        </ProjectBox>
        <ProjectBox>
          <WareHouseSvg />
          <p>Warehouse</p>
        </ProjectBox>
        <ProjectBox>
          <StackSvg />
          <p>Visitor queue</p>
        </ProjectBox>
      </div>
    </div>
  );
}

function WhyFlat() {
  return (
    <div class={`flex flex-col gap-6 mx-6`}>
      <h2 class={`text-gray-100 sm:text-2xl text-xl`}>
        Why use a flat modular architecture?
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <ProjectBox>
          <BoltSvg width="36px" height="36px" />
          <p>Rapid Build</p>
        </ProjectBox>
        <ProjectBox>
          <SettingSvg />
          <p>Easy to maintain</p>
        </ProjectBox>
        <ProjectBox>
          <ScaleSvg />
          <p>Improved scalability</p>
        </ProjectBox>
        <ProjectBox>
          <RepeatSvg />
          <p>Reusability</p>
        </ProjectBox>
      </div>
    </div>
  );
}

function WhySSR() {
  return (
    <div class={`flex flex-col gap-6 mx-6`}>
      <h2 class={`text-gray-100 sm:text-2xl text-xl`}>
        Why use SSR?
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <ProjectBox>
          <BoltSvg width="36px" height="36px" />
          <p>Quick Load</p>
        </ProjectBox>
        <ProjectBox>
          <SeoSvg />
          <p>Improved SEO</p>
        </ProjectBox>
        <ProjectBox>
          <UxSvg />
          <p>Better UX</p>
        </ProjectBox>
        <ProjectBox>
          <WwwSvg />
          <p>Browser Legacy</p>
        </ProjectBox>
      </div>
    </div>
  );
}

function PoweredBy() {
  return (
    <div class={`flex flex-col gap-y-6 mx-6 md:mx-0`}>
      <h2 class={`text-gray-500 sm:text-2xl text-xl`}>
        High-performance web framework built on a flat, modular architecture.
        Powered by Deno, TypeScript, Preact JS, and Tailwind CSS
      </h2>

      <div
        class={`mx-auto max-w-xl flex justify-between gap-x-9`}
      >
        <div class={`text-white h-[100px]`}>
          <DenoSvg />
        </div>
        <div class={`text-white h-[100px]`}>
          <TypeScriptSvg />
        </div>
        <div class={`text-white flex items-center h-[100px]`}>
          <PreactSvg />
        </div>
        <div class={`text-white flex items-center h-[100px]`}>
          <TailwindSvg />
        </div>
      </div>
    </div>
  );
}

// deno-lint-ignore no-explicit-any
function NonLogin(props: { data: any }) {
  const data = props.data;
  return (
    <section class="container flex flex-col gap-y-16 grow max-w-4xl mx-auto text-center">
      <div
        class={`flex flex-col gap-y-6 py-16 bg-gradient-to-r from-gray-950 to-green-800 rounded-2xl`}
      >
        <div class={`text-center`}>
          <InlineNav
            title="What's new"
            description={data.new}
            destination={`${data.baseUrl}/${data.destination}`}
          />
        </div>

        <h1 class="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-center text-white">
          {data.title}
        </h1>

        <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 mx-6 md:mx-0">
          <a
            href="/docs/start"
            class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-900 border border-white"
          >
            Get started
            <svg
              class="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              >
              </path>
            </svg>
          </a>
          <div class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg border text-white border-white bg-black">
            deno run -A -r https://fastro.dev
          </div>
        </div>
      </div>

      <PoweredBy />

      <div
        class={`flex flex-col gap-y-12 py-12 rounded-2xl bg-gradient-to-r from-gray-950 to-green-800`}
      >
        <WhySSR />
        <WhyFlat />
      </div>
    </section>
  );
}

export default function Index({ data }: PageProps<
  {
    user: string;
    title: string;
    description: string;
    baseUrl: string;
    new: string;
    destination: string;
    isLogin: boolean;
    avatar_url: string;
    html_url: string;
  }
>) {
  return (
    <>
      <Header
        isLogin={data.isLogin}
        avatar_url={data.avatar_url}
        html_url={data.html_url}
      />

      {data.isLogin &&
        (
          <section class="container flex flex-col gap-y-12 grow max-w-4xl mx-auto text-center">
            <WhatApps />
          </section>
        )}

      {!data.isLogin && <NonLogin data={data} />}

      <Footer />
    </>
  );
}
