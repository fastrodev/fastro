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
      class={`bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4 mb-4 ${className}`}
    >
      <div class="font-semibold text-gray-200 mb-4">On this page</div>
      <div class="space-y-0">
        {tocItems.map((item) => (
          <div
            class="toc-item relative border-l border-gray-700"
            key={item.value}
          >
            <span class="absolute -left-[5px] top-2.5 w-2.5 h-2.5 bg-gray-500 rounded-full border-2 border-gray-800">
            </span>
            <a
              href={item.value}
              onClick={(e) => handleTocClick(e, item.value)}
              class="block h-10 pl-4 pr-3 py-1 text-sm text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-md"
            >
              {item.label}
            </a>
          </div>
        ))}
      </div>
    </nav>
  );
}
