import { useEffect, useState } from "preact/hooks";
import { PageProps } from "@app/mod.ts";
import Header from "./header.tsx";
import { JSX } from "preact/jsx-runtime";

interface Post {
  id: string;
  content: string;
  timestamp: string;
  author: string;
}

interface Comment {
  id: string;
  content: string;
  postId: string;
  timestamp: string;
  author: string;
}

export default function Post({ data }: PageProps<{
  title: string;
  description: string;
  baseUrl: string;
  isLogin: boolean;
  avatar_url: string;
  html_url: string;
  author: string;
  post: Post;
}>) {
  const [isDark, setIsDark] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch comments on page load
  useEffect(() => {
    fetchComments();
  }, []);

  // Fetch comments for this post
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments/${data.post.id}`);
      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Handle comment submission
  const handleCommentSubmit = async (
    e: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) => {
    e.preventDefault();
    if (!commentText.trim() || !data.isLogin) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText,
          postId: data.post.id,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setCommentText("");
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Revised keyboard handling approach
  const handleKeyDown = (
    e: JSX.TargetedEvent<HTMLTextAreaElement, KeyboardEvent>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (commentText.trim() && data.isLogin) {
        handleCommentSubmit({
          preventDefault: () => {},
        } as unknown as JSX.TargetedEvent<HTMLFormElement, Event>);
      }
    }
  };

  // Simplified text change handler
  const handleTextChange = (
    e: JSX.TargetedEvent<HTMLTextAreaElement, Event>,
  ) => {
    setCommentText(e.currentTarget.value);
  };

  // Theme styles
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
    cardGlow: isDark
      ? "shadow-[0_0_35px_rgba(147,51,234,0.3)]"
      : "shadow-[0_0_20px_rgba(147,51,234,0.15)]",
  };

  const { post } = data;

  // Format the date for display
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        {/* Solid Background */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: themeStyles.background }}
        />

        {/* Subtle Dot Pattern */}
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

        <div className="max-w-xl mx-auto backdrop-blur-lg">
          <Header
            isLogin={data.isLogin}
            avatar_url={data.avatar_url}
            html_url={data.html_url}
            isDark={isDark}
          />

          <main className="max-w-2xl mx-auto px-4">
            {/* Post Detail Card */}
            <div
              className={`${themeStyles.cardBg} rounded-lg ${themeStyles.cardGlow} p-6 border ${themeStyles.cardBorder} backdrop-blur-lg mb-4`}
            >
              {/* Post author info */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <p className={`font-medium text-lg ${themeStyles.text}`}>
                    {post.author}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {formatDate(post.timestamp)}
                  </p>
                </div>
              </div>

              {/* Post content */}
              <div
                className={`${themeStyles.text} text-lg whitespace-pre-wrap leading-relaxed mb-6`}
              >
                {post.content}
              </div>

              {/* Comments section with improved responsiveness */}
              <div
                className={`mt-4 sm:mt-6 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                } pt-3 sm:pt-4`}
              >
                <form
                  onSubmit={handleCommentSubmit}
                  className="flex items-start space-x-2 sm:space-x-3 mb-6 mt-6"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {data.isLogin ? data.author?.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="flex-grow min-w-0">
                    <textarea
                      placeholder={data.isLogin
                        ? "Add a comment... (press Enter to submit)"
                        : "Login to comment"}
                      value={commentText}
                      onInput={handleTextChange}
                      onKeyDown={handleKeyDown}
                      rows={2}
                      disabled={!data.isLogin}
                      className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border ${themeStyles.input} resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        !data.isLogin ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    />
                    {data.isLogin && (
                      <>
                        <p
                          className={`text-xs mt-1 ${themeStyles.footer} hidden sm:block`}
                        >
                          Press Enter to submit, Shift+Enter for new line
                        </p>
                        <p
                          className={`text-xs mt-1 ${themeStyles.footer} block sm:hidden`}
                        >
                          Enter to send
                        </p>
                      </>
                    )}
                  </div>
                </form>

                {/* Display comments */}
                <div className="space-y-4">
                  {isLoading
                    ? (
                      <div
                        className={`text-center py-4 ${themeStyles.text} opacity-70`}
                      >
                        Loading comments...
                      </div>
                    )
                    : comments.length > 0
                    ? (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`flex space-x-2 sm:space-x-3 ${themeStyles.text} items-baseline`}
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <div
                            className={`flex-grow rounded-lg`}
                          >
                            <div className="flex justify-between items-baseline mb-2">
                              <span className="font-medium">
                                {comment.author}
                              </span>
                              <span className={`text-xs ${themeStyles.footer}`}>
                                {formatDate(comment.timestamp)}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap text-sm">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )
                    : (
                      <div
                        className={`text-center py-4 ${themeStyles.text} opacity-70`}
                      >
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
