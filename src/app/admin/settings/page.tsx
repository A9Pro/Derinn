"use client";
import { useState } from "react";
import AdminLayout from "../layout";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("My Website");

  const handleSave = () => {
    alert(`Saved site name: ${siteName}`);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-5">Admin Settings</h1>
      <div className="bg-white p-5 rounded shadow max-w-md">
        <label className="block mb-2">Site Name</label>
        <input
          type="text"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </AdminLayout>
  );
}
