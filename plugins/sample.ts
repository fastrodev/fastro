import { Fastro, Request } from "../mod.ts";

export const sample = function (fastro: Fastro, request: Request) {
  fastro.decorate((instance) => {
    instance.hello = "hello";
  });
  request.ok = "ok";
};
