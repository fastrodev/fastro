import fastro, { Context, HttpRequest } from "$fastro/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const client = new Client({
  user: "postgres",
  database: "postgres",
  password: "postgres",
  hostname: "localhost",
  port: 5432,
});

// init table and data
await createTable();

// init connection
await client.connect();

async function getData() {
  const { rows } = await client.queryObject`SELECT * FROM todos WHERE id = 1`;
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

// waiting 2s for DB connection
setTimeout(async () => {
  await f.serve();
}, 3000);

async function createTable() {
  if (!client) throw new Error();
  await client.connect();
  try {
    await client.queryObject`
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
)
`;
    await client.queryObject`INSERT INTO todos (title) VALUES ('hello')`;
  } finally {
    await client.end();
  }
}
