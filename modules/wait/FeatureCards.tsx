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
      "Comprehensive guides and API references to help you build amazing applications.",
  },
  {
    href: "/blog",
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
          d="m10.051 8.102-3.778.322-1.994 1.994a.94.94 0 0 0 .533 1.6l2.698.316m8.39 1.617-.322 3.78-1.994 1.994a.94.94 0 0 1-1.595-.533l-.4-2.652m8.166-11.174a1.366 1.366 0 0 0-1.12-1.12c-1.616-.279-4.906-.623-6.38.853-1.671 1.672-5.211 8.015-6.31 10.023a.932.932 0 0 0 .162 1.111l.828.835.833.832a.932.932 0 0 0 1.111.163c2.008-1.102 8.35-4.642 10.021-6.312 1.475-1.478 1.133-4.70.855-6.385Zm-2.961 3.722a1.88 1.88 0 1 1-3.76 0 1.88 1.88 0 0 1 3.76 0Z"
        />
      </svg>
    ),
    title: "Stories",
    description:
      "Discover tutorials, example apps, and templates powered by the Fastro framework.",
  },
];

function FeatureCard({ href, icon, title, description }: FeatureCardData) {
  return (
    <a href={href} class="group h-full">
      <main
        class="bg-gray-800/80 rounded-xl shadow-md border border-gray-700 p-6 md:p-8 group-hover:border-blue-500/50 group-hover:shadow-xl transition-all h-full flex relative overflow-hidden backdrop-blur-lg hover:bg-blue-900/20"
        style={{
          boxShadow:
            "0 4px 24px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
        }}
      >
        {/* Icon on the left - full height */}
        <div class="flex-shrink-0 mr-5 flex items-center justify-center">
          {icon}
        </div>
        {/* Text content on the right */}
        <div class="flex flex-col flex-1 text-left">
          <h2 class="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h2>
          <p class="text-sm sm:text-base text-gray-400 leading-relaxed flex-1">
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

export default function FeatureCards({}: FeatureCardsProps) {
  return (
    // add thin top border
    <div class="grid gap-6 sm:gap-8 md:grid-cols-2">
      {featureCards.map((card) => <FeatureCard {...card} />)}
    </div>
  );
}
