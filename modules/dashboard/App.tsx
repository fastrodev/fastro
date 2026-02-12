type Props = {
  user?: string;
  name?: string;
};

import Page from "../shared/Page.tsx";

export function App({ user, name }: Props) {
  return (
    <Page user={user} title="Dashboard">
      <div className="mb-6 p-5 sm:p-6 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-sm">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
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
            Share your thoughts with the world by writing a new blog post.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
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
            View, edit, or delete your existing blog posts and drafts.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
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
            Track views, engagement, and performance of your content.
          </p>
        </div>
      </div>
    </Page>
  );
}

export default App;
