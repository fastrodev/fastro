type Props = {
  user?: string | undefined;
};

import version from "../../version.json" with { type: "json" };
import { useEffect, useRef, useState } from "react";

export default function Header({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [navTop, setNavTop] = useState<string | undefined>(undefined);
  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  function getIsMobile() {
    const maybe = (globalThis as unknown as {
      matchMedia?: (q: string) => { matches: boolean };
    }).matchMedia;
    return typeof maybe === "function" && maybe("(max-width:640px)").matches;
  }

  useEffect(() => {
    function updateNavTop() {
      try {
        if (!headerRef.current) return;
        const rect = headerRef.current.getBoundingClientRect();
        setNavTop(Math.max(rect.bottom, 0) + "px");
      } catch {
        /* ignore measurement errors */
      }
    }

    function onResize() {
      if (!getIsMobile()) {
        setOpen(false);
        setNavTop(undefined);
      } else {
        if (open) updateNavTop();
      }
    }

    function onScroll() {
      if (getIsMobile() && open) updateNavTop();
    }

    globalThis.addEventListener("resize", onResize);
    globalThis.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      globalThis.removeEventListener("resize", onResize);
      globalThis.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="header-container h-[64.8px] flex items-center border-b border-gray-200 dark:border-gray-800 transition-colors"
    >
      <div className="max-w-180 mx-auto px-6 md:px-8 flex justify-between items-center w-full">
        <div className="flex items-center">
          <a
            href="/"
            className="inline-flex items-center no-underline text-gray-900 dark:text-gray-100"
          >
            <span className="inline-flex items-center">
              <span className="font-bold text-2xl ml-0 tracking-wide text-gray-900 dark:text-gray-100">
                FASTRO
              </span>
              <span className="ml-2 inline-flex items-center bg-slate-100 text-slate-900 text-xs font-semibold px-2 py-0.5 rounded-full dark:bg-slate-800 dark:text-slate-100">
                {version?.version ?? ""}
              </span>
            </span>
          </a>
        </div>

        <div className="flex items-center">
          {user
            ? (
              <>
                <nav
                  id="header-nav"
                  ref={navRef}
                  className={`${
                    open ? "flex" : "hidden sm:flex"
                  } flex-col sm:flex-row gap-3 items-start sm:items-center fixed sm:static left-0 right-0 w-full sm:w-auto bg-white dark:bg-[#030712] sm:bg-transparent sm:dark:bg-transparent p-4 sm:p-0 border-b sm:border-b-0 border-gray-100 dark:border-gray-800 z-50`}
                  style={navTop && open ? { top: navTop } : undefined}
                >
                  <a
                    className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 text-sm font-medium no-underline"
                    href="/dashboard"
                  >
                    Dashboard
                  </a>
                  <a
                    className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 text-sm font-medium no-underline"
                    href="/profile"
                  >
                    Profile
                  </a>
                  <a
                    className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 text-sm font-medium no-underline"
                    href="/password"
                  >
                    Change Password
                  </a>
                  <a
                    className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 text-sm font-medium no-underline"
                    href="/signout"
                  >
                    Sign out
                  </a>
                </nav>

                <button
                  type="button"
                  id="menu-btn"
                  className="inline-block sm:hidden bg-transparent border-0 text-xl p-2 ml-2 text-gray-600 dark:text-gray-300"
                  aria-controls="header-nav"
                  aria-expanded={open ? "true" : "false"}
                  onClick={() => {
                    if (!getIsMobile()) return;
                    try {
                      if (headerRef.current) {
                        const rect = headerRef.current.getBoundingClientRect();
                        setNavTop(Math.max(rect.bottom, 0) + "px");
                      }
                    } catch {
                      /* ignore */
                    }
                    setOpen((v) => !v);
                  }}
                >
                  ☰
                </button>
              </>
            )
            : null}
        </div>
      </div>
    </header>
  );
}
