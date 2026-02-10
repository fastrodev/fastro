type Props = {
  submitted?: boolean;
  error?: string | null;
  data?: { identifier?: string } | null;
};

import Footer from "../shared/Footer.tsx";

export function App(props: Props) {
  const { submitted, error, data } = props;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <h1>Sign In</h1>
      {error && (
        <div style={{ color: "#900", marginBottom: 12 }}>Error: {error}</div>
      )}

      {submitted
        ? (
          <div>
            <h2>Signed in</h2>
            <p>Welcome back:</p>
            <pre
              style={{ background: "#f6f8fa", padding: 12 }}
            >{JSON.stringify(data, null, 2)}</pre>
          </div>
        )
        : (
          <form method="POST" action="/signin">
            <div style={{ marginBottom: 8 }}>
              <label>
                Email / Phone Number:
                <br />
                <input name="identifier" />
              </label>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>
                Password:
                <br />
                <input name="password" type="password" />
              </label>
            </div>
            <button type="submit">Sign in</button>
            <div style={{ marginTop: 12 }}>
              <small>
                Don't have an account? <a href="/signup">Sign up here</a>.
              </small>
            </div>
          </form>
        )}
      <Footer />
    </div>
  );
}

export default App;
