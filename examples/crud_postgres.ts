/**
Table:

  CREATE TABLE fruits(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
  );
*/

import { Client } from "https://deno.land/x/postgres/mod.ts";
import { Fastro, Request } from "../mod.ts";

// SERVICES
async function postgres() {
  const client = new Client({
    user: "patrick",
    hostname: "localhost",
    database: "test",
    password: "",
    port: 5432,
  });
  await client.connect();
  return client;
}

const db = await postgres();

const getFruits = async function () {
  const query = "SELECT * FROM fruits;";
  const result = (await db.query(query)).rows;
  return result;
};

const createFruit = async function (name: string) {
  const query = `
    INSERT INTO fruits(name) 
    VALUES('${name}')
    RETURNING id;
  `;

  const [[result]] = (await db.query(query)).rows;
  return result;
};

const updateFruit = async function (id: number, name: string) {
  const query = `
    UPDATE fruits
    SET name = '${name}'
    WHERE
      id = ${id}
    RETURNING id;
  `;
  const [[result]] = (await db.query(query)).rows;
  return result;
};

const deleteFruit = async function (id: number) {
  const query = `
    DELETE FROM fruits
    WHERE id = ${id}
  `;
  const results = (await db.query(query)).rowCount;
  return results;
};
// END OF SERVICES

// HANDLERS
const getFruitHandler = async (req: Request) => {
  const result = await getFruits();
  req.send(result);
};

const createFruitHandler = async (req: Request) => {
  if (!req.payload) return req.send("empty payload");
  const { name } = JSON.parse(req.payload);
  const result = await createFruit(name);
  req.send(result);
};

const updateFruitHandler = async (req: Request) => {
  if (!req.payload) return req.send("empty payload");
  const { id, name } = JSON.parse(req.payload);
  const result = await updateFruit(id, name);
  req.send(result);
};

const deleteFruitHandler = async (req: Request) => {
  if (!req.payload) return req.send("empty payload");
  const { id } = JSON.parse(req.payload);
  const result = await deleteFruit(id);
  req.send(result);
};
// END OF HANDLERS

const server = new Fastro();
server
  .get("/", getFruitHandler)
  .post("/", createFruitHandler)
  .put("/", updateFruitHandler)
  .delete("/", deleteFruitHandler);

await server.listen();
