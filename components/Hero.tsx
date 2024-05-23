// hero.tsx
import { JSX } from "preact";

export default function Hero(): JSX.Element {
  return (
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white min-h-screen flex items-center">
      <div class="container mx-auto px-6 py-16 text-center">
        <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Welcome to advrk.io
        </h1>
        <p class="text-xl md:text-2xl mb-8">
          Simplify your URLs with our lightweight and efficient URL shortener.
        </p>
        <div class="flex justify-center">
          <a
            href="/login"
            class="bg-white text-blue-600 font-semibold py-2 px-4 rounded-md shadow-md hover:bg-gray-100 transition duration-300"
          >
            Login
          </a>
          <a
            href="https://github.com/crowlsyong/advrk-io"
            target="_blank"
            rel="noopener noreferrer"
            class="ml-4 bg-transparent border border-white text-white font-semibold py-2 px-4 rounded-md hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Open Source
          </a>
        </div>
      </div>
    </div>
  );
}
