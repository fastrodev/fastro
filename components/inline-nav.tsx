export function InlineNav(
  props: { title?: string; description?: string; destination?: string },
) {
  const title = props.title ?? "Fastro";
  const desc = props.description ?? "Home";
  const dest = props.destination ?? "/";
  return (
    <div class="inline-flex justify-between items-center py-1 px-1 pr-4 mb-5 text-sm text-gray-700 bg-gray-200 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
      <a
        href="/"
        class={`text-white mb-0.5`}
        style={{ textDecoration: "none" }}
      >
        <span class="text-xs bg-primary-600 rounded-full text-white px-4 py-1 mr-3">
          {title}
        </span>
      </a>
      <a
        href={dest}
        class={`text-gray-700 dark:text-white`}
        style={{ textDecoration: "none" }}
      >
        <span class="text-xs font-light">
          {desc}
        </span>
      </a>

      <svg
        class="ml-2 w-5 h-5"
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
    </div>
  );
}
