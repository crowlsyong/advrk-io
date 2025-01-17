import { Handlers } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.203.0/http/cookie.ts";

export const handler: Handlers = {
  GET(req) {
    const cookies = getCookies(req.headers);
    const isAllowed = Boolean(cookies.auth); // Check if the auth cookie exists

    if (isAllowed) {
      return new Response(null, {
        status: 303,
        headers: { "Location": "/s" },
      });
    } else {
      return new Response(null, {
        status: 303,
        headers: { "Location": "/login" },
      });
    }
  },
};
