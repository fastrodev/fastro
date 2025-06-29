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
    <footer class="bg-white border-t border-gray-200 mt-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* change this with brand description */}
          <div>
            <div class="mb-6">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Fastro</h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                A modern, fast, and lightweight web framework built for
                performance and developer experience. Create blazing-fast
                applications with ease.
              </p>
            </div>
          </div>

          {/* Documentation Links */}
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">
              Dokumentasi
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href={`${baseUrl}/docs`}
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href={`${baseUrl}/docs`}
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Memulai
                </a>
              </li>
              <li>
                <a
                  href={`${baseUrl}/docs`}
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/fastrodev/fastro/tree/main/examples"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Contoh
                </a>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">
              Komunitas
            </h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Forum
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Kontribusi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">Resources</h4>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Changelog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Status
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div class="mt-8 pt-8 border-t border-gray-200">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-sm text-gray-600">
              © 2025 {"Fastro Services"}. All rights reserved.
            </p>
            <p class="text-sm text-gray-600 mt-2 md:mt-0">
              Made with ❤️ by the Fastro Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
