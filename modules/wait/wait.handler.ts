import { Context, HttpRequest } from "@app/mod.ts";
import addEmail from "@app/modules/wait/wait.service.ts";

export default async function waitHandler(_req: HttpRequest, ctx: Context) {
  return await ctx.render({
    title: "Inventory Management & Purchasing Solutions",
    description:
      "Inventory management & purchasing solutions for small businesses.",
  });
}

export async function submitHandler(req: HttpRequest, _ctx: Context) {
  try {
    const body = await req.json();
    const email = body.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    await addEmail(email);

    return new Response(JSON.stringify({ message: "success" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
}
