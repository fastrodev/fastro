type Props = {
  user?: string;
  name?: string;
};

import Header from "../shared/Header.tsx";
import Footer from "../shared/Footer.tsx";

export function App({ user, name }: Props) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <Header user={user} />

      <h1>Dashboard</h1>
      <p>Welcome {name || user}</p>

      <p style={{ fontSize: "0.9em", color: "#666" }}>
        Your public profile: <a href={`/u/${user}`}>/u/{user}</a>
      </p>

      <Footer />
    </div>
  );
}

export default App;
