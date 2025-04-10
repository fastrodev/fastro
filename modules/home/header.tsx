import BoltSvg from "@app/components/icons/bolt.tsx";
// import AngleLeftSvg from "@app/components/icons/angle-left-svg.tsx";
import GithubSvg from "@app/components/icons/github-svg.tsx";
// import RocketSvg from "./icons/rocket-svg.tsx";

export default function Header(
  props: {
    isLogin: boolean;
    avatar_url: string;
    html_url: string;
    title?: string;
    previous_url?: string;
    isDark?: boolean;
  },
) {
  const textColorClass = props.isDark ? "text-gray-100" : "text-gray-700";
  const linkTextColorClass = props.isDark ? "text-gray-100" : "text-gray-700"; // Define link text color

  return (
    <div
      class={`container flex justify-between max-w-4xl mx-auto text-center text-sm py-6 px-3 xl:px-0 md:px-0 sm:px-0 ${textColorClass}`}
    >
      <div class={`flex space-x-2 items-center`}>
        <a href="/" class={`text-gray-100`}>
          <div
            class={`border-[1px] border-gray-600 bg-gray-900 rounded-full p-[1px]`}
          >
            <BoltSvg />
          </div>
        </a>
        <span class={`${textColorClass}`}>
          {`${props.title || "Fastro"}`}
        </span>
      </div>
      <div class={`flex items-center space-x-3`}>
        {props.isLogin && (
          <a class={`${linkTextColorClass}`} href="/signout">Sign out</a>
        )}
        {!props.isLogin && (
          <a class={`${linkTextColorClass}`} href="/signin">Sign in</a>
        )}

        <a
          aria-label="user profile"
          class={`${linkTextColorClass}`}
          href={props.isLogin
            ? props.html_url
            : "https://github.com/fastrodev/fastro"}
        >
          {!props.avatar_url ? <GithubSvg /> : (
            <img
              loading="lazy"
              src={props.avatar_url}
              width={24}
              class={`rounded-full`}
            />
          )}
        </a>
      </div>
    </div>
  );
}
