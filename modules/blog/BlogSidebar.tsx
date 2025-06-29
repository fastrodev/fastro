import { useMemo } from "preact/hooks";

export default function BlogSidebar() {
  const featuredTitles = [
    "10 Tips for Productive Coding",
    "Understanding Async in JavaScript",
    "How to Build REST APIs Fast",
    "Deploying Your App with Ease",
    "Mastering TypeScript Basics",
    "UI/UX Trends in 2025",
    "Optimizing Web Performance",
    "Getting Started with Fastro",
  ];

  // Pick a random title only once per render
  const randomTitle = useMemo(
    () => featuredTitles[Math.floor(Math.random() * featuredTitles.length)],
    [],
  );

  return (
    <>
      {/*  */}
      <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-sm hover:shadow-md hover:bg-gray-800/80 transition-all duration-200 rounded-2xl p-3 mb-5">
        <h3 class="font-semibold text-gray-200 mb-3">Featured Content</h3>
        {/* add skeleton while image loading */}
        <div
          class="w-full h-32 mb-2 rounded-lg bg-gray-700 animate-pulse"
          id="sidebar-img-skeleton"
          style={{ display: "none" }}
        />
        <img
          src="https://picsum.photos/240/160?random=1"
          alt="Random image"
          class="w-full h-32 object-cover rounded-lg mb-2"
          loading="lazy"
          onLoad={(e) => {
            const skeleton = document.getElementById("sidebar-img-skeleton");
            if (skeleton) skeleton.style.display = "none";
            (e.currentTarget as HTMLImageElement).style.display = "block";
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
            const skeleton = document.getElementById("sidebar-img-skeleton");
            if (skeleton) skeleton.style.display = "block";
          }}
          style={{ display: "block" }}
        />
        {/* generate random title */}
        <h4 class="font-medium text-sm text-gray-200 mb-1">
          {randomTitle}
        </h4>
      </div>
      <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-sm hover:shadow-md hover:bg-gray-800/80 transition-all duration-200 rounded-2xl p-3">
        <h3 class="font-semibold text-gray-200 mb-3">Tags</h3>
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
