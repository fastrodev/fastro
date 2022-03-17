import { serve } from "https://deno.land/std@0.129.0/http/server.ts"

await serve(() => new Response('Hello world!'))