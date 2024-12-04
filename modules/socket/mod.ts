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
  user: string;
  message?: Message;
}

export default function socketModule(s: Fastro) {
  function broadcastMessage(ctx: Context, room: string, message: string) {
    const c = ctx.stores.get("connected");
    if (!c) return;
    const entries = c.entries().toArray();
    console.log("broadcastMessage:", JSON.stringify(entries));
    if (entries) {
      for (const key in entries) {
        const [, { value: { socket } }] = entries[key];
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(message);
        }
      }
    }
  }

  async function broadcastConnection(ctx: Context, data: Data) {
    const c = ctx.stores.get("connected");
    if (!c) return;
    const entries = c.entries().toArray();
    // console.log("entries", JSON.stringify(entries));
    const connected = Array.from(entries).map(([, { value }]) => ({
      username: value.data.username,
      room: value.data.room,
      avatar_url: value.data.avatar_url,
    }));

    for (const key in entries) {
      const [, { value: { socket } }] = entries[key];
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(connected));
      }
    }
  }

  async function joinRoom(
    ctx: Context,
    socket: WebSocket,
    data: Data,
  ) {
    const connected = ctx.stores.get("connected");
    // console.log("connected", connected);
    if (data.user) {
      connected?.set(data.user, { data, socket });
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
      ctx.stores.set(data.room, store);
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
      await joinRoom(ctx, socket, data);
      if (data.type === "ping") {
        return await broadcastConnection(ctx, data);
      }
      if (data.type === "message" && data.message?.msg !== "") {
        broadcastMessage(
          ctx,
          data.room,
          JSON.stringify(data.message),
        );
        return await injectData(ctx, data);
      }
    };
    socket.onclose = async () => {
      const c = ctx.stores.get("connected");
      if (!c) return;
      const entries = c.entries().toArray();
      for (const key in entries) {
        const [username, { value: { socket, data } }] = entries[key];
        if (socket && socket.readyState !== WebSocket.OPEN) {
          c.delete(username);
          await broadcastConnection(ctx, {
            type: "ping",
            room: data.room,
            user: data.user,
          });
        }
      }
      console.log("DISCONNECTED");
    };

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
