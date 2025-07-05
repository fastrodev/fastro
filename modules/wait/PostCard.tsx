import { JSX } from "preact";

interface Post {
  title: string;
  slug: string;
  description: string;
  date: string;
  readTime: string;
  image?: string;
}

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps): JSX.Element {
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
    <article class="group">
      <a
        href={`/play/${post.slug}`}
        class="block p-5 sm:p-7 border border-gray-700 rounded-2xl bg-gray-800 hover:bg-blue-900/30 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300 h-full hover:border-blue-500/70 relative overflow-hidden group"
        style={{
          boxShadow:
            "0 4px 24px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
        }}
      >
        {/* Animated background blob on hover */}
        <div
          class="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[320px] h-[180px] rounded-full opacity-0 blur-[60px] scale-100 transition-all duration-500 group-hover:opacity-60 group-hover:scale-125 group-hover:-translate-y-4"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.18) 60%, transparent 100%)",
          }}
        />
        <div class="flex gap-4 h-full relative z-10">
          {/* Thumbnail with animation */}
          <div class="transition-transform duration-300 group-hover:scale-105">
            {renderThumbnail(post, index)}
          </div>
          {/* Content */}
          <div class="flex flex-col gap-3 flex-1 min-w-0">
            <div class="flex-1">
              <h3 class="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p class="text-sm sm:text-base text-gray-200 mb-2 line-clamp-2 sm:line-clamp-3">
                {post.description}
              </p>
            </div>
            <div class="flex items-center justify-between">
              {/*  */}
              <div class="flex flex-row items-center gap-2 text-xs text-gray-400">
                <div class={`flex items-center gap-2`}>
                  <img
                    src="https://avatars.githubusercontent.com/u/10122431?s=70&v=4"
                    alt="Avatar"
                    class="w-4 h-4 rounded-full object-cover border border-gray-600 shadow"
                    loading="lazy"
                  />
                  <span>
                    Fastro Team
                  </span>
                </div>
                <span class="inline">•</span>
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
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </div>
          </div>
        </div>
        {/* Glow effect on hover */}
        <div
          class="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.18) 0%, transparent 70%)",
          }}
        />
      </a>
    </article>
  );
}
