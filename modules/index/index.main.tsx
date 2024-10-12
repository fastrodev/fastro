import { useEffect, useRef, useState } from "preact/hooks";
import { Message } from "@app/modules/index/index.message.tsx";
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

function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function daysInYear(year: number): number {
    return isLeapYear(year) ? 366 : 365;
}

function formatTime(isoDateString: string): string {
    const date = new Date(isoDateString);
    const now = new Date();

    let diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    // Define time units in seconds
    const units = [
        { value: 60, unit: "second" }, // 60 seconds in a minute
        { value: 3600, unit: "minute" }, // 3600 seconds in an hour
        { value: 86400, unit: "hour" }, // 86400 seconds in a day
        { value: 604800, unit: "day" }, // 604800 seconds in a week
        { value: 2629746, unit: "month" }, // Average seconds in a month (30.44 days)
        { value: 31536000, unit: "year" }, // Non-leap year seconds in a year
    ];

    // Adjust for leap years
    const currentYear = now.getFullYear();
    const totalDaysInYear = daysInYear(currentYear);
    const secondsInYear = totalDaysInYear * 86400; // Total seconds in the year

    for (const { value, unit } of units) {
        const absDiff = Math.abs(diffInSeconds);
        if (absDiff < value) {
            const relativeValue = Math.round(
                diffInSeconds / (value / (unit === "second" ? 1 : 60)),
            );
            return rtf.format(
                relativeValue,
                unit as Intl.RelativeTimeFormatUnit,
            );
        }
        diffInSeconds /= value; // Reduce diffInSeconds for the next unit
    }

    // Handle years, considering leap years
    const years = Math.round(diffInSeconds * secondsInYear / (365 * 86400));
    return rtf.format(years, "year" as Intl.RelativeTimeFormatUnit);
}

export function Main(props: { avatar_url: string; username: string }) {
    const [data, setData] = useState<User[]>(initialData);
    const [inputValue, setInputValue] = useState<string>("");

    const handleInputChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        setInputValue(target.value);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            // Shallow copy data
            const updatedData = [...data];
            // init new message
            const newMessage = {
                msg: inputValue,
                time: new Date().toISOString(),
            };
            // get the latest user
            const lastUser = updatedData[updatedData.length - 1];
            if (lastUser.username === props.username) {
                const lastUserMessages = lastUser.messages;
                lastUserMessages.push(newMessage);
            } else {
                updatedData.push({
                    username: props.username,
                    img: props.avatar_url,
                    messages: [newMessage],
                });
            }

            setData(updatedData);
            setInputValue("");
        }
    };

    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [data]);

    return (
        <div class="relative h-screen max-w-8/12 flex flex-col justify-end bg-gray-950 border-t border-l border-r border-gray-700">
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
                        value={inputValue}
                        onInput={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message and press Enter"
                        class="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                    <button class="text-white absolute end-2.5 bottom-[0.4rem] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
