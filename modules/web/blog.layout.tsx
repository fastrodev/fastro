import { InlineNav } from "$fastro/components/inline-nav.tsx";
import { Footer } from "$fastro/components/footer.tsx";

function convert(dateString: string) {
  const date = new Date(dateString);

  const monthName = date.toLocaleString("en-US", { month: "long" });
  const dateNumber = date.getDate();
  const year = date.getFullYear();

  const formattedString = `${monthName} ${dateNumber}, ${year}`;
  return formattedString;
}

function generateTags(tags: string[]) {
  if (!tags) {
    return <></>;
  }

  return (
    <div class={"flex space-x-1 mb-3"}>
      {tags &&
        tags.map((tag) => (
          <a href={`tag/${tag}`}>
            <span
              class={"rounded border dark:bg-gray-800 border-slate-700 px-2 py-1 font-light"}
            >
              {tag}
            </span>
          </a>
        ))}
    </div>
  );
}

export default function (
  props: {
    CSS: string;
    markdown: string;
    attrs: Record<string, unknown>;
  },
) {
  const title = props.attrs.title as string;
  const description = props.attrs.description as string;
  const image = props.attrs.image as string;
  const author = props.attrs.author as string;
  const date = convert(props.attrs.date as string);
  const avatar = (props.attrs.avatar as string) ??
    "https://avatars.githubusercontent.com/u/10122431?v=4";
  const tags = props.attrs.tags as string[];

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta property="og:image" content={image} />
        <title>{`${title} | Fastro`}</title>

        <link
          href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css"
          rel="stylesheet"
        />
        <style>
          {props.CSS}
        </style>
        <link href="/styles.css" rel="stylesheet" />
        <link href="/markdown.css" rel="stylesheet" />
      </head>
      <body class="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">
        <main
          class={"container grow max-w-4xl px-6 mt-6 mx-auto"}
        >
          <div class={`flex flex-col gap-y-3`}>
            <div class={`flex flex-col gap-y-3`}>
              <div>
                <InlineNav
                  title="Fastro"
                  description="Blog"
                  destination="/blog"
                />
              </div>
              <h1 class="text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white">
                {title}
              </h1>
            </div>
            <p class={"inline-flex items-center gap-x-2 mb-3"}>
              <img
                src={avatar}
                class="self-center w-5 h-5 rounded-full"
              />
              <span class={"font-light"}>{author} • {date}</span>
            </p>
            {generateTags(tags)}
          </div>
          <hr class="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-800" />
          <div
            data-color-mode="auto"
            data-light-theme="light"
            data-dark-theme="dark"
            class="markdown-body"
          >
            {props.markdown}
          </div>
        </main>
        <Footer />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" />
      </body>
    </html>
  );
}
