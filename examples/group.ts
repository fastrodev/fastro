import fastro, { Fastro } from "@app/mod.ts";

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

await f.group(helloModule);
await f.group(userModule);
await f.group(productModule);

await f.serve();
