import { Main } from "@app/modules/index/index.main.tsx";
import { Navigation } from "@app/modules/index/index.navigation.tsx";
import { Menu } from "@app/modules/index/index.menu.tsx";

export default function Launchpad(
    props: { avatar_url: string; username: string; ws_url: string },
) {
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
