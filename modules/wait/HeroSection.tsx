// deno-lint-ignore-file
import MovingStarsBackground from "./MovingStarsBackground.tsx";

export interface HeroSectionProps {
  title: string;
  description: string;
}

export default function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <div class="flex-1 min-w-0">
      <main
        class="bg-gray-800/70 rounded-lg shadow-md border border-gray-700 px-4 py-8 sm:py-24 sm:px-6 lg:px-8 text-center relative overflow-hidden backdrop-blur-lg group hover:border-blue-500/50 hover:shadow-xl hover:bg-blue-900/20 transition-all duration-200 transform group-hover:scale-[1.025] cursor-pointer"
        style={{
          boxShadow:
            "0 4px 24px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
        }}
      >
        <MovingStarsBackground />
        {/* Content with relative positioning to appear above background */}
        <div class="relative z-10">
          <h1 class="mx-auto text-4xl sm:text-5xl lg:text-6xl font-bold max-w-2xl text-white mb-3 transition-colors duration-200">
            {title}
          </h1>
          <p class="text-base sm:text-lg lg:text-xl max-w-2xl text-gray-200 mb-4 sm:mb-6 mx-auto leading-relaxed">
            Build blazing-fast web apps with ease. Simplify development with
            modern tools and seamless performance.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`/docs`}
              class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Getting Started
            </a>
            <div class="w-full sm:w-auto bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 font-mono text-sm md:text-base text-gray-300 overflow-x-auto backdrop-blur-sm">
              deno run -A -r https://fastro.deno.dev
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
