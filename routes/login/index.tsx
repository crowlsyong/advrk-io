import { useEffect } from "preact/hooks";
import type { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.203.0/http/cookie.ts";
import ErrorHandler from "../../islands/ErrorHandler.tsx";

interface Data {
  isAllowed: boolean;
  error?: string;
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const cookies = getCookies(req.headers);
    const error = url.searchParams.get("error") || undefined; // Ensure error is undefined if null
    const isAllowed = Boolean(cookies.auth); // Check if the auth cookie exists

    return ctx.render!({ isAllowed, error });
  },
};

function Login() {
  return (
    <form
      method="post"
      action="/api/login"
      class="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full"
    >
      <div class="mb-4">
        <label
          class="block text-gray-300 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          class="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-300 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          class="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="flex items-center justify-between w-full">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Log In
        </button>
      </div>
    </form>
  );
}

export default function Home({ data }: PageProps<Data>) {
  useEffect(() => {
    if (data.isAllowed) {
      window.location.href = "/s"; // Redirect if logged in
    }
  }, [data.isAllowed]);

  return (
    <div class="md:bg-black bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div class="flex flex-col md:flex-row max-w-4xl w-full">
        <div class="flex-1 flex flex-col text-center justify-center mb-8 md:mb-0">
          <h1 class="font-bold text-red-600 text-4xl md:text-6xl mb-4">
            advkr.io
          </h1>
          <p class="text-gray-300 text-xl md:text-2xl">
            Simple URL shortener.
          </p>
        </div>
        <div class="flex-1 bg-gray-900 p-6 rounded-lg shadow-lg">
          <div class="mb-4 text-gray-300 text-center">
            You currently {data.isAllowed ? "are" : "are not"} logged in.
          </div>
          {!data.isAllowed ? <Login /> : (
            <div class="text-center">
              <a href="/logout" class="text-blue-500 hover:text-blue-400">
                Logout
              </a>
            </div>
          )}
          {data.error && <ErrorHandler initialError={data.error} />}
          <div class="mt-4 text-gray-400 text-center">
          </div>
        </div>
      </div>
    </div>
  );
}
