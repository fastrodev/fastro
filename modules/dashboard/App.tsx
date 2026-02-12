type Props = {
  user?: string;
  name?: string;
};

import Page from "../shared/Page.tsx";
import { useEffect, useState } from "react";

export function App({ user, name }: Props) {
  const [gitStatus, setGitStatus] = useState({ branch: "", status: "" });

  useEffect(() => {
    fetch("/api/git/status")
      .then((res) => res.json())
      .then((data) => setGitStatus(data));
  }, []);

  return (
    <Page user={user} title="Dashboard">
      <div className="mb-6 p-5 sm:p-6 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Welcome back
          </p>
          <h2 className="mt-2 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            <span className="block xs:inline mr-2">Hello,</span>
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent wrap-break-word">
              {name || user}
            </span>
          </h2>
          <div className="mt-4 pt-4 border-t border-gray-100/50 dark:border-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex flex-col xs:flex-row xs:items-center gap-1">
              <span className="shrink-0">Your public profile:</span>
              <a
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium truncate"
                href={`/u/${user}`}
              >
                /u/{user}
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 md:gap-8 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-6 md:pt-0 md:pl-8">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">
              Git Branch
            </span>
            <span className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse">
              </span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {gitStatus.branch || "Loading..."}
              </span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">
              Storage
            </span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 mt-1">
              124.5 KB
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">
              Posts
            </span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 mt-1">
              12 Total
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-2">
        <a
          href="/posts/new"
          className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-400">Posts</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Create New Post
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Write and publish a new blog post.
          </p>
        </a>

        <a
          href="/posts"
          className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-400">Library</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Manage Posts
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Edit or delete your existing posts.
          </p>
        </a>

        <a
          href="/analytics"
          className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-400">Analytics</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Post Statistics
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track views and engagement metrics.
          </p>
        </a>

        <a
          href="/git"
          className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-400">Git</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Git Management
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage repo and sync your changes.
          </p>
        </a>

        <a
          href="/media"
          className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-400">Media</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Media Assets
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage images and your media files.
          </p>
        </a>

        <a
          href="/settings"
          className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-400">Settings</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Configurations
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure tokens and blog metadata.
          </p>
        </a>
      </div>
    </Page>
  );
}

export default App;
