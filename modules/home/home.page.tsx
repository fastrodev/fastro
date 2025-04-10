// deno-lint-ignore-file
import { useEffect, useState } from "preact/hooks";
import { PageProps } from "@app/mod.ts";
import Header from "./header.tsx";
import { JSX } from "preact/jsx-runtime";

interface Post {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  commentCount?: number;
}

export default function Home({ data }: PageProps<{
  user: string;
  title: string;
  description: string;
  baseUrl: string;
  isLogin: boolean;
  avatar_url: string;
  html_url: string;
  author: string;
  posts: Post[];
}>) {
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>(data.posts || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    console.log("author", data.author);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle post submission
  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();

    if (!postContent.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: postContent }),
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost, ...posts]);
        setPostContent("");
        setSubmitSuccess(true);

        // Reset success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle text field change
  const handleChange = (e: { currentTarget: { value: string } }) => {
    setPostContent(e.currentTarget.value);
  };

  // Add keyboard handling for Enter submission
  const handleKeyDown = (
    e: JSX.TargetedEvent<HTMLTextAreaElement, KeyboardEvent>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (postContent.trim()) {
        handleSubmit({
          preventDefault: () => {},
        } as unknown as JSX.TargetedEvent<HTMLFormElement, Event>);
      }
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Theme styles with performance optimizations
  const themeStyles = {
    background: isDark ? "#0f172a" : "#f8fafc",
    cardBg: isDark ? "bg-gray-800/90" : "bg-white/90",
    text: isDark ? "text-gray-100" : "text-gray-800",
    input: isDark
      ? "bg-gray-700/30 border-gray-600 text-white placeholder-gray-400"
      : "bg-gray-100/70 border-gray-300 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-purple-600 hover:bg-purple-700"
      : "bg-purple-500 hover:bg-purple-600",
    footer: isDark ? "text-gray-400" : "text-gray-600",
    link: isDark
      ? "text-purple-400 hover:text-purple-300"
      : "text-purple-600 hover:text-purple-500",
    cardBorder: isDark ? "border-gray-700" : "border-gray-200",
    // Simplified shadows for mobile
    cardGlow: isMobile
      ? isDark ? "shadow-md" : "shadow-sm"
      : isDark
      ? "shadow-[0_0_35px_rgba(147,51,234,0.3)]"
      : "shadow-[0_0_20px_rgba(147,51,234,0.15)]",
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Layer - simplified for mobile */}
      <div className="fixed inset-0 z-0">
        {/* Solid Background */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: themeStyles.background }}
        />

        {/* Dot pattern only on non-mobile */}
        {!isMobile && (
          <div className="absolute inset-0 z-[1]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(${
                  isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"
                } 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {/* Theme toggle button */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`fixed bottom-4 right-4 p-3 rounded-full transition-colors 
            shadow-lg hover:scale-110 transform duration-200 z-50
            ${
            isDark ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-800"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        <div className="max-w-xl mx-auto">
          <Header
            isLogin={data.isLogin}
            avatar_url={data.avatar_url}
            html_url={data.html_url}
            isDark={isDark}
          />

          <main className="max-w-2xl mx-auto px-4">
            {/* Post creation card - reduced blur effects */}
            <div
              className={`${themeStyles.cardBg} rounded-lg ${themeStyles.cardGlow} p-6 mb-4 border ${themeStyles.cardBorder} ${
                !isMobile ? "backdrop-blur-lg" : ""
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <textarea
                    placeholder="What's on your mind?"
                    value={postContent}
                    onInput={handleChange}
                    onKeyDown={handleKeyDown}
                    required
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg border ${themeStyles.input} resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {/* Add hint text for keyboard shortcuts */}
                  <p className={`text-xs mt-1 ${themeStyles.footer} hidden sm:block`}>
                    Press Enter to submit, Shift+Enter for new line
                  </p>
                  <p className={`text-xs mt-1 ${themeStyles.footer} block sm:hidden`}>
                    Enter to send
                  </p>
                </div>

                <div className="flex justify-start w-full">
                  {submitSuccess && (
                    <div className="bg-green-500/20 text-green-500 px-4 py-2 rounded-lg">
                      Post created successfully!
                    </div>
                  )}
                  {isSubmitting && (
                    <div className="bg-blue-500/20 text-blue-500 px-4 py-2 rounded-lg">
                      Posting...
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Posts list - performance optimized */}
            <div className="space-y-4 mb-8">
              {posts.length > 0
                ? (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className={`${themeStyles.cardBg} rounded-lg ${themeStyles.cardGlow} p-6 border ${themeStyles.cardBorder} relative ${
                        !isMobile ? "backdrop-blur-lg" : ""
                      } ${
                        !isMobile
                          ? "transition-all duration-300 hover:scale-[1.01]"
                          : ""
                      }`}
                    >
                      {/* Delete button - only visible to post author */}
                      {data.isLogin && data.author === post.author && (
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          className={`absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-700/30 transition-colors ${
                            isDark
                              ? "text-gray-400 hover:text-gray-200"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                          aria-label="Delete post"
                        >
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
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6">
                            </path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}

                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {post.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className={`font-medium ${themeStyles.text}`}>
                            {post.author}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(post.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Make the content clickable to view details */}
                      <a href={`/post/${post.id}`} className="block">
                        <p
                          className={`${themeStyles.text} whitespace-pre-wrap mb-3`}
                        >
                          {post.content}
                        </p>
                      </a>

                      {/* Comment count indicator - only shown when comments exist */}
                      <div className="mt-4 pt-3 border-t border-gray-700/30 flex items-center">
                        <a
                          href={`/post/${post.id}`}
                          className={`flex items-center gap-x-1 ${themeStyles.footer} hover:${
                            themeStyles.link.split(" ")[0]
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="icon icon-tabler icons-tabler-outline icon-tabler-message-2"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M8 9h8" />
                            <path d="M8 13h6" />
                            <path d="M9 18h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-3l-3 3l-3 -3z" />
                          </svg>
                          <span>
                            {post.commentCount
                              ? (
                                <>
                                  {post.commentCount} {post.commentCount === 1
                                    ? "comment"
                                    : "comments"}
                                </>
                              )
                              : (
                                "Add comment"
                              )}
                          </span>
                        </a>
                      </div>
                    </div>
                  ))
                )
                : (
                  <div
                    className={`${themeStyles.cardBg} rounded-lg ${themeStyles.cardGlow} p-6 border ${themeStyles.cardBorder} text-center ${themeStyles.text} ${
                      !isMobile ? "backdrop-blur-lg" : ""
                    }`}
                  >
                    <p>No posts yet. Be the first to post something!</p>
                  </div>
                )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
