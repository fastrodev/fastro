import PostCard from "./PostCard.tsx";

const blogPosts = [
  {
    id: "getting-started-with-fastro",
    title: "Getting Started with Fastro",
    slug: "getting-started-with-fastro",
    description:
      "Learn how to build your first application with Fastro in just a few minutes.",
    publishedAt: "2 hours ago",
    date: "2025-06-01",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    tags: [
      { name: "Fastro", color: "blue" },
      { name: "Tutorial", color: "green" },
    ],
  },
  {
    id: "building-apis-with-fastro",
    title: "Building APIs with Fastro",
    slug: "building-apis-with-fastro",
    description:
      "A comprehensive guide to creating robust APIs using Fastro's powerful features.",
    publishedAt: "1 day ago",
    date: "2025-05-28",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    tags: [
      { name: "API", color: "purple" },
      { name: "Backend", color: "red" },
    ],
  },
  {
    id: "authentication-in-fastro",
    title: "Authentication in Fastro",
    slug: "authentication-in-fastro",
    description:
      "How to add authentication and authorization to your Fastro apps.",
    publishedAt: "3 days ago",
    date: "2025-05-20",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    tags: [
      { name: "Auth", color: "indigo" },
      { name: "Security", color: "orange" },
    ],
  },
  {
    id: "fastro-performance-tips",
    title: "Fastro Performance Tips",
    slug: "fastro-performance-tips",
    description:
      "Tips and tricks to make your Fastro applications run even faster.",
    publishedAt: "5 days ago",
    date: "2025-05-15",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
    tags: [
      { name: "Performance", color: "red" },
      { name: "Optimization", color: "blue" },
    ],
  },
];

export default function BlogPostsList() {
  return (
    <div class="space-y-6">
      {blogPosts.map((post, index) => (
        <PostCard key={index} post={post} index={index} />
      ))}
    </div>
  );
}
