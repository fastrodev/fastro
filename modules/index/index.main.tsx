import { useEffect, useRef, useState } from "preact/hooks";
import { Message } from "@app/modules/index/index.message.tsx";

const data = [
    {
        username: "github-actions",
        img: "https://avatars.githubusercontent.com/in/15368?v=4",
        messages: [
            { msg: "Hello world", time: "2024-10-12T15:30:00Z" },
            {
                msg: "What is your name? Where is your address? How old are you?",
                time: "2024-10-12T15:30:00Z",
            },
        ],
    },
    {
        username: "ynwd",
        img: "https://avatars.githubusercontent.com/u/10122431?v=4",
        messages: [
            { msg: "Hello world", time: "2024-10-12T15:31:00Z" },
            {
                msg: "My name is ynwd. I'm come from indonesia. I'm 10 years old. a second-grade student. I'm a gamer. I like kebab",
                time: "2024-10-12T15:31:00Z",
            },
        ],
    },
];

function formatTime(isoDateString: string): string {
    const date = new Date(isoDateString);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${hours}:${formattedMinutes} ${ampm}`;
}

export function Main() {
    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, []);

    return (
        <div class="relative grow max-w-8/12 flex flex-col justify-end bg-gray-950 border-t border-l border-r border-gray-700">
            <div ref={listRef} class={`overflow-auto pt-3 mb-20`}>
                <ul class={`flex flex-col justify-end gap-y-2`}>
                    {data.map((item, index) => {
                        return (
                            <ul
                                class={`px-4 text-sm flex flex-col justify-end gap-y-1`}
                                key={index}
                            >
                                {item.messages.map((d, x) => {
                                    const idx = x;
                                    return (
                                        <Message
                                            idx={idx}
                                            msg={d.msg}
                                            time={formatTime(d.time)}
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
                <div class="relative">
                    <input
                        type="search"
                        id="search"
                        class="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Text your message here"
                        required
                    />
                    <button
                        type="submit"
                        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
