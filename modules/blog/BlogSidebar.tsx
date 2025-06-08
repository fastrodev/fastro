export default function BlogSidebar() {
  return (
    <>
      <div class="bg-white/80 backdrop-blur-sm border border-stone-300/50 shadow-sm hover:shadow-md hover:bg-white/90 hover:border-stone-300/70 transition-all duration-200 rounded-2xl p-4 mb-4">
        <img
          src="https://picsum.photos/240/160?random=1"
          alt="Random image"
          class="w-full h-32 object-cover rounded-lg mb-3"
        />
        <h4 class="font-medium text-sm text-gray-900 mb-1">
          Featured Content
        </h4>
      </div>
      <div class="bg-white/80 backdrop-blur-sm border border-stone-300/50 shadow-sm hover:shadow-md hover:bg-white/90 hover:border-stone-300/70 transition-all duration-200 rounded-2xl p-4">
        <h3 class="font-semibold text-gray-900 mb-4">Tags</h3>
        <div class="flex flex-col gap-3">
          <span class="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-200 cursor-pointer transition-colors">
            JavaScript
          </span>
          <span class="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg hover:bg-green-200 cursor-pointer transition-colors">
            TypeScript
          </span>
          <span class="px-4 py-2 bg-purple-100 text-purple-800 text-sm font-medium rounded-lg hover:bg-purple-200 cursor-pointer transition-colors">
            Fastro
          </span>
          <span class="px-4 py-2 bg-orange-100 text-orange-800 text-sm font-medium rounded-lg hover:bg-orange-200 cursor-pointer transition-colors">
            Web Dev
          </span>
          <span class="px-4 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-lg hover:bg-red-200 cursor-pointer transition-colors">
            Performance
          </span>
          <span class="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-lg hover:bg-yellow-200 cursor-pointer transition-colors">
            Routing
          </span>
          <span class="px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-lg hover:bg-indigo-200 cursor-pointer transition-colors">
            Database
          </span>
          <span class="px-4 py-2 bg-pink-100 text-pink-800 text-sm font-medium rounded-lg hover:bg-pink-200 cursor-pointer transition-colors">
            API
          </span>
        </div>
      </div>
    </>
  );
}
