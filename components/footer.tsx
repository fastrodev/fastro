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
      Powered by{" "}
      <a
        href={`https://deno.com/deploy`}
        class={`text-blue-600 dark:text-blue-500 hover:underline`}
      >
        Deno Deploy.
      </a>
    </div>
  );
}
