"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react"; // Filter removed

// -----------------------------------------------------
// DUMMY PRODUCT DATA (Replace later with real API)
// -----------------------------------------------------
const allProducts = Array.from({ length: 40 }).map((_, i) => ({
  id: i + 1,
  name: `Premium Bracelet ${i + 1}`,
  price: 14500 + i * 200,
  image: `/products/p${(i % 6) + 1}.jpg`,
}));

export default function ShopPage() {
  const [visibleCount, setVisibleCount] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  const displayedProducts = allProducts.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <main className="pt-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-xs md:text-sm tracking-[0.35em] uppercase text-neutral-800 mb-10"
      >
        Essentials by Derinn
      </motion.h2>

      <div className="w-full flex flex-col items-center text-center mt-16 mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Shop
        </h2>
      </div>

      {/* FILTER BUTTON REMOVED */}

      <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-10 lg:ml-28">
        <aside className="hidden md:block w-64 sticky top-28 h-fit border-r pr-6">
          <h4 className="text-sm font-semibold mb-4 tracking-wide">Filters</h4>

          <div className="space-y-5">
            <div>
              <h5 className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
                Category
              </h5>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-black cursor-pointer">Necklaces</li>
                <li className="hover:text-black cursor-pointer">Bracelets</li>
                <li className="hover:text-black cursor-pointer">Rings</li>
                <li className="hover:text-black cursor-pointer">Watches</li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
                Price
              </h5>
              <ul className="space-y-2 text-sm">
                <li>₦10,000 - ₦20,000</li>
                <li>₦20,000 - ₦30,000</li>
                <li>₦30,000 - ₦50,000</li>
              </ul>
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
                onClick={() => setQuickViewProduct(product)}
              >
                <div className="relative rounded-lg overflow-hidden bg-neutral-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-44 object-cover group-hover:scale-105 transition"
                  />
                </div>
                <h4 className="mt-3 text-sm font-medium">{product.name}</h4>
                <p className="text-neutral-600 text-xs">
                  ₦{product.price.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>

          {visibleCount < allProducts.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                className="px-6 py-3 border border-black rounded-full text-sm hover:bg-black hover:text-white transition"
              >
                Load More
              </button>
            </div>
          )}
        </section>
      </div>

      {/* MOBILE FILTER MODAL (still works if opened some other way, but hidden since button removed) */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white w-[90%] rounded-2xl p-6 relative">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="absolute top-4 right-4"
            >
              <X size={22} />
            </button>

            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            <div className="space-y-6">
              <div>
                <h5 className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
                  Category
                </h5>
                <ul className="space-y-2 text-sm">
                  <li>Necklaces</li>
                  <li>Bracelets</li>
                  <li>Rings</li>
                  <li>Watches</li>
                </ul>
              </div>

              <div>
                <h5 className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
                  Price
                </h5>
                <ul className="space-y-2 text-sm">
                  <li>₦10,000 - ₦20,000</li>
                  <li>₦20,000 - ₦30,000</li>
                  <li>₦30,000 - ₦50,000</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4"
            >
              <X size={22} />
            </button>

            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="w-full h-64 object-cover rounded-lg mb-5"
            />

            <h3 className="text-lg font-semibold">{quickViewProduct.name}</h3>
            <p className="text-neutral-600 mb-2">
              ₦{quickViewProduct.price.toLocaleString()}
            </p>

            <button className="w-full py-3 mt-4 rounded-full bg-black text-white text-sm tracking-wide">
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
