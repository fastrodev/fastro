// deno-lint-ignore-file no-explicit-any
import { ulid } from "jsr:@std/ulid/ulid";
import { useState } from "preact/hooks";

export default function MessageInput(
    props: {
        room: { id: string; name: string };
        username: string;
        avatar_url: string;
        ws_url: string;
        sendMessage: (message: string) => void;
    },
) {
    const [inputValue, setInputValue] = useState<string>("");

    const handleSendMessage = (data: any) => {
        props.sendMessage(JSON.stringify(data));
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
                room: props.room.id,
                type: "message",
                message: newMessage,
            };
            handleSendMessage(data);
            setInputValue("");
        }
    };

    const handleInputChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        setInputValue(target.value);
    };

    return (
        <div class={`flex items-center z-20`}>
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
                    type="text"
                    placeholder="Message"
                    class="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    );
}
