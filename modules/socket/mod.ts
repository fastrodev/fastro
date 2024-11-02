// deno-lint-ignore-file
import { Context, Fastro } from "@app/mod.ts";
import { createCollection } from "@app/modules/store/mod.ts";
import { DAY } from "jsr:@std/datetime@^0.221.0/constants";

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
    function broadcastMessage(connections: any, room: string, message: string) {
        const sockets = connections.get(room);
        if (sockets) {
            console.log("size", sockets.size);
            for (const client of sockets) {
                if (client.readyState !== WebSocket.OPEN) {
                    client.close(1000, "Normal Closure");
                    sockets.delete(client);
                }
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            }
            console.log("size", sockets.size);
        }
    }

    async function joinRoom(ctx: Context, socket: WebSocket, room: string) {
        if (socket.readyState == WebSocket.OPEN) {
            const connections = await ctx.stores.get("core")?.get(
                "connections",
            );
            if (!connections.has(room)) {
                connections.set(room, new Set<WebSocket>());
            }
            connections.get(room)?.add(socket);
        }
    }

    const injectData = async (ctx: Context, data: Data) => {
        let rs = ctx.stores.get(data.room);
        const d: any = { ...data };
        delete d["room"];
        const id = data.message?.id as string;
        if (!rs) {
            const store = await createCollection("rooms", data.room);
            await store.set(id, d, DAY).commit();
            ctx.stores.set(d.room, store);
            rs = store;
        }

        await rs?.set(id, d, DAY).commit();
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
            await joinRoom(ctx, socket, data.room);
            console.log(event.data);
            if (data.type === "ping") return;
            if (data.type === "message" && data.message?.msg !== "") {
                const c = await ctx.stores.get("core")?.get("connections");
                broadcastMessage(c, data.room, JSON.stringify(data.message));
            }
            await injectData(ctx, data);
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

    return s;
}
