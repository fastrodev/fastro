// deno-lint-ignore-file

import TableOfContents from "../wait/TableOfContents.tsx";

interface BlogPostDetailProps {
  post?: {
    id: string;
    title: string;
    content: string;
    author: any;
    publishedAt: string;
    tags?: string[];
    readTime?: string;
    image?: string;
    toc?: any;
    description?: string;
  };
  onBack: () => void;
}

export default function BlogPostDetail(
  props: BlogPostDetailProps,
) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle case when no post is provided
  if (!props.post) {
    return (
      <div class="bg-gray-800/50 rounded-lg shadow-sm border border-gray-700 p-6">
        <div class="mb-4">
          <button
            type="button"
            onClick={props.onBack}
            class="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go to all posts
          </button>
        </div>
        <div class="text-center py-8">
          <p class="text-gray-400">Post not found</p>
        </div>
      </div>
    );
  }

  const currentPost = props.post;
  // console.log("Current Post:", currentPost);
  return (
    <article class="bg-gray-800/50 rounded-xl shadow-sm border border-gray-700 p-6">
      {/* Back button */}
      <div class="mb-4 flex justify-between items-center">
        <button
          type="button"
          onClick={props.onBack}
          class="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Go to all posts
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-gray-400 hover:text-gray-200 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      <header class="mb-6 flex flex-col gap-4">
        <h1 class="text-3xl font-bold text-gray-100">
          {currentPost.title}
        </h1>

        <div class="flex flex-wrap items-center text-sm text-gray-400 gap-4">
          <span class="flex items-center">
            <svg
              class="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {currentPost.author.name}
          </span>

          <span class="flex items-center">
            <svg
              class="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(currentPost.publishedAt)}
          </span>

          {currentPost.readTime && (
            <span class="flex items-center">
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {currentPost.readTime}
            </span>
          )}
        </div>

        {/* Tags */}
        {currentPost.tags && currentPost.tags.length > 0 && (
          <div class="flex flex-wrap gap-2">
            {currentPost.tags.map((tag: string) => (
              <span
                key={tag}
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 bg-opacity-50 text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* make it full width with cover style and proportional height*/}
      {currentPost.image && (
        <div class="w-full flex justify-center mb-4">
          <img
            src={currentPost.image}
            alt={currentPost.title}
            class="w-full max-h-96 object-cover rounded-lg shadow-md border border-gray-700"
            style={{ aspectRatio: "16/9" }}
          />
        </div>
      )}

      {/* hide on large devices */}
      {currentPost.description && (
        <h2 class="text-gray-400 mb-4">
          {currentPost.description}
        </h2>
      )}

      {/* hide on large devices */}
      {currentPost.toc && (
        <div class="lg:hidden *:mt-4 mb-6">
          <TableOfContents tocItems={currentPost.toc} />
        </div>
      )}

      <div
        data-color-mode="dark"
        data-dark-theme="dark"
        class="markdown-body"
        dangerouslySetInnerHTML={{ __html: currentPost.content }}
      />

      <style>
        {`
        .markdown-body {
          background-color: transparent;
          color: #adbac7;
        }
        .markdown-body .anchor {
          opacity: 0;
          transition: opacity 0.2s;
          text-decoration: none;
          margin-left: -16px;
          padding-right: 2px;
          color: #58a6ff;
        }
        
        .markdown-body h1:hover .anchor,
        .markdown-body h2:hover .anchor,
        .markdown-body h3:hover .anchor,
        .markdown-body h4:hover .anchor,
        .markdown-body h5:hover .anchor,
        .markdown-body h6:hover .anchor,
        .markdown-body .anchor:hover {
          opacity: 1;
        }
        
        .markdown-body .anchor .octicon {
          vertical-align: middle;
          width: 12px;
          height: 12px;
        }
        
        .markdown-body h1,
        .markdown-body h2,
        .markdown-body h3,
        .markdown-body h4,
        .markdown-body h5,
        .markdown-body h6 {position: relative; color: #e6edf3;}`}
      </style>
    </article>
  );
}
