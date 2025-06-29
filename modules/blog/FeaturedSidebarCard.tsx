import { useMemo } from "preact/hooks";

export default function FeaturedSidebarCard() {
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

  const randomTitle = useMemo(
    () => featuredTitles[Math.floor(Math.random() * featuredTitles.length)],
    [],
  );

  return (
    <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-sm hover:shadow-md hover:bg-gray-800/80 transition-all duration-200 rounded-2xl p-3 mb-5">
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
      <h4 class="font-medium text-sm text-gray-200 mb-1">
        {randomTitle}
      </h4>
    </div>
  );
}
