// deno-lint-ignore-file no-explicit-any
import { useState } from "preact/hooks";

export function Message(
  props: {
    id: string;
    username: string;
    msg: string;
    time: string;
    img: string;
    idx: number;
  },
) {
  const [show, setShow] = useState<any>(false);

  function handleClick(id: string) {
    setShow(!show);
  }

  function handleForward(id: string): void {
    throw new Error("Function not implemented.");
  }

  function handleDelete(id: string): void {
    throw new Error("Function not implemented.");
  }

  function handlePin(id: string): void {
    throw new Error("Function not implemented.");
  }

  function handleReplyPrivately(id: string): void {
    throw new Error("Function not implemented.");
  }

  function handleReply(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <li
      key={props.idx}
      class={`rounded-lg flex gap-3`}
    >
      {props.idx === 0
        ? (
          <div class={`min-w-8`}>
            <img
              src={props.img}
              width={32}
              class={`rounded-full`}
              loading={"lazy"}
            />
          </div>
        )
        : <div class={`w-8 min-w-8 block`}></div>}

      <div
        class={`relative bg-gray-900 ps-3 pt-2 pe-3 pb-2 border border-gray-800 flex flex-col gap-1 rounded-lg`}
      >
        <div
          class={`select-none flex items-center justify-between gap-3 text-gray-500 font-light text-xs`}
        >
          <div class={`inline-flex items-center gap-x-1`}>
            <span class={"grow"}>
              {props.username}
            </span>
            <span class={"grow"}>
              {props.time}
            </span>
          </div>
          <svg
            class="w-4 h-4 cursor-pointer"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="none"
            viewBox="0 0 24 24"
            onClick={(e) => {
              e.preventDefault();
              handleClick(props.id);
            }}
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="m19 9-7 7-7-7"
            />
          </svg>
        </div>
        <span>
          {props.msg}
        </span>
        <div
          class={`absolute ${
            show ? "" : "hidden"
          } select-none flex flex-col justify-end text-xs mt-6 right-[-4rem] w-10/12 z-10 bg-black border-t border-r border-l border-b rounded-md`}
        >
          <div
            class={`border-b p-3 cursor-pointer`}
            onClick={() => handleReply(props.id)}
          >
            Reply
          </div>
          <div
            class={`border-b p-3 cursor-pointer`}
            onClick={() => handleReplyPrivately(props.id)}
          >
            Reply Privately
          </div>
          <div
            class={`border-b p-3 cursor-pointer`}
            onClick={() => handlePin(props.id)}
          >
            Pin
          </div>
          <div
            class={`border-b p-3 cursor-pointer`}
            onClick={() => handleDelete(props.id)}
          >
            Delete
          </div>
          <div
            class={`p-3 cursor-pointer`}
            onClick={() => handleForward(props.id)}
          >
            Forward
          </div>
        </div>
      </div>
    </li>
  );
}
