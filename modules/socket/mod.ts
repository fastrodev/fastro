// deno-lint-ignore-file
import { Context, Fastro } from "@app/mod.ts";

interface Message {
    img: string;
    username: string;
    msg: string;
    id: string;
}

interface Data {
    type: string;
    room: string;
    message?: Message;
}

export default function socketModule(s: Fastro) {
    const connections = new Map<string, Set<WebSocket>>();
    function broadcastMessage(room: string, message: string) {
        const sockets = connections.get(room);
        if (!sockets) return;
        for (const client of sockets) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }

    function joinRoom(socket: WebSocket, room: string) {
        if (!connections.has(room)) connections.set(room, new Set<WebSocket>());
        connections.get(room)?.add(socket);
    }

    const insertData = (data: any[], newMessage?: {
        msg: string;
        username: string;
        img: string;
        id: string;
    }) => {
        if (!newMessage) return data;
        const lastUser = data[data.length - 1];
        if (lastUser && lastUser.username === newMessage.username) {
            const lastUserMessages = lastUser.messages;
            const msg = {
                msg: newMessage.msg,
                id: newMessage.id,
            };
            if (lastUser.messages) {
                lastUserMessages.push(msg);
            } else {
                lastUser.messages = [msg];
            }
        } else {
            data.push({
                username: newMessage.username,
                img: newMessage.img,
                messages: [{
                    msg: newMessage.msg,
                    id: newMessage.id,
                }],
            });
        }
    };

    function handleConnection(
        ctx: Context,
        socket: WebSocket,
    ) {
        socket.onopen = () => {
            console.log("CONNECTED");
        };

        socket.onmessage = async (event) => {
            const data: Data = JSON.parse(event.data);
            joinRoom(socket, data.room);
            if (data.type === "message" && data.message?.msg !== "") {
                broadcastMessage(data.room, JSON.stringify(data.message));
                try {
                    const key = data.room;
                    const store = ctx.stores.get("core");
                    if (store) {
                        const exist = await store.has(key);
                        if (!exist) store.set(data.room, []);
                        const x = (await store.get(key)) as any[];
                        insertData(x, data.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };
        socket.onclose = () => console.log("DISCONNECTED");
        socket.onerror = (error) => console.error("ERROR:", error);
    }

    s.use((request, ctx) => {
        if (request.headers.get("upgrade") === "websocket") {
            const { socket, response } = Deno.upgradeWebSocket(request);
            handleConnection(ctx, socket);
            return response;
        }
    });

    s.get("/api/message/:room", async (req, ctx) => {
        const room = req.params?.room;
        if (!room) {
            return Response.json({ message: "Not found" }, {
                status: 404,
            });
        }
        const x = await ctx.stores.get("core")?.get(room);
        return Response.json(x);
    });

    return s;
}
