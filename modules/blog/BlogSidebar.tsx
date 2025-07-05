import PanelCard from "./PanelCard.tsx";

const tags = [
  { name: "Applications", count: 12 },
  { name: "Careers", count: 7 },
  { name: "Services", count: 15 },
  { name: "Templates", count: 5 },
  { name: "Middleware", count: 6 },
].sort((a, b) => b.count - a.count);

export default function BlogSidebar() {
  return (
    <aside class="flex flex-col gap-6 z-0 top-14 sticky">
      <div class="bg-gray-800/50 border border-gray-700 shadow-md rounded-xl p-3">
        <input
          type="text"
          placeholder="Search tags..."
          class="mb-4 px-3 py-2 rounded-md bg-gray-900 text-gray-100 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
        />
        <div class="flex flex-col gap-2">
          {tags.map((tag) => (
            <span
              key={tag.name}
              class="px-3 py-1.5 bg-gray-900 text-gray-200 text-sm font-normal rounded-full hover:bg-blue-700/70 hover:text-white cursor-pointer transition-colors border border-gray-700 flex items-center justify-between"
              style={{ letterSpacing: "0.01em" }}
            >
              <span>{tag.name}</span>
              <span class="ml-3 bg-gray-700 text-gray-300 rounded-full px-2 py-0.5 text-xs font-semibold">
                {tag.count}
              </span>
            </span>
          ))}
        </div>
      </div>
      <PanelCard />
    </aside>
  );
}
