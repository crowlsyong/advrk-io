import { Handlers } from "$fresh/server.ts";
import { kv } from "../../../services/database.ts";
import { UserSchema } from "../../../services/database.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export const handler: Handlers<UserSchema | string> = {
    async GET(_req, ctx) {
      const id = ctx.params.id;
      const key = ["user", id];
      const user = (await kv.get<UserSchema>(key)).value;
      if (!user) {
        return new Response(`User with id ${id} not found`, { status: 404 });
      }
      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" },
      });
    },
  
    async PUT(req, ctx) {
      const id = ctx.params.id;
      const { username, password, userType } = await req.json() as UserSchema;
      const userKey = ["user", id];
      const userRes = await kv.get(userKey);
      if (!userRes.value) {
        return new Response(`No user with id ${id} found`, { status: 404 });
      }
      const hashedPassword = await bcrypt.hash(password); // Hash the new password
      const updatedUser: UserSchema = { id, username, password: hashedPassword, userType };
      const ok = await kv.atomic().check(userRes).set(userKey, updatedUser).commit();
      if (!ok) throw new Error("Something went wrong.");
      return new Response(JSON.stringify(updatedUser), {
        headers: { "Content-Type": "application/json" },
      });
    },
  
    async DELETE(_req, ctx) {
      const id = ctx.params.id;
      const userKey = ["user", id];
      const userRes = await kv.get(userKey);
      if (!userRes.value) {
        return new Response(`No user with id ${id} found`, { status: 404 });
      }
      const ok = await kv.atomic().check(userRes).delete(userKey).commit();
      if (!ok) throw new Error("Something went wrong.");
      return new Response(`User ${id} deleted`);
    },
  };
