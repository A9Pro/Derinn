"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("electronics");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const categories = [
    { id: "electronics", label: "Electronics" },
    { id: "fashion", label: "Fashion" },
    { id: "books", label: "Books" },
    { id: "home", label: "Home & Living" },
    { id: "others", label: "Others" },
  ];

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p className="text-center mt-12">Access Denied</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !image || !category) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("file", image);

    const res = await fetch("/api/items", { method: "POST", body: formData });
    const data = await res.json();
    setMessage(data.message);

    setName("");
    setDescription("");
    setPrice("");
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="flex justify-between w-full max-w-lg mb-6">
        <h1 className="text-3xl font-bold text-green-800">Admin Dashboard</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg flex flex-col gap-4"
      >
        {message && <p className="text-green-700 font-semibold">{message}</p>}

        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
        />
        {preview && <img src={preview} alt="Preview" className="h-48 object-contain my-2 mx-auto" />}
        <button className="bg-green-700 hover:bg-green-800 text-white py-2 rounded-md font-bold transition">
          Upload Item
        </button>
      </form>
    </div>
  );
}
