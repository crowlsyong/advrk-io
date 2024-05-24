import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.203.0/http/cookie.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const url = new URL(req.url);

  // Exclude the login route from the middleware check
  if (url.pathname === "/login") {
    return await ctx.next();
  }

  const cookies = getCookies(req.headers);
  const sessionId = cookies["auth"];

  console.log("Cookies:", cookies); // Debugging line to log cookies
  console.log("Session ID:", sessionId); // Debugging line to log session ID

  if (sessionId) {
    return await ctx.next();
  }

  return Response.redirect("/login", 303);
}
