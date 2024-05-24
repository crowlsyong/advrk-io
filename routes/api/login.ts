import { Handlers } from "$fresh/server.ts";
import { setCookie } from "https://deno.land/std@0.203.0/http/cookie.ts";
import { getUser } from "../../services/database.ts";

export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const form = await req.formData();
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    const user = await getUser(username);

    if (user && user.password === password) {
      const sessionId = crypto.randomUUID(); // Generate a unique session ID
      const headers = new Headers();
      setCookie(headers, {
        name: "auth",
        value: sessionId, // Use the unique session ID
        maxAge: 1200,
        sameSite: "Lax", // This is important to prevent CSRF attacks
        domain: url.hostname,
        path: "/",
        secure: true,
      });

      headers.set("location", "/");
      return new Response(null, {
        status: 303, // "See Other"
        headers,
      });
    } else {
      const headers = new Headers({ "Content-Type": "application/json" });
      headers.set("location", "/login?error=Invalid%20username%20or%20password");
      return new Response(null, {
        status: 303,
        headers,
      });
    }
  },
};
