import { JSX } from "preact/jsx-runtime";
import { useContext, useState } from "preact/hooks";
import { AppContext } from "@app/modules/index/index.context.ts";

const initRooms = [
    { name: "global", id: "1" },
    { name: "smooking", id: "01JACJJ3CN1ZAYXDMQHC4CB2SQ" },
    { name: "jobs", id: "01JACJFARBMNDSF1FCAH776YST" },
    { name: "Tranning", id: "01JACFZ32G13BHA2QZZYQ4KJEK" },
    { name: "remote", id: "01JACBS4WXSJ1EG8G5C6NVHY7E" },
];

export function Room(
    props: { title: string; id: string; checked?: boolean; disabled?: boolean },
) {
    const [selectedMethod, setSelectedMethod] = useState<string>("");
    const state = useContext(AppContext);

    const handleChange = (
        e: JSX.TargetedEvent<HTMLInputElement, InputEvent>,
    ) => {
        const target = e.target as HTMLInputElement;
        setSelectedMethod(target.value);
        const [r] = initRooms.filter((v) => {
            return v.id === target.value;
        });
        state.room.value = r;
    };

    return (
        <li
            key={props.id}
            class={`inline-flex justify-between items-start gap-1`}
        >
            <span class={`capitalize`}>{props.title}</span>
            <input
                id={props.id}
                name="room"
                type="radio"
                value={props.id}
                onInput={(e) =>
                    handleChange(
                        e as JSX.TargetedEvent<
                            HTMLInputElement,
                            InputEvent
                        >,
                    )}
                checked={selectedMethod === props.id}
                disabled={props.disabled}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
        </li>
    );
}
