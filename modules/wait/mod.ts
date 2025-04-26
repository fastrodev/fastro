import { Fastro } from "@app/mod.ts";
import pageLayout from "@app/modules/wait/wait.layout.tsx";
import pageComponent from "@app/modules/wait/wait.page.tsx";
import pageHandler, { submitHandler } from "@app/modules/wait/wait.handler.ts";

export default function (s: Fastro) {
  /** proxy for github repo */
  s.use(async (_req, ctx) => {
    if (
      ctx.url.pathname.endsWith(".ts") ||
      ctx.url.pathname.endsWith(".tsx")
    ) {
      const version = ctx.url.pathname.startsWith("/v")
        ? ""
        : ctx.url.pathname.startsWith("/canary")
        ? "/canary"
        : "/main";
      const path =
        `https://raw.githubusercontent.com/fastrodev/fastro${version}${ctx.url.pathname}`;
      const res = await fetch(path);
      const content = await res.text();
      return new Response(content);
    }
    return ctx.next();
  });
  // add page
  s.page("/", {
    folder: "modules/wait",
    component: pageComponent,
    layout: pageLayout,
    handler: pageHandler,
  });

  s.post("/api/submit", submitHandler);
  s.get("/api/get", (req, ctx) => {
    return new Response("Oke", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  });
  s.post("/api/v1/post", async (req, ctx) => {
    // Define CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "http://localhost:8000",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400", // 24 hours cache for preflight requests
    };

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers,
      });
    }

    // For GET and POST requests
    try {
      let responseBody;
      let responseStatus = 200;

      if (req.method === "POST") {
        // Parse the request body as JSON
        try {
          const body = await req.json();
          responseBody = { message: "Received POST request", data: body };
        } catch (error) {
          console.error("Error parsing JSON:", error);
          responseBody = { error: "Invalid JSON" };
          responseStatus = 400;
        }
      } else if (req.method === "GET") {
        responseBody = { message: "Hello from Deno server!" };
      } else {
        responseBody = { error: "Method not allowed" };
        responseStatus = 405;
      }

      return new Response(JSON.stringify(responseBody), {
        status: responseStatus,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Server error:", error);
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
    }
  });
  return s;
}
