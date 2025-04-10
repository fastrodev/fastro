import { useState } from "preact/hooks";
import { PageProps } from "@app/mod.ts";
import Header from "./header.tsx";
// import { JSX } from "preact/jsx-runtime";

interface Post {
  id: string;
  content: string;
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
  post: Post;
}>) {
  const [isDark, setIsDark] = useState(true);

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Theme styles with solid colors
  const themeStyles = {
    background: isDark
      ? "#0f172a" /* Slate 900 - solid dark background */
      : "#f8fafc", /* Very light gray - solid light background */
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
      ? "shadow-[0_0_35px_rgba(147,51,234,0.3)]" /* Enhanced purple glow for dark theme */
      : "shadow-[0_0_20px_rgba(147,51,234,0.15)]", /* Light purple glow */
  };

  const { post } = data;

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
              className={`${themeStyles.cardBg} rounded-lg ${themeStyles.cardGlow} p-6 border ${themeStyles.cardBorder} backdrop-blur-lg`}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <p className={`font-medium text-lg ${themeStyles.text}`}>
                    {post.author}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.timestamp).toLocaleString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div
                className={`${themeStyles.text} text-lg whitespace-pre-wrap leading-relaxed mb-8`}
              >
                {post.content}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
