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
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Update Password
          </h1>

          {msg && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <p className="text-sm text-green-700">{msg}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form method="POST" action="/password" className="w-full">
            {identifier
              ? (
                <div className="mb-5 bg-gray-50 border border-gray-200 rounded-md p-3">
                  <p className="text-sm text-gray-600">
                    Using account:{" "}
                    <strong className="text-gray-900">{identifier}</strong>
                    <span className="ml-2 text-xs text-gray-400">
                      (read-only)
                    </span>
                  </p>
                </div>
              )
              : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identifier (email or phone)
                  </label>
                  <input
                    type="text"
                    name="identifier"
                    defaultValue={identifier}
                    placeholder="you@example.com"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Create new password"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="password_confirm"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
