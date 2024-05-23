// routes/createuser.tsx
import { Handlers } from "$fresh/server.ts";
import CreateUserForm from "../../islands/CreateUserForm.tsx";
import { createUser } from "../../services/database.ts";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    if (username && password) {
      await createUser(username, password);
      return new Response(null, {
        status: 200,
      });
    } else {
      return new Response(null, {
        status: 400,
      });
    }
  },
};

export default function CreateUser() {
  return (
    <div>
      <CreateUserForm />
    </div>
  );
}
