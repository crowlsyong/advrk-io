// api/login.ts
import { Handlers } from "$fresh/server.ts";
import { setCookie } from "https://deno.land/std@0.203.0/http/cookie.ts";
import {
  comparePassword,
  getUser,
  saveSession,
} from "../../services/database.ts";

export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const form = await req.formData();
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    console.log("Login attempt for username:", username);

    const user = await getUser(username);
    console.log("User fetched:", user); // Log the user object

    if (user) {
      const passwordMatch = await comparePassword(password, user.password);
      console.log("Password match result:", passwordMatch); // Log password match result

      if (passwordMatch) {
        console.log(`User logged in with userType: ${user.userType}`); // Log the user type

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

        if (user.userType) {
          setCookie(headers, {
            name: "userType",
            value: user.userType, // Ensure userType is not undefined
            maxAge: 1200,
            sameSite: "Lax",
            domain: url.hostname,
            path: "/",
            secure: true,
          });
        } else {
          console.error("UserType is undefined for user:", username);
        }

        // Save session with user ID and session ID
        await saveSession(user.id, sessionId);

        headers.set("location", "/");
        return new Response(null, {
          status: 303, // "See Other"
          headers,
        });
      } else {
        console.error("Password does not match for user:", username);
      }
    } else {
      console.error("User not found:", username);
    }

    const headers = new Headers({ "Content-Type": "application/json" });
    headers.set("location", "/login?error=Invalid%20username%20or%20password");
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
