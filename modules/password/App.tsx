type Props = {
  identifier?: string;
  error?: string | null;
  msg?: string | null;
};

export function App({ identifier, error, msg }: Props) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <h1>Update Password</h1>

      <nav style={{ marginBottom: 20 }}>
        <a href="/dashboard" style={{ marginRight: 10 }}>Home</a>
        <a href="/profile" style={{ marginRight: 10 }}>Profile</a>
        <a href="/password">Change Password</a>
      </nav>

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
              <label>
                Identifier (email or phone):<br />
                <input
                  type="text"
                  name="identifier"
                  defaultValue={identifier}
                  placeholder="you@example.com"
                  style={{ width: "100%", maxWidth: "360px" }}
                />
              </label>
            </div>
          )}

        <div style={{ marginBottom: 10 }}>
          <label>
            Current Password:<br />
            <input
              type="password"
              name="current_password"
              style={{ width: "100%", maxWidth: "360px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            New Password:<br />
            <input
              type="password"
              name="password"
              style={{ width: "100%", maxWidth: "360px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Confirm New Password:<br />
            <input
              type="password"
              name="password_confirm"
              style={{ width: "100%", maxWidth: "360px" }}
            />
          </label>
        </div>

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default App;
