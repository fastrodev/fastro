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
                class={`bg-gray-900 ps-3 pt-2 pe-3 pb-2 border border-gray-800 rounded-lg flex flex-col gap-1`}
            >
                <div
                    class={`flex items-center justify-between gap-3 text-gray-500 font-light text-xs`}
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
                        class="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 24 24"
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
            </div>
        </li>
    );
}
