// deno-lint-ignore-file
import MovingStarsBackground from "./MovingStarsBackground.tsx";
import { useState } from "preact/hooks";

export interface HeroSectionProps {
  title: string;
  description: string;
}

export default function HeroSection({ title, description }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("deno run -A -r https://fastro.deno.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <div class="flex-1 min-w-0">
      <main
        class="bg-gray-800/50 rounded-lg shadow-md border border-gray-700/50 px-4 py-8 sm:py-24 sm:px-6 lg:px-8 text-center relative overflow-hidden backdrop-blur-lg group hover:border-blue-500/50 hover:shadow-xl hover:bg-blue-900/20 transition-all duration-200 transform group-hover:scale-[1.025] cursor-pointer"
        style={{
          boxShadow:
            "0 4px 24px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
        }}
      >
        <MovingStarsBackground />
        <div class="relative z-10">
          <h1 class="mx-auto text-4xl sm:text-6xl lg:text-8xl font-bold max-w-2xl lg:max-w-5xl text-white mb-8 sm:mb-10 transition-colors duration-200">
            {title}
          </h1>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`/docs`}
              class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium sm:text-xl p-2.5 sm:py-6 sm:px-10 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Getting Started
            </a>
            <div
              class="w-full sm:w-auto bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-6 font-mono text-sm md:text-xl text-gray-300 overflow-x-auto backdrop-blur-sm cursor-pointer relative"
              onClick={handleCopy}
              title="Click to copy"
            >
              deno run -A -r https://fastro.deno.dev
              {copied && (
                <span class="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded shadow border border-blue-400 flex items-center gap-1">
                  {/* Copied SVG icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
