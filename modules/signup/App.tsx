type Props = {
  submitted?: boolean;
  error?: string | null;
  data?: { identifier?: string; password?: string } | null;
};

import Page from "../shared/Page.tsx";

export function App(props: Props) {
  const { submitted, error, data } = props;

  return (
    <Page title="Sign Up">
      {error && (
        <div style={{ color: "#900", marginBottom: 12 }}>Error: {error}</div>
      )}

      {submitted
        ? (
          <div>
            <h2>Registration successful</h2>
            <p>Here are the submitted values:</p>
            <pre
              style={{ background: "#f6f8fa", padding: 12 }}
            >{JSON.stringify(data, null, 2)}</pre>
          </div>
        )
        : (
          <>
            <form method="POST" action="/signup">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email / Phone Number
                  <input
                    name="identifier"
                    className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                  <input
                    name="password"
                    type="password"
                    className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </form>

            <div style={{ marginTop: 12 }}>
              <small>
                Already have an account? <a href="/signin">Sign in</a>
              </small>
            </div>
          </>
        )}
    </Page>
  );
}

export default App;
