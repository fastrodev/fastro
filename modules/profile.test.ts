import { assert, assertEquals } from "@std/assert";
import server, { _resetForTests } from "../core/server.ts";
import profile from "./profile/mod.ts";
import dashboard from "./dashboard/mod.ts";
import { cookieMiddleware } from "../middlewares/cookie/mod.ts";
import { createToken } from "../middlewares/jwt/mod.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fastro-secret";

Deno.test({
  name: "Profile Module - Integration Test",
  fn: async () => {
    _resetForTests();

    // Mock KV
    const mockData: Record<string, unknown> = {
      "user:testuser": { password: "testpass" },
    };

    const mockKv = {
      get: (key: string[]) => {
        const k = key.join(":");
        return Promise.resolve({ value: mockData[k] || null });
      },
      set: (key: string[], value: unknown) => {
        const k = key.join(":");
        mockData[k] = value;
        return Promise.resolve({ ok: true });
      },
      delete: (key: string[]) => {
        const k = key.join(":");
        delete mockData[k];
        return Promise.resolve();
      },
      close: () => {},
    };

    // @ts-ignore: mocking Deno.openKv
    const originalOpenKv = Deno.openKv;
    // @ts-ignore: mocking Deno.openKv (using unknown for ease of mocking)
    Deno.openKv = () => Promise.resolve(mockKv as unknown as Deno.Kv);

    // Mock ctx.renderToString
    server.use((_req, ctx, next) => {
      ctx.renderToString = (vnode: unknown) =>
        "<html>" + JSON.stringify(vnode) + "</html>";
      return next();
    });

    server.use(cookieMiddleware);
    server.use(profile);
    server.use(dashboard);

    const s = server.serve({ port: 8200 });

    try {
      const token = await createToken({ user: "testuser" }, JWT_SECRET);
      const cookie = `token=${token}`;

      // 1. View profile
      const res = await fetch("http://localhost:8200/profile", {
        headers: { Cookie: cookie },
      });
      assertEquals(res.status, 200);
      const text = await res.text();
      assert(text.includes("testuser"), "Profile should show username");

      // 2. Update profile
      const form = new FormData();
      form.append("name", "Test User");
      form.append("bio", "This is a bio");

      const postRes = await fetch("http://localhost:8200/profile", {
        method: "POST",
        body: form,
        headers: { Cookie: cookie },
      });
      assertEquals(postRes.status, 200);
      const postText = await postRes.text();
      assert(
        postText.includes("Profile updated successfully!"),
        "Should show success message",
      );
      assert(postText.includes("Test User"), "Should show updated name");
      assert(postText.includes("This is a bio"), "Should show updated bio");

      // 3. Update username
      const userForm = new FormData();
      userForm.append("username", "newuser");
      userForm.append("name", "New Name");

      const userRes = await fetch("http://localhost:8200/profile", {
        method: "POST",
        body: userForm,
        headers: { Cookie: cookie },
      });
      assertEquals(userRes.status, 200);
      const userText = await userRes.text();
      assert(
        userText.includes("Profile and username updated successfully!"),
        "Should show username success message",
      );
      assert(userText.includes("newuser"), "Should show new username");
      assert(userText.includes("New Name"), "Should show new name");
    } finally {
      await s.shutdown();
      // @ts-ignore: restoring Deno.openKv
      Deno.openKv = originalOpenKv;
    }
  },
});
