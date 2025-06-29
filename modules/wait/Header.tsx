// deno-lint-ignore-file no-window no-window-prefix
import { JSX } from "preact";
import MobileNavigation from "./MobileNavigation.tsx";
import BoltSvg from "../../components/icons/bolt.tsx";
import GithubSvg from "../../components/icons/github-svg.tsx";
import { useEffect, useState } from "preact/hooks";

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
      class={`bg-gray-900 transition-shadow duration-200 ${
        atTop ? "" : "shadow-lg"
      }`}
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center py-6 gap-3 relative">
          <div class="relative lg:hidden">
            {navigationSections.length > 0 && (
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                class="flex items-center p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm text-sm text-gray-300 hover:bg-gray-700"
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
            class="flex items-center gap-2 text-lg font-semibold text-white"
            aria-label="Fastro Home"
          >
            <BoltSvg width="32" height="32" />
            <span class="sr-only">Fastro Home</span>
            <span class="hidden lg:block">Fastro</span>
          </a>

          <div class="flex-1">
            <input
              type="text"
              placeholder="Search..."
              class="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-2xl shadow-sm text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div
            class={`hidden lg:flex items-center gap-4 ${
              isLogin ? "justify-end" : "justify-between"
            }`}
          >
            <a
              href="https://github.com/fastrodev/fastro"
              aria-label="Fastro on GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubSvg />
              <span class="sr-only">Fastro on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
