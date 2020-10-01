import { Fastro } from "../mod.ts";
import { assertEquals, assertStringContains } from "../deps.ts";

const { test } = Deno;
const port = 3002;
const base = `http://localhost:${port}`;
const server = new Fastro();

test({
  name: "MULTIPART FORM",
  async fn() {
    let data = new FormData();
    const file = await Deno.readFile("readme.md");
    const blob = new Blob([file.buffer]);
    data.append("file", blob, "file_name.txt");
    data.append("name", "agus");
    server.listen({ port });
    const result = await fetch(`${base}/form/post`, {
      body: data,
      method: "POST",
    });
    const text = await result.text();
    const [v1, v2] = JSON.parse(text);
    assertStringContains(v1.value, "# Fast and simple web framework");
    assertStringContains(v2.value, "agus");
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

test({
  name: "URL ENCODED FORM",
  async fn() {
    server.listen({ port });
    var data = new URLSearchParams();
    data.append("userName", "test@gmail.com");
    data.append("password", "Password");
    data.append("grant_type", "password");

    const result = await fetch(`${base}/form/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });
    const text = await result.text();
    const [c] = JSON.parse(text);
    assertEquals(c, { userName: "test@gmail.com" });
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

test({
  name: "JSON FORM",
  async fn() {
    server.listen({ port });
    const result = await fetch(`${base}/form/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg: "hello" }),
    });
    const text = await result.text();
    assertEquals(text, '{"msg":"hello"}');
    server.close();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
