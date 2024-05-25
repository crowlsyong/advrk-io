import { Handlers } from "$fresh/server.ts";
import { kv, createUser, getUser } from "../../../services/database.ts";  // Adjust the import path if necessary

export const handler: Handlers = {
  async GET() {
    try {
      const users = await kv.list({ prefix: ["user"] });
      const allUsers = new Map(); // Use a Map to ensure unique users
      for await (const entry of users) {
        allUsers.set(entry.key[1], entry.value); // Assuming entry.key[1] is the unique user ID
      }
      return new Response(JSON.stringify([...allUsers.values()]), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
  
  async POST(req) {
    try {
      const user = await req.json();
      const existingUser = await getUser(user.username);
      if (existingUser) {
        return new Response("Username already exists", { status: 409 });
      }
      const userId = await createUser(user.username, user.password, user.userType);
      const userKey = ["user", userId];
      const savedUser = (await kv.get(userKey)).value;
      if (!savedUser) {
        return new Response("Failed to create user", { status: 500 });
      }
      return new Response(JSON.stringify(savedUser), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
