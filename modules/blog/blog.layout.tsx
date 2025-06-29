import { LayoutProps } from "@app/core/server/types.ts";
import { CSS } from "jsr:@deno/gfm@0.11.0";

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
        <title>{data.title} | Fastro</title>

        <meta
          name="title"
          content={`${data.title} | Fastro`}
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
          content={`${data.title} | Fastro`}
        />
        <meta property="og:description" content={data.description} />
        <meta property="og:image" content={data.image} />
        <meta property="og:site_name" content="Fastro" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fastro.dev" />
        <meta
          property="twitter:title"
          content={`${data.title} | Fasto Services`}
        />
        <meta property="twitter:description" content={data.description} />
        <meta property="twitter:image" content={data.image} />

        {/* Links */}
        <link
          href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.min.css"
          rel="stylesheet"
        />
        {/* Links */}
        <link
          href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.min.css"
          rel="stylesheet"
        />
        <style>
          {CSS}
        </style>
        <link href="/styles.css" rel="stylesheet" />
        <link href="/markdown.css" rel="stylesheet" />
        <link rel="canonical" href="https://fastro.dev" />
      </head>
      <body
        id="root"
        className="bg-gray-900 text-white"
      >
        {children}
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-core.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js" />
      </body>
    </html>
  );
}
