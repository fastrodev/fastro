type Props = {
  height?: number;
  width?: number;
  className?: string;
  title?: string;
};

export default function Logo(
  { height = 28, width = 28, className, title = "Fastro" }: Props,
) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* dibuat oleh fastrodev */}
      <path
        d="M60 5 L30 55 H48 L40 95 L70 45 H52 L60 5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
