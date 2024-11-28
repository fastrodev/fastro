import { Room } from "@app/modules/index/index.room.tsx";
import { AppContext } from "@app/modules/index/index.context.ts";
import { useContext } from "preact/hooks";

export function Discover() {
  const state = useContext(AppContext);
  return (
    <div class={`flex flex-col gap-y-1`}>
      <div class={`flex gap-2 items-center`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-brand-safari"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M8 16l2 -6l6 -2l-2 6l-6 2" />
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        </svg>

        <span>Discover</span>
      </div>
      <div class={`overflow-y-auto pl-3 pb-3 pt-3 h-64`}>
        <ul
          class={`flex flex-col text-xs font-thin border-l border-gray-800 pl-3 gap-y-3`}
        >
          {state.rooms.value && state.rooms.value.map((r) => {
            return (
              <Room
                id={r.id}
                title={r.name + " room"}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
