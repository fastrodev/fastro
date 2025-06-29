import { JSX } from "preact";

interface FooterProps {
  title?: string;
  description?: string;
  baseUrl: string;
}

export default function Footer(
  { title, description, baseUrl }: FooterProps,
): JSX.Element {
  return (
    <footer class="bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 xl:grid-cols-12 gap-8">
          {/* Brand Description */}
          <div class="sm:col-span-2 md:col-span-2 xl:col-span-5">
            <div class="mb-6">
              <h3 class="text-lg font-bold text-gray-100 mb-4">
                {"Fastro Framework"}
              </h3>
              <p class="text-sm text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Empty column for spacing on very large screens */}
          <div class="hidden xl:block xl:col-span-1"></div>

          {/* Documentation Links */}
          <div class="xl:col-span-2">
            <h4 class="text-sm font-semibold text-gray-100 mb-4">
              Documentation
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href={`${baseUrl}/docs`}
                  class="text-sm text-gray-400 hover:text-white"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href={`${baseUrl}/docs`}
                  class="text-sm text-gray-400 hover:text-white"
                >
                  Getting Started
                </a>
              </li>
              <li>
                <a
                  href={`${baseUrl}/docs/api`}
                  class="text-sm text-gray-400 hover:text-white"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/fastrodev/fastro/tree/main/examples"
                  class="text-sm text-gray-400 hover:text-white"
                >
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div class="xl:col-span-2">
            <h4 class="text-sm font-semibold text-gray-100 mb-4">
              Community
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="https://chat.whatsapp.com/KwSP4Q1IE8m5NA9DNk1Sxa"
                  class="text-sm text-gray-400 hover:text-white"
                >
                  Whatsapp
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/fastrodev/fastro/discussions"
                  class="text-sm text-gray-400 hover:text-white"
                >
                  GitHub Discussions
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/fastrodev/fastro/blob/main/CONTRIBUTING.md"
                  class="text-sm text-gray-400 hover:text-white"
                >
                  Contributing
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/orgs/fastrodev/projects/1"
                  class="text-sm text-gray-400 hover:text-white"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Organization Links */}
          <div class="xl:col-span-2">
            <h4 class="text-sm font-semibold text-gray-100 mb-4">
              Organization
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-400 hover:text-white"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-400 hover:text-white"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-400 hover:text-white"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div class="mt-8 p-6 shadow-[0_-4px_24px_0_rgba(0,0,0,0.25)]">
        <div class={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
          <div class="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-6">
            <p class="text-sm text-gray-400">
              © 2025 {"Fastro Services"}. All rights reserved.
            </p>
            <p class="text-sm text-gray-400">
              Made with ❤️ in Tulungagung by the Fastro Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
