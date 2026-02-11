type Props = {
  user?: string;
  name?: string;
  bio?: string;
  msg?: string;
};

import Page from "../shared/Page.tsx";

export function App({ user, name, bio, msg }: Props) {
  return (
    <Page user={user} title={undefined}>
      <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-24">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            User Profile
          </h1>

          {msg && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <p className="text-sm text-green-700">{msg}</p>
            </div>
          )}

          <form method="POST" action="/profile" className="w-full">
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                defaultValue={user}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={name}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                defaultValue={bio}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
              />
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default App;
