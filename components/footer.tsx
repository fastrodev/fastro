export function Footer() {
  return (
    <div
      class={`container max-w-4xl mx-auto text-center text-xs font-extralight py-3 dark:text-gray-400 border-t  dark:border-gray-700`}
    >
      Fastro Web Framework. Powered by{" "}
      <a href={`https://deno.com/deploy`}>Deno Deploy.</a>
    </div>
  );
}
