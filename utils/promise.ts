// import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const requestQueue: (() => Promise<Response>)[] = [];
let isProcessing = false;

const processQueue = async () => {
  // Process each request in the queue
  while (requestQueue.length > 0) {
    const requestHandler = requestQueue.shift();
    if (requestHandler) {
      return await requestHandler(); // Wait for the request to be processed
    }
  }
  isProcessing = false; // Reset processing state when done
};

const handler = async (_req: Request) => {
  // Create a promise that resolves to a response
  const responsePromise = new Promise<Response>((resolve) => {
    // Simulate some processing delay (e.g., 1 second)
    setTimeout(() => {
      resolve(new Response("Hello, World!"));
    }, 1);
  });

  // Add the request to the queue
  requestQueue.push(() => responsePromise);

  // Start processing if not already processing
  if (!isProcessing) {
    isProcessing = true;
    const x = await processQueue(); // Start processing the queue
    if (x) return x;
  }

  // Return a placeholder response immediately
  return new Response("Not found", { status: 400 });
};

// Start the server
Deno.serve(handler);
