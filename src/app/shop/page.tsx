"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FloatingNav from "@/components/FloatingNav";
import { X, ShoppingCart } from "lucide-react";

// Sample products (could be fetched from API)
const allProducts = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: `₦${(i + 1) * 5000}`,
  img: `/products/product${(i % 5) + 1}.jpg`,
  description: `This is a detailed description for Product ${i + 1}.`,
}));

export default function ShopPage() {
  const [visibleProducts, setVisibleProducts] = useState(allProducts.slice(0, 8));
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filter, setFilter] = useState("All");

  <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="absolute top-8 text-sm tracking-[0.3em] uppercase text-neutral-100"
      >
        Essentials by Derinn
      </motion.h2>

  // Infinite scroll / Load More
  const loadMore = () => {
    const next = allProducts.slice(visibleProducts.length, visibleProducts.length + 8);
    setVisibleProducts([...visibleProducts, ...next]);
  };

  // Filters (just sample categories)
  const categories = ["All", "Earrings", "Necklaces", "Bags", "Slippers", "Heels", "Croks", "Perfume", "Bracelets"];

  // Filtered products
  const filteredProducts =
    filter === "All"
      ? visibleProducts
      : visibleProducts.filter((p) => p.name.includes(filter));

  return (
    <main className="relative bg-[#f8f6f4] min-h-screen">
      <FloatingNav />

      {/* Hero Section - displayed across all pages */}
      <section id="hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 px-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">
            Shop Accessories
          </h1>
          <p className="mt-4 text-neutral-600 md:text-lg">
            Discover our curated collection of jewelry, bags, and essentials.
          </p>
        </motion.div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-8">

        {/* Filter / Sort Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 space-y-6 sticky top-32">
          <h2 className="text-lg font-semibold text-neutral-900">Categories</h2>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`text-left px-4 py-2 rounded-lg transition ${
                filter === cat ? "bg-black text-white" : "hover:bg-neutral-200"
              }`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* Mobile Filter Dropdown */}
        <div className="lg:hidden mb-6">
          <select
            className="w-full p-3 rounded-lg border border-gray-300"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-64 object-cover transform hover:scale-105 transition"
                />
              </div>
              <div className="p-4">
                <h2 className="text-neutral-900 font-semibold">{product.name}</h2>
                <p className="text-neutral-700 mt-1">{product.price}</p>
                <button className="mt-4 w-full py-2 rounded-full bg-black text-white text-sm hover:bg-neutral-800 transition">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </section>
      </div>

      {/* Load More Button */}
      {visibleProducts.length < allProducts.length && (
        <div className="text-center my-12">
          <button
            onClick={loadMore}
            className="px-6 py-3 rounded-full bg-black text-white text-sm hover:bg-neutral-800 transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl max-w-md w-full overflow-hidden"
          >
            <div className="relative">
              <img
                src={selectedProduct.img}
                alt={selectedProduct.name}
                className="w-full h-80 object-cover"
              />
              <button
                className="absolute top-4 right-4 text-black"
                onClick={() => setSelectedProduct(null)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">{selectedProduct.name}</h2>
              <p className="mt-2 text-neutral-700">{selectedProduct.price}</p>
              <p className="mt-4 text-neutral-600">{selectedProduct.description}</p>
              <button className="mt-6 w-full py-2 rounded-full bg-black text-white text-sm hover:bg-neutral-800 transition">
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
