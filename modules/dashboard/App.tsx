type Props = {
  user?: string;
  name?: string;
};

import Page from "../shared/Page.tsx";

export function App({ user, name }: Props) {
  return (
    <Page user={user} title="Dashboard">
      <div className="mb-6 p-4 rounded-lg bg-white/60 backdrop-blur border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500">Welcome back</p>
        <h2 className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          <span className="mr-2">Hello,</span>
          <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {name || user}
          </span>
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Your public profile:{" "}
          <a className="text-indigo-600 hover:underline" href={`/u/${user}`}>
            /u/{user}
          </a>
        </p>
      </div>
    </Page>
  );
}

export default App;
