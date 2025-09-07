// deno-lint-ignore-file no-window no-window-prefix
import { JSX } from "preact";
import MobileNavigation from "./MobileNavigation.tsx";
import BoltSvg from "../../components/icons/bolt.tsx";
import GithubSvg from "../../components/icons/github-svg.tsx";
import { useEffect, useState } from "preact/hooks";
import UserAccountSvg from "../../components/icons/user-account-svg.tsx";

interface NavigationItem {
  href: string;
  label: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface HeaderProps {
  title: string;
  isLogin: boolean;
  user: string;
  avatar_url: string;
  baseUrl: string;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  isMobileTocOpen: boolean;
  setIsMobileTocOpen: (open: boolean) => void;
  navigationSections: NavigationSection[];
}

export default function Header(
  {
    title,
    isLogin,
    user,
    avatar_url,
    baseUrl,
    isMobileNavOpen,
    setIsMobileNavOpen,
    isMobileTocOpen,
    setIsMobileTocOpen,
    navigationSections,
  }: HeaderProps,
): JSX.Element {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => setAtTop(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      class={`bg-gray-950 transition-shadow duration-200 ${
        atTop ? "" : "shadow-lg"
      }`}
    >
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center py-4 relative">
          <div class="relative lg:hidden">
            {navigationSections.length > 0 && (
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                // add small space on the right
                class="flex items-center p-2 mr-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm text-sm text-gray-300 hover:bg-gray-700"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  >
                  </path>
                </svg>
              </button>
            )}

            {navigationSections.length > 0 && (
              <MobileNavigation
                isOpen={isMobileNavOpen}
                navigationSections={navigationSections}
              />
            )}
          </div>

          <a
            href={`${baseUrl}/`}
            class="flex items-center gap-1"
            aria-label="Fastro Home"
          >
            <div class={`border border-gray-700 rounded-full p-1 bg-gray-800`}>
              <BoltSvg width="22" height="22" />
            </div>
            <span class="hidden sm:block ml-2 text-xl font-bold text-white">
              Fastro
            </span>
          </a>

          <div class="flex-1"></div>

          <div class="flex items-center gap-4">
            <button
              type="button"
              aria-label="Search"
              class="text-gray-300 hover:text-white flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-search"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
              <span class="hidden sm:block">Search</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
