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
  activePath?: string;
}

export default function Navigation(
  { baseUrl, className = "", navigationSections, activePath }: NavigationProps,
): JSX.Element {
  // Check if an item is active
  const isItemActive = (href: string): boolean => {
    if (!activePath) return false;
    // Extract the page name from the href (e.g., "hello" from "/docs/hello?section=getting-started")
    const hrefPage = href.split("/").pop()?.split("?")[0] || "";
    // Extract the current page from activePath
    const currentPage = activePath.split("/").pop() || "";
    return hrefPage === currentPage;
  };

  // Check if a section has an active item or matches the section parameter
  const sectionHasActiveItem = (section: NavigationSection): boolean => {
    // Check if any item in this section is active
    const hasActiveItem = section.items.some((item) => isItemActive(item.href));

    // Check if the section title matches the section parameter
    // Convert "Getting Started" to "getting-started" format
    const sectionSlug = section.title.toLowerCase().replace(/\s+/g, "-");
    const activeSectionFromParam = activePath; // This should be "getting-started" from your docs.page.tsx

    return hasActiveItem || sectionSlug === activeSectionFromParam;
  };

  // Initialize openSections with sections that have active items
  const [openSections, setOpenSections] = useState<number[]>(() => {
    if (!activePath) return [];
    return navigationSections
      .map((section, index) => ({ section, index }))
      .filter(({ section }) => sectionHasActiveItem(section))
      .map(({ index }) => index);
  });

  console.log("activePath", activePath);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => prev.includes(index) ? [] : [index]);
  };

  return (
    <nav class={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {navigationSections.map((navigation, index) => {
        const hasActiveItem = sectionHasActiveItem(navigation);
        const isOpen = openSections.includes(index) || hasActiveItem;

        return (
          <div key={index} class={index > 0 ? "mt-8" : ""}>
            <button
              onClick={() => toggleSection(index)}
              class="w-full flex items-center justify-between font-semibold text-gray-900 mb-3 hover:text-gray-700 transition-colors"
            >
              <span>{navigation.title}</span>
              <svg
                class={`w-4 h-4 transform transition-transform ${
                  isOpen ? "rotate-180" : "rotate-0"
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
            {isOpen && (
              <div class="space-y-2">
                {navigation.items.map((item) => {
                  const isActive = isItemActive(item.href);
                  return (
                    <div class="nav-item" key={item.href}>
                      <a
                        href={item.href}
                        class={`block px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
