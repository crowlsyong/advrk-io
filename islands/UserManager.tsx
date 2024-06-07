import { useEffect, useState } from "preact/hooks";

type User = {
  id: string;
  username: string;
  userType: "admin" | "sudo" | "user";
};

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    userType: "user",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const currentUserId = "CURRENT_USER_ID"; // Replace with logic to get the current user ID

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Error fetching users");
      setIsError(true);
    }
  }

  function validateUsername(username: string) {
    const regex = /^[a-zA-Z0-9~!@#$%^&*()_+|}{\['";:/.,?><]+$/;
    return username.length >= 4 && regex.test(username);
  }

  function validatePassword(password: string) {
    return password.length >= 20;
  }

  async function handleCreate() {
    if (
      !validateUsername(formData.username) ||
      !validatePassword(formData.password)
    ) {
      setIsError(true);
      setMessage(
        "Invalid username or password. Username must be at least 4 characters and password must be at least 20 characters.",
      );
      return;
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.status === 409) {
      setIsError(true);
      setMessage("That username already exists, bucko");
    } else if (res.ok) {
      setIsError(false);
      setMessage("User created successfully!");
      fetchUsers();
    } else {
      setIsError(true);
      setMessage("An error occurred while creating the user");
    }
  }

  async function handleUpdate(id: string) {
    if (
      !validateUsername(formData.username) ||
      !validatePassword(formData.password)
    ) {
      setIsError(true);
      setMessage(
        "Invalid username or password. Username must be at least 10 characters and password must be at least 40 characters.",
      );
      return;
    }

    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, id }),
    });
    const message = await res.text();
    setMessage(message);
    fetchUsers();
    setEditUserId(null);
  }

  async function handleDelete(id: string) {
    if (id === currentUserId) {
      setMessage("You cannot delete the current user.");
      setIsError(true);
      return;
    }

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (res.status === 404) {
        setMessage(`User with id ${id} not found`);
        setIsError(true);
      } else {
        const message = await res.text();
        setMessage(message);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Error deleting user");
      setIsError(true);
    }
  }

  function startEditing(user: User) {
    if (editUserId === user.id) {
      // If already editing, cancel edit mode
      setEditUserId(null);
      setFormData({ username: "", password: "", userType: "user" });
    } else {
      // Start editing the user
      setEditUserId(user.id);
      setFormData({
        username: user.username,
        password: "",
        userType: user.userType,
      });
    }
  }

  return (
    <div class="p-6 bg-gray-900 text-white min-h-screen flex items-start justify-center">
      <div class="w-full max-w-3xl bg-gray-800 p-6 rounded-md shadow-md">
        <h1 class="text-3xl font-bold mb-6">User Manager</h1>
        <form onSubmit={(e) => e.preventDefault()} class="space-y-4 mb-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onInput={(e) =>
                setFormData({
                  ...formData,
                  username: (e.target as HTMLInputElement).value,
                })}
              class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder={editUserId ? "New Password" : "Password"}
              value={formData.password}
              onInput={(e) =>
                setFormData({
                  ...formData,
                  password: (e.target as HTMLInputElement).value,
                })}
              class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <select
              value={formData.userType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userType: (e.target as HTMLSelectElement).value,
                })}
              class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:ring focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="sudo">Sudo</option>
            </select>
          </div>
          <button
            onClick={() => (editUserId
              ? handleUpdate(editUserId)
              : handleCreate())}
            class={`w-full px-4 py-2 ${
              editUserId
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-md transition duration-300`}
          >
            {editUserId ? "Update User" : "Create User"}
          </button>
        </form>
        {message && (
          <p
            class={`mb-4 p-2 text-center ${
              isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
        <ul class="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              class={`flex items-center justify-between p-4 rounded-md ${
                user.id === currentUserId ? "bg-red-500" : "bg-gray-700"
              }`}
            >
              <span>{user.username} - {user.userType}</span>
              <div class="space-x-2">
                <button
                  onClick={() => startEditing(user)}
                  class={`px-3 py-1 ${
                    editUserId === user.id ? "bg-red-500" : "bg-yellow-500"
                  } text-white rounded-md hover:${
                    editUserId === user.id ? "bg-red-600" : "bg-yellow-600"
                  } transition duration-300`}
                >
                  {editUserId === user.id ? "Cancel" : "Edit"}
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  disabled={user.id === currentUserId}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
