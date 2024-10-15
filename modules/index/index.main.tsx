// deno-lint-ignore-file no-explicit-any
import { useEffect, useRef, useState } from "preact/hooks";
import { Message } from "@app/modules/index/index.message.tsx";
import useWebSocket from "@app/modules/socket/socket.ts";

const initialData: User[] = [
    {
        username: "github-actions",
        img: "https://avatars.githubusercontent.com/in/15368?v=4",
        messages: [
            { msg: "Hello world", time: "2024-10-01T15:30:00Z" },
            {
                msg: "What is your name? Where is your address? How old are you?",
                time: "2024-10-01T15:30:00Z",
            },
        ],
    },
    {
        username: "mike",
        img: "https://avatars.githubusercontent.com/u/157196041?v=4",
        messages: [
            { msg: "Hello world", time: "2024-10-02T15:31:00Z" },
            {
                msg: "My name is mike",
                time: "2024-10-02T15:31:00Z",
            },
        ],
    },
    {
        username: "john",
        img: "https://avatars.githubusercontent.com/u/65916846?v=4",
        messages: [
            { msg: "Hello world", time: "2024-10-11T15:31:00Z" },
            {
                msg: "My name is john",
                time: "2024-10-11T15:31:00Z",
            },
        ],
    },
    {
        username: "agus",
        img: "https://avatars.githubusercontent.com/u/218257?v=4",
        messages: [
            { msg: "Hello world", time: "2024-10-12T15:31:00Z" },
            {
                msg: "My name is agus. I'm come from indonesia. I'm 10 years old. a second-grade student. I'm a gamer. I like kebab",
                time: "2024-10-12T15:31:00Z",
            },
        ],
    },
];

interface MessageType {
    msg: string;
    time: string;
}

interface User {
    username: string;
    img: string;
    messages: MessageType[];
}

function formatTime(isoDateString: string): string {
    const date = new Date(isoDateString);
    const now = new Date();

    // Get local date components
    const localYear = date.getFullYear();
    const localMonth = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const localDay = String(date.getDate()).padStart(2, "0");
    const localHours = date.getHours();
    const localMinutes = String(date.getMinutes()).padStart(2, "0");

    // Check if the date is now
    if (
        date.toDateString() === now.toDateString() &&
        date.getTime() === now.getTime()
    ) {
        const formattedHours = localHours % 12 || 12; // Convert to 12-hour format
        const amPm = localHours < 12 ? "AM" : "PM";
        return `— Now at ${formattedHours}:${localMinutes} ${amPm}`;
    }

    // Format hours for 12-hour clock
    const formattedHours = localHours % 12 || 12; // Convert to 12-hour format
    const amPm = localHours < 12 ? "AM" : "PM";

    // Construct the desired format
    return `— ${localMonth}/${localDay}/${localYear} ${formattedHours}:${localMinutes} ${amPm}`;
}

// ws_url ws://localhost:8000
export function Main(
    props: { avatar_url: string; username: string; ws_url: string },
) {
    const [data, setData] = useState<User[]>(initialData);
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
        time: string;
        username: string;
    }) => {
        const updatedData = [...data];
        const lastUser = updatedData[updatedData.length - 1];
        if (lastUser.username === newMessage.username) {
            const lastUserMessages = lastUser.messages;
            lastUserMessages.push({
                msg: newMessage.msg,
                time: newMessage.time,
            });
        } else {
            updatedData.push({
                username: newMessage.username,
                img: props.avatar_url,
                messages: [{
                    msg: newMessage.msg,
                    time: newMessage.time,
                }],
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
                msg: inputValue,
                time: new Date().toISOString(),
            };
            const data = {
                type: "message",
                room: "global",
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

    return (
        <div class="relative h-screen max-w-8/12 flex flex-col justify-end bg-gray-950 border-t border-l border-r border-gray-700">
            <div ref={listRef} class={`overflow-auto pt-3 mb-20`}>
                <ul class={`flex flex-col justify-end gap-y-2`}>
                    {data.map((item, index) => {
                        return (
                            <ul
                                class={`px-4 text-sm flex flex-col justify-end gap-y-2`}
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
                        value={inputValue}
                        onInput={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message and press Enter"
                        class="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                    <button
                        onClick={handleClick}
                        class="text-white absolute end-2.5 bottom-[0.4rem] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
    );
}
