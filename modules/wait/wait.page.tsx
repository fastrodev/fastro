import { PageProps } from "@app/mod.ts";
import { useState } from "preact/hooks";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
// import Navigation from "./Navigation.tsx";
// import TableOfContents from "./TableOfContents.tsx";
import BoltSvg from "../../components/icons/bolt.tsx";

export default function Wait({ data }: PageProps<
  {
    user: string;
    title: string;
    description: string;
    baseUrl: string;
    new: string;
    destination: string;
    isLogin: boolean;
    avatar_url: string;
    html_url: string;
  }
>) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  return (
    <div class="min-h-screen" style="background-color: rgb(244, 242, 238);">
      <div class="sticky top-0 z-50">
        <Header
          title={data.title}
          isLogin={data.isLogin}
          user={data.user}
          avatar_url={data.avatar_url}
          baseUrl={data.baseUrl}
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
          isMobileTocOpen={isMobileTocOpen}
          setIsMobileTocOpen={setIsMobileTocOpen}
          navigationSections={[]}
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-6 py-6">
          <div class="flex-1 min-w-0">
            <main class="bg-white rounded-lg shadow-sm border p-8 lg:p-12 text-center">
              <div class="flex justify-center mb-4">
                <BoltSvg width="64" height="64" />
              </div>
              <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {data.title}
              </h1>
              <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                {data.description}
              </p>
              <div class="flex flex-col lg:flex-row items-center justify-center gap-4">
                <a
                  href={`/docs`}
                  class="w-full sm:w-80 lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Getting Started
                </a>
                <div class="w-full sm:w-80 lg:w-auto bg-gray-100 border rounded-lg p-4 font-mono text-sm text-gray-800">
                  deno run -A -r https://fastro.deno.dev
                </div>
              </div>
            </main>
          </div>

          <div class="flex flex-col lg:flex-row gap-6">
            <a href="/docs" class="flex-1 min-w-0">
              <main class="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:p-8 text-center">
                <div class="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-book"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                    <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                    <path d="M3 6l0 13" />
                    <path d="M12 6l0 13" />
                    <path d="M21 6l0 13" />
                  </svg>
                </div>
                <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Documentation
                </h1>
                <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Comprehensive guides, API references, and tutorials to help
                  you build amazing applications with Fastro.
                </p>
              </main>
            </a>
            <a href="/blog" class="flex-1 min-w-0">
              <main class="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:p-8 text-center">
                <div class="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-notebook"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
                    <path d="M13 8l2 0" />
                    <path d="M13 12l2 0" />
                  </svg>
                </div>
                <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Blog
                </h1>
                <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Stay updated with the latest features, best practices, and
                  insights from the Fastro community.
                </p>
              </main>
            </a>
          </div>
        </div>
      </div>

      <Footer
        title={data.title}
        description={data.description}
        baseUrl={data.baseUrl}
      />
    </div>
  );
}
