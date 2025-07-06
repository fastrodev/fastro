import { marked } from "npm:marked@15.0.12";
import yaml from "npm:yaml@2.3.1";

export const renderPreview = (content: string) => {
  if (!content.trim()) {
    return {
      preview: <p class="text-gray-500 italic">Nothing to preview...</p>,
      frontmatterJson: null,
    };
  }

  try {
    const frontmatterRegex = /^---[\s\S]*?---/;
    const match = content.match(frontmatterRegex);

    const frontmatter = match ? match[0] : null;
    const body = content.replace(frontmatterRegex, "").trim();

    const frontmatterJson = frontmatter
      ? yaml.parse(frontmatter.replace(/^---|---$/g, "").trim())
      : null;

    let htmlContent = marked(body, {
      breaks: true,
      gfm: true,
    }) as string;

    htmlContent = htmlContent.replace(/<(\w+)[^>]*>/g, "<$1>");
    console.log("Converted HTML content:", htmlContent);

    const preview = (
      <div class="text-sm h-full sm:text-base bg-gray-800/60 shadow-sm border border-gray-700 p-4 rounded-lg">
        {frontmatterJson && (
          <div class="mb-3 flex flex-col gap-4">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-100 mb-0">
              {frontmatterJson.title || "Untitled Post"}
            </h2>

            {(frontmatterJson.author || frontmatterJson.published ||
              frontmatterJson.readTime) && (
              <div class="flex flex-wrap items-center text-xs text-gray-400 gap-4">
                {frontmatterJson.author && (
                  <span class="flex items-center">
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {frontmatterJson.author}
                  </span>
                )}
                {frontmatterJson.published_at && (
                  <span class="flex items-center">
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {frontmatterJson.published_at}
                  </span>
                )}
                {frontmatterJson.read_time && (
                  <span class="flex items-center">
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {frontmatterJson.read_time}
                  </span>
                )}
              </div>
            )}

            {frontmatterJson.tags && frontmatterJson.tags.length > 0 && (
              <div class="flex flex-wrap gap-2">
                {frontmatterJson.tags.map((tag: string) => (
                  <span
                    key={tag}
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 bg-opacity-50 text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {frontmatterJson.image && (
              <div class="w-full flex justify-center">
                <img
                  src={frontmatterJson.image}
                  alt={frontmatterJson.title || "Post Image"}
                  class="w-full max-h-72 object-cover rounded-lg shadow border border-gray-700"
                  style={{ aspectRatio: "16/9" }}
                />
              </div>
            )}
            {frontmatterJson.description && (
              <h3 class="text-gray-400 text-base font-normal">
                {frontmatterJson.description}
              </h3>
            )}
          </div>
        )}
        <div
          class="markdown-body prose prose-invert prose-headings:font-semibold prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );

    return {
      preview,
      frontmatterJson,
    };
  } catch (error) {
    console.error("Markdown parsing error:", error);
    return {
      preview: <p class="text-red-500">Error parsing markdown</p>,
      frontmatterJson: null,
    };
  }
};
