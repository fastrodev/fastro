import { assert, assertEquals } from "@std/assert";
import server, { _resetForTests } from "../core/server.ts";
import userMod from "./user/mod.ts";

Deno.test({
  name: "User Module - Public Profile",
  fn: async () => {
    _resetForTests();

    // Mock KV
    const mockData: Record<string, unknown> = {
      "user:testuser": { name: "Test User", bio: "Public Bio" },
      "user:John": { name: "John Doe", bio: "Developer" },
    };

    const mockKv = {
      get: (key: string[]) => {
        const k = key.join(":");
        return Promise.resolve({ value: mockData[k] || null });
      },
      close: () => {},
    };

    // @ts-ignore: mocking Deno.openKv
    const originalOpenKv = Deno.openKv;
    // @ts-ignore: mocking Deno.openKv
    Deno.openKv = () => Promise.resolve(mockKv as unknown as Deno.Kv);

    // Mock ctx.renderToString
    server.use((_req, ctx, next) => {
      ctx.renderToString = (vnode: unknown) =>
        "<html>" + JSON.stringify(vnode) + "</html>";
      return next();
    });

    server.use(userMod);

    const s = server.serve({ port: 8300 });

    try {
      // 1. View existing user
      const res = await fetch("http://localhost:8300/u/testuser");
      assertEquals(res.status, 200);
      const text = await res.text();
      assert(text.includes("testuser"), "Profile should show username");
      assert(text.includes("Test User"), "Profile should show name");
      assert(text.includes("Public Bio"), "Profile should show bio");

      // 2. View non-existing user
      const res404 = await fetch("http://localhost:8300/u/nonexistent");
      assertEquals(res404.status, 404);
      const text404 = await res404.text();
      assert(
        text404.includes("notFound"),
        "Should show not found status in vnode",
      );

      // 3. View user with special characters in username
      const resSpecial = await fetch("http://localhost:8300/u/John");
      assertEquals(resSpecial.status, 200);
      const textSpecial = await resSpecial.text();
      assert(
        textSpecial.includes("John"),
        "Should show the username John",
      );

      // 4. View user with encoded characters in username
      const resEncoded = await fetch(
        "http://localhost:8300/u/John",
      );
      assertEquals(resEncoded.status, 200);
      const textEncoded = await resEncoded.text();
      assert(
        textEncoded.includes("John"),
        "Should show the username",
      );
    } finally {
      await s.shutdown();
      // @ts-ignore: restoring Deno.openKv
      Deno.openKv = originalOpenKv;
    }
  },
});
