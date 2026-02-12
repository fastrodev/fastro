type Props = {
  submitted?: boolean;
  error?: string | null;
  data?: { identifier?: string; password?: string } | null;
};

import { useState } from "react";
import Page from "../shared/Page.tsx";
import Spinner from "../shared/Spinner.tsx";

export function App(props: Props) {
  const { submitted, error, data } = props;
  const [loading, setLoading] = useState(false);

  return (
    <Page title={undefined}>
      <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-24">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Sign Up
          </h1>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitted
            ? (
              <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 border border-green-100 dark:border-green-900/30">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Registration successful
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Here are the submitted values:
                </p>
                <pre className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 text-sm overflow-auto font-mono text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700">
                  {JSON.stringify(data, null, 2)}
                </pre>
                <div className="mt-6">
                  <a
                    href="/signin"
                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Go to Sign in
                  </a>
                </div>
              </div>
            )
            : (
              <form
                method="POST"
                action="/signup"
                className="w-full"
                onSubmit={() => setLoading(true)}
              >
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email / Phone Number
                  </label>
                  <input
                    name="identifier"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Enter email or phone"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Create a password"
                  />
                </div>
                <div className="flex items-center justify-between mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && (
                      <span className="mr-2">
                        <Spinner className="h-4 w-4" />
                      </span>
                    )}
                    Sign up
                  </button>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Already have an account?{" "}
                    <a
                      href="/signin"
                      className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </form>
            )}
        </div>
      </div>
    </Page>
  );
}

export default App;
