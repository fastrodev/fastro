import { Fastro } from "../../core/server/types.ts";
import {
  generateDeleteSignedUrl,
  generateSignedUrl,
} from "../../utils/signed-url.ts";

// Create a helper function for CORS headers
const corsHeaders = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
});

const optionsHandler = function (_req: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};

export default function apisModule(s: Fastro) {
  s.post("/api/signed-url", async (req, res) => {
    try {
      const body = await req.json();
      const { filename, contentType } = body;

      if (!filename || typeof filename !== "string") {
        return res.send(
          {
            error: "Invalid request: filename is required",
          },
          400,
          corsHeaders,
        );
      }
      if (!contentType || typeof contentType !== "string") {
        return res.status(400).send(
          {
            error: "Invalid request: contentType is required",
          },
          400,
          corsHeaders,
        );
      }

      const signedUrlResponse = await generateSignedUrl(filename, contentType);

      // return res.send(
      //   {
      //     signedUrl: signedUrlResponse.signedUrl,
      //   },
      //   200,
      //   corsHeaders,
      // );

      const responseHeaders = new Headers(corsHeaders); // Create a new Headers object, copying from corsHeaders
      responseHeaders.set("Content-Type", "application/json"); // Set the Content-Type

      return new Response(
        JSON.stringify({
          signedUrl: signedUrlResponse.signedUrl,
        }),
        {
          status: 200,
          headers: responseHeaders, // Use the correctly constructed Headers object
        },
      );
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return res.send(
        {
          error: "Failed to generate signed URL",
        },
        500,
        corsHeaders,
      );
    }
  });

  s.options("/api/signed-url", optionsHandler);

  // Update delete-signed-url endpoint
  s.post("/api/delete-signed-url", async (req, res) => {
    try {
      const body = await req.json();
      const { filename } = body;

      if (!filename || typeof filename !== "string") {
        return res.send(
          {
            error: "Invalid request: filename is required",
          },
          400,
          corsHeaders,
        );
      }

      const deleteUrlResponse = await generateDeleteSignedUrl(filename);
      return res.send(deleteUrlResponse, 200, corsHeaders);
    } catch (error) {
      console.error("Error generating delete signed URL:", error);
      return res.send(
        {
          error: "Failed to generate delete signed URL",
          details: error,
        },
        500,
        corsHeaders,
      );
    }
  });

  // Update delete-signed-url OPTIONS handler
  s.options("/api/delete-signed-url", optionsHandler);

  // Update healthcheck endpoint
  s.get("/api/healthcheck", (_req, _ctx) => {
    try {
      return new Response("API is healthy", {
        status: 200,
        headers: corsHeaders,
      });
    } catch (error) {
      console.error("Healthcheck failed:", error);
      return new Response(
        JSON.stringify({
          error: "Healthcheck failed",
          details: error,
        }),
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }
  });

  // Update healthcheck OPTIONS handler
  s.options("/api/healthcheck", optionsHandler);

  // Update avatar endpoint
  s.get("/api/avatar/:seed", (req) => {
    const seed = req.params?.seed ? req.params.seed : "avatar";

    function stringToColor(str: string, salt = "") {
      let hash = 0;
      const salted = str + salt;
      for (let i = 0; i < salted.length; i++) {
        hash = salted.charCodeAt(i) + ((hash << 5) - hash);
      }
      let color = "#";
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ("00" + value.toString(16)).slice(-2);
      }
      return color;
    }

    function generatePattern(seed: string) {
      const size = 5;
      const center = Math.floor(size / 2);
      const pattern: boolean[][] = Array(size)
        .fill(null)
        .map(() => Array(size).fill(false));

      // More stable hash function
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
      }

      // Use a fixed seed value to ensure consistent patterns
      const seedValue = Math.abs(hash);

      for (let y = 0; y < size; y++) {
        for (let x = 0; x <= center; x++) {
          // More deterministic pattern generation
          const val = ((seedValue >> ((y * 3 + x) % 32)) & 1) === 1;
          pattern[y][x] = val;

          // Mirror horizontally
          if (x !== center) {
            pattern[y][size - 1 - x] = pattern[y][x];
          }
        }
      }

      return pattern;
    }

    // Generate SVG
    const fgColor = stringToColor(seed, "foreground");
    const bgColor = stringToColor(seed, "background");
    const cellSize = 16;
    const margin = 8;
    const pattern = generatePattern(seed);
    const size = pattern.length;
    const svgSize = cellSize * size + margin * 2;

    const cells = pattern
      .flatMap((row, y) =>
        row.map((cell, x) =>
          cell
            ? `<rect x="${margin + x * cellSize}" y="${
              margin + y * cellSize
            }" width="${cellSize}" height="${cellSize}" fill="${fgColor}"/>`
            : ""
        )
      )
      .join("");

    const svg = `
      <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${svgSize}" height="${svgSize}" fill="${bgColor}"/>
        ${cells}
      </svg>
    `.trim();

    return new Response(svg, {
      status: 200,
      headers: new Headers({
        ...corsHeaders,
        "Content-Type": "image/svg+xml",
      }),
    });
  });

  // Update avatar OPTIONS handler
  s.options("/api/avatar/:seed", optionsHandler);

  return s;
}
