import { useRef, useState } from "preact/hooks";
import { renderPreview } from "../../utils/markdownUtils.tsx";

// SVG Constants
const ChevronDownIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 9l6 6l6 -6" />
  </svg>
);

const ChevronUpIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-up"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 15l6 -6l6 6" />
  </svg>
);

// change this with image icon
const UnsplashIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="icon icon-tabler icons-tabler-outline icon-tabler-brand-unsplash"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 11h5v4h6v-4h5v9h-16zm5 -7h6v4h-6z" />
  </svg>
);

async function getRandomUnsplashImage(query = "") {
  try {
    const baseUrl = "/api/unpslash"; // Adjust this to your API endpoint
    const url = query
      ? `${baseUrl}/${encodeURIComponent(query)}`
      : `${baseUrl}`;

    const response = await fetch(url);
    console.log("Fetching random image from:", url);
    console.log("Response status:", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      url: data.url,
      description: data.description,
      photographer: data.photographer,
      link: data.link,
    };
  } catch (error) {
    console.error("Error fetching random image:", error);
    return null;
  }
}

export default function PostCreator() {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [editorActive, setEditorActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [postContent, setPostContent] = useState(`---
title: Untitled Post
description: Untitled description
tags: ["technology", "laptop"]
---


Write your post content here...`);

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
        setPostContent("");
        setEditorActive(false);
      } else {
        console.error("Failed to create post:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUnsplash = async () => {
    const json = renderPreview(postContent).frontmatterJson;
    const tags = json?.tags || ["blue", "sky"];
    const tagString = tags.join(" ");
    const image = await getRandomUnsplashImage(tagString);
    const published = `${new Date().getDate()}-${new Date().getMonth() + 1}-${
      new Date().getFullYear()
    }`;

    const fm = `---
title: ${json?.title || "Untitled Post"}
description: ${json?.description || "Untitled description"}
tags: ${JSON.stringify(json?.tags || ["untitled", "default"])}
author: ${json?.author || "Anonymous"}
readTime: ${json?.readTime || "1 min read"}
type: ${json?.type || "blog"}
published: ${published}
image: ${image?.url}
---

${postContent.replace(/---[\s\S]*?---/, "").trim()}
`;
    setPostContent(fm);
  };

  if (!editorActive) {
    return (
      <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl pl-4 pr-6 py-6">
        <div
          onClick={() => setEditorActive(true)}
          onMouseDown={(e) => e.preventDefault()}
          class="w-full flex items-center justify-between h-[24px] cursor-pointer border-0 focus:outline-none resize-none bg-transparent text-gray-500"
        >
          <span>What's on your mind? Write a new post...</span>
          {ChevronDownIcon}
        </div>
      </div>
    );
  }

  return (
    <div
      class={`bg-gray-800/50 backdrop-blur-sm border rounded-xl transition-colors duration-200 ${
        activeTab === "edit" ? "border-blue-400" : "border-gray-700"
      }`}
    >
      <div
        class={`flex px-4 gap-0 h-16 items-center border-b transition-colors duration-200 border-gray-700`}
      >
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
        <div class="flex-1" />
        <button
          type="button"
          class="ml-2 p-2 text-gray-400 hover:text-blue-400 rounded-full transition-colors"
          onMouseDown={(e) => e.preventDefault()} // Prevent text selection on click
          onClick={() => setEditorActive(false)}
          aria-label="Switch to simple input"
        >
          {ChevronUpIcon}
        </button>
      </div>

      <div class="min-h-[120px] px-4 py-3 flex bg-transparent">
        {activeTab === "edit"
          ? (
            <textarea
              ref={textareaRef}
              placeholder="What's on your mind? Write a new post..."
              value={postContent}
              onInput={(e) =>
                setPostContent((e.target as HTMLTextAreaElement).value)}
              class="w-full h-60 border-0 focus:outline-none resize-none bg-transparent text-gray-300 placeholder-gray-500 text-xs sm:text-md font-mono overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              autoFocus
            />
          )
          : (
            <div class="w-full h-full px-1 py-1 overflow-y-auto">
              {renderPreview(postContent).preview}
            </div>
          )}
      </div>

      {/* Actions */}
      <div class="flex justify-between items-center px-4 py-3 border-t border-gray-700 gap-3">
        {/* add text when hover the button */}
        <button
          type="button"
          onClick={handleUnsplash}
          class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Generate Unsplash image based on tags"
          title="Generate Unsplash image based on tags"
        >
          {UnsplashIcon}
        </button>
        <button
          type="button"
          onClick={handleCreatePost}
          disabled={!postContent.trim()}
          class="px-4 py-1.5 md:px-5 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors font-medium disabled:bg-gray-600 disabled:cursor-not-allowed text-sm md:text-base"
        >
          Post
        </button>
      </div>
    </div>
  );
}
