import { Context } from "../../core/types.ts";
import { join } from "@std/path";

export const createPostHandler = async (_req: Request, ctx: Context) => {
  const { json } = ctx.state as {
    json: { filename: string; content?: string };
  };
  if (!json || !json.filename) {
    return new Response("Invalid request: missing filename", { status: 400 });
  }

  // Basic filename sanitization: prevent path separators
  let filename = String(json.filename).trim();
  if (filename.length === 0) {
    return new Response("Invalid request: empty filename", { status: 400 });
  }
  if (filename.includes("/") || filename.includes("\\")) {
    return new Response("Invalid filename", { status: 400 });
  }

  // Ensure filename ends with .md
  if (!filename.endsWith(".md")) filename += ".md";

  const content = typeof json.content === "string" ? json.content : "";

  const postsDir = join(Deno.cwd(), "posts");
  const filePath = join(postsDir, filename);

  try {
    await Deno.writeTextFile(filePath, content);
    return {
      success: true,
      message: "Post created successfully",
      filename: filename,
    };
  } catch (error) {
    console.error("Error writing post:", error);
    return new Response("Failed to create post", { status: 500 });
  }
};

export const listPostsHandler = async () => {
  try {
    const postsDir = join(Deno.cwd(), "posts");
    const entries = [] as string[];
    for await (const e of Deno.readDir(postsDir)) {
      if (e.isFile && e.name.endsWith(".md")) entries.push(e.name);
    }
    return { posts: entries };
  } catch (err) {
    console.error("Error listing posts:", err);
    return new Response("Failed to list posts", { status: 500 });
  }
};

export const getPostHandler = async (_req: Request, ctx: Context) => {
  const params = ctx.params || ({} as Record<string, string>);
  const name = params.name;
  if (!name) return new Response("Missing filename", { status: 400 });
  if (name.includes("/") || name.includes("\\")) {
    return new Response("Invalid filename", { status: 400 });
  }
  try {
    const postsDir = join(Deno.cwd(), "posts");
    const filePath = join(postsDir, name);
    const content = await Deno.readTextFile(filePath);
    return { filename: name, content };
  } catch (err) {
    console.error("Error reading post:", err);
    return new Response("Failed to read post", { status: 500 });
  }
};

export const deletePostHandler = async (_req: Request, ctx: Context) => {
  const params = ctx.params || ({} as Record<string, string>);
  const name = params.name;
  if (!name) return new Response("Missing filename", { status: 400 });
  if (name.includes("/") || name.includes("\\")) {
    return new Response("Invalid filename", { status: 400 });
  }
  try {
    const postsDir = join(Deno.cwd(), "posts");
    const filePath = join(postsDir, name);
    await Deno.remove(filePath);
    return { success: true, filename: name };
  } catch (err) {
    console.error("Error deleting post:", err);
    return new Response("Failed to delete post", { status: 500 });
  }
};

export const updatePostHandler = async (_req: Request, ctx: Context) => {
  const params = ctx.params || ({} as Record<string, string>);
  const name = params.name;
  const { json } = ctx.state as { json?: { content?: string } };
  if (!name) return new Response("Missing filename", { status: 400 });
  if (name.includes("/") || name.includes("\\")) {
    return new Response("Invalid filename", { status: 400 });
  }
  try {
    const postsDir = join(Deno.cwd(), "posts");
    const filePath = join(postsDir, name);
    const content = (json && typeof json.content === "string")
      ? json.content
      : "";
    await Deno.writeTextFile(filePath, content);
    return { success: true, filename: name };
  } catch (err) {
    console.error("Error updating post:", err);
    return new Response("Failed to update post", { status: 500 });
  }
};
