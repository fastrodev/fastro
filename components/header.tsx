import BoltSvg from "@app/components/icons/bolt.tsx";
import AngleLeftSvg from "@app/components/icons/angle-left-svg.tsx";
import GithubSvg from "@app/components/icons/github-svg.tsx";
import GridSvg from "@app/components/icons/grid-svg.tsx";

export default function Header(
    props: {
        isLogin: boolean;
        avatar_url: string;
        html_url: string;
        title?: string;
        previous_url?: string;
    },
) {
    return (
        <div
            class={`container flex justify-between max-w-4xl mx-auto text-center text-sm py-6 px-3 xl:px-0 md:px-0 sm:px-0 dark:text-gray-400`}
        >
            <a href="/" class={`flex space-x-2 items-center dark:text-white`}>
                <div
                    class={`border-[2px] border-gray-400 rounded-full p-[4px]`}
                >
                    {props.isLogin
                        ? <GridSvg />
                        : props.previous_url
                        ? <AngleLeftSvg />
                        : <BoltSvg />}
                </div>
                <span>{`${props.title || "Fastro"}`}</span>
            </a>
            <div class={`flex items-center space-x-3`}>
                <a class={`dark:text-white`} href={"/blog"}>Blog</a>
                <a class={`dark:text-white`} href={"/docs"}>Docs</a>

                {props.isLogin && (
                    <a class={`dark:text-white`} href={"/signout"}>Sign out</a>
                )}
                {!props.isLogin && (
                    <a class={`dark:text-white`} href={"/signin"}>Sign in</a>
                )}

                <a
                    aria-label="user profile"
                    class={`dark:text-white`}
                    href={props.isLogin
                        ? props.html_url
                        : "https://github.com/fastrodev/fastro"}
                >
                    {!props.avatar_url ? <GithubSvg /> : (
                        <img
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
