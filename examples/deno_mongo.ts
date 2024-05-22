import fastro, { Context, HttpRequest } from "$fastro/mod.ts";
import { MongoClient, ObjectId } from "jsr:x/mongo@v0.32.0/mod.ts";

const client = new MongoClient();
await client.connect("mongodb://root:example@localhost:27017");

interface UserSchema {
  _id: ObjectId;
  username: string;
  password: string;
}

const db = client.database("test");
const users = db.collection<UserSchema>("users");

const insertId = await users.insertOne({
  username: "user1",
  password: "pass1",
});

async function getData() {
  const user1 = await users.findOne({ _id: insertId });
  return user1;
}

const f = new fastro();

f.get("/", async (_req: HttpRequest, ctx: Context) => {
  const data = await getData();
  return ctx.send(data, 200);
});

await f.serve();
