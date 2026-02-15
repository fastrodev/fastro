import { createRouter } from "../../core/router.ts";

const r = createRouter();

const IMG_DIR = "./public/img";

function sanitizeFilename(name: string) {
  // Keep only safe characters and collapse spaces
  return name.replace(/[^A-Za-z0-9._-]/g, "-").replace(/-+/g, "-");
}

async function fileExists(path: string) {
  try {
    await Deno.stat(path);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return false;
    throw err;
  }
}

r.get("/api/media", async () => {
  try {
    const assets: Array<{ name: string; url: string; size?: number }> = [];
    for await (const entry of Deno.readDir(IMG_DIR)) {
      if (!entry.isFile) continue;
      const name = entry.name;
      const path = `${IMG_DIR}/${name}`;
      try {
        const stat = await Deno.stat(path);
        assets.push({
          name,
          url: `/img/${encodeURIComponent(name)}`,
          size: stat.size,
        });
      } catch {
        // ignore stat errors per-file
      }
    }
    return Response.json({ assets });
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return Response.json({ assets: [] });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
});

r.post("/api/media", async (req) => {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("multipart/form-data")) {
    return new Response(null, { status: 415 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file || !file.name) return new Response(null, { status: 400 });

  const safe = sanitizeFilename(file.name);
  await Deno.mkdir(IMG_DIR, { recursive: true });

  const parts = safe.split(".");
  const ext = parts.length > 1 ? `.${parts.pop()}` : "";
  const base = parts.join(".") || "file";

  let outName = base + ext;
  let outPath = `${IMG_DIR}/${outName}`;
  if (await fileExists(outPath)) {
    // avoid overwriting: append timestamp
    outName = `${base}-${Date.now()}${ext}`;
    outPath = `${IMG_DIR}/${outName}`;
  }

  const data = new Uint8Array(await file.arrayBuffer());
  await Deno.writeFile(outPath, data);

  return Response.json({
    ok: true,
    name: outName,
    url: `/img/${encodeURIComponent(outName)}`,
  });
});

r.delete("/api/media/:name", async (_req, ctx) => {
  const raw = ctx.params.name;
  const name = decodeURIComponent(raw || "");
  if (
    !name || name.includes("/") || name.includes("\\") || name.includes("..")
  ) {
    return new Response(null, { status: 400 });
  }

  const path = `${IMG_DIR}/${name}`;
  try {
    await Deno.remove(path);
    return new Response(null, { status: 204 });
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return new Response(null, { status: 404 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
});

export default r.build();
