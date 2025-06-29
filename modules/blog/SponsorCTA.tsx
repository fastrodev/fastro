export default function SponsorCTA() {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-sm hover:shadow-md hover:bg-gray-800/80 transition-all duration-200 rounded-2xl p-4">
      <div class="text-center">
        <div class="mb-3">
          <svg
            class="w-8 h-8 mx-auto text-blue-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-100 text-sm mb-2">
          Partner with Fastro
        </h3>
        <p class="text-xs text-gray-400 mb-3 leading-relaxed">
          Reach thousands of developers building fast web applications. Showcase
          your brand to our growing community!
        </p>
        <a
          href="#sponsor"
          class="inline-block w-full px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Explore Sponsorship
        </a>
      </div>
    </div>
  );
}
