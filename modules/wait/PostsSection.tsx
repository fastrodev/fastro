import { useState } from "preact/hooks";
import PostCard from "./PostCard.tsx";

export interface PostsSectionProps {
  popularPosts?: Array<{
    title: string;
    slug: string;
    description: string;
    date: string;
    readTime: string;
    image?: string;
  }>;
}

export default function PostsSection({ popularPosts }: PostsSectionProps) {
  const [activeTab, setActiveTab] = useState<"new" | "popular" | "featured">(
    "new",
  );

  // Mock data
  const mockPopularPosts = [
    {
      title: "Getting Started with Fastro",
      slug: "getting-started-with-fastro",
      description:
        "Learn how to build your first application with Fastro in just a few minutes.",
      date: "2025-06-01",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Building APIs with Fastro",
      slug: "building-apis-with-fastro",
      description:
        "A comprehensive guide to creating robust APIs using Fastro's powerful features.",
      date: "2025-05-28",
      readTime: "8 min read",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Authentication in Fastro",
      slug: "authentication-in-fastro",
      description:
        "How to add authentication and authorization to your Fastro apps.",
      date: "2025-05-20",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Fastro Performance Tips",
      slug: "fastro-performance-tips",
      description:
        "Tips and tricks to make your Fastro applications run even faster.",
      date: "2025-05-15",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
  ];

  const mockNewPosts = [
    {
      title: "Fastro 2.0 Release Notes",
      slug: "fastro-2-0-release-notes",
      description:
        "Discover what's new in Fastro 2.0 with improved performance and new features.",
      date: "2025-06-08",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "New Middleware System",
      slug: "new-middleware-system",
      description:
        "Learn about the new middleware system that makes Fastro more flexible and powerful.",
      date: "2025-06-07",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Deployment Best Practices",
      slug: "deployment-best-practices",
      description:
        "Learn the best practices for deploying your Fastro applications to production.",
      date: "2025-05-25",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Advanced Fastro Features",
      slug: "advanced-fastro-features",
      description:
        "Explore the advanced features of Fastro that can help you build more efficient applications.",
      date: "2025-05-20",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
  ];

  const mockFeaturedPosts = [
    {
      title: "Building a Real-time Chat App",
      slug: "building-realtime-chat-app",
      description:
        "Step-by-step guide to building a real-time chat application with Fastro and WebSockets.",
      date: "2025-05-30",
      readTime: "12 min read",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Microservices with Fastro",
      slug: "microservices-with-fastro",
      description:
        "Learn how to architect and build scalable microservices using Fastro framework.",
      date: "2025-05-15",
      readTime: "15 min read",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Fastro for Startups",
      slug: "fastro-for-startups",
      description:
        "Why Fastro is a great choice for startups and fast-moving teams.",
      date: "2025-05-10",
      readTime: "9 min read",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
    {
      title: "Integrating Fastro with Databases",
      slug: "integrating-fastro-with-databases",
      description:
        "A practical guide to connecting Fastro with popular databases.",
      date: "2025-05-05",
      readTime: "10 min read",
      image:
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    },
  ];

  const posts = popularPosts || mockPopularPosts;

  const getCurrentPosts = () => {
    switch (activeTab) {
      case "new":
        return mockNewPosts;
      case "featured":
        return mockFeaturedPosts;
      default:
        return posts;
    }
  };

  return (
    <div
      class="bg-gray-900 rounded-2xl shadow-md border border-gray-700 backdrop-blur-lg relative overflow-hidden group sm:bg-gray-900 sm:shadow-md sm:border sm:border-gray-700 sm:backdrop-blur-lg bg-transparent shadow-none border-0 backdrop-blur-0"
      style={{
        boxShadow:
          "0 4px 24px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
      }}
    >
      {/* Softer animated background blob for the whole section */}
      <div
        class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full opacity-30 blur-[160px] transition-all duration-700 group-hover:opacity-55 group-hover:scale-110 group-hover:-translate-y-8 group-hover:translate-x-6"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.12) 60%, transparent 100%)",
        }}
      />
      {/* Glow effect on hover for the whole section */}
      <div
        class="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.14) 0%, transparent 70%)",
        }}
      />

      {/* Header with Modern Tabs */}
      <div class="relative pt-10 pb-3">
        <div class="flex justify-center absolute top-3 left-1/2 transform -translate-x-1/2 z-10">
          <nav class="flex space-x-3 bg-gray-900 px-4 py-3 rounded-full shadow-xl backdrop-blur-md border border-gray-700">
            {[
              { label: "Popular", value: "popular" },
              { label: "New", value: "new" },
              { label: "Featured", value: "featured" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value as typeof activeTab)}
                class={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm ${
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
      </div>

      {/* Posts Content */}
      <div class="py-8 px-0 sm:px-6 lg:p-8 sm:p-8">
        <div class="grid gap-6 sm:gap-8 lg:grid-cols-2">
          {getCurrentPosts().map((post, index) => (
            <PostCard key={index} post={post} index={index} />
          ))}
        </div>
        <div class="mt-8 text-center">
          <a
            href="/blog"
            class="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-full shadow transition-all duration-200"
          >
            View All Posts
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
