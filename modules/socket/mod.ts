import { Fastro } from "@app/mod.ts";

export default function socketModule(s: Fastro) {
    const connections = new Set<WebSocket>();
    function broadcast(message: string) {
        for (const client of connections) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }
    s.use((request, _ctx) => {
        if (request.headers.get("upgrade") === "websocket") {
            const { socket, response } = Deno.upgradeWebSocket(request);
            connections.add(socket);

            socket.onopen = () => {
                console.log("CONNECTED");
            };
            socket.onmessage = (event) => {
                broadcast(event.data);
            };
            socket.onclose = () => console.log("DISCONNECTED");
            socket.onerror = (error) => console.error("ERROR:", error);

            return response;
        }
    });

    return s;
}
