// deno-lint-ignore-file no-explicit-any no-window
import { useState } from "preact/hooks";
import Header from "../wait/Header.tsx";
import TableOfContents from "../wait/TableOfContents.tsx";
import PostCreator from "./PostCreator.tsx";
import BlogSidebar from "./BlogSidebar.tsx";
import BlogPostsList from "./BlogPostsList.tsx";
import BlogPostDetail from "./BlogPostDetail.tsx";
import SponsorCTA from "./SponsorCTA.tsx";
import FeaturedSidebarCard from "./FeaturedSidebarCard.tsx";
import TabNav from "../wait/TabNav.tsx";

export default function Blog(
  props: {
    data: any;
  },
) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"new" | "popular" | "featured">(
    "new",
  );
  const data = props.data;

  return (
    <div class="min-h-screen bg-gray-900 text-gray-300">
      <div class="sticky top-0 z-50">
        <Header
          title="Documentation"
          isLogin={false}
          user=""
          avatar_url=""
          baseUrl={data.baseUrl}
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
          isMobileTocOpen={isMobileTocOpen}
          setIsMobileTocOpen={setIsMobileTocOpen}
          navigationSections={[]}
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6 pb-6">
          <div class="hidden lg:block lg:w-64 lg-flex-shrink-0">
            <BlogSidebar />
          </div>

          <div class="flex-1">
            {props.data.post
              ? (
                <BlogPostDetail
                  onBack={() => {
                    window.history.back();
                  }}
                  post={props.data.post}
                />
              )
              : (
                <div class="flex flex-col gap-3">
                  {/* Post Creator - Shown only if no post is selected */}
                  <PostCreator />
                  <div class="relative h-16 lg:h-20">
                    <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
                  </div>
                  <BlogPostsList />
                </div>
              )}
          </div>

          {/* Column 3: Content TOC - Hidden on mobile, shown on larger screens */}
          <div class="hidden lg:block lg:w-64 lg-flex-shrink-0">
            <div class="sticky top-20 flex flex-col gap-y-0">
              {props.data.post && props.data.post.toc && (
                <TableOfContents tocItems={props.data.post.toc} />
              )}
              <FeaturedSidebarCard />
              <SponsorCTA />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
