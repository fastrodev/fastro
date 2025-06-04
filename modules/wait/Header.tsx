import { JSX } from "preact";
import MobileNavigation from "./MobileNavigation.tsx";
import MobileTableOfContents from "./MobileTableOfContents.tsx";
import BoltSvg from "../../components/icons/bolt.tsx";
import GithubSvg from "../../components/icons/github-svg.tsx";

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
  return (
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center gap-2 py-4 relative">
          <div class="relative lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              class="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm text-sm text-gray-700 hover:bg-gray-50"
            >
              <svg
                class="w-4 h-4"
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

            <MobileNavigation
              isOpen={isMobileNavOpen}
              baseUrl={baseUrl}
              navigationSections={navigationSections}
            />
          </div>
          <div
            class={`flex items-center gap-2 text-lg font-semibold text-gray-900`}
          >
            <BoltSvg width="32" height="32" />
            <span class={`hidden lg:block`}>Fastro</span>
          </div>

          <div class="flex-1 mx-2">
            <input
              type="text"
              placeholder="Cari..."
              class="w-full px-3 py-2 bg-white border rounded-lg shadow-sm text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div
            class={`hidden lg:flex items-center gap-4 ${
              isLogin ? "justify-end" : "justify-between"
            }`}
          >
            <a href={`${baseUrl}/Docs`}>Docs</a>
            <a href="#">Blog</a>
            <a href="#">
              <GithubSvg />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
