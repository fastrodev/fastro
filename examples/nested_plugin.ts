import { Fastro } from "../mod.ts";

const server = new Fastro();

const plugin4 = function (fastro: Fastro, done: Function) {
  fastro.get("/", (req) => req.send("root"));
  done();
};

const plugin3 = function (fastro: Fastro, done: Function) {
  fastro.register("v4", plugin4);
  done();
};

const plugin2 = function (fastro: Fastro, done: Function) {
  fastro.register(plugin3);
  done();
};

const plugin1 = function (fastro: Fastro, done: Function) {
  fastro.register(plugin2);
  fastro.register("v2", plugin2);
  done();
};

server
  .register(plugin1);

await server.listen();
