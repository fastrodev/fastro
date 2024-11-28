import { Discover } from "@app/modules/index/index.discover.tsx";
import { Chat } from "@app/modules/index/index.chat.tsx";
import { Setting } from "@app/modules/index/index.profile.tsx";
import { Signout } from "@app/modules/index/index.signout.tsx";

export function Menu(
  props: { avatar_url: string; username: string },
) {
  return (
    <div
      class={`hidden w-2/12 lg:flex lg:flex-col gap-y-5 pb-5 ps-5 pt-5`}
    >
      <Discover />
      <Chat />
      <div class={`grow`}></div>
      <Setting username={props.username} avatar_url={props.avatar_url} />
      <Signout />
    </div>
  );
}
