type Props = {
  user?: string;
};

export function App({ user }: Props) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome {user}</p>

      <form method="POST" action="/signout">
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}

export default App;
