import { PageProps } from "@app/mod.ts";
import { useState } from "preact/hooks";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
// import Navigation from "./Navigation.tsx";
// import TableOfContents from "./TableOfContents.tsx";
import BoltSvg from "../../components/icons/bolt.tsx";

export default function Wait({ data }: PageProps<
  {
    user: string;
    title: string;
    description: string;
    baseUrl: string;
    new: string;
    destination: string;
    isLogin: boolean;
    avatar_url: string;
    html_url: string;
    popularPosts?: Array<{
      title: string;
      slug: string;
      excerpt: string;
      date: string;
      readTime: string;
      image?: string;
    }>;
  }
>) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"new" | "popular" | "featured">(
    "popular",
  );

  // Mock popular posts if not provided
  const mockPopularPosts = [
    {
      title: "Getting Started with Fastro",
      slug: "getting-started-with-fastro",
      excerpt:
        "Learn how to build your first application with Fastro in just a few minutes.",
      date: "2025-06-01",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Building APIs with Fastro",
      slug: "building-apis-with-fastro",
      excerpt:
        "A comprehensive guide to creating robust APIs using Fastro's powerful features.",
      date: "2025-05-28",
      readTime: "8 min read",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Deployment Best Practices",
      slug: "deployment-best-practices",
      excerpt:
        "Learn the best practices for deploying your Fastro applications to production.",
      date: "2025-05-25",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Advanced Fastro Features",
      slug: "advanced-fastro-features",
      excerpt:
        "Explore the advanced features of Fastro that can help you build more efficient applications.",
      date: "2025-05-20",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
  ];

  const mockNewPosts = [
    {
      title: "Fastro 2.0 Release Notes",
      slug: "fastro-2-0-release-notes",
      excerpt:
        "Discover what's new in Fastro 2.0 with improved performance and new features.",
      date: "2025-06-08",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "New Middleware System",
      slug: "new-middleware-system",
      excerpt:
        "Learn about the new middleware system that makes Fastro more flexible and powerful.",
      date: "2025-06-07",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
  ];

  const mockFeaturedPosts = [
    {
      title: "Building a Real-time Chat App",
      slug: "building-realtime-chat-app",
      excerpt:
        "Step-by-step guide to building a real-time chat application with Fastro and WebSockets.",
      date: "2025-05-30",
      readTime: "12 min read",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Microservices with Fastro",
      slug: "microservices-with-fastro",
      excerpt:
        "Learn how to architect and build scalable microservices using Fastro framework.",
      date: "2025-05-15",
      readTime: "15 min read",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
  ];

  const popularPosts = data.popularPosts || mockPopularPosts;

  const getCurrentPosts = () => {
    switch (activeTab) {
      case "new":
        return mockNewPosts;
      case "featured":
        return mockFeaturedPosts;
      default:
        return popularPosts;
    }
  };

  // Function to render thumbnail image with fallback
  const renderThumbnail = (
    post: { title: string; image?: string },
    index: number,
  ) => {
    if (post.image) {
      return (
        <img
          src={post.image}
          alt={post.title}
          class="w-24 sm:w-28 h-full rounded-lg object-cover flex-shrink-0"
          loading="lazy"
        />
      );
    }

    // Fallback to generated thumbnail if no image
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-orange-100 text-orange-600",
    ];
    const colorClass = colors[index % colors.length];
    const initial = post.title.charAt(0).toUpperCase();

    return (
      <div
        class={`w-24 sm:w-28 h-full rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}
      >
        <span class="text-3xl sm:text-4xl font-bold">{initial}</span>
      </div>
    );
  };

  return (
    <div class="min-h-screen" style="background-color: rgb(244, 242, 238);">
      <div class="sticky top-0 z-50">
        <Header
          title={data.title}
          isLogin={data.isLogin}
          user={data.user}
          avatar_url={data.avatar_url}
          baseUrl={data.baseUrl}
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
          isMobileTocOpen={isMobileTocOpen}
          setIsMobileTocOpen={setIsMobileTocOpen}
          navigationSections={[]}
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-6 py-6">
          {/* Hero Section */}
          <div class="flex-1 min-w-0">
            <main class="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:p-8 text-center relative overflow-hidden">
              {/* Harmonious gradient background */}
              <div class="absolute inset-0 bg-gradient-to-br from-slate-300 via-gray-50 to-blue-300 opacity-80">
              </div>

              {/* Content with relative positioning to appear above background */}
              <div class="relative z-10">
                {/* Icon with thin circle */}
                <div class="flex justify-center mb-3">
                  <div class="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                    <BoltSvg width="32" height="32" />
                  </div>
                </div>
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  {data.title}
                </h1>
                <p class="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 mx-auto leading-relaxed">
                  {data.description}
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`/docs`}
                    class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
                  >
                    Getting Started
                  </a>
                  <div class="w-full sm:w-auto bg-gray-100 border rounded-lg p-2.5 sm:p-3 font-mono text-xs sm:text-sm text-gray-800 overflow-x-auto">
                    deno run -A -r https://fastro.deno.dev
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* Two equal-height cards */}
          <div class="grid gap-4 sm:gap-6 md:grid-cols-2">
            <a href="/applications" class="group h-full">
              <main class="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center group-hover:shadow-md transition-shadow h-full flex flex-col">
                <div class="flex justify-center mb-4">
                  <svg
                    class="w-[48px] h-[48px] text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m10.051 8.102-3.778.322-1.994 1.994a.94.94 0 0 0 .533 1.6l2.698.316m8.39 1.617-.322 3.78-1.994 1.994a.94.94 0 0 1-1.595-.533l-.4-2.652m8.166-11.174a1.366 1.366 0 0 0-1.12-1.12c-1.616-.279-4.906-.623-6.38.853-1.671 1.672-5.211 8.015-6.31 10.023a.932.932 0 0 0 .162 1.111l.828.835.833.832a.932.932 0 0 0 1.111.163c2.008-1.102 8.35-4.642 10.021-6.312 1.475-1.478 1.133-4.77.855-6.385Zm-2.961 3.722a1.88 1.88 0 1 1-3.76 0 1.88 1.88 0 0 1 3.76 0Z"
                    />
                  </svg>
                </div>
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Applications
                </h2>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed flex-1">
                  Explore example applications and templates built with Fastro
                  framework.
                </p>
              </main>
            </a>
            <a href="/docs" class="group h-full">
              <main class="bg-white rounded-lg shadow-sm border p-6 sm:p-8 text-center group-hover:shadow-md transition-shadow h-full flex flex-col">
                <div class="flex justify-center mb-4">
                  <svg
                    class="w-[48px] h-[48px] text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
                    />
                  </svg>
                </div>
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Documentation
                </h2>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed flex-1">
                  Comprehensive guides and API references to help you build
                  amazing applications.
                </p>
              </main>
            </a>
          </div>

          {/* Posts Section */}
          <div class="bg-white rounded-lg shadow-sm border">
            {/* Header with Tabs */}
            <div class="border-b border-gray-200">
              {/* Tabs */}
              <div class="px-4 sm:px-6 lg:px-6 mt-3">
                <nav class="flex space-x-6 lg:space-x-8">
                  <button
                    onClick={() =>
                      setActiveTab("popular")}
                    class={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "popular"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Popular
                  </button>
                  <button
                    onClick={() =>
                      setActiveTab("new")}
                    class={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "new"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setActiveTab("featured")}
                    class={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "featured"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Featured
                  </button>
                </nav>
              </div>
            </div>

            {/* Posts Content */}
            <div class="p-4 sm:p-6 lg:p-6">
              <div class="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {getCurrentPosts().map((post, index) => (
                  <article key={index} class="group">
                    <a
                      href={`/blog/${post.slug}`}
                      class="block p-4 sm:p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 h-full"
                    >
                      <div class="flex gap-3 sm:gap-4 h-full">
                        {/* Thumbnail */}
                        {renderThumbnail(post, index)}

                        {/* Content */}
                        <div class="flex flex-col gap-3 flex-1 min-w-0">
                          <div class="flex-1">
                            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                            <p class="text-sm sm:text-base text-gray-600 mb-2 line-clamp-2 sm:line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>
                          <div class="flex items-center justify-between">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500">
                              <time dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </time>
                              <span class="hidden sm:inline">•</span>
                              <span>{post.readTime}</span>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0"
                            >
                              <path d="M7 17L17 7" />
                              <path d="M7 7h10v10" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>

              <div class="mt-6 sm:mt-8 text-center">
                <a
                  href="/blog"
                  class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  View All Posts
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer
        title={data.title}
        description={data.description}
        baseUrl={data.baseUrl}
      />
    </div>
  );
}
