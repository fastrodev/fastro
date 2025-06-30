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
          class="prose prose-sm max-w-none prose-invert prose-headings:text-gray-200 prose-p:text-gray-400 prose-a:text-blue-400 prose-strong:text-gray-200 prose-code:text-pink-400 prose-code:bg-gray-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800 prose-pre:text-gray-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    } catch (error) {
      console.error("Markdown parsing error:", error);
      return <p class="text-red-500">Error parsing markdown</p>;
    }
  };

  return (
    <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
      {/* make sure the tall between edit and preview mode have the same height. */}
      <div class="flex border-b border-gray-700 px-4 gap-0 h-16">
        <button
          type="button"
          onClick={() => setActiveTab("edit")}
          class={`h-full px-3 flex items-center font-medium text-base transition-colors relative ${
            activeTab === "edit"
              ? "text-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          style={{
            borderBottom: activeTab === "edit"
              ? "2px solid #60a5fa"
              : "2px solid transparent",
          }}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          class={`h-full px-3 flex items-center font-medium text-base transition-colors relative ${
            activeTab === "preview"
              ? "text-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          style={{
            borderBottom: activeTab === "preview"
              ? "2px solid #60a5fa"
              : "2px solid transparent",
          }}
        >
          Preview
        </button>
      </div>

      {/* Tab Content */}
      <div class="min-h-[120px] px-4 py-3 flex">
        {activeTab === "edit"
          ? (
            <textarea
              placeholder="What's on your mind? Write a new post..."
              value={postContent}
              onInput={(e) =>
                setPostContent((e.target as HTMLTextAreaElement).value)}
              class="w-full h-full min-h-[120px] border-0 focus:outline-none resize-none bg-transparent text-gray-300 placeholder-gray-500"
              style={{ minHeight: "120px", maxHeight: "320px" }}
            />
          )
          : (
            <div
              class="w-full h-full px-1 py-1 overflow-y-auto"
              style={{ minHeight: "120px", maxHeight: "320px" }}
            >
              {renderPreview(postContent)}
            </div>
          )}
      </div>

      {/* Actions */}
      <div class="flex justify-between items-center px-4 py-3 border-t border-gray-700 gap-3">
        <button
          type="button"
          onClick={handleAttachFile}
          class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Attach file"
        >
          <svg
            class="w-5 h-5"
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
            >
            </path>
          </svg>
        </button>
        <button
          type="button"
          onClick={handleCreatePost}
          disabled={!postContent.trim()}
          class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors font-medium disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </div>
    </div>
  );
}
