import { h } from "preact";
import IconFacebook from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/brand-facebook.tsx";
import IconTwitter from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/brand-twitter.tsx";
import IconInstagram from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/brand-instagram.tsx";
import IconGithub from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/brand-github.tsx";

export default function Footer() {
  return (
    <footer class="bg-gray-900 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-between items-center">
          <div class="w-full md:w-auto text-center md:text-left">
            <h2 class="text-2xl font-bold mb-2">Company Name</h2>
            <p class="text-gray-400">© 2024 Company Name. All rights reserved.</p>
          </div>
          <div class="w-full md:w-auto text-center md:text-right mt-4 md:mt-0">
            <div class="flex justify-center md:justify-end space-x-4">
              <a
                href="#"
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Sign Up
              </a>
              <a
                href="#"
                class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
        <div class="flex justify-center md:justify-end mt-6 space-x-6">
          <a href="#" class="text-gray-400 hover:text-gray-500">
            <IconFacebook class="w-6 h-6" aria-hidden="true" />
          </a>
          <a href="#" class="text-gray-400 hover:text-gray-500">
            <IconTwitter class="w-6 h-6" aria-hidden="true" />
          </a>
          <a href="#" class="text-gray-400 hover:text-gray-500">
            <IconInstagram class="w-6 h-6" aria-hidden="true" />
          </a>
          <a href="#" class="text-gray-400 hover:text-gray-500">
            <IconGithub class="w-6 h-6" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
