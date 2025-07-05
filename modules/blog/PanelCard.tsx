export default function PanelCard() {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-sm hover:shadow-md hover:bg-gray-800/80 transition-all duration-200 rounded-2xl p-3">
      <div class="flex items-center gap-3 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-chart-bar-popular"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
          <path d="M9 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
          <path d="M15 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
          <path d="M4 20h14" />
        </svg>
        <span class="text-base text-gray-200">
          Analytics Panel
        </span>
      </div>
      <div class="text-sm text-gray-400 mb-2">
        Track post performance and audience engagement with real-time
      </div>
    </div>
  );
}
