import { JSX } from "preact";
import { useState } from "preact/hooks";

interface NavigationItem {
  href: string;
  label: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface NavigationProps {
  baseUrl: string;
  className?: string;
  navigationSections: NavigationSection[];
}

export default function Navigation(
  { baseUrl, className = "", navigationSections }: NavigationProps,
): JSX.Element {
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => prev.includes(index) ? [] : [index]);
  };

  return (
    <nav class={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {navigationSections.map((navigation, index) => (
        <div key={index} class={index > 0 ? "mt-8" : ""}>
          <button
            onClick={() =>
              toggleSection(index)}
            class="w-full flex items-center justify-between font-semibold text-gray-900 mb-3 hover:text-gray-700 transition-colors"
          >
            <span>{navigation.title}</span>
            <svg
              class={`w-4 h-4 transform transition-transform ${
                openSections.includes(index) ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openSections.includes(index) && (
            <div class="space-y-1">
              {navigation.items.map((item) => (
                <div class="nav-item" key={item.href}>
                  <a
                    href={item.href}
                    class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
