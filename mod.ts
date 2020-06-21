export const version = {
  fastro: "0.12.0",
  deno: "1.1.1",
};
export * from "./core/server.ts";
export * from "./core/injection/mod.ts";

export {
  support,
  sendOk,
} from "./middlewares/sample.ts";

export {
  sample,
} from "./plugins/sample.ts";
