"use client";

import { useState } from "react";
import FloatingNav from "@/components/FloatingNav";
import { motion } from "framer-motion";
import { CartItem } from "@/types";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 
  const [savedCode, setSavedCode] = useState("");

  return (
    <main id="cart" className="relative bg-[#f8f6f4] min-h-screen">
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
          Your Cart
        </h2>

        <p className="text-gray-500 text-sm md:text-base mt-2 max-w-xl">
          Review your items, save your cart, or continue to checkout.
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-10 lg:ml-28">

        {/* LEFT SIDE: Cart Items */}
        <section className="flex-1">
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* RIGHT SIDE: Summary + Save Cart */}
        <aside className="w-full lg:w-80 sticky top-28 h-fit bg-white/40 backdrop-blur-sm border border-neutral-100 p-5 rounded-xl shadow-sm flex flex-col gap-6">

          {/* Cart Total */}
          <div>
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <p className="text-sm text-neutral-600 mt-2">
              Total: <span className="font-semibold text-black">₦0</span>
            </p>
          </div>

          {/* Buy Now */}
          <Link
            href="/checkout"
            className="w-full py-3 rounded-xl text-center bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
          >
            Proceed to Checkout
          </Link>

          {/* Save Cart */}
          <button className="w-full py-3 rounded-xl text-center bg-white border border-neutral-300 text-sm font-medium hover:bg-neutral-100 transition">
            Save Cart for Later
          </button>

          {/* Load Saved Cart */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-500">Load Saved Cart</label>
            <input
              value={savedCode}
              onChange={(e) => setSavedCode(e.target.value)}
              placeholder="Enter code e.g. ED-4829"
              className="px-3 py-2 border border-neutral-300 rounded-xl text-sm"
            />
            <button className="py-2.5 rounded-xl bg-neutral-800 text-white text-sm hover:bg-black transition">
              Load Cart
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* --------------------------------------
   EMPTY CART COMPONENT
--------------------------------------- */
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-20"
    >
      <img
        src="/empty-cart.png"
        className="w-40 opacity-80 mb-6"
        alt="Empty Cart"
      />
      <h3 className="text-lg font-semibold">Your cart is empty</h3>
      <p className="text-sm text-gray-500 mt-2 mb-6">
        Browse our products and add items to your cart.
      </p>

      <Link
        href="/categories"
        className="px-5 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
      >
        Continue Shopping
      </Link>
    </motion.div>
  );
}

/* --------------------------------------
   CART ITEM CARD
--------------------------------------- */
function CartItemCard({ item }: { item: CartItem }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex gap-4 bg-white/40 backdrop-blur-sm border border-neutral-100 rounded-xl p-4 shadow-sm"
    >
      <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-200">
        <img
          src={item.image}
          className="w-full h-full object-cover"
          alt={item.name}
        />
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-sm">{item.name}</h4>
        <p className="text-xs text-neutral-500 mt-1">₦{item.price}</p>

        <div className="flex items-center gap-2 mt-3">
          <button className="px-2 py-1 border border-neutral-300 rounded-lg text-xs">
            -
          </button>
          <span className="text-sm">{item.quantity || 1}</span>
          <button className="px-2 py-1 border border-neutral-300 rounded-lg text-xs">
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
}
