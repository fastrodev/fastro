import { Fastro } from "@app/mod.ts";

// // in-memory cache of messages
// // deno-lint-ignore no-explicit-any
// export const messages: any[] = [];

// // A BroadcastChannel used by all isolates
// export const channel = new BroadcastChannel("all_messages");

// // When a new message comes in from other instances, add it
// channel.onmessage = (event: MessageEvent) => {
//     messages.push(event.data);
// };

export default function sseModule(s: Fastro) {
    // s.get("/list", (_req, _ctx) => {
    //     return Response.json(messages);
    // });
    // s.get("/send", (req, _ctx) => {
    //     const message = req.query?.message;
    //     if (message) {
    //         messages.push(message);
    //         channel.postMessage(message);
    //     }
    //     return Response.json({ send: "success" });
    // });
    return s;
}
