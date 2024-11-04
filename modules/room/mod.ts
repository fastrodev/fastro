// deno-lint-ignore-file
import { Context, Fastro } from "@app/mod.ts";
import { ulid } from "jsr:@std/ulid/ulid";
import { STATUS_CODE } from "@app/core/server/deps.ts";
import { ulidToDate } from "@app/utils/ulid.ts";
import { createCollection } from "@app/modules/store/mod.ts";
import { DAY } from "jsr:@std/datetime@^0.221.0/constants";

const initRooms = [
    { name: "startup", id: "01JBNPF4KWPD0TYS6SSSHZGY5E" },
    { name: "english", id: "01JACJFARBMNDSF1FCAH776YST" },
    { name: "health", id: "01JBNM5X3Y12692X1EDCCR3G2Z" },
    { name: "finance", id: "01JBNM75G892T2K4FN7Q10AYAZ" },
    { name: "travel", id: "01JBNM7ZRDMZTM21F6X0986YB4" },
    { name: "food", id: "01JBNM9H6TTQMF9C2JBX5CEJSY" },
    { name: "automotive", id: "01JBNMBY9PV6ZY22RZJSKXAP2B" },
    { name: "sport", id: "01JBNMDE6XR6S4WKKSZ715B913" },
    { name: "education", id: "01JBNMYGN7VSN4H49YF63TX08R" },
    { name: "trading", id: "01JBNPHEMX9GYCH0RXB1WR75VR" },
    { name: "fashion", id: "01JBNVTCRG7A5SQ61BHJZKHT2Y" },
    { name: "furniture", id: "01JBNVV1H4DM86NAJ59DBCSMNA" },
    { name: "electronic", id: "01JBNVW2H8GWWACVB6R7XYR49F" },
];

const g = [
    { name: "global", id: "01JAC4GM721KGRWZHG53SMXZP0" },
    {
        name: "jobs",
        id: "01JACBS4WXSJ1EG8G5C6NVHY7E",
    },
    { name: "news", id: "01JBNM8TFVV961WFHCDK50N7CV" },
];
const i = initRooms.sort((a, b) => {
    return a.name.localeCompare(b.name);
});
const arr = [...g, ...i];

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

export default function roomModules(s: Fastro) {
    s.get("/api/message/:room_id/:username", async (req, ctx) => {
        const r = req.params?.room_id;
        const u = req.params?.username;
        if (!r || !u) return Response.json([]);
        const room = await getMessageFromRoom(ctx, r, u);
        if (!room) return Response.json([]);
        return Response.json(room);
    });

    s.get("/api/room", async (req, ctx) => {
        const store = ctx.stores.get("rooms");
        await store?.syncMap();
        const entries = store?.entries().toArray();
        // console.log("entries", entries);
        if (!entries) return Response.json([]);
        const r: any = [];
        entries.map(([id, { value }]) => {
            r.push({ id, name: value.name });
        });
        const rooms = [...arr, ...r];
        return Response.json(rooms);
    });

    s.post("/api/room/:name", async (req, ctx) => {
        const roomStore = ctx.stores.get("rooms");
        const entries = roomStore?.entries().toArray();
        const name = req.params?.name || "";
        const found = entries?.find(([id, { value }]) => {
            return value.name === name;
        });

        const roomName = found ? `${name}-${new Date().getTime()}` : name;
        const room = { name: roomName };
        const roomId = ulid();
        await roomStore?.set(roomId, room, DAY).commit();
        return Response.json({
            message: `Room created`,
            room: { name: roomName, id: roomId },
        }, {
            status: STATUS_CODE.Created,
        });
    });

    s.get("/api/room/:id", async (req, ctx) => {
        const target = req.params?.id;
        if (!target) return Response.json([]);

        const store = ctx.stores.get("rooms");
        const entries = store?.entries().toArray();
        if (!entries) return Response.json([]);
        const r: any = [];
        entries.map(([id, { value }]) => r.push({ id, name: value.name }));

        const rooms = [...arr, ...r];
        const room = rooms.find((v) => v.id.toString() === target);
        if (!room) return Response.json([]);
        return Response.json(room);
    });

    return s;
}
