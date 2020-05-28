import { Fastro, Request } from "../mod.ts";

export const sample = function (fastro: Fastro, request: Request) {
  fastro.hello = "hello plugin";
  request.ok = "ok plugin";
};
