import { JSX } from "preact/jsx-runtime";
import { useContext, useState } from "preact/hooks";
import { AppContext } from "@app/modules/index/index.context.ts";
import useFetch from "@app/modules/hook/fetch.ts";

export function Room(
    props: { title: string; id: string; checked?: boolean; disabled?: boolean },
) {
    const [selected, setSelected] = useState<string>(
        "01JAC4GM721KGRWZHG53SMXZP0",
    );
    const state = useContext(AppContext);
    const { data } = useFetch(`/api/room/${props.id}`);

    const handleChange = (
        e: JSX.TargetedEvent<HTMLInputElement, InputEvent>,
    ) => {
        const target = e.target as HTMLInputElement;
        setSelected(target.value);
        state.room.value = data as {
            name: string;
            id: string;
        };
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
                checked={selected === props.id}
                disabled={props.disabled}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
        </li>
    );
}
