import { Context, HttpRequest } from "@app/mod.ts";
import { getSession } from "@app/utils/session.ts";
import {
  createPost,
  deletePostById,
  getPosts,
} from "@app/modules/home/home.service.ts";

// Add these imports for comment handling
import {
  createComment,
  getCommentsByPostId,
} from "@app/modules/home/home.service.ts";

export default async function homeHandler(req: HttpRequest, ctx: Context) {
  const ses = await getSession(req, ctx);
  const isLogin = ses?.isLogin;
  if (!isLogin) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  const avatar_url = ses?.avatar_url;
  const html_url = ses?.html_url;
  const author = ses?.username;
  // Get posts for the initial page load
  const posts = await getPosts();
  console.log("Posts data:", JSON.stringify(posts, null, 2));
  console.log("Number of posts:", posts.length);
  //**
  // {
  //  "id": "01JRF7X2TM6PPRJ52VP98R6ATJ",
  //  "content": "okeeeee",
  //  "timestamp": "2025-04-10T06:58:51.860Z",
  //  "author": "ynwd"
  // },
  //  */

  return await ctx.render({
    title: "Home",
    description: "Share your thoughts and connect with others",
    image: "https://fastro.deno.dev/fastro.jpeg",
    isLogin,
    avatar_url,
    html_url,
    author,
    posts,
  });
}

export async function postHandler(req: HttpRequest, ctx: Context) {
  try {
    const body = await req.json();
    const content = body.content;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the user from session
    const ses = await getSession(req, ctx);
    const username = ses?.username;

    // Create the post
    const post = await createPost({
      content,
      author: username,
    });

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing post request:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function deletePostHandler(req: HttpRequest, ctx: Context) {
  try {
    // Extract post ID from the URL path instead of query parameters
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 1]; // Get the last part of the path

    if (!id) {
      return new Response(JSON.stringify({ error: "Post ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the user from session for authorization
    const ses = await getSession(req, ctx);
    if (!ses?.isLogin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Delete the post
    const success = await deletePostById(id);

    if (!success) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing delete request:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle comment creation
export async function commentHandler(req: HttpRequest, ctx: Context) {
  try {
    const body = await req.json();
    const { content, postId } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!postId) {
      return new Response(JSON.stringify({ error: "Post ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the user from session
    const ses = await getSession(req, ctx);
    if (!ses?.isLogin) {
      return new Response(
        JSON.stringify({ error: "Login required to comment" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const username = ses.username || "";

    // Create the comment
    const comment = await createComment({
      content,
      postId,
      author: username,
    });

    return new Response(JSON.stringify(comment), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing comment request:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Get comments for a post
export async function getCommentsHandler(req: HttpRequest, _ctx: Context) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const postId = pathParts[pathParts.length - 1];

    if (!postId) {
      return new Response(JSON.stringify({ error: "Post ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const comments = await getCommentsByPostId(postId);

    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
