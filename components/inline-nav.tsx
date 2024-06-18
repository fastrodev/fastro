function BoltSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      width="12px"
      height="12px"
      fill="#e8eaed"
    >
      <path d="m320-80 40-280H160l360-520h80l-40 320h240L400-80h-80Z" />
    </svg>
  );
}

function ArrowSvg() {
  return (
    <svg
      class="ml-2 w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clip-rule="evenodd"
      >
      </path>
    </svg>
  );
}

export function InlineNav(
  props: { title?: string; description?: string; destination?: string },
) {
  const title = props.title ?? "Fastro";
  const desc = props.description ?? "Home";
  const dest = props.destination ?? "/";
  return (
    <div class="inline-flex justify-between items-center p-1 pr-4 text-sm text-gray-700 bg-gray-200 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
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
        class={`text-gray-700 dark:text-white text-xs font-light flex items-center`}
        style={{ textDecoration: "none" }}
      >
        <span>{desc}</span>
        <ArrowSvg />
      </a>
    </div>
  );
}
