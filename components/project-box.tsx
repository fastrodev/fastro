import { VNode } from "preact";

export default function ProjectBox(
    props: { children: VNode[]; active?: boolean; url?: string },
) {
    const ready = props.active ? "bg-green-700 cursor-pointer" : "";

    const onClickHandler = () => {
        location.replace(props.url || "/");
    };

    return (
        <div
            onClick={onClickHandler}
            class={`p-3 border border-gray-100 rounded-xl ${ready} flex justify-center`}
        >
            <div class={`flex flex-col items-center gap-1`}>
                {props.children}
            </div>
        </div>
    );
}
