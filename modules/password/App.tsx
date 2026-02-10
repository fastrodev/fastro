type Props = {
  identifier?: string;
  error?: string | null;
  msg?: string | null;
};

import Page from "../shared/Page.tsx";

export function App({ identifier, error, msg }: Props) {
  return (
    <Page user={identifier} title="Update Password">
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form method="POST" action="/password">
        {identifier
          ? (
            <div style={{ marginBottom: 10 }}>
              <p style={{ color: "#444" }}>
                Using account: <strong>{identifier}</strong>
                <span
                  style={{ marginLeft: 8, color: "#888", fontSize: "0.9em" }}
                >
                  (read-only)
                </span>
              </p>
            </div>
          )
          : (
            <div style={{ marginBottom: 10 }}>
              <label className="block text-sm font-medium text-gray-700">
                Identifier (email or phone)
                <input
                  type="text"
                  name="identifier"
                  defaultValue={identifier}
                  placeholder="you@example.com"
                  className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>
          )}

        <div style={{ marginBottom: 10 }}>
          <label className="block text-sm font-medium text-gray-700">
            Current Password
            <input
              type="password"
              name="current_password"
              className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label className="block text-sm font-medium text-gray-700">
            New Password
            <input
              type="password"
              name="password"
              className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
            <input
              type="password"
              name="password_confirm"
              className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Update Password
        </button>
      </form>
    </Page>
  );
}

export default App;
