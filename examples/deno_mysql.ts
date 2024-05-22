import fastro, { Context, HttpRequest } from "$fastro/mod.ts";
import { Client } from "jsr:x/mysql@v2.12.1/mod.ts";

const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "homestead",
  password: "root",
});

// init table and data
await createTable();

async function getData() {
  const { rows } = await client.execute(`SELECT * FROM todos WHERE id = 1`);
  return rows;
}

const f = new fastro();

f.get(
  "/",
  async (_req: HttpRequest, ctx: Context) => {
    const data = await getData();
    return ctx.send(data, 200);
  },
);

await f.serve();

async function createTable() {
  await client.execute(`
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
)
`);
  await client.execute(`INSERT INTO todos (title) VALUES ('hello')`);
}
