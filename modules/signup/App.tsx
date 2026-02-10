type Props = {
  submitted?: boolean;
  error?: string | null;
  data?: { identifier?: string; password?: string } | null;
};

import Footer from "../shared/Footer.tsx";

export function App(props: Props) {
  const { submitted, error, data } = props;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <h1>Sign Up</h1>
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
              <div style={{ marginBottom: 8 }}>
                <label>
                  Email / No. Handphone:
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
              <button type="submit">Sign up</button>
            </form>

            <div style={{ marginTop: 12 }}>
              <small>
                Already have an account? <a href="/signin">Sign in</a>
              </small>
            </div>
          </>
        )}
      <Footer />
    </div>
  );
}

export default App;
