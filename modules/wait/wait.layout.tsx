import { LayoutProps } from "@app/core/server/types.ts";

export default function layout(
  { data, children }: LayoutProps<
    { title: string; description: string; image: string }
  >,
) {
  return (
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>{data.title} | Fastro Solutions</title>

        {/* Primary Meta Tags */}
        <meta
          name="title"
          content={`${data.title} | Fastro Solutions`}
        />
        <meta name="description" content={data.description} />
        <meta
          name="keywords"
          content="inventory management, purchasing software, aplikasi inventaris, sistem inventaris, software inventory, manajemen stok, inventory system, inventory control, warehouse management, procurement software"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fastro.dev" />
        <meta
          property="og:title"
          content={`${data.title} | Inventory & Purchasing Software`}
        />
        <meta property="og:description" content={data.description} />
        <meta property="og:image" content={data.image} />
        <meta property="og:site_name" content="Fastro Inventory Solutions" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fastro.dev" />
        <meta
          property="twitter:title"
          content={`${data.title} | Inventory & Purchasing Software`}
        />
        <meta property="twitter:description" content={data.description} />
        <meta property="twitter:image" content={data.image} />

        {/* PWA Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#000000" />

        {/* Links */}
        <link href="/styles.css" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="canonical" href="https://fastro.dev" />
      </head>
      <body id="root">
        {children}
      </body>
    </html>
  );
}
