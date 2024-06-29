function HeartSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon icon-tabler icons-tabler-outline icon-tabler-heart"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
    </svg>
  );
}

export function Footer() {
  return (
    <div
      class={`container max-w-4xl mx-auto text-center text-xs py-3 px-6 dark:text-gray-400 border-t-[1px] border-t-gray-800`}
    >
      Fastro Framework is{" "}
      <a
        href={`https://github.com/fastrodev/fastro`}
        class={`text-blue-600 dark:text-blue-500 hover:underline`}
      >
        free and open source
      </a>
      {" full stack web framework for Deno, TypeScript, Preact, and Tailwind. "}
      <div class={`inline-flex gap-1 items-center`}>
        <p>Made in Tulungagung with</p> <HeartSvg />
      </div>
    </div>
  );
}
