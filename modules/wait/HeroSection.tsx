import BoltSvg from "../../components/icons/bolt.tsx";

export interface HeroSectionProps {
  title: string;
  description: string;
}

export default function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <div class="flex-1 min-w-0">
      <main
        class="bg-gray-800/70 rounded-lg shadow-md border border-gray-700 p-4 sm:p-6 lg:p-8 text-center relative overflow-hidden backdrop-blur-lg group hover:border-blue-500/50 hover:shadow-xl hover:bg-blue-900/20 transition-all duration-200 transform group-hover:scale-[1.025]"
        style={{
          boxShadow:
            "0 4px 24px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
        }}
      >
        {/* Bolder animated background blob */}
        <div
          class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[380px] rounded-full opacity-60 blur-[100px] transition-all duration-700 group-hover:scale-125 group-hover:opacity-90 group-hover:-translate-y-6 group-hover:translate-x-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(59,130,246,0.45) 0%, rgba(59,130,246,0.25) 60%, transparent 100%)",
          }}
        />
        {/* Glow effect on hover - same as other cards */}
        <div
          class="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.28) 0%, transparent 70%)",
          }}
        />

        {/* Content with relative positioning to appear above background */}
        <div class="relative z-10">
          {/* Icon with thin circle and animation */}
          <div class="flex justify-center mb-3">
            <div class="w-16 h-16 rounded-full border-[1px] border-gray-600 flex items-center justify-center bg-gray-700/30 backdrop-blur-sm group-hover:border-blue-500/50 transition-colors duration-200 transform transition-transform group-hover:scale-110">
              <BoltSvg
                width="32"
                height="32"
                class="transition-colors duration-200 group-hover:text-blue-400"
              />
            </div>
          </div>
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-200">
            {title}
          </h1>
          <p class="text-base sm:text-lg lg:text-xl max-w-2xl text-gray-200 mb-4 sm:mb-6 mx-auto leading-relaxed">
            {"Build modern web applications using Deno and Preact.js — fast APIs, seamless SSR, and zero-config developer experience."}
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`/docs`}
              class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Getting Started
            </a>
            <div class="w-full sm:w-auto bg-black/50 border border-gray-700 rounded-lg p-2.5 sm:p-3 font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto backdrop-blur-sm">
              deno run -A -r https://fastro.deno.dev
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
