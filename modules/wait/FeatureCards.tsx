import { JSX } from "preact";

export interface FeatureCardsProps {}

interface FeatureCardData {
  href: string;
  icon: JSX.Element;
  title: string;
  description: string;
}

const featureCards: FeatureCardData[] = [
  {
    href: "/play",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-full h-full max-w-[72px] max-h-[72px] text-gray-400 group-hover:text-blue-400 transition-colors"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M20.894 15.553a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.553 3.774l7.554 -3.775a1 1 0 0 1 1.341 .447m0 -4a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.552 3.775l7.554 -3.775a1 1 0 0 1 1.341 .447m-8.887 -8.552q .056 0 .111 .007l.111 .02l.086 .024l.012 .006l.012 .002l.029 .014l.05 .019l.016 .009l.012 .005l8 4a1 1 0 0 1 0 1.788l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 0 -1.788l8 -4l.011 -.005l.018 -.01l.078 -.032l.011 -.002l.013 -.006l.086 -.024l.11 -.02l.056 -.005z" />
      </svg>
    ),
    title: "Fastro Play",
    description:
      "Discover tutorials, example apps, and templates powered by the Fastro framework.",
  },
  // add more feature cards here for performance dashboard
  {
    href: "/#",
    icon: (
      <svg
        class="w-full h-full max-w-[72px] max-h-[72px] text-gray-400 group-hover:text-blue-400 transition-colors"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <rect
          x="3"
          y="13"
          width="6"
          height="8"
          rx="1"
          stroke="currentColor"
          stroke-width="2"
        />
        <rect
          x="9"
          y="9"
          width="6"
          height="12"
          rx="1"
          stroke="currentColor"
          stroke-width="2"
        />
        <rect
          x="15"
          y="5"
          width="6"
          height="16"
          rx="1"
          stroke="currentColor"
          stroke-width="2"
        />
        <path d="M4 21h16" stroke="currentColor" stroke-width="2" />
      </svg>
    ),
    title: "Insights",
    description:
      "Track your app’s performance, monitor analytics, and gain insights into your usage.",
  },
  {
    href: "/docs",
    icon: (
      <svg
        class="w-full h-full max-w-[72px] max-h-[72px] text-gray-400 group-hover:text-blue-400 transition-colors"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
        />
      </svg>
    ),
    title: "Documentation",
    description:
      "Comprehensive guides and API references to help you build amazing applications faster and more efficiently.",
  },
];

// make it 3 columns on larger screens
// and 1 column on mobile screens
export default function FeatureCards({}: FeatureCardsProps) {
  return (
    <div class="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {featureCards.map((card) => <FeatureCard {...card} />)}
    </div>
  );
}

function FeatureCard({ href, icon, title, description }: FeatureCardData) {
  return (
    <a href={href} class="group">
      <main
        class="bg-gray-800/50 rounded-xl shadow-md border border-gray-700/50 p-3 sm:p-4 md:p-6 group-hover:border-blue-500/50 group-hover:shadow-xl transition-all flex relative overflow-hidden backdrop-blur-lg hover:bg-blue-900/20"
        style={{
          boxShadow:
            "0 4px 24px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
        }}
      >
        {/* icon is too small. make it proportional */}
        <div class="flex-shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mr-3 sm:mr-4">
          {/* Ensure all SVGs use w-full h-full for scaling */}
          {icon}
        </div>
        {/* Text content on the right */}
        <div class="flex flex-col flex-1 text-left">
          <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5 sm:mb-1 group-hover:text-blue-400 transition-colors">
            {title}
          </h2>
          <p class="text-base text-gray-400 leading-relaxed flex-1 pb-1 sm:pb-2 md:pb-4">
            {description}
          </p>
        </div>
        {/* Glow effect on hover */}
        <div
          class="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-200"
          style={{
            background:
              "radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.18) 0%, transparent 70%)",
          }}
        />
      </main>
    </a>
  );
}
