"use client";

import { useState, useEffect } from "react";
import FloatingNav from "@/components/FloatingNav";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trash2, Plus, Minus, Mail, Printer, Share2 } from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  productNumber: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedCode, setSavedCode] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, Math.min(item.stock, item.quantity + change));
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSaveCart = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const items = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtAdd: item.price,
      }));

      const response = await fetch("/api/admin/saved-carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || null,
          items,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedCode(data.cartCode);
        
        // Send email if provided
        if (email) {
          await fetch("/api/send-cart-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              cartCode: data.cartCode,
              items: cartItems,
              total: calculateTotal(),
            }),
          });
        }

        setShowSaveModal(false);
        alert(`Cart saved! Your code is: ${data.cartCode}\n\nPlease save this code to retrieve your cart later.`);
        setEmail("");
      } else {
        alert("Failed to save cart");
      }
    } catch (error) {
      console.error("Error saving cart:", error);
      alert("Error saving cart");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCart = async () => {
    if (!savedCode.trim()) {
      alert("Please enter a cart code");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/saved-carts?cartCode=${savedCode}`);
      
      if (response.ok) {
        const data = await response.json();
        
        const loadedItems: CartItem[] = data.items.map((item: any) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          productNumber: item.product.productNumber,
          image: item.product.imageUrl,
          price: item.product.price,
          quantity: item.quantity,
          stock: item.product.stock,
        }));

        setCartItems(loadedItems);
        setSavedCode("");
        alert("Cart loaded successfully!");
      } else if (response.status === 404) {
        alert("Cart not found. Please check your code.");
      } else if (response.status === 410) {
        alert("This cart has expired.");
      } else {
        alert("Failed to load cart");
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      alert("Error loading cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `Check out my cart at Derinn!\n\nItems:\n${cartItems
      .map((item) => `- ${item.name} (x${item.quantity})`)
      .join("\n")}\n\nTotal: ₦${calculateTotal().toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Cart details copied to clipboard!");
    }
  };

  const total = calculateTotal();

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
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-10 lg:ml-28 pb-20">
        {/* LEFT SIDE: Cart Items */}
        <section className="flex-1">
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </section>

        {/* RIGHT SIDE: Summary + Actions */}
        {cartItems.length > 0 && (
          <aside className="w-full lg:w-80 sticky top-28 h-fit bg-white/40 backdrop-blur-sm border border-neutral-100 p-5 rounded-xl shadow-sm flex flex-col gap-6">
            {/* Cart Total */}
            <div>
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Items ({cartItems.length})</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Buy Now */}
            <Link
              href="/checkout"
              className="w-full py-3 rounded-xl text-center bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
            >
              Proceed to Checkout
            </Link>

            {/* Cart Actions */}
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-sm hover:bg-neutral-100 transition flex items-center justify-center gap-2"
                title="Print Cart"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-sm hover:bg-neutral-100 transition flex items-center justify-center gap-2"
                title="Share Cart"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>

            {/* Save Cart */}
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full py-3 rounded-xl text-center bg-white border border-neutral-300 text-sm font-medium hover:bg-neutral-100 transition"
            >
              Save Cart for Later
            </button>

            {/* Load Saved Cart */}
            <div className="flex flex-col gap-2 pt-4 border-t border-neutral-200">
              <label className="text-xs text-neutral-500">Load Saved Cart</label>
              <input
                value={savedCode}
                onChange={(e) => setSavedCode(e.target.value.toUpperCase())}
                placeholder="Enter code e.g. ED-4829"
                className="px-3 py-2 border border-neutral-300 rounded-xl text-sm"
              />
              <button
                onClick={handleLoadCart}
                disabled={loading}
                className="py-2.5 rounded-xl bg-neutral-800 text-white text-sm hover:bg-black transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load Cart"}
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Save Cart Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Save Your Cart</h2>
            <p className="text-sm text-gray-600 mb-4">
              We'll generate a unique code (ED-####) so you can retrieve your cart later.
              Optionally, provide your email to receive the cart details.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll email you your cart code and items
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setEmail("");
                }}
                className="flex-1 py-2.5 rounded-lg border border-neutral-300 text-sm hover:bg-neutral-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCart}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg bg-black text-white text-sm hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
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
      <div className="w-40 h-40 bg-neutral-200 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-20 h-20 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
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
function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex gap-4 bg-white/40 backdrop-blur-sm border border-neutral-100 rounded-xl p-4 shadow-sm"
    >
      <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
        <img
          src={item.image}
          className="w-full h-full object-cover"
          alt={item.name}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{item.name}</h4>
            <p className="text-xs text-neutral-500 mt-1">{item.productNumber}</p>
            <p className="text-sm font-semibold mt-2">₦{item.price.toLocaleString()}</p>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition text-red-500"
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
            className="p-1.5 border border-neutral-300 rounded-lg text-xs hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            disabled={item.quantity >= item.stock}
            className="p-1.5 border border-neutral-300 rounded-lg text-xs hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
          </button>
          <span className="text-xs text-neutral-500 ml-2">
            {item.stock} in stock
          </span>
        </div>

        <div className="mt-2 text-right">
          <span className="text-sm font-semibold">
            Subtotal: ₦{(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}