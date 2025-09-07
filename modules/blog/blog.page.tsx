// deno-lint-ignore-file no-explicit-any no-window
import { useState } from "preact/hooks";
import Header from "../wait/Header.tsx";
import TableOfContents from "../wait/TableOfContents.tsx";
import PostCreator from "./PostCreator.tsx";
import BlogSidebar from "./BlogSidebar.tsx";
import BlogPostsList from "./BlogPostsList.tsx";
import BlogPostDetail from "./BlogPostDetail.tsx";
import SponsorCTA from "./SponsorCTA.tsx";
// import FeaturedSidebarCard from "./FeaturedSidebarCard.tsx";
import TabNav from "../wait/TabNav.tsx";
import AuthorCard from "./AuthorCard.tsx";

export default function Blog(
  props: {
    data: any;
  },
) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "new" | "popular" | "featured" | "trending" | "all"
  >(
    "new",
  );
  const [isPostCreatorActive, setIsPostCreatorActive] = useState(false); // New state
  const data = props.data;

  return (
    <div class="min-h-screen bg-gray-950 text-gray-300">
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

      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-6 pb-6">
          {/* can you make this element static to the screen? */}
          <div class="hidden lg:block lg:w-4/12 lg-flex-shrink-0">
            <BlogSidebar />
          </div>

          {/* column 2 */}
          <div class={`lg:w-5/12`}>
            {props.data.post
              ? (
                <div class="flex-col mx-auto">
                  <BlogPostDetail
                    onBack={() => {
                      window.location.href = "/play";
                    }}
                    post={props.data.post}
                  />
                </div>
              )
              : (
                <div class="flex flex-col gap-y-3 mx-auto">
                  <PostCreator
                    onActivate={() => setIsPostCreatorActive(true)} // Activate
                    onDeactivate={() => setIsPostCreatorActive(false)} // Deactivate
                  />
                  {/* Conditionally hide these elements */}
                  {!isPostCreatorActive && (
                    <>
                      <div class="relative h-16 lg:h-20">
                        <TabNav
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        />
                      </div>
                      <BlogPostsList />
                    </>
                  )}
                </div>
              )}
          </div>

          {/* column 3 */}
          <div class="hidden lg:w-3/12 lg-flex-shrink-0 lg:flex lg:flex-col lg:gap-y-6">
            <div class="sticky top-16 flex flex-col gap-y-6">
              {props.data.post && props.data.post.author &&
                props.data.post.toc &&
                (
                  <>
                    <AuthorCard author={props.data.post.author} />
                    <TableOfContents tocItems={props.data.post.toc} />
                  </>
                )}

              <SponsorCTA />
              {/* add text to explain simple words about fastro services */}
              <div class="text-xs text-gray-500 text-center">
                Made with ❤️ in Tulungagung, Indonesia
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
