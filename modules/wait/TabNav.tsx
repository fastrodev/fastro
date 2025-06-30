import { FunctionalComponent } from "preact";

interface TabNavProps {
  activeTab: "new" | "popular" | "featured";
  setActiveTab: (tab: "new" | "popular" | "featured") => void;
}

const tabs = [
  { label: "Popular", value: "popular" },
  { label: "New", value: "new" },
  { label: "Featured", value: "featured" },
];

const TabNav: FunctionalComponent<TabNavProps> = (
  { activeTab, setActiveTab },
) => (
  <div class="flex justify-center absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
    <nav class="flex space-x-3 bg-transparent px-4 py-3">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => setActiveTab(tab.value as typeof activeTab)}
          class={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm
            sm:px-7 sm:py-3 sm:text-base ${
            activeTab === tab.value
              ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg scale-105"
              : "bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-blue-200"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          style={{ letterSpacing: "0.03em" }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

export default TabNav;
