type Props = {
  user?: string;
  name?: string;
  bio?: string;
  msg?: string;
};

import Header from "../shared/Header.tsx";
import Footer from "../shared/Footer.tsx";

export function App({ user, name, bio, msg }: Props) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <Header user={user} />
      <h1>User Profile</h1>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <form method="POST" action="/profile">
        <div style={{ marginBottom: 10 }}>
          <label>
            Username:<br />
            <input
              type="text"
              name="username"
              defaultValue={user}
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Full Name:<br />
            <input
              type="text"
              name="name"
              defaultValue={name}
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>
            Bio:<br />
            <textarea
              name="bio"
              defaultValue={bio}
              style={{ width: "100%", maxWidth: "300px", height: "100px" }}
            />
          </label>
        </div>
        <button type="submit">Update Profile</button>
      </form>

      <Footer />
    </div>
  );
}

export default App;
