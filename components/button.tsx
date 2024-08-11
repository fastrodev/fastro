import type { ComponentChildren } from "https://esm.sh/preact@10.23.1";

export default function Button(props: { children: ComponentChildren }) {
    return (
        <div
            class={`inline-flex items-center px-2 py-1 text-sm font-medium text-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-900 border border-white rounded-lg cursor-pointer`}
        >
            {props.children}
        </div>
    );
}
