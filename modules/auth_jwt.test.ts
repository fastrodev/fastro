import { assert, assertEquals } from "@std/assert";
import server, { _resetForTests } from "../core/server.ts";
import signin from "./signin/mod.ts";
import dashboard from "./dashboard/mod.ts";
import signup from "./signup/mod.ts";
import { cookieMiddleware } from "../middlewares/cookie/mod.ts";

Deno.test({
  name: "JWT Integration - Full Flow",
  fn: async () => {
    _resetForTests();

    // Always mock KV for this integration test to ensure isolation and
    // deterministic behavior under coverage and CI (avoid relying on host KV).
    const originalOpenKv = Deno.openKv;
    const store = new Map<string, unknown>();
    const mockKv = {
      get: (key: string[]) => {
        const k = JSON.stringify(key);
        return Promise.resolve({ value: store.get(k) ?? null });
      },
      set: (key: string[], value: unknown) => {
        const k = JSON.stringify(key);
        store.set(k, value);
        return Promise.resolve({ ok: true });
      },
      delete: (key: string[]) => {
        const k = JSON.stringify(key);
        store.delete(k);
        return Promise.resolve({ ok: true });
      },
      close: () => {},
    };
    // @ts-ignore: mocking Deno.openKv
    Deno.openKv = () => Promise.resolve(mockKv);

    // Mock ctx.renderToString
    server.use((_req, ctx, next) => {
      ctx.renderToString = (vnode: unknown) =>
        "<html>" + JSON.stringify(vnode) + "</html>";
      return next();
    });

    server.use(cookieMiddleware);
    server.use(signup);
    server.use(signin);
    server.use(dashboard);

    const s = server.serve({ port: 8100 });

    try {
      // 1. Signup
      const signupForm = new FormData();
      signupForm.append("identifier", "testuser@example.com");
      signupForm.append("password", "testpass");

      const signupRes = await fetch("http://localhost:8100/signup", {
        method: "POST",
        body: signupForm,
        redirect: "manual",
      });

      assertEquals(signupRes.status, 303);
      const signupLocation = signupRes.headers.get("Location");
      assertEquals(signupLocation, "/dashboard");
      const signupCookie = signupRes.headers.get("set-cookie");
      assert(
        signupCookie?.includes("token="),
        "Signup should set token cookie",
      );
      await signupRes.body?.cancel();

      // 2. Dashboard with cookie from signup
      const dashboardRes = await fetch("http://localhost:8100/dashboard", {
        headers: { Cookie: signupCookie! },
      });
      assertEquals(dashboardRes.status, 200);
      const dashboardText = await dashboardRes.text();
      assert(
        dashboardText.includes("testuser@example.com"),
        "Dashboard should show username",
      );

      // 3. Signin
      const signinForm = new FormData();
      signinForm.append("identifier", "testuser@example.com");
      signinForm.append("password", "testpass");

      const signinRes = await fetch("http://localhost:8100/signin", {
        method: "POST",
        body: signinForm,
        redirect: "manual",
      });

      assertEquals(signinRes.status, 303);
      assertEquals(signinRes.headers.get("Location"), "/dashboard");
      const signinCookie = signinRes.headers.get("set-cookie");
      assert(
        signinCookie?.includes("token="),
        "Signin should set token cookie",
      );
      await signinRes.body?.cancel();

      // 4. Signout
      const signoutRes = await fetch("http://localhost:8100/signout", {
        method: "POST",
        headers: { Cookie: signinCookie! },
        redirect: "manual",
      });
      assertEquals(signoutRes.status, 303);
      assertEquals(signoutRes.headers.get("Location"), "/signin");
      const signoutCookie = signoutRes.headers.get("set-cookie");
      assert(
        signoutCookie?.includes("token=;"),
        "Signout should clear token cookie",
      );
      await signoutRes.body?.cancel();

      // 5. Signup with invalid identifier
      const invalidSignupForm = new FormData();
      invalidSignupForm.append("identifier", "invalid_id");
      invalidSignupForm.append("password", "pass");
      const invalidRes = await fetch("http://localhost:8100/signup", {
        method: "POST",
        body: invalidSignupForm,
      });
      const invalidText = await invalidRes.text();
      assert(
        invalidText.includes(
          "Identifier must be a valid email or phone number",
        ),
        "Should show error for invalid identifier",
      );

      // 6. Dashboard without cookie (should redirect)
      const dashboardNoAuthRes = await fetch(
        "http://localhost:8100/dashboard",
        {
          redirect: "manual",
        },
      );
      assertEquals(dashboardNoAuthRes.status, 303);
      assertEquals(
        dashboardNoAuthRes.headers.get("Location"),
        "/signin?msg=auth_required",
      );
      await dashboardNoAuthRes.body?.cancel();
    } finally {
      s.close();
      if (originalOpenKv) Deno.openKv = originalOpenKv;
    }
  },
  sanitizeResources: false,
});
