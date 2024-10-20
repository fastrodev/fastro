import { Fastro } from "@app/mod.ts";
import { Store } from "@app/core/map/mod.ts";
import { NOT_FOUND } from "@app/modules/types/mod.ts";

const initRooms = [
    { name: "global", id: "01JAC4GM721KGRWZHG53SMXZP0" },
    { name: "smooking", id: "01JACJJ3CN1ZAYXDMQHC4CB2SQ" },
    { name: "jobs", id: "01JACJFARBMNDSF1FCAH776YST" },
    { name: "training", id: "01JACFZ32G13BHA2QZZYQ4KJEK" },
    { name: "remote", id: "01JACBS4WXSJ1EG8G5C6NVHY7E" },
];

export default function roomModule(s: Fastro) {
    s.post("/api/v2/room/:id", (req, ctx) => {
        const roomId = req.params?.id;
        if (!roomId) return NOT_FOUND;

        // init room collection
        const roomStore = new Store({
            repo: "store",
            owner: "fastrodev",
            path: `modules/${roomId}/records.json`,
            token: Deno.env.get("GITHUB_TOKEN"),
        });

        // set room collections
        ctx.stores.set(roomId, roomStore);
        // ctx.server.stores.get("core")?.set("room", roomId);
    });

    s.get("/api/v2/room/:id", (req, ctx) => {
        const roomId = req.params?.id;
        if (!roomId) return NOT_FOUND;

        // get room collections
        const roomStore = ctx.stores.get(roomId);

        if (!roomStore) {
            // TODO create
        }

        return Response.json(roomStore);
    });

    s.get("/api/v2/room", (req, ctx) => {
        return Response.json(initRooms);
    });
}
