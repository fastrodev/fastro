// deno-lint-ignore-file no-window
import { JSX } from "preact";

interface TableOfContentsProps {
  className?: string;
  tocItems: Array<{ value: string; label: string }>;
}

export default function TableOfContents(
  { className = "", tocItems }: TableOfContentsProps,
): JSX.Element {
  const handleTocClick = (e: Event, anchor: string) => {
    e.preventDefault();

    const element = document.querySelector(anchor);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top +
        window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      class={`bg-gray-800 rounded-lg shadow-md border border-gray-700 px-4 py-3 ${className}`}
    >
      <div class="font-semibold text-gray-200 mb-4">On this page</div>
      {tocItems.map((item) => (
        <div
          class="toc-item flex flex-col gap-3 relative border-l border-gray-700 last:border-l-0 hover:bg-gray-800"
          key={item.value}
        >
          <span class="absolute -left-[5px] top-0 w-3 h-3 bg-gray-500 rounded-full border-[1px] border-gray-800">
          </span>

          <a
            href={item.value}
            onClick={(e) => handleTocClick(e, item.value)}
            class={`block relative h-10 pl-4 pr-3 text-sm text-gray-400 hover:text-gray-100 cursor-pointer`}
          >
            <span class={`absolute top-[-3px]`}>
              {item.label}
            </span>
          </a>
        </div>
      ))}
    </nav>
  );
}
