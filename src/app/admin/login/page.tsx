"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-green-800 text-center mb-4">Admin Login</h1>
        {error && <p className="text-red-600">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
        />
        <button className="bg-green-700 hover:bg-green-800 text-white py-2 rounded-md font-bold transition">
          Sign In
        </button>
      </form>
    </div>
  );
}
