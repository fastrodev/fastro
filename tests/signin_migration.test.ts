import { signinHandler } from "../modules/signin/handler.tsx";

class MockKV {
  store = new Map<string, unknown>();
  get(key: unknown) {
    const k = JSON.stringify(key);
    return Promise.resolve({
      value: this.store.has(k) ? this.store.get(k) : null,
    });
  }
  set(key: unknown, value: unknown) {
    const k = JSON.stringify(key);
    this.store.set(k, value);
    return Promise.resolve({ ok: true });
  }
}

Deno.test("signin migrates plaintext password to hash+salt", async () => {
  const kv = new MockKV();
  // create legacy user with plaintext password
  await kv.set(["user", "legacy@test"], { password: "plainpw" });

  // prepare ctx
  const form = new FormData();
  form.set("identifier", "legacy@test");
  form.set("password", "plainpw");

  let setCookieCalled = false;
  const ctx = {
    state: { formData: form },
    kv,
    query: {} as Record<string, string>,
    renderToString: () => "",
    setCookie: (_n: string, _v: string, _o: Record<string, unknown>) => {
      setCookieCalled = true;
    },
  } as unknown as {
    state: { formData: FormData };
    kv: MockKV;
    query: Record<string, string>;
    renderToString: () => string;
    setCookie: (n: string, v: string, o: Record<string, unknown>) => void;
  };

  const req = new Request("http://localhost/signin", { method: "POST" });
  const res = await signinHandler(req, ctx);
  if (res.status !== 303) {
    throw new Error("Expected redirect after successful signin");
  }
  if (!setCookieCalled) throw new Error("setCookie was not called");

  const stored = await kv.get(["user", "legacy@test"]);
  if (!stored || !stored.value) throw new Error("User not found after signin");
  const user = stored.value as Record<string, unknown>;
  if (!user.hash || !user.salt) {
    throw new Error("User was not migrated to hash+salt");
  }
  if ("password" in user) {
    throw new Error("Legacy plaintext password still present");
  }
});
