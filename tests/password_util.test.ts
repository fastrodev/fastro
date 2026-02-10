import { hashPassword, verifyPassword } from "../utils/password.ts";

Deno.test("hash and verify password", async () => {
  const password = "s3cr3t-p@ss";
  const { salt, hash } = await hashPassword(password);
  if (!salt || !hash) throw new Error("salt/hash not returned");

  const ok = await verifyPassword(password, salt, hash);
  if (!ok) throw new Error("verifyPassword failed for correct password");

  const nok = await verifyPassword("wrong", salt, hash);
  if (nok) throw new Error("verifyPassword returned true for wrong password");
});
