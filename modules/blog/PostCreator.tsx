import { useState } from "preact/hooks";
import { marked } from "npm:marked@15.0.12";

export default function PostCreator() {
  const [postContent, setPostContent] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: postContent,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Post created successfully:", result);
        setPostContent(""); // This should clear the text
      } else {
        console.error("Failed to create post:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleAttachFile = () => {
    // Handle file attachment logic here
    console.log("Attaching file");
  };

  // Fixed markdown preview renderer - make it synchronous
  const renderPreview = (content: string) => {
    if (!content.trim()) {
      return <p class="text-gray-500 italic">Nothing to preview...</p>;
    }

    try {
      // Remove frontmatter (content between --- blocks)
      const cleanContent = content.replace(/^---[\s\S]*?---\s*/m, "");

      // Simple approach: convert markdown and then strip all attributes
      let htmlContent = marked(cleanContent, {
        breaks: true,
        gfm: true,
      }) as string;

      // Strip all attributes from HTML tags
      htmlContent = htmlContent.replace(/<(\w+)[^>]*>/g, "<$1>");

      return (
        <div
          class="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    } catch (error) {
      console.error("Markdown parsing error:", error);
      return <p class="text-red-500">Error parsing markdown</p>;
    }
  };

  return (
    <div class="mb-6 border border-gray-200 rounded-xl p-4 bg-white">
      <div class="flex flex-col">
        {/* Tab Navigation */}
        <div class="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            class={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === "edit"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Edit
            {activeTab === "edit" && (
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600">
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            class={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === "preview"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Preview
            {activeTab === "preview" && (
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600">
              </div>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div class="h-32 overflow-hidden border border-gray-200 border-t-0 rounded-b-lg mt-0">
          {activeTab === "edit"
            ? (
              <textarea
                placeholder="What's on your mind? Write a new post..."
                value={postContent}
                onInput={(e) =>
                  setPostContent((e.target as HTMLTextAreaElement).value)}
                class="w-full h-full px-4 py-3 border-0 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:ring-inset resize-none bg-transparent transition-all duration-200 rounded-b-lg"
              />
            )
            : (
              <div class="w-full h-full px-4 py-3 overflow-y-auto">
                {renderPreview(postContent)}
              </div>
            )}
        </div>

        <div class="flex justify-between mt-3">
          <button
            type="button"
            onClick={handleAttachFile}
            class="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            Attach file
          </button>
          <button
            type="button"
            onClick={handleCreatePost}
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
}
