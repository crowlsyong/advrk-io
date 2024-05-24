import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "https://deno.land/std@0.203.0/http/cookie.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const cookies = getCookies(req.headers);
  const sessionId = cookies["auth"]; // Check if the auth cookie exists

  console.log("Cookies:", cookies); // Debugging line to log cookies
  console.log("Session ID:", sessionId); // Debugging line to log session ID

  if (sessionId) {
    return await ctx.next();
  }

  const headers = new Headers();
  headers.set("location", "/login");
  return new Response(null, { status: 303, headers });
}