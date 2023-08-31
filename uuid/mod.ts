import { Fastro } from "../mod.ts";
import { apiHandler } from "./uuidApi.handler.ts";
import uuid from "./uuid.page.tsx";
import jsx from "./uuidJSX.page.tsx";
import pageHandler from "./uuidPage.handler.ts";

export const uuidModule = (f: Fastro) => {
  f.get("/api", apiHandler);
  f.page("/uuid", { component: uuid, folder: "uuid" }, pageHandler);
  f.page("/jsx", jsx, pageHandler);
  return f;
};
