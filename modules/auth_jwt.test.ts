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

    // Mock KV if not available
    const originalOpenKv = Deno.openKv;
    if (typeof Deno.openKv !== "function") {
      const mockKv = {
        get: (key: string[]) => {
          if (key[0] === "user" && key[1] === "testuser") {
            return Promise.resolve({ value: { password: "testpass" } });
          }
          return Promise.resolve({ value: null });
        },
        set: () => Promise.resolve({ ok: true }),
        delete: () => Promise.resolve({ ok: true }),
        close: () => {},
      };
      // @ts-ignore: mocking Deno.openKv
      Deno.openKv = () => Promise.resolve(mockKv);
    }

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
      signupForm.append("identifier", "testuser");
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
        dashboardText.includes("testuser"),
        "Dashboard should show username",
      );

      // 3. Signin
      const signinForm = new FormData();
      signinForm.append("identifier", "testuser");
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

      // 5. Dashboard without cookie (should redirect)
      const dashboardNoAuthRes = await fetch(
        "http://localhost:8100/dashboard",
        {
          redirect: "manual",
        },
      );
      assertEquals(dashboardNoAuthRes.status, 303);
      assertEquals(dashboardNoAuthRes.headers.get("Location"), "/signin");
      await dashboardNoAuthRes.body?.cancel();
    } finally {
      s.close();
      if (originalOpenKv) Deno.openKv = originalOpenKv;
    }
  },
  sanitizeResources: false,
});
