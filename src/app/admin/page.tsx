// src/app/admin/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded auth
    if (username === "admin" && password === "secret") {
      localStorage.setItem("adminToken", "authenticated");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-green-800">Admin Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-md font-bold transition">
          Login
        </button>
      </form>
    </div>
  );
}
