import { useEffect, useRef, useState } from "preact/hooks";
import IconDatabase from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/database.tsx";
import IconArchiveFilled from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/archive-filled.tsx";
import IconLogin from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/login.tsx";
import IconLogout from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/logout.tsx";
import IconMenu2 from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/menu-2.tsx";
import IconHome from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/home.tsx";

export default function MenuBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState<string>("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActivePath(window.location.pathname);
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
      activePath === path
        ? "text-white bg-gray-700"
        : "text-gray-700 hover:text-white hover:bg-gray-700"
    }`;

  return (
    <nav class="bg-white border-b border-gray-300 shadow-sm relative" ref={menuRef}>
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={toggleMenu}
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <IconMenu2 class="h-6 w-6" aria-hidden="true" />
            </button>
            <a href="/" class="ml-3 text-xl font-semibold">🧗 advrk.io</a>
          </div>
        </div>
      </div>

      {isOpen && (
        <div class="absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a href="/" class={getLinkClass("/s")}>
              <IconHome class="h-6 w-6 mr-1" />
              URL Shortener
            </a>
            <a href="/archive" class={getLinkClass("/archive")}>
              <IconArchiveFilled class="h-6 w-6 mr-1" />
              URL Archive
            </a>
            <a href="/data" class={getLinkClass("/data")}>
              <IconDatabase class="h-6 w-6 mr-1" />
              URL Database
            </a>

            <a href="/login" class={getLinkClass("/login")}>
              <IconLogin class="h-6 w-6 mr-1" />
              Log In
            </a>
            <a href="/logout" class={getLinkClass("/logout")}>
              <IconLogout class="h-6 w-6 mr-1" />
              Log Out
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
