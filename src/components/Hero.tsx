"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const heroBackgrounds = [
  "/hero/hero-bg1.jpg",
  "/hero/hero-bg2.jpg",
  "/hero/hero-bg3.jpg",
  "/hero/hero-bg4.jpg",
  "/hero/hero-bg5.jpg",
];

const trendingItems = [
  { img: "/trending/trend1.jpg", name: "Pearl Drop Earrings" },
  { img: "/trending/trend2.jpg", name: "Silver Layered Necklace" },
  { img: "/trending/trend3.jpg", name: "Gold Charm Bracelet" },
  { img: "/trending/trend4.jpg", name: "Leather Statement Bag" },
  { img: "/trending/trend5.jpg", name: "Chandelier Earrings" },
];

export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollX((prev) => prev + 1);
    }, 50); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">

      {/* Rotating Hero Backgrounds */}
      <AnimatePresence>
        <motion.div
          key={bgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackgrounds[bgIndex]})` }}
        />
      </AnimatePresence>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Wordmark */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="absolute top-8 text-sm tracking-[0.3em] uppercase text-neutral-100"
      >
        Essentials by Derinn
      </motion.h2>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-4xl font-semibold leading-tight text-black"
        >
          Where Timeless Elegance  
          <br />
          Meets Energy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-5 text-neutral-200 text-sm md:text-base leading-relaxed"
        >
          Discover accessories crafted for bold, confident men & women.  
          A curated world of jewelry, bags, and signature pieces designed to shine in every moment.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <button className="px-6 py-3 rounded-full bg-white text-black text-sm tracking-wide hover:bg-neutral-200 transition">
            Shop New Arrivals
          </button>

          <button className="px-6 py-3 rounded-full border border-white text-sm hover:bg-white hover:text-white transition">
            Explore Essentials
          </button>
        </motion.div>

        {/* Auto-Scrolling Trending Items Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-12 overflow-hidden"
        >
          <div
            className="flex gap-4"
            style={{ transform: `translateX(-${scrollX}px)` }}
          >
            {trendingItems.concat(trendingItems).map((item, idx) => (
              <div
                key={idx}
                className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 min-w-[120px] flex-shrink-0"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-28 object-cover rounded-md"
                />
                <p className="text-white text-xs mt-2">{item.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
