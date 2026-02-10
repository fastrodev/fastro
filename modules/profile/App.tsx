type Props = {
  user?: string;
  name?: string;
  bio?: string;
  msg?: string;
};

import Page from "../shared/Page.tsx";

export function App({ user, name, bio, msg }: Props) {
  return (
    <Page user={user} title="User Profile">
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      <form method="POST" action="/profile">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Username
            <input
              type="text"
              name="username"
              defaultValue={user}
              className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
            <input
              type="text"
              name="name"
              defaultValue={name}
              className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Bio
            <textarea
              name="bio"
              defaultValue={bio}
              className="mt-1 block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
            />
          </label>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Update Profile
        </button>
      </form>
    </Page>
  );
}

export default App;
