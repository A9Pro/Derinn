// src/app/cart/page.tsx
"use client";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import FloatingNav from "@/components/FloatingNav";
import { motion } from "framer-motion";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, saveCart, loadSavedCart } = useCart();
  const [codeInput, setCodeInput] = useState("");
  const [savedCode, setSavedCode] = useState<string | null>(null);

  const handleSaveCart = () => {
    const newCode = saveCart();
    setSavedCode(newCode);
    clearCart();
  };

  return (
    <main className="relative bg-[#f8f6f4] min-h-screen pb-20">
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
      <div className="w-full flex flex-col items-center text-center mt-4 mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Cart</h1>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        {cart.length === 0 ? (
          <p className="text-center text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 p-4 rounded-xl mb-4 flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-semibold text-lg">{item.title}</p>
                <p className="text-gray-700 text-sm">₦{item.price}</p>
              </div>

              <input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="border p-2 w-20 rounded-lg text-center"
              />

              <button
                className="text-red-500 font-medium"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4">
          <button className="bg-black text-white p-4 rounded-xl text-lg font-medium shadow-md">
            Pay Now
          </button>

          <button
            onClick={handleSaveCart}
            className="bg-gray-200 p-4 rounded-xl text-lg font-medium shadow-sm"
          >
            Save Cart
          </button>
          <p className="text-sm text-center text-gray-600 -mt-2">Save to cart and buy later</p>

          {savedCode && (
            <p className="text-center text-green-600 text-xl font-semibold mt-4">
              Saved! Your code: {savedCode}
            </p>
          )}
        </div>

        {/* Load Saved Cart */}
        <div className="mt-12 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-center">Load Saved Cart</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter saved code (e.g., ED-3823)"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="border p-3 flex-1 rounded-lg text-lg"
            />

            <button
              onClick={() => {
                const ok = loadSavedCart(codeInput);
                if (!ok) alert("Invalid or expired cart code.");
              }}
              className="bg-black text-white px-6 rounded-lg text-lg font-medium"
            >
              Load
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}