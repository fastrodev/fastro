export default function MovingStarsBackground() {
  // Helper to generate a random y between 0 and 100

  return (
    <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg
        class="w-full h-full absolute inset-0"
        style={{ display: "block" }}
        width="100%"
        height="100%"
      >
        {/* One fast-moving star with random y axis each cycle */}
        <circle
          cx="-2%"
          cy="0%"
          r={0.7}
          fill="#fff"
          opacity={1}
        >
          <animate
            attributeName="cx"
            values="-2%;102%"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={Array.from({ length: 6 })
              .map(() => `${Math.random() * 100}%`)
              .join(";")}
            dur="15s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="1.25s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Many slow-moving stars */}
        {Array.from({ length: 30 }).map((_, i) => {
          const y = Math.random() * 100;
          const size = 0.3 + Math.random() * 0.7;
          const duration = 18 + Math.random() * 22;
          const delay = Math.random() * duration;
          const opacity = 0.5 + Math.random() * 0.5;
          return (
            <circle
              key={i}
              cx="-2%"
              cy={`${y}%`}
              r={size}
              fill="#fff"
              opacity={opacity}
            >
              <animate
                attributeName="cx"
                values="-2%;102%"
                dur={`${duration}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values={`${opacity};${opacity * 0.7};${opacity}`}
                dur={`${duration / 2}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>
    </div>
  );
}
