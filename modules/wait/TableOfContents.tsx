import { JSX } from "preact";

interface TableOfContentsProps {
  className?: string;
  tocItems: Array<{ value: string; label: string }>;
}

export default function TableOfContents(
  { className = "", tocItems }: TableOfContentsProps,
): JSX.Element {
  return (
    <nav class={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <h3 class="font-semibold text-gray-900 mb-4">On this page</h3>
      <div class="space-y-2">
        {tocItems.map((item) => (
          <div class="toc-item" key={item.value}>
            <a
              href={item.value}
              class="block px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              {item.label}
            </a>
          </div>
        ))}
      </div>
    </nav>
  );
}
