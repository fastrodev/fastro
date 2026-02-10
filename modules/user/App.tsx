import Page from "../shared/Page.tsx";

type Props = {
  username?: string;
  name?: string;
  bio?: string;
  notFound?: boolean;
  currentUser?: string;
};

export function App({ username, name, bio, notFound, currentUser }: Props) {
  if (notFound) {
    return (
      <Page>
        <div className="max-w-md mx-auto text-center py-12">
          <div className="text-6xl">🧭</div>
          <h2 className="mt-4 text-2xl font-semibold">User Not Found</h2>
          <p className="mt-2 text-gray-500">
            The profile you are looking for does not exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Home
          </a>
        </div>
      </Page>
    );
  }

  return (
    <Page user={currentUser} title={`${name || username}'s Profile`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 py-6">
          <div className="flex-shrink-0 flex items-center justify-center md:justify-start">
            <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-4xl font-bold">
                {(name || username || "?").slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex-1">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold">{username}</h2>
              {currentUser === username
                ? (
                  <a
                    href="/profile"
                    className="ml-2 px-3 py-1 border rounded-md text-sm"
                  >
                    Edit Profile
                  </a>
                )
                : (
                  <button
                    type="button"
                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                  >
                    Follow
                  </button>
                )}
            </div>

            <div className="mt-4 flex space-x-6 text-sm">
              <div>
                <span className="font-semibold">0</span> posts
              </div>
              <div>
                <span className="font-semibold">0</span> followers
              </div>
              <div>
                <span className="font-semibold">0</span> following
              </div>
            </div>

            <div className="mt-4 text-gray-800">
              <div className="font-medium">{name}</div>
              {bio
                ? (
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                    {bio}
                  </p>
                )
                : <p className="mt-2 text-sm text-gray-500">No bio yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default App;
