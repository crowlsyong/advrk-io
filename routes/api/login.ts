// login.ts
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
      const headers = new Headers();
      setCookie(headers, {
        name: "auth",
        value: "bar", // this should be a unique value for each session
        maxAge: 120,
        sameSite: "Lax", // this is important to prevent CSRF attacks
        domain: url.hostname,
        path: "/",
        secure: true,
      });

      headers.set("location", "/s/");
      return new Response(null, {
        status: 303, // "See Other"
        headers,
      });
    } else {
      return new Response(null, {
        status: 403,
      });
    }
  },
};
