type Props = {
  user?: string;
  name?: string;
};

import Page from "../shared/Page.tsx";

export function App({ user, name }: Props) {
  return (
    <Page user={user} title="Dashboard">
      <div className="mb-6 p-5 sm:p-6 rounded-xl bg-white/60 backdrop-blur-md border border-gray-100 shadow-sm">
        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
          Welcome back
        </p>
        <h2 className="mt-2 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-[1.1]">
          <span className="block xs:inline mr-2">Hello,</span>
          <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent break-words">
            {name || user}
          </span>
        </h2>
        <div className="mt-4 pt-4 border-t border-gray-100/50">
          <p className="text-sm text-gray-600 flex flex-col xs:flex-row xs:items-center gap-1">
            <span className="shrink-0">Your public profile:</span>
            <a
              className="text-indigo-600 hover:text-indigo-700 font-medium truncate"
              href={`/u/${user}`}
            >
              /u/{user}
            </a>
          </p>
        </div>
      </div>
    </Page>
  );
}

export default App;
