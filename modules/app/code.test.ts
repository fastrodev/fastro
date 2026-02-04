import { assertEquals } from "@std/assert";
import App from "../../mod.ts";
import { registerCodeRoutes } from "./code.ts";
import { _getRoutesForTests, _resetForTests } from "../../core/server.ts";

Deno.test("code - registerCodeRoutes", async () => {
  _resetForTests();
  const app = new App();
  registerCodeRoutes(app);

  const routes = _getRoutesForTests();
  // We expect 5 routes from code.ts:
  // core/loader.ts, core/router.ts, core/server.ts, core/types.ts, native.ts
  assertEquals(routes.length >= 5, true);

  // Test the handlers directly
  for (const route of routes) {
    const req = new Request(`http://localhost${route.pattern.pathname}`);
    // deno-lint-ignore no-explicit-any
    const ctx = {} as any;
    const res = await route.handler(req, ctx, () => new Response());
    const response = res instanceof Response
      ? res
      : new Response(res as string);
    assertEquals(response.status, 200);
    const text = await response.text();
    assertEquals(text.length > 0, true);
  }
});
