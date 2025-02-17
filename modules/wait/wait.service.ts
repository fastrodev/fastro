import { ulid } from "jsr:@std/ulid/ulid";
import { kv } from "@app/utils/db.ts";

export default async function addEmail(email: string) {
  const userId = ulid();
  const u = {
    userId,
    email,
    active: true,
  };

  const primaryKey = ["users", userId];

  const atomic = kv.atomic()
    .check({ key: primaryKey, versionstamp: null })
    .set(primaryKey, u);

  const res = await atomic.commit();
  if (!res.ok) throw new Error("Failed to create user");

  return u;
}
