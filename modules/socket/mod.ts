import { Fastro } from "@app/mod.ts";

interface Message {
    username: string;
    msg: string;
    time: string;
}

interface Data {
    type: string;
    room: string;
    message?: Message;
}

export default function socketModule(s: Fastro) {
    // const connections = new Set<WebSocket>();
    const connections = new Map<string, Set<WebSocket>>(); // Store user connections by room

    function broadcastMessage(room: string, message: string) {
        const sockets = connections.get(room);
        if (!sockets) return;
        for (const client of sockets) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }

    // function broadcast(message: string) {
    //     for (const client of connections) {
    //         if (client.readyState === WebSocket.OPEN) {
    //             client.send(message);
    //         }
    //     }
    // }

    function joinRoom(socket: WebSocket, room: string) {
        if (!connections.has(room)) connections.set(room, new Set<WebSocket>());
        connections.get(room)?.add(socket);
    }

    function handleConnection(socket: WebSocket) {
        // connections.add(socket);

        socket.onopen = () => {
            console.log("CONNECTED");
        };

        socket.onmessage = (event) => {
            const data: Data = JSON.parse(event.data);
            joinRoom(socket, data.room);
            if (data.type === "message") {
                broadcastMessage(data.room, JSON.stringify(data.message));
            }
        };
        socket.onclose = () => console.log("DISCONNECTED");
        socket.onerror = (error) => console.error("ERROR:", error);
    }

    s.use((request, _ctx) => {
        if (request.headers.get("upgrade") === "websocket") {
            const { socket, response } = Deno.upgradeWebSocket(request);
            handleConnection(socket);
            return response;
        }
    });

    return s;
}
