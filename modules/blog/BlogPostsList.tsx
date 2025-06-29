// Blog posts data
const blogPosts = [
  {
    id: "getting-started-with-fastro-framework",
    title: "Getting Started with Fastro Framework",
    author: {
      name: "John Doe",
      avatar: "https://picsum.photos/40/40?random=1",
    },
    publishedAt: "2 hours ago",
    image: "https://picsum.photos/120/80?random=11",
    tags: [
      { name: "Fastro", color: "blue" },
      { name: "TypeScript", color: "green" },
    ],
    readTime: "5 min read",
  },
  {
    id: "building-high-performance-apis-with-fastro",
    title: "Building High-Performance APIs with Fastro",
    author: {
      name: "Jane Smith",
      avatar: "https://picsum.photos/40/40?random=2",
    },
    publishedAt: "1 day ago",
    image: "https://picsum.photos/120/80?random=12",
    tags: [
      { name: "API", color: "purple" },
      { name: "Performance", color: "red" },
    ],
    readTime: "8 min read",
  },
  {
    id: "database-integration-made-simple",
    title: "Database Integration Made Simple",
    author: {
      name: "Mike Johnson",
      avatar: "https://picsum.photos/40/40?random=3",
    },
    publishedAt: "3 days ago",
    image: "https://picsum.photos/120/80?random=13",
    tags: [
      { name: "Database", color: "indigo" },
      { name: "Web Dev", color: "orange" },
    ],
    readTime: "6 min read",
  },
];

const getTagClasses = (color: string) => {
  const colorMap: { [key: string]: string } = {
    blue: "bg-blue-900/50 text-blue-300",
    green: "bg-green-900/50 text-green-300",
    purple: "bg-purple-900/50 text-purple-300",
    red: "bg-red-900/50 text-red-300",
    indigo: "bg-indigo-900/50 text-indigo-300",
    orange: "bg-orange-900/50 text-orange-300",
  };
  return colorMap[color] || "bg-gray-700 text-gray-300";
};

export default function BlogPostsList() {
  return (
    <div class="space-y-4 mt-6">
      {blogPosts.map((post) => (
        <article
          key={post.id}
          class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-sm hover:shadow-md hover:bg-gray-800/80 transition-all duration-200 rounded-2xl p-6"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 class="font-medium text-gray-200 text-sm">
                  {post.author.name}
                </h4>
                <p class="text-xs text-gray-400">{post.publishedAt}</p>
              </div>
            </div>

            <button
              type="button"
              class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => console.log("Menu clicked for post:", post.id)}
            >
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>

          <a href={`/blog/${post.id}`} class="block">
            <div class="mb-3">
              <img
                src={post.image}
                alt={post.title}
                class="w-full h-64 rounded-lg object-cover"
              />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-100 hover:text-blue-400 cursor-pointer">
                {post.title}
              </h2>
            </div>
          </a>

          <div class="flex items-center justify-between mt-3">
            <div class="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  class={`px-2 py-1 ${
                    getTagClasses(
                      tag.color,
                    )
                  } text-xs font-medium rounded-full`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span>{post.readTime}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
