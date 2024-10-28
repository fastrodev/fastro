import useFetch from "@app/modules/hook/fetch.ts";
import type { RoomType } from "@app/modules/types/mod.ts";
import { Room } from "@app/modules/index/index.room.tsx";

function TemplateCollection(
    props: { title: string; checked?: boolean; disabled?: boolean },
) {
    return (
        <li
            class={`inline-flex justify-between items-start gap-1`}
        >
            <span>{props.title}</span>
            <input
                id="helper-radio-4"
                name="helper-radio"
                type="radio"
                value=""
                checked={props.checked}
                disabled={props.disabled}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
        </li>
    );
}

export function Menu(
    props: { avatar_url: string; username: string },
) {
    const { data: rooms, loading } = useFetch<RoomType[]>(
        "/api/room",
    );

    return (
        <div
            class={`hidden w-2/12 min-w-[250px] lg:flex lg:flex-col gap-5 ps-5 pb-5 pt-5`}
        >
            <div class={`flex gap-2 items-center`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-bolt"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
                </svg>

                <span>Home</span>
            </div>
            <div class={`flex gap-2 items-center`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-compass"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M8 16l2 -6l6 -2l-2 6l-6 2" />
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                    <path d="M12 3l0 2" />
                    <path d="M12 19l0 2" />
                    <path d="M3 12l2 0" />
                    <path d="M19 12l2 0" />
                </svg>

                <span>Explore</span>
            </div>
            <div class={`pl-3`}>
                {loading
                    ? <div class={`text-xs border-l-2 pl-3`}>Loading</div>
                    : (
                        <ul
                            class={`flex flex-col text-xs font-thin border-l pl-3 gap-y-3`}
                        >
                            {rooms && rooms.map((r) => {
                                return (
                                    <Room
                                        id={r.id}
                                        title={r.name + " room"}
                                    />
                                );
                            })}
                        </ul>
                    )}
            </div>

            <div class={`flex gap-2 items-center`}>
                <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill-rule="evenodd"
                        d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z"
                        clip-rule="evenodd"
                    />
                </svg>

                <span>Template Collections</span>
            </div>
            <div class={`pl-3`}>
                <ul
                    class={`flex flex-col text-xs font-thin border-l pl-3 gap-y-3`}
                >
                    <TemplateCollection
                        title="Job Template by Andrea"
                        disabled={true}
                    />
                    <TemplateCollection
                        title="Ads Template by Andrea"
                        disabled={true}
                    />
                    <TemplateCollection
                        title="Question Template by Andrea"
                        disabled={true}
                    />
                    <TemplateCollection
                        title="Slide Template by Andrea"
                        disabled={true}
                    />
                    <TemplateCollection
                        title="Polling Template by Andrea"
                        disabled={true}
                    />
                </ul>
            </div>
            <div class={`grow`}></div>
            <div class={`flex justify-between gap-2 items-center`}>
                <div class={`inline-flex gap-2 items-center`}>
                    <img
                        loading={"lazy"}
                        src={props.avatar_url}
                        width={24}
                        class={`rounded-full`}
                    />

                    <span>{props.username}</span>
                </div>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-settings-2"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
                    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                </svg>
            </div>
            <a href={"/signout"}>
                <div class={`inline-flex gap-2 items-center`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                        <path d="M9 12h12l-3 -3" />
                        <path d="M18 15l3 -3" />
                    </svg>

                    <span>Sign out</span>
                </div>
            </a>
        </div>
    );
}
