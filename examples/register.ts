import fastro, { Fastro } from "$fastro/mod.ts";

const f = new fastro();

const helloModule = (f: Fastro) => {
  return f.get("/", () => "Hello World");
};

const userModule = (f: Fastro) => {
  const path = `/api/user`;
  return f.get(path, () => "Get user")
    .post(path, () => "Add user")
    .put(path, () => "Update user")
    .delete(path, () => "Delete user");
};

const productModule = (f: Fastro) => {
  const path = `/api/product`;
  return f.get(path, () => "Get product")
    .post(path, () => "Add product")
    .put(path, () => "Update product")
    .delete(path, () => "Delete product");
};

await f.register(helloModule);
await f.register(userModule);
await f.register(productModule);

await f.serve();
