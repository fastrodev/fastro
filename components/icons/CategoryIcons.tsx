import { JSX } from "preact/jsx-runtime";

interface IconProps {
  className?: string;
  size?: number;
}

export const CategoryIcons = {
  Spreadsheet: ({ className = "", size = 64 }: IconProps): JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-xls"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
      <path d="M4 15l4 6" />
      <path d="M4 21l4 -6" />
      <path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" />
      <path d="M11 15v6h3" />
    </svg>
  ),

  Tracking: ({ className = "", size = 64 }: IconProps): JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      class="icon icon-tabler icons-tabler-outline icon-tabler-device-ipad-horizontal-search"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M11.5 20h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v5.5" />
      <path d="M9 17h2" />
      <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M20.2 20.2l1.8 1.8" />
    </svg>
  ),

  Analytics: ({ className = "", size = 64 }: IconProps): JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      class="icon icon-tabler icons-tabler-outline icon-tabler-chart-histogram"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 3v18h18" />
      <path d="M20 18v3" />
      <path d="M16 16v5" />
      <path d="M12 13v8" />
      <path d="M8 16v5" />
      <path d="M3 11c6 0 5 -5 9 -5s3 5 9 5" />
    </svg>
  ),

  Inventory: ({ className = "", size = 64 }: IconProps): JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      class="icon icon-tabler icons-tabler-outline icon-tabler-building-warehouse"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 21v-13l9 -4l9 4v13" />
      <path d="M13 13h4v8h-10v-6h6" />
      <path d="M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3" />
    </svg>
  ),

  Barcode: ({ className = "", size = 64 }: IconProps): JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      class="icon icon-tabler icons-tabler-outline icon-tabler-qrcode"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
      <path d="M7 17l0 .01" />
      <path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
      <path d="M7 7l0 .01" />
      <path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
      <path d="M17 7l0 .01" />
      <path d="M14 14l3 0" />
      <path d="M20 14l0 .01" />
      <path d="M14 14l0 3" />
      <path d="M14 20l3 0" />
      <path d="M17 17l3 0" />
      <path d="M20 17l0 3" />
    </svg>
  ),

  Alert: ({ className = "", size = 64 }: IconProps): JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      class="icon icon-tabler icons-tabler-filled icon-tabler-info-triangle"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm0 9.33h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
    </svg>
  ),

  Document: ({ className = "", size = 64 }: IconProps): JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      class="icon icon-tabler icons-tabler-outline icon-tabler-script"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17 20h-11a3 3 0 0 1 0 -6h11a3 3 0 0 0 0 6h1a3 3 0 0 0 3 -3v-11a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v8" />
    </svg>
  ),

  Budget: ({ className = "", size = 64 }: IconProps): JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      class="icon icon-tabler icons-tabler-filled icon-tabler-coin"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 2.66a1 1 0 0 0 -1 1a3 3 0 1 0 0 6v2a1.024 1.024 0 0 1 -.866 -.398l-.068 -.101a1 1 0 0 0 -1.732 .998a3 3 0 0 0 2.505 1.5h.161a1 1 0 0 0 .883 .994l.117 .007a1 1 0 0 0 1 -1l.176 -.005a3 3 0 0 0 -.176 -5.995v-2c.358 -.012 .671 .14 .866 .398l.068 .101a1 1 0 0 0 1.732 -.998a3 3 0 0 0 -2.505 -1.501h-.161a1 1 0 0 0 -1 -1zm1 7a1 1 0 0 1 0 2v-2zm-2 -4v2a1 1 0 0 1 0 -2z" />
    </svg>
  ),
};

export const getIconForHeading = (
  heading: string,
  isDark: boolean,
): JSX.Element => {
  const baseClass = `transition-all ${
    isDark ? "text-blue-400/80" : "text-blue-600/80"
  } scale-125`;

  if (heading.match(/spreadsheet|excel|data|tersebar/i)) {
    return <CategoryIcons.Spreadsheet className={baseClass} />;
  }
  if (heading.match(/track|monitor|status|receiving|multi-cabang/i)) {
    return <CategoryIcons.Tracking className={baseClass} />;
  }
  if (heading.match(/analisis|report|performance|forecast|slow-moving|cost/i)) {
    return <CategoryIcons.Analytics className={baseClass} />;
  }
  if (heading.match(/barcode|scan/i)) {
    return <CategoryIcons.Barcode className={baseClass} />;
  }
  if (heading.match(/alert|notifikasi|kehabisan/i)) {
    return <CategoryIcons.Alert className={baseClass} />;
  }
  if (heading.match(/dokumen|arsip|approval|po/i)) {
    return <CategoryIcons.Document className={baseClass} />;
  }
  if (heading.match(/budget|harga|supplier|cost/i)) {
    return <CategoryIcons.Budget className={baseClass} />;
  }
  return <CategoryIcons.Inventory className={baseClass} />;
};
