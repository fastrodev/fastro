import { Footer } from "@app/components/footer.tsx";
import Header from "@app/components/header.tsx";

function convert(dateString: string) {
  const date = new Date(dateString);

  const monthName = date.toLocaleString("en-US", { month: "long" });
  const dateNumber = date.getDate();
  const year = date.getFullYear();

  const formattedString = `${monthName} ${dateNumber}, ${year}`;
  return formattedString;
}
function formatDateToISO(date: Date): string {
  // Check if the input is a valid Date object
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  // Get the components of the date
  const year: number = date.getUTCFullYear();
  const month: string = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day: string = String(date.getUTCDate()).padStart(2, "0");
  const hours: string = String(date.getUTCHours()).padStart(2, "0");
  const minutes: string = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds: string = String(date.getUTCSeconds()).padStart(2, "0");

  // Get the timezone offset in hours and minutes
  const timezoneOffset: number = -date.getTimezoneOffset();
  const offsetHours: string = String(Math.floor(Math.abs(timezoneOffset) / 60))
    .padStart(2, "0");
  const offsetMinutes: string = String(Math.abs(timezoneOffset) % 60).padStart(
    2,
    "0",
  );

  // Format the timezone offset
  const timezoneString: string = (timezoneOffset >= 0 ? "+" : "-") +
    offsetHours + offsetMinutes;

  // Construct the final formatted date string
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezoneString}`;
}

function generateTags(tags: string[]) {
  if (!tags) {
    // deno-lint-ignore jsx-no-useless-fragment
    return <></>;
  }

  return (
    <div class="flex space-x-1 mb-3">
      {tags &&
        tags.map((tag) => (
          <a href={`tag/${tag}`}>
            <span class="rounded border dark:bg-gray-800 border-slate-700 px-2 py-1 font-light">
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
    // deno-lint-ignore no-explicit-any
    data?: any;
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
  const data = props.data;
  const time = formatDateToISO(new Date(date));
  const ogImage = image ?? "https://fastro.deno.dev/fastro.png";

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta name="author" content={author} />
        <meta
          property="article:published_time"
          content={time}
        />
        <meta property="og:publish_date" content={time} />
        <meta property="article:modified_time" content={time} />
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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&family=Merriweather:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
          .markdown-body, .post-title {
            font-family: 'Merriweather', serif;
          }
          `}
        </style>
      </head>
      <body class="bg-white dark:bg-gray-950 text-slate-900 dark:text-white">
        <Header
          isLogin={data.isLogin}
          avatar_url={data.avatar_url}
          html_url={data.html_url}
        />

        <main class="container grow max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg relative before:content-[''] before:absolute before:inset-0 before:rounded-lg before:z-[-1] before:shadow-[0_0_40px_20px_rgba(0,0,0,0.2)] dark:before:shadow-[0_0_40px_20px_rgba(128,0,128,0.3)] border border-gray-200 dark:border-gray-800">
          {image && (
            <div class="relative rounded-t-lg overflow-hidden">
              <img
                src={image}
                class="w-full max-h-64 object-cover"
                loading="lazy"
              />
              <div
                class="absolute inset-0 pointer-events-none"
                style="box-shadow: inset 0 0 100px 40px rgba(0,0,0,0.7);background: linear-gradient(to right, rgba(0,0,0,0.5) 0px, transparent 70px, transparent calc(100% - 70px), rgba(0,0,0,0.5) 100%),linear-gradient(to bottom, rgba(0,0,0,0.5) 0px, transparent 70px, transparent calc(100% - 70px), rgba(0,0,0,0.5) 100%);z-index: 2;"
              >
              </div>
            </div>
          )}
          <div class={`p-6`}>
            <div class={`flex flex-col gap-y-3`}>
              <h1 class="post-title text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white">
                {title}
              </h1>
              <p class="inline-flex items-center gap-x-2 mb-3">
                <img
                  src={avatar}
                  class="self-center w-5 h-5 rounded-full"
                />
                <span class="font-light">{author} • {date}</span>
              </p>
              {generateTags(tags)}
            </div>
            <hr class="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-800" />
            <div
              data-color-mode="auto"
              data-light-theme="light"
              data-dark-theme="dark"
              class="markdown-body text-gray-900 dark:text-white"
            >
              {props.markdown}
            </div>
          </div>
        </main>
        <Footer />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js" />
      </body>
    </html>
  );
}
