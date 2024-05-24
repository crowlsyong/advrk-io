import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.203.0/http/cookie.ts";
import TopBar from "../islands/TopBar.tsx";

interface Data {
  isAllowed: boolean;
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    const isAllowed = Boolean(cookies.auth); // Check if the auth cookie exists

    return ctx.render({ isAllowed });
  },
};

export default function App({ Component, data }: PageProps<Data>) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>shrt url</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        {data.isAllowed && <TopBar />} {/* Conditionally render TopBar */}
        <Component />
      </body>
    </html>
  );
}
