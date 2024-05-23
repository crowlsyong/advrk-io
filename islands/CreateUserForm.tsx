// islands/CreateUserForm.tsx
import { h } from "preact";
import { useState } from "preact/hooks";

export default function CreateUserForm() {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/u/create", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setMessage("User created successfully!");
      setIsSuccess(true);
      form.reset();
    } else {
      setMessage("Failed to create user.");
      setIsSuccess(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div class="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold mb-4 text-center text-white">Create User</h1>
        {message && (
          <div class={`mb-4 p-2 text-center ${isSuccess ? "text-white bg-green-500" : "text-white bg-red-500"} rounded`}>
            {message}
          </div>
        )}
        <form class="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label for="username" class="block text-gray-400">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              class="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label for="password" class="block text-gray-400">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              class="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
