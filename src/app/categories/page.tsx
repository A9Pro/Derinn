"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import FloatingNav from "@/components/FloatingNav";

const categories = [
  { id: "earrings", title: "Earrings", count: 48, image: "/categories/cat-earrings.jpg" },
  { id: "necklaces", title: "Necklaces", count: 34, image: "/categories/cat-necklaces.jpg" },
  { id: "bags", title: "Bags", count: 22, image: "/categories/cat-bags.jpg" },
  { id: "bracelets", title: "Bracelets", count: 15, image: "/categories/cat-bracelets.jpg" },
  { id: "rings", title: "Rings", count: 19, image: "/categories/cat-rings.jpg" },
  { id: "footwear", title: "Footwear", count: 26, image: "/categories/cat-footwear.jpg" },
  { id: "fragrance", title: "Fragrance", count: 8, image: "/categories/cat-fragrance.jpg" },
  { id: "accessories", title: "Other Accessories", count: 40, image: "/categories/cat-accessories.jpg" },
];

export default function CategoriesPage() {
  return (
    <main id="categories" className="relative bg-[#f8f6f4] min-h-screen">
      <FloatingNav />

      {/* Brand Heading */}
      <div className="pt-12">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs md:text-sm tracking-[0.35em] uppercase text-neutral-800 mb-8"
        >
          Essentials by Derinn
        </motion.h2>
      </div>

      {/* Page Title */}
      <div className="w-full flex flex-col items-center text-center mt-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Categories
        </h2>

        <p className="text-gray-500 text-sm md:text-base mt-2 max-w-xl">
          Browse our curated categories — find what moves you.
        </p>
      </div>

      {/* MOBILE SORT ONLY */}
      <div className="lg:hidden flex justify-end px-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-600">Sort</span>
          <select className="px-3 py-2 rounded-lg border border-neutral-300 text-xs">
            <option value="popular">Most Popular</option>
            <option value="new">Newest</option>
            <option value="a-z">A → Z</option>
          </select>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-10 lg:ml-28">

        {/* DESKTOP SIDEBAR: Sort ABOVE Filters */}
        <aside className="hidden lg:flex w-64 sticky top-28 h-fit pr-6 flex-col gap-6">

          {/* SORT AREA */}
          <div className="bg-white/40 backdrop-blur-sm border border-neutral-100 rounded-lg p-4">
            <span className="text-xs text-neutral-600">Sort</span>

            <select className="mt-2 px-3 py-2 rounded-lg border border-neutral-300 text-xs w-full">
              <option value="popular">Most Popular</option>
              <option value="new">Newest</option>
              <option value="a-z">A → Z</option>
            </select>
          </div>

          {/* FILTER AREA */}
          <div className="bg-white/40 backdrop-blur-sm border border-neutral-100 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Filters (coming soon)</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Refine by material, price, and collection.
            </p>
          </div>
        </aside>

        {/* GRID */}
        <section className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

/* --------------------------------------
   Category Card Component
--------------------------------------- */
function CategoryCard({
  category,
}: {
  category: { id: string; title: string; count: number; image: string };
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="group cursor-pointer">
      <Link href={`/categories/${category.id}`} className="block">
        <div className="relative h-44 w-full rounded-xl overflow-hidden bg-neutral-100 shadow-sm">

          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25 opacity-90" />

          <div className="absolute left-4 bottom-4">
            <h3 className="text-white font-semibold text-sm">{category.title}</h3>
            <p className="text-xs text-white/90 mt-1">{category.count} items</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
