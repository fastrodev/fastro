export function Footer() {
  return (
    <div
      class={`container max-w-4xl mx-auto text-center text-xs font-extralight py-3 px-6 dark:text-gray-400 border-t  dark:border-gray-700`}
    >
      Fastro Framework is{" "}
      <a
        href={`https://github.com/fastrodev/fastro`}
        class={`text-blue-600 dark:text-blue-500 hover:underline`}
      >
        free and open source.
      </a>{" "}
      Requests per second (RPS) for each use case is monitored daily through
      {"  "}
      <a
        href={`/docs/benchmarks`}
        class={`text-blue-600 dark:text-blue-500 hover:underline`}
      >
        internal benchmarks.
      </a>{"  "}
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
