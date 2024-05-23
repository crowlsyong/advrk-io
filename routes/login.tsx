import { h } from "preact";
import { useEffect } from "preact/hooks";
import type { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.203.0/http/cookie.ts";
import ErrorHandler from "../islands/ErrorHandler.tsx";

interface Data {
  isAllowed: boolean;
  error?: string;
}

export const handler: Handlers = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const cookies = getCookies(req.headers);
    const error = url.searchParams.get("error");
    return ctx.render!({ isAllowed: cookies.auth === "bar", error });
  },
};

function Login() {
  return (
    <form
      method="post"
      action="/api/login"
      class="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div class="mb-4">
        <label
          class="block text-gray-400 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          class="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-400 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          class="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default function Home({ data }: PageProps<Data>) {
  useEffect(() => {
    // Log the auth cookie on the client side
    const authCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth="));
    console.log("Auth Cookie:", authCookie);
  }, []);

  return (
    <div class="bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen pb-10 flex flex-col items-center justify-center">
      <div class="flex flex-row gap-2 items-center">
        <h1 class="font-bold text-white text-2xl mb-4">🧗 advrk.io</h1>
      </div>
      <div class="mb-4 text-gray-400">
        You currently {data.isAllowed ? "are" : "are not"} logged in.
      </div>
      {!data.isAllowed ? <Login /> : <a href="/logout" class="text-blue-500 hover:text-blue-300">Logout</a>}
      {data.error && <ErrorHandler initialError={data.error} />}
    </div>
  );
}
