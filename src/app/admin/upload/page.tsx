// src/app/admin/upload/page.tsx
"use client";

import { useState, useEffect } from "react";
import { categories } from "@/app/categories/page"; // reuse categories
import Link from "next/link";

export default function AdminUpload() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0].id); // default category
  const [itemNumber, setItemNumber] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !image || !category || !itemNumber) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("itemNumber", itemNumber);
    formData.append("file", image);

    const res = await fetch("/api/items", { method: "POST", body: formData });
    const data = await res.json();
    setMessage(data.message);

    setName("");
    setDescription("");
    setPrice("");
    setItemNumber("");
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-green-800">Admin Upload</h1>

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

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Item Number"
          value={itemNumber}
          onChange={(e) => setItemNumber(e.target.value)}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
        />

        {/* Category Selector with preview */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-green-800">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>

          <div className="mt-2 h-32 w-full rounded-xl overflow-hidden">
            <img
              src={categories.find((cat) => cat.id === category)?.image}
              alt="Category Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
        />
        {preview && <img src={preview} alt="Item Preview" className="h-48 object-contain my-2 mx-auto" />}

        <button className="bg-green-700 hover:bg-green-800 text-white py-2 rounded-md font-bold transition">
          Upload Item
        </button>
      </form>
    </div>
  );
}
