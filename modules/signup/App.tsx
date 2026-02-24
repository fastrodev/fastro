type Props = {
  submitted?: boolean;
  error?: string | null;
  data?: { identifier?: string; password?: string } | null;
};

import { useState } from "react";
import Page from "../shared/Page.tsx";
import Spinner from "../shared/Spinner.tsx";

export function App(props: Props) {
  const { submitted, error } = props;
  const [loading, setLoading] = useState(false);

  return (
    <Page title={undefined} hideHeader hideFooter fullWidth>
      <div className="relative flex-1 flex flex-col items-center justify-center py-12 px-4 overflow-hidden bg-canvas-default text-fg-default">
        <div className="w-full max-w-md relative z-10 transition-all duration-500">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-fg-default mb-3">
              Join Fastro
            </h1>
            <p className="text-fg-muted">
              Create your account to start managing content.
            </p>
          </div>

          <div className="bg-canvas-default/90 dark:bg-canvas-subtle/10 backdrop-blur-xl border border-border-default dark:border-border-subtle shadow-2xl rounded-2xl p-8 sm:p-10">
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
                <p className="text-sm text-red-600 font-medium">
                  {error}
                </p>
              </div>
            )}

            {submitted
              ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-emerald-500"
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
                  <h2 className="text-2xl font-bold text-fg-default mb-2">
                    Welcome aboard!
                  </h2>
                  <p className="text-fg-muted mb-8">
                    Your account has been created successfully.
                  </p>
                  <a
                    href="/signin"
                    className="inline-flex items-center justify-center px-8 py-3 bg-accent-fg hover:opacity-95 text-canvas-default font-bold rounded-2xl shadow-lg shadow-accent-fg/20 transition-all active:scale-[0.98]"
                  >
                    Go to Sign in
                  </a>
                </div>
              )
              : (
                <form
                  method="POST"
                  action="/signup"
                  className="space-y-6"
                  onSubmit={() => setLoading(true)}
                >
                  <div>
                    <label className="block text-sm font-semibold text-fg-default mb-2 ml-1">
                      Email or Phone
                    </label>
                    <input
                      name="identifier"
                      required
                      className="block w-full px-5 py-3 bg-canvas-subtle border border-border-default rounded-2xl focus:outline-none focus:border-accent-fg/30 focus:ring-4 focus:ring-accent-fg/5 transition-all text-fg-default placeholder:text-fg-muted text-sm shadow-sm"
                      placeholder="Enter details"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-fg-default mb-2 ml-1">
                      Create Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      className="block w-full px-5 py-3 bg-canvas-subtle border border-border-default rounded-2xl focus:outline-none focus:border-accent-fg/30 focus:ring-4 focus:ring-accent-fg/5 transition-all text-fg-default placeholder:text-fg-muted text-sm shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex items-center justify-center px-6 py-4 bg-accent-fg hover:opacity-95 text-canvas-default font-bold rounded-2xl shadow-lg shadow-accent-fg/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Spinner className="h-5 w-5" /> : (
                      <>
                        Sign up
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

                  <div className="pt-8 text-center border-t border-border-subtle">
                    <p className="text-sm text-fg-muted">
                      Already have an account?{" "}
                      <a
                        href="/signin"
                        className="text-accent-fg font-bold hover:underline"
                      >
                        Sign in
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
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-fg-muted hover:text-fg-default transition-all active:scale-95"
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
