import { Fastro } from "../../mod.ts";

export const sample = function (fastro: Fastro, done: Function) {
  fastro.hello = "hello plugin";
  done();
};
