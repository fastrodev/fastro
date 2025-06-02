import { PageProps } from "@app/mod.ts";
import { useState } from "preact/hooks";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import Navigation from "./Navigation.tsx";
import TableOfContents from "./TableOfContents.tsx";

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
  const nav = [
    {
      title: "Learn",
      items: [
        { href: `${data.baseUrl}/docs/start`, label: "Getting started" },
        { href: `${data.baseUrl}/docs/structure`, label: "App Structure" },
        { href: `${data.baseUrl}/docs/hello-world`, label: "Hello World" },
        {
          href: `${data.baseUrl}/docs/hello-world-context`,
          label: "Hello World Context",
        },
        { href: `${data.baseUrl}/docs/hello-json`, label: "Hello JSON" },
        { href: `${data.baseUrl}/docs/routing`, label: "Routing" },
        { href: `${data.baseUrl}/docs/url-params`, label: "URL Params" },
        { href: `${data.baseUrl}/docs/query-params`, label: "Query Params" },
        {
          href: `${data.baseUrl}/docs/app-middleware`,
          label: "App Middleware",
        },
        {
          href: `${data.baseUrl}/docs/route-middleware`,
          label: "Route Middleware",
        },
        {
          href: `${data.baseUrl}/docs/markdown`,
          label: "Markdown Middleware",
        },
        {
          href: `${data.baseUrl}/docs/tailwind`,
          label: "Tailwind Middleware",
        },
        { href: `${data.baseUrl}/docs/static`, label: "Static File" },
        { href: `${data.baseUrl}/docs/tsx`, label: "Hello TSX" },
        { href: `${data.baseUrl}/docs/tsx-component`, label: "TSX Component" },
        {
          href: `${data.baseUrl}/docs/function-component`,
          label: "Function Component",
        },
        {
          href: `${data.baseUrl}/docs/server-side-rendering`,
          label: "Server Side Rendering",
        },
        { href: `${data.baseUrl}/docs/oauth`, label: "OAuth" },
        { href: `${data.baseUrl}/docs/mysql`, label: "MySQL" },
        { href: `${data.baseUrl}/docs/postgres`, label: "Postgres" },
        { href: `${data.baseUrl}/docs/redis`, label: "Redis" },
        { href: `${data.baseUrl}/docs/mongo`, label: "Mongo" },
        { href: `${data.baseUrl}/docs/deno-kv`, label: "Deno KV" },
        { href: `${data.baseUrl}/docs/grouping`, label: "Grouping" },
        { href: `${data.baseUrl}/docs/deployment`, label: "Deployment" },
        { href: `${data.baseUrl}/docs/store`, label: "Store" },
      ],
    },
    {
      title: "Reference",
      items: [
        { href: "#memulai", label: "Memulai" },
        { href: "#instalasi", label: "Instalasi" },
        { href: "#konfigurasi", label: "Konfigurasi" },
      ],
    },
  ];

  return (
    <div class="min-h-screen bg-gray-50">
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
          navigationSections={nav}
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6 py-6">
          {/* Column 1: Main Navigation TOC - Hidden on mobile, shown on larger screens */}
          <div class="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div class="lg:sticky lg:top-24">
              <Navigation
                baseUrl={data.baseUrl}
                navigationSections={nav}
              />
            </div>
          </div>

          {/* Column 2: Main Content */}
          <div class="flex-1 min-w-0">
            <main class="bg-white rounded-lg shadow-sm border p-4 sm:p-6 lg:p-8">
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Selamat Datang, {data.user}!
              </h2>

              <p class="text-gray-600 mb-6">Ini adalah halaman dokumentasi.</p>

              <div class="lg:hidden mb-6">
                <TableOfContents />
              </div>

              <div class="mb-8" id="memulai">
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Memulai
                </h3>
                <p class="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              <div class="mb-8" id="instalasi">
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Instalasi
                </h3>
                <p class="text-gray-600 mb-4">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              <div class="mb-8" id="konfigurasi">
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Konfigurasi
                </h3>
                <p class="text-gray-600 mb-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>

              <div>
                <a
                  href={data.destination}
                  class="inline-block w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  {data.new}
                </a>
              </div>
            </main>
          </div>

          {/* Column 3: Content TOC - Hidden on mobile, shown on larger screens */}
          <div class="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div class="sticky top-24">
              <TableOfContents />
            </div>
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
