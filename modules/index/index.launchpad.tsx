import { Main } from "@app/modules/index/index.main.tsx";
import { Navigation } from "@app/modules/index/index.navigation.tsx";
import { Menu } from "@app/modules/index/index.menu.tsx";
import useFetch from "@app/modules/hook/fetch.ts";
import { DataType, RoomType } from "@app/modules/types/mod.ts";
import { useContext } from "preact/hooks";
import { effect } from "https://esm.sh/@preact/signals@1.3.0";
import { AppContext } from "@app/modules/index/index.context.ts";

function Loader(props: { text: string }) {
  return (
    <div
      class={`max-w-screen-2xl mx-auto h-screen w-full flex flex-col justify-center text-center bg-gray-900`}
    >
      {props.text}
    </div>
  );
}

export default function Launchpad(
  props: { avatar_url: string; username: string; ws_url: string },
) {
  const state = useContext(AppContext);
  const { data: rooms, loading: loadRoom } = useFetch<RoomType[]>(
    "/api/room",
  );

  const url = `api/message/${state.room.value.id}/${props.username}`;
  const { data: messages, loading: loadMessage, error } = useFetch<
    DataType[]
  >(url);

  effect(() => {
    state.rooms.value = rooms;
    state.messages.value = messages;
    return () => {
      state.rooms.value = null;
      state.messages.value = null;
    };
  });

  if (error) {
    return <Loader text="Error"></Loader>;
  }

  if (loadRoom || loadMessage) {
    return <Loader text="Loading"></Loader>;
  }

  return (
    <div
      class={`container flex gap-x-3 max-w-screen-2xl bg-gray-900 mx-auto`}
    >
      <Menu
        avatar_url={props.avatar_url}
        username={props.username}
      />
      <Main
        avatar_url={props.avatar_url}
        username={props.username}
        ws_url={props.ws_url}
      />
      <Navigation />
    </div>
  );
}
