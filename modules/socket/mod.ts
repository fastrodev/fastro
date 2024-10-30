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

type Arr = {
    type: string;
    username: string;
    img: string;
    messages: {
        msg: any;
        time: string;
        id: string | number | symbol;
    }[];
};

async function getMessageFromRoom(
    ctx: Context,
    room: string,
    username: string,
) {
    let store = ctx.stores.get(room);
    if (!store) {
        store = await createCollection("rooms", room);
        ctx.stores.set(room, store);
    }
    const entries = store?.entries().toArray();

    const o = entries.map(([id, { value }]) => ({
        type: value.type,
        username: value.message.username,
        img: value.message.img,
        messages: [{
            msg: value.message.msg,
            time: ulidToDate(id as string),
            id,
        }],
    }));
    const y: Arr[] = [];
    const updatedData = [...o];
    for (const e of updatedData) {
        const l = y[y.length - 1];
        if (l && l.username === e.username) {
            l.messages.push(e.messages[0]);
        } else {
            y.push(e);
        }
    }

    return y;
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

    function joinRoom(ctx: Context, socket: WebSocket, room: string) {
        if (!connections.has(room)) connections.set(room, new Set<WebSocket>());
        connections.get(room)?.add(socket);
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
            await injectData(ctx, data);
            if (data.type === "message" && data.message?.msg !== "") {
                broadcastMessage(data.room, JSON.stringify(data.message));
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

    return s;
}
