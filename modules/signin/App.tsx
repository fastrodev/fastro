type Props = {
  submitted?: boolean;
  error?: string | null;
  data?: { identifier?: string } | null;
};

import { useState } from "react";
import Page from "../shared/Page.tsx";
import Spinner from "../shared/Spinner.tsx";

export function App(props: Props) {
  const { submitted, error, data } = props;
  const [loading, setLoading] = useState(false);

  return (
    <Page title={undefined} hideHeader hideFooter fullWidth>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `,
        }}
      />
      <div className="relative flex-1 flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
        {/* Artistic Background Blobs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-blob">
        </div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000">
        </div>

        <div className="w-full max-w-md relative z-10 transition-all duration-500">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
              Fastro CMS
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Welcome back. Please sign in to continue.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-2xl rounded-3xl p-8 sm:p-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-red-500 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              </div>
            )}

            {submitted
              ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Signed in
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 text-left border border-gray-100 dark:border-gray-700">
                    <pre className="text-xs font-mono text-gray-600 dark:text-gray-400 overflow-auto max-h-40">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                </div>
              )
              : (
                <form
                  method="POST"
                  action="/signin"
                  className="space-y-6"
                  onSubmit={() => setLoading(true)}
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                      Identifier
                    </label>
                    <input
                      name="identifier"
                      required
                      className="block w-full px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-gray-900 dark:text-white"
                      placeholder="Email or phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      className="block w-full px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-gray-900 dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex items-center justify-center px-6 py-4 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Spinner className="h-5 w-5" /> : (
                      <>
                        Sign in
                        <svg
                          className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </button>

                  <div className="pt-8 text-center border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Don't have an account?{" "}
                      <a
                        href="/signup"
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        Create account
                      </a>
                    </p>
                  </div>
                </form>
              )}
          </div>

          {/* Back to Home Link */}
          <div className="mt-8 text-center">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-all active:scale-95"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to home</span>
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default App;
