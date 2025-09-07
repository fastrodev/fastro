// deno-lint-ignore-file
import { FunctionalComponent } from "preact";

interface TabNavProps {
  activeTab: "new" | "popular" | "featured" | "trending" | "all";
  setActiveTab: (
    tab: "new" | "popular" | "featured" | "trending" | "all",
  ) => void;
}

// if All selected, go to /play
const tabs = [
  { label: "New", value: "new" },
  { label: "Popular", value: "popular" },
  { label: "Featured", value: "featured" },
  { label: "Trending", value: "trending" },
  { label: "All", value: "all" },
];

const TabNav: FunctionalComponent<TabNavProps> = (
  { activeTab, setActiveTab },
) => (
  <div className="w-full relative">
    <div
      className="overflow-x-auto pb-2 text-center"
      style={{
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none", /* Firefox */
        msOverflowStyle: "none", /* IE and Edge */
      }}
    >
      <style jsx>
        {`
        div::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}
      </style>
      <div className="inline-flex space-x-2 px-4 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              if (tab.value === "all") {
                window.location.href = "/play";
              } else {
                setActiveTab(tab.value as typeof activeTab);
              }
            }}
            class={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm whitespace-nowrap
              sm:px-6 sm:py-3 sm:text-base ${
              activeTab === tab.value
                ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg scale-105"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-blue-200"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            style={{ letterSpacing: "0.03em" }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default TabNav;
