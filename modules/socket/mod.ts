// deno-lint-ignore-file
import { Context, Fastro } from "@app/mod.ts";
import { type RoomType } from "@app/modules/types/mod.ts";
import { ulid } from "jsr:@std/ulid/ulid";
import { STATUS_CODE } from "@app/core/server/deps.ts";
import { Store } from "@app/core/map/mod.ts";
import { ulidToDate } from "@app/utils/ulid.ts";
import { createCollection } from "@app/modules/store/mod.ts";

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

    function joinRoom(ctx: Context, socket: WebSocket, room: string) {
        const s = connections.get(room);
        if (s) {
            s.add(socket);
        } else {
            const s = new Set<WebSocket>();
            s.add(socket);
            connections.set(room, s);
        }
    }

    const injectData = async (ctx: Context, data: Data) => {
        let rs = ctx.stores.get(data.room);
        const d: any = { ...data };
        delete d["room"];
        const id = data.message?.id as string;
        if (!rs) {
            const store = await createCollection("rooms", data.room);
            await store.set(id, d).commit();
            ctx.stores.set(d.room, store);
            rs = store;
        }

        await rs?.set(id, d).commit();
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
            joinRoom(ctx, socket, data.room);
            if (data.type === "ping") return;
            if (data.type === "message" && data.message?.msg !== "") {
                broadcastMessage(data.room, JSON.stringify(data.message));
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
