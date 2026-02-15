import { Context, Handler } from "../../core/types.ts";
import { join } from "@std/path";

export const getConfigHandler: Handler = async (
  _req: Request,
  ctx: Context,
) => {
  try {
    const pagesDir = join(Deno.cwd(), "pages");
    const allPages: string[] = [];
    try {
      for await (const entry of Deno.readDir(pagesDir)) {
        if (
          entry.isFile &&
          (entry.name.endsWith(".md") || entry.name.endsWith(".html"))
        ) {
          // Remove extension
          const name = entry.name.replace(/\.(md|html)$/i, "");
          allPages.push(name);
        }
      }
    } catch (_e) {
      // pages dir might not exist
    }

    let headerPages: string[] = [];
    if (ctx.kv) {
      const res = await ctx.kv.get(["config", "headerPages"]);
      if (res?.value) {
        headerPages = res.value as string[];
      }
    }

    return Response.json({
      allPages: [...new Set(allPages)],
      headerPages,
    });
  } catch (err) {
    console.error("Error getting config:", err);
    return new Response("Failed to get config", { status: 500 });
  }
};

export const updateConfigHandler: Handler = async (
  _req: Request,
  ctx: Context,
) => {
  const { json } = ctx.state as { json?: { headerPages: string[] } };
  if (!json || !Array.isArray(json.headerPages)) {
    return new Response("Invalid request: missing headerPages", {
      status: 400,
    });
  }

  if (json.headerPages.length > 4) {
    return new Response("Maximum 4 header pages allowed", { status: 400 });
  }

  try {
    if (ctx.kv) {
      await ctx.kv.set(["config", "headerPages"], json.headerPages);
    }
    return Response.json({ success: true, headerPages: json.headerPages });
  } catch (err) {
    console.error("Error updating config:", err);
    return new Response("Failed to update config", { status: 500 });
  }
};
