import fastro, { Fastro } from "../mod.ts";

const f = new fastro();

const module = (f: Fastro) => {
  return f.get("/", () => "Hello Get")
    .post("/", () => "Hello Post")
    .put("/", () => "Hello Put")
    .delete("/", () => "Hello Delete");
};

f.register(module);

await f.serve();
