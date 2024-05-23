import { useEffect, useRef, useState } from "preact/hooks";
import IconDatabase from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/database.tsx";
import IconArchiveFilled from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/archive-filled.tsx";
import IconLogin from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/login.tsx";
import IconLogout from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/logout.tsx";
import IconMenu2 from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/menu-2.tsx";
import IconHome from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/home.tsx";
import IconTextScan2 from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/text-scan-2.tsx";
import IconArrowBigLeft from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrow-big-left.tsx";
import IconUserPlus from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/user-plus.tsx";
import IconUsersGroup from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/users-group.tsx";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActivePath(window.location.pathname);
    // Check login status, for example, by checking a cookie
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=").map(c => c.trim());
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    setIsLoggedIn(cookies.auth === "bar");
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getLinkClass = (path: string) =>
    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
      activePath === path ? "text-white" : "text-gray-300"
    } hover:bg-gray-700`;

  return (
    <nav class="bg-gray-900 border-b border-gray-700 shadow-sm top-0 w-full z-50" ref={menuRef}>
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={toggleMenu}
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <IconMenu2 class="h-6 w-6" aria-hidden="true" />
            </button>
            <a href="/" class="ml-1 text-xl font-semibold text-white">🧗 advrk.io</a>
          </div>
        </div>
      </div>

      <div
        class={`absolute inset-0 bg-gray-900 z-50 transition-transform transform top-0 left-0 bottom-0 w-64 shadow-lg space-y-1 p-4 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:p-4`}
      >
        <div class="px-2 pb-3 space-y-1 flex flex-col">
          <button
            onClick={toggleMenu}
            class="inline-flex items-center justify-center p-2 rounded-md text-white bg-gray-700 hover:text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white w-full lg:w-auto"
          >
            <IconArrowBigLeft class="h-6 w-6" aria-hidden="true" />
          </button>
          <a href="/" class={getLinkClass("/")}>
            <IconHome class="h-6 w-6 mr-1" />
            Home
          </a>
          {isLoggedIn && (
            <>
              <a href="/s/" class={getLinkClass("/s/")}>
                <IconTextScan2 class="h-6 w-6 mr-1" />
                URL Shortener
              </a>
              <a href="/s/archive" class={getLinkClass("/s/archive")}>
                <IconArchiveFilled class="h-6 w-6 mr-1" />
                URL Archive
              </a>
              <a href="/s/data" class={getLinkClass("/s/data")}>
                <IconDatabase class="h-6 w-6 mr-1" />
                URL Database
              </a>
              <a href="/u/create" class={getLinkClass("/u/create")}>
                <IconUserPlus class="h-6 w-6 mr-1" />
                Create User
              </a>
              <a href="/u/db" class={getLinkClass("/u/db")}>
                <IconUsersGroup class="h-6 w-6 mr-1" />
                User Database
              </a>
            </>
          )}
          {isLoggedIn ? (
            <a href="/logout" class={getLinkClass("/logout")}>
              <IconLogout class="h-6 w-6 mr-1" />
              Log Out
            </a>
          ) : (
            <a href="/login" class={getLinkClass("/login")}>
              <IconLogin class="h-6 w-6 mr-1" />
              Log In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
