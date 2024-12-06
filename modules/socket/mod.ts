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
  const connected = new Map<string, any>();

  function broadcastMessage(message: string) {
    const entries = connected.entries().toArray();
    for (const key in entries) {
      const [, { socket }] = entries[key];
      if (socket.readyState === WebSocket.OPEN) {
        console.log("s.getNonce:", s.getNonce());
        socket.send(message);
      } else {
        socket.close();
      }
    }
  }

  async function broadcastConnection(
    data: Data,
    socket: WebSocket,
  ) {
    connected.set(data.user, { data, socket });
    const entries = connected.entries().toArray();
    const cc = Array.from(entries).map(([, { data }]) => ({
      username: data.username,
      room: data.room,
      avatar_url: data.avatar_url,
    }));

    for (const key in entries) {
      const [, { socket }] = entries[key];
      if (socket.readyState === WebSocket.OPEN) {
        console.log("s.getNonce:", s.getNonce());
        socket.send(JSON.stringify(cc));
      } else {
        socket.close();
      }
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
      if (socket.readyState !== WebSocket.OPEN) {
        console.log("socket.readyState", socket.readyState);
        return;
      }
      const data: Data = JSON.parse(event.data);
      if (data.type === "ping") {
        return await broadcastConnection(data, socket);
      }
      if (data.type === "message" && data.message?.msg !== "") {
        broadcastMessage(JSON.stringify(data.message));
        return await injectData(ctx, data);
      }
    };
    socket.onclose = async () => {
      const entries = connected.entries().toArray();
      for (const key in entries) {
        const [username, { value: { socket, data } }] = entries[key];
        if (socket && socket.readyState !== WebSocket.OPEN) {
          connected.delete(username);
          await broadcastConnection({
            type: "ping",
            room: data.room,
            user: data.user,
          }, socket);
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
