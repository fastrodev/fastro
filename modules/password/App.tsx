type Props = {
  identifier?: string;
  error?: string | null;
  msg?: string | null;
};

import Page from "../shared/Page.tsx";

export function App({ identifier, error, msg }: Props) {
  return (
    <Page user={identifier} title={undefined}>
      <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-24">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Update Password
          </h1>

          {msg && (
            <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-400 dark:border-green-600 p-4 mb-6">
              <p className="text-sm text-green-700 dark:text-green-300">
                {msg}
              </p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400 dark:border-red-600 p-4 mb-6">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <form method="POST" action="/password" className="w-full">
            {identifier
              ? (
                <div className="mb-5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Using account:{" "}
                    <strong className="text-gray-900 dark:text-gray-100">
                      {identifier}
                    </strong>
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                      (read-only)
                    </span>
                  </p>
                </div>
              )
              : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Identifier (email or phone)
                  </label>
                  <input
                    type="text"
                    name="identifier"
                    defaultValue={identifier}
                    placeholder="you@example.com"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="••••••••"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Create new password"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="password_confirm"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Repeat new password"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default App;
