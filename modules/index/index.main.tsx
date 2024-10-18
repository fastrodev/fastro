// deno-lint-ignore-file no-explicit-any
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { Message } from "@app/modules/index/index.message.tsx";
import useWebSocket from "@app/modules/hook/socket.ts";
import { ulid } from "jsr:@std/ulid/ulid";
import { formatTime, ulidToDate } from "@app/utils/ulid.ts";
import useFetch from "@app/modules/hook/fetch.ts";
import type { RoomType, User } from "@app/modules/types/mod.ts";
import { initialData } from "@app/modules/socket/init.ts";
import { AppContext } from "@app/modules/index/index.context.ts";
import { effect } from "https://esm.sh/@preact/signals@1.3.0";

export function Main(
    props: { avatar_url: string; username: string; ws_url: string },
) {
    const state = useContext(AppContext);
    const { data: d } = useFetch<User[]>(
        "http://localhost:8000/api/message/global",
    );
    const [data, setData] = useState<User[]>(d as any);
    const [room, setRoom] = useState<RoomType>({
        name: "global",
        id: "1",
    });
    const [inputValue, setInputValue] = useState<string>("");
    const { message, sendMessage } = useWebSocket(props.ws_url);

    const handleSendMessage = (data: any) => {
        sendMessage(JSON.stringify(data));
    };

    const handleInputChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        setInputValue(target.value);
    };

    const insertData = (newMessage: {
        msg: string;
        username: string;
        id: string;
    }) => {
        const updatedData = [...data];
        const lastUser = updatedData[updatedData.length - 1];
        const time = ulidToDate(newMessage.id);
        const msg = {
            msg: newMessage.msg,
            id: newMessage.id,
            time,
        };

        if (lastUser.username === newMessage.username) {
            const lastUserMessages = lastUser.messages;
            lastUserMessages.push(msg);
        } else {
            updatedData.push({
                username: newMessage.username,
                img: props.avatar_url,
                messages: [msg],
            });
        }

        setData(updatedData);
        setInputValue("");
    };

    const handleClick = () => {
        // const newMessage = {
        //     msg: inputValue,
        //     time: new Date().toISOString(),
        // };
        // handleSendMessage(newMessage);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            const newMessage = {
                username: props.username,
                img: props.avatar_url,
                msg: inputValue,
                id: ulid(),
            };
            const data = {
                room: room.name,
                type: "message",
                message: newMessage,
            };
            handleSendMessage(data);
        }
    };

    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [data]);

    useEffect(() => {
        if (message) {
            insertData(JSON.parse(message));
        }
    }, [message]);

    useEffect(() => {
        if (d) {
            const dd = [...initialData, ...d];
            const ddd = dd.map((v) => {
                const msg = v.messages.map((m) => {
                    m.id = ulidToDate(m.id);
                    return m;
                });
                v.messages = msg;
                return v;
            });
            setData(ddd);
        }
    }, [d, initialData]);

    effect(() => {
        const c = state.room.value;
        setRoom(c);
        return () => console.log(`cleanup ${c.id}`);
    });

    // useEffect(() => {
    //     console.log("room", room);
    // }, [room]);

    return (
        <div class="relative grow h-screen max-w-8/12 flex flex-col justify-end bg-gray-950 border-t border-l border-r border-gray-700">
            <div ref={listRef} class={`overflow-auto pt-3 mb-20`}>
                <ul class={`flex flex-col justify-end gap-y-2`}>
                    {data && data.map((item, index) => {
                        return (
                            <ul
                                class={`px-4 text-sm flex flex-col justify-end gap-y-2`}
                                key={index}
                            >
                                {item.messages.map((d, x) => {
                                    const idx = x;
                                    return (
                                        <Message
                                            id={d.id}
                                            idx={idx}
                                            msg={d.msg}
                                            time={formatTime(d.id)}
                                            username={item.username}
                                            img={item.img}
                                        />
                                    );
                                })}
                            </ul>
                        );
                    })}
                </ul>
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-3">
                <div class={`flex items-center`}>
                    <div class={`w-12 min-w-12 block`}>
                        <img
                            src={props.avatar_url}
                            width={32}
                            class={`rounded-full`}
                            loading={"lazy"}
                        />
                    </div>
                    <div class="relative grow">
                        <input
                            autocomplete="off"
                            value={inputValue}
                            onInput={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message and press Enter"
                            class="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                        <button
                            onClick={handleClick}
                            class="hidden text-white absolute end-2.5 bottom-[0.4rem] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <svg
                                class="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
