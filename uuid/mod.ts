import { Fastro } from "../mod.ts";
import { apiHandler } from "./uuidApiHandler.ts";
import uuidPage from "./uuidPage.tsx";
import uuidPageJsx from "./uuidPageJsx.tsx";
import { pageHandler } from "./uuidPageHandler.ts";

export const uuidModule = (f: Fastro) => {
  f.get("/api", apiHandler);
  f.page("/uuid", { component: uuidPage, folder: "uuid" }, pageHandler);
  f.page("/jsx", uuidPageJsx, pageHandler);
  return f;
};
