import { JSX } from "preact";
import { useState } from "preact/hooks";

interface NavigationItem {
  href: string;
  label: string;
}

interface NavigationSection {
  title: string;
  href: string; // Add this to match your navigation-sections.ts
  items: NavigationItem[];
}

interface NavigationProps {
  className?: string;
  navigationSections: NavigationSection[];
  activePath?: string;
}

export default function Navigation(
  { className = "", navigationSections, activePath }: NavigationProps,
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

  const toggleSection = (index: number) => {
    setOpenSections((prev) => prev.includes(index) ? [] : [index]);
  };

  return (
    <nav
      class={`bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 ${className}`}
    >
      {navigationSections.map((navigation, index) => {
        const hasActiveItem = sectionHasActiveItem(navigation);
        const isOpen = openSections.includes(index) || hasActiveItem;

        return (
          <div key={index} class={index > 0 ? "mt-8" : ""}>
            {/* implement the href on the root of section here */}
            <div class="flex items-center justify-between mb-3">
              <a
                href={navigation.href}
                class="font-semibold text-white hover:text-gray-300 transition-colors flex-1"
              >
                {navigation.title}
              </a>
              {/* hide the toggle if no items provided */}
              {navigation.items.length > 0 && (
                <button
                  type="button"
                  onClick={() => toggleSection(index)}
                  class="ml-2 p-1 hover:bg-gray-700 rounded transition-colors text-gray-300"
                >
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
              )}
            </div>
            {isOpen && navigation.items.length > 0 && (
              <div class="space-y-2">
                {navigation.items.map((item) => {
                  const isActive = isItemActive(item.href);
                  return (
                    <div class="nav-item" key={item.href}>
                      <a
                        href={item.href}
                        class={`block px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive
                            ? "bg-gray-700 text-white font-medium"
                            : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
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
