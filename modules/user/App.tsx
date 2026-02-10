type Props = {
  username?: string;
  name?: string;
  bio?: string;
  notFound?: boolean;
  currentUser?: string | undefined;
};

import Header from "../shared/Header.tsx";
import Footer from "../shared/Footer.tsx";

export function App({ username, name, bio, notFound, currentUser }: Props) {
  if (notFound) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
        <h1>User Not Found</h1>
        <p>The user you are looking for does not exist.</p>
        <a href="/">Go to Home</a>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
      {currentUser ? <Header user={currentUser} /> : null}
      <h1>{name || username}'s Profile</h1>
      <p>
        <strong>Username:</strong> {username}
      </p>
      {name && (
        <p>
          <strong>Full Name:</strong> {name}
        </p>
      )}
      {bio && (
        <p>
          <strong>Bio:</strong>{" "}
          <span style={{ whiteSpace: "pre-wrap" }}>{bio}</span>
        </p>
      )}

      <Footer />
    </div>
  );
}

export default App;
