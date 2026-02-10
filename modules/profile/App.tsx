type Props = {
  user?: string;
  name?: string;
  bio?: string;
  msg?: string;
};

export function App({ user, name, bio, msg }: Props) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <h1>User Profile</h1>
      <nav style={{ marginBottom: 20 }}>
        <a href="/dashboard" style={{ marginRight: 10 }}>Home</a>
        <a href="/profile" style={{ marginRight: 10 }}>Profile</a>
        <a href="/password">Change Password</a>
      </nav>

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <p>
        <a href={`/u/${user}`}>View your public profile</a>
      </p>

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

      <hr style={{ margin: "20px 0" }} />

      <form method="POST" action="/signout">
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}

export default App;
