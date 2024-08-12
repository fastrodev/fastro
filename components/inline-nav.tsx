import BoltSvg from "./icons/bolt.tsx";
import ArrowSvg from "@app/components/icons/arrow-svg.tsx";

export function InlineNav(
  props: { title?: string; description?: string; destination?: string },
) {
  const title = props.title ?? "Fastro";
  const desc = props.description ?? "Home";
  const dest = props.destination ?? "/";
  return (
    <div class="inline-flex justify-between items-center p-1 pr-4 text-sm rounded-full text-white bg-gray-700">
      <a
        href="/"
        class={`text-white`}
        style={{ textDecoration: "none" }}
      >
        <div class="flex items-center gap-1 text-xs bg-primary-600 rounded-full text-white px-3 py-1 mr-3 ">
          <BoltSvg />
          <span>{title}</span>
        </div>
      </a>
      <a
        href={dest}
        class={`text-white text-xs font-light flex items-center`}
        style={{ textDecoration: "none" }}
      >
        <span>{desc}</span>
        <ArrowSvg />
      </a>
    </div>
  );
}
