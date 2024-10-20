// deno-lint-ignore-file
import { Context, Fastro } from "@app/mod.ts";
import { NOT_FOUND } from "@app/modules/types/mod.ts";

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

const initRooms = [
    { name: "global", id: "01JAC4GM721KGRWZHG53SMXZP0" },
    { name: "smooking", id: "01JACJJ3CN1ZAYXDMQHC4CB2SQ" },
    { name: "jobs", id: "01JACJFARBMNDSF1FCAH776YST" },
    { name: "training", id: "01JACFZ32G13BHA2QZZYQ4KJEK" },
    { name: "remote", id: "01JACBS4WXSJ1EG8G5C6NVHY7E" },
];

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
        console.log("room join==>", room);
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
        const ws = request.headers.get("upgrade");
        if (ws && ws === "websocket") {
            const { socket, response } = Deno.upgradeWebSocket(request);
            handleConnection(ctx, socket);
            return response;
        }
    });

    s.get("/api/message/:room_id", async (req, ctx) => {
        const r = req.params?.room_id;
        if (!r) return NOT_FOUND;
        const room = await ctx.stores.get("core")?.get(r);
        if (!room) return NOT_FOUND;
        return Response.json(room);
    });

    s.get("/api/room", (req, ctx) => {
        return Response.json(initRooms);
    });

    s.get("/api/room/:id", (req, ctx) => {
        const target = req.params?.id;
        if (!target) return NOT_FOUND;
        const room = initRooms.find((v) => v.id.toString() === target);
        if (!room) return NOT_FOUND;
        return Response.json(room);
    });

    return s;
}
