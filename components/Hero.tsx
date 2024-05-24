import { JSX } from "preact";

interface HeroProps {
  isLoggedIn: boolean;
}

export default function Hero({ isLoggedIn }: HeroProps): JSX.Element {
  return (
    <div class="bg-gray-800 text-white min-h-screen flex items-center">
      <div class="container mx-auto px-6 py-16 text-center">
        <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-4">
          {isLoggedIn ? "Welcome back" : "Welcome to advrk.io"}
        </h1>
        <p class="text-xl md:text-2xl mb-8">
          {isLoggedIn
            ? "The URL Shortener Awaits"
            : "Simplify your URLs with our lightweight and efficient URL shortener."}
        </p>
        <div class="flex justify-center">
          <a
            href={isLoggedIn ? "/s" : "/login"}
            class={`${
              isLoggedIn ? "bg-green-600" : "bg-blue-600"
            } text-white font-semibold py-2 px-4 rounded-md shadow-md hover:${
              isLoggedIn ? "bg-green-500" : "bg-blue-500"
            } transition duration-300`}
          >
            {isLoggedIn ? "URL Shortener" : "Login"}
          </a>
          <a
            href="https://github.com/crowlsyong/advrk-io"
            target="_blank"
            rel="noopener noreferrer"
            class="ml-4 bg-transparent border border-gray-300 text-gray-300 font-semibold py-2 px-4 rounded-md hover:bg-gray-800 hover:text-white transition duration-300"
          >
            Open Source
          </a>
        </div>
      </div>
    </div>
  );
}
