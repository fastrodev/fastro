import { useRef, useState } from "preact/hooks";
import { renderPreview } from "../../utils/markdownUtils.tsx";

const MarkdownIcon = (
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
    class="icon icon-tabler icons-tabler-outline icon-tabler-markdown"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
    <path d="M7 15v-6l2 2l2 -2v6" />
    <path d="M14 13l2 2l2 -2m-2 2v-6" />
  </svg>
);

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

const ClassIcon = (
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
    class="icon icon-tabler icons-tabler-outline icon-tabler-school"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
    <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
  </svg>
);

const StoreIcon = (
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
    class="icon icon-tabler icons-tabler-outline icon-tabler-building-store"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 21l18 0" />
    <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
    <path d="M5 21l0 -10.15" />
    <path d="M19 21l0 -10.15" />
    <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
  </svg>
);

const RocketIcon = (
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
    class="icon icon-tabler icons-tabler-outline icon-tabler-rocket"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
    <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
    <path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </svg>
);

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
    class="icon icon-tabler icons-tabler-outline icon-tabler-blockquote"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 15h15" />
    <path d="M21 19h-15" />
    <path d="M15 11h6" />
    <path d="M21 7h-6" />
    <path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
    <path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
  </svg>
);

const VideoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="icon icon-tabler icons-tabler-filled icon-tabler-video"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M20.117 7.625a1 1 0 0 0 -.564 .1l-4.553 2.275v4l4.553 2.275a1 1 0 0 0 1.447 -.892v-6.766a1 1 0 0 0 -.883 -.992z" />
    <path d="M5 5c-1.645 0 -3 1.355 -3 3v8c0 1.645 1.355 3 3 3h8c1.645 0 3 -1.355 3 -3v-8c0 -1.645 -1.355 -3 -3 -3z" />
  </svg>
);

const SpinnerIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="animate-spin icon icon-tabler icons-tabler-filled icon-tabler-inner-shadow-top-right"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10zm0 3a1 1 0 0 0 0 2a5 5 0 0 1 5 5a1 1 0 0 0 2 0a7 7 0 0 0 -7 -7z" />
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

export default function PostCreator(
  props: { onActivate?: () => void; onDeactivate?: () => void },
) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [editorActive, setEditorActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [postContent, setPostContent] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);

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
        props.onDeactivate?.();
      } else {
        console.error("Failed to create post:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUnsplash = async () => {
    setLoadingImage(true);
    try {
      const json = renderPreview(postContent).frontmatterJson;
      const tags = json?.tags || ["blue", "sky"];
      const tagString = tags.join(" ");
      const image = await getRandomUnsplashImage(tagString);

      if (!image) {
        throw new Error("Failed to fetch image. Please try again.");
      }

      const published = `${new Date().getDate()}-${new Date().getMonth() + 1}-${
        new Date().getFullYear()
      }`;

      const fm = `---
title: ${json?.title || "Untitled Post"}
description: ${json?.description || "Untitled description"}
tags: ${JSON.stringify(json?.tags)}
type: ${json?.type || "blog"}
author: ${json?.author || "Anonymous"}
read_time: ${json?.readTime || "1 min read"}
published_at: ${published}
image: ${image.url}
---

${postContent.replace(/---[\s\S]*?---/, "").trim()}
`;
      setPostContent(fm);
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      setLoadingImage(false);
    }
  };

  if (!editorActive) {
    return (
      <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl pl-4 pr-6 py-6">
        <div
          onClick={() => {
            setEditorActive(true);
            setPostContent(`---
title: Untitled Post
description: Untitled description
tags: ["technology", "electronics", "hardware", "laptop"]
type: blog
---

Write your post content here...`);
            props.onActivate?.();
          }}
          onMouseDown={(e) => e.preventDefault()}
          class="w-full flex items-center justify-between h-[24px] cursor-pointer border-0 focus:outline-none resize-none bg-transparent text-gray-500 text-sm sm:text-base"
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
        <a
          href="https://www.markdownguide.org/cheat-sheet/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-ellipsis text-gray-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
        >
          {MarkdownIcon}
        </a>
        <button
          type="button"
          class="ml-2 p-2 text-gray-400 hover:text-blue-400 rounded-full transition-colors"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setEditorActive(false);
            props.onDeactivate?.();
          }}
          aria-label="Switch to simple input"
        >
          {ChevronUpIcon}
        </button>
      </div>

      <div class="min-h-[480px] px-4 py-3 flex bg-gray-900">
        {activeTab === "edit"
          ? (
            <textarea
              ref={textareaRef}
              placeholder="What's on your mind? Write a new post..."
              value={postContent}
              onInput={(e) =>
                setPostContent((e.target as HTMLTextAreaElement).value)}
              class="w-full h-auto border-0 focus:outline-none resize-none bg-transparent text-gray-300 placeholder-gray-500 text-sm font-mono overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              autoFocus
              spellcheck={false}
              autocorrect="off"
              autocomplete="off"
              autocapitalize="off"
            />
          )
          : (
            <div class="w-full h-full px-1 py-1 overflow-y-auto">
              {renderPreview(postContent).preview}
            </div>
          )}
      </div>

      <div class="flex justify-between items-center px-4 py-3 border-t border-gray-700 gap-3">
        <div class={`flex items-center gap-2`}>
          <button
            type="button"
            onClick={handleUnsplash}
            class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Generate Unsplash image based on tags"
            title="Generate Unsplash image based on tags"
          >
            {loadingImage ? SpinnerIcon : UnsplashIcon}
          </button>
          <button
            type="button"
            // onClick={handleUnsplash}
            class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Generate Unsplash image based on tags"
            title="Generate Unsplash image based on tags"
          >
            {RocketIcon}
          </button>
          <button
            type="button"
            // onClick={handleUnsplash}
            class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Generate Unsplash image based on tags"
            title="Generate Unsplash image based on tags"
          >
            {ClassIcon}
          </button>
          <button
            type="button"
            // onClick={handleUnsplash}
            class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Generate Unsplash image based on tags"
            title="Generate Unsplash image based on tags"
          >
            {VideoIcon}
          </button>
          <button
            type="button"
            // onClick={handleUnsplash}
            class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Generate Unsplash image based on tags"
            title="Generate Unsplash image based on tags"
          >
            {StoreIcon}
          </button>
        </div>
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
