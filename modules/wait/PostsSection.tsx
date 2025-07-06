import { useState } from "preact/hooks";
import PostCard from "../blog/PostCard.tsx";
import TabNav from "./TabNav.tsx";

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
  const [activeTab, setActiveTab] = useState<
    "new" | "popular" | "featured" | "trending" | "all"
  >(
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
    <div>
      <div class="relative h-20 lg:h-24">
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div class="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {getCurrentPosts().map((post, index) => (
          <PostCard key={index} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
