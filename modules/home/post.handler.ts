import { Context, HttpRequest } from "@app/mod.ts";
import { getSession } from "@app/utils/session.ts";
import { getPostById } from "@app/modules/home/home.service.ts";

export default async function postDetailHandler(
  req: HttpRequest,
  ctx: Context,
) {
  // Extract post ID from URL parameters provided by Fastro
  const id = req.params?.id;

  if (!id) {
    console.error("No post ID found in parameters");
    return new Response("No post ID provided", { status: 400 });
  }

  // Check if user is logged in, but don't restrict access
  const ses = await getSession(req, ctx);
  const isLogin = ses?.isLogin || false;
  const avatar_url = ses?.avatar_url || "";
  const html_url = ses?.html_url || "";

  // Get the post details
  const post = await getPostById(id);
  console.log("Post retrieved:", post ? "Yes" : "No");

  if (!post) {
    // If post doesn't exist, redirect to home
    console.log("Post not found, redirecting to home");
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/home",
      },
    });
  }

  return await ctx.render({
    title: `Post by ${post.author}`,
    description: post.content.substring(0, 150) +
      (post.content.length > 150 ? "..." : ""),
    image: "https://fastro.deno.dev/fastro.png",
    isLogin,
    avatar_url,
    html_url,
    post,
  });
}
