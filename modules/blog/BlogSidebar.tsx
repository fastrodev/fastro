export default function BlogSidebar() {
  return (
    <>
      <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-sm hover:shadow-md hover:bg-gray-800/80 transition-all duration-200 rounded-2xl p-3">
        <div class="flex flex-col gap-2">
          <span class="px-3 py-2 bg-blue-900/50 text-blue-300 text-sm font-medium rounded-lg hover:bg-blue-800/50 cursor-pointer transition-colors">
            JavaScript
          </span>
          <span class="px-3 py-2 bg-green-900/50 text-green-300 text-sm font-medium rounded-lg hover:bg-green-800/50 cursor-pointer transition-colors">
            TypeScript
          </span>
          <span class="px-3 py-2 bg-purple-900/50 text-purple-300 text-sm font-medium rounded-lg hover:bg-purple-800/50 cursor-pointer transition-colors">
            Fastro
          </span>
          <span class="px-3 py-2 bg-orange-900/50 text-orange-300 text-sm font-medium rounded-lg hover:bg-orange-800/50 cursor-pointer transition-colors">
            Web Dev
          </span>
          <span class="px-3 py-2 bg-red-900/50 text-red-300 text-sm font-medium rounded-lg hover:bg-red-800/50 cursor-pointer transition-colors">
            Performance
          </span>
          <span class="px-3 py-2 bg-yellow-900/50 text-yellow-300 text-sm font-medium rounded-lg hover:bg-yellow-800/50 cursor-pointer transition-colors">
            Routing
          </span>
          <span class="px-3 py-2 bg-indigo-900/50 text-indigo-300 text-sm font-medium rounded-lg hover:bg-indigo-800/50 cursor-pointer transition-colors">
            Database
          </span>
          <span class="px-3 py-2 bg-pink-900/50 text-pink-300 text-sm font-medium rounded-lg hover:bg-pink-800/50 cursor-pointer transition-colors">
            API
          </span>
        </div>
      </div>
    </>
  );
}
