import { assertEquals, assertExists } from "./deps.ts";
import { fastro } from "./server.ts";

const host = "http://127.0.0.1:9000";

Deno.test({
  name: "non-root folder files",
  fn: async () => {
    const f = fastro();
    f.static("/public", 6000);
    const s = f.serve();

    const nf = await fetch(`${host}/public`, { method: "GET" });
    // console.log(await nf.text());
    assertEquals("Not Found", await nf.text());

    await fetch(`${host}/public/deno.svg`, { method: "GET" });
    const x = await fetch(`${host}/public/deno.svg`, { method: "GET" });
    assertExists(
      await x.text(),
      `<svg width="105" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">`,
    );

    f.close();
    await s;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "FILES",
  fn: async () => {
    const f = fastro();
    f.flash(false);
    f.static("/");

    const s = f.serve();

    await fetch(host, { method: "GET" });
    const idx = await fetch(host, { method: "GET" });
    assertEquals((await idx.text()).trim(), `<h1>ok</h1>`);

    fetch(host, { method: "GET" });
    const nf = await fetch(`${host}/img`, { method: "GET" });
    assertEquals(await nf.text(), "Not Found");

    await fetch(host + "/index.jpg", { method: "GET" });
    const r = await fetch(host + "/index.jpg", { method: "GET" });
    assertEquals(await r.text(), "Not Found");

    await fetch(host + "/ok.jpg", { method: "GET" });
    const j = await fetch(host + "/ok.jpg", { method: "GET" });
    assertEquals("jpg\n", await j.text());

    await fetch(host + "/ok.x", { method: "GET" });
    const x = await fetch(host + "/ok.x", { method: "GET" });
    assertEquals("mov\n", await x.text());

    const js = await fetch(host + "/public/hello.js", { method: "GET" });
    assertExists("scheduler/cjs/scheduler.production.min.js:", await js.text());

    const m = await fetch(host + "/bench/result.md", { method: "GET" });
    assertExists("module", await m.text());

    f.close();
    await s;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "non-root folder files",
  fn: async () => {
    await Deno.remove("./index.html");
    const f = fastro();
    f.flash(false);
    f.static("/ne", 6000);
    const s = f.serve();

    await fetch(`${host}`, { method: "GET" });
    const nf = await fetch(`${host}`, { method: "GET" });
    assertEquals("Not Found", await nf.text());

    f.close();
    await s;
  },

  sanitizeResources: false,
  sanitizeOps: false,
});
