type Props = {
  user?: string;
  name?: string;
};

export function App({ user, name }: Props) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome {name || user}</p>

      <p style={{ fontSize: "0.9em", color: "#666" }}>
        Your public profile: <a href={`/u/${user}`}>/u/{user}</a>
      </p>

      <nav style={{ marginBottom: 20 }}>
        <a href="/dashboard" style={{ marginRight: 10 }}>Home</a>
        <a href="/profile" style={{ marginRight: 10 }}>Profile</a>
        <a href="/password">Change Password</a>
      </nav>

      <form method="POST" action="/signout">
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}

export default App;
