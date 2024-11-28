import type { ComponentChildren } from "preact";

export default function Button(props: { children: ComponentChildren }) {
  return (
    <button
      type="button"
      class="block text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"
    >
      {props.children}
    </button>
  );
}
