export default function SponsorCTA() {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-sm hover:shadow-md hover:bg-gray-800/80 transition-all duration-200 rounded-xl p-5">
      <div class="text-center flex flex-col items-center gap-2">
        <h3 class="font-semibold text-gray-100 text-base mb-1">
          Join Fastro as a Partner
        </h3>
        <p class="text-sm text-gray-400 mb-3 leading-relaxed">
          Collaborate with Fastro Services to accelerate web applications for
          MSMEs & MVPs.
        </p>
        <a
          href="#sponsor"
          class="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Become a Partner
        </a>
      </div>
    </div>
  );
}
