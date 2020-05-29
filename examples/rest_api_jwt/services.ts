import { Client } from "https://deno.land/x/postgres/mod.ts";

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

export const getFruits = async function () {
  const query = "SELECT * FROM fruits;";
  const result = (await db.query(query)).rows;
  return result;
};

export const createFruit = async function (name: string) {
  const query = `
    INSERT INTO fruits(name) 
    VALUES('${name}')
    RETURNING id;
  `;

  const [[result]] = (await db.query(query)).rows;
  return result;
};

export const updateFruit = async function (id: number, name: string) {
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

export const deleteFruit = async function (id: number) {
  const query = `
    DELETE FROM fruits
    WHERE id = ${id};
  `;
  const results = (await db.query(query)).rowCount;
  return results;
};
