"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Search, Calendar, Mail, Trash2 } from "lucide-react";

interface SavedCart {
  id: string;
  cartCode: string;
  email: string | null;
  totalAmount: number;
  items: Array<{
    id: string;
    quantity: number;
    priceAtAdd: number;
    product: {
      name: string;
      productNumber: string;
      imageUrl: string;
    };
  }>;
  expiresAt: string;
  createdAt: string;
}

export default function SavedCartsPage() {
  const [carts, setCarts] = useState<SavedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCart, setSelectedCart] = useState<SavedCart | null>(null);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await fetch("/api/admin/saved-carts");
      const data = await response.json();
      setCarts(data);
    } catch (error) {
      console.error("Error fetching carts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCart = async (id: string, cartCode: string) => {
    if (!confirm(`Are you sure you want to delete cart ${cartCode}?`)) return;

    try {
      const response = await fetch(`/api/admin/saved-carts?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCarts();
        if (selectedCart?.id === id) {
          setSelectedCart(null);
        }
        alert("Cart deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  };

  const filteredCarts = carts.filter((cart) => {
    const matchesSearch =
      cart.cartCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cart.email && cart.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading saved carts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Saved Carts</h1>
        <p className="text-gray-400 mt-2">View all customer saved carts with ED codes</p>
      </div>

      {/* Search */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by cart code or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 pt-4 border-t border-white/10">
          <div className="text-sm">
            <span className="text-gray-400">Total Carts: </span>
            <span className="text-white font-semibold">{carts.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Active: </span>
            <span className="text-green-400 font-semibold">
              {carts.filter((c) => !isExpired(c.expiresAt)).length}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Expired: </span>
            <span className="text-red-400 font-semibold">
              {carts.filter((c) => isExpired(c.expiresAt)).length}
            </span>
          </div>
        </div>
      </div>

      {/* Carts List */}
      {filteredCarts.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No saved carts found</h3>
          <p className="text-gray-400">
            {searchTerm ? "Try adjusting your search" : "Saved carts will appear here when customers save their carts"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCarts.map((cart) => (
            <div
              key={cart.id}
              className={`bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border rounded-xl p-4 hover:from-white/10 hover:to-white/15 transition-all duration-300 ${
                isExpired(cart.expiresAt) ? "border-red-500/30" : "border-white/20"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white font-mono">
                      {cart.cartCode}
                    </h3>
                    {isExpired(cart.expiresAt) && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
                        Expired
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                    {cart.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        {cart.email}
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Items: </span>
                      {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      Created: {new Date(cart.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      Expires: {new Date(cart.expiresAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-3 text-green-400 font-semibold">
                    Total: ₦{cart.totalAmount.toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCart(cart)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    View Items
                  </button>
                  <button
                    onClick={() => deleteCart(cart.id, cart.cartCode)}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    title="Delete cart"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Details Modal */}
      {selectedCart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0e0e0e] border border-white/20 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white font-mono">
                {selectedCart.cartCode}
              </h2>
              <button
                onClick={() => setSelectedCart(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Cart Info */}
              <div className="grid grid-cols-2 gap-4 text-sm pb-4 border-b border-white/10">
                {selectedCart.email && (
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{selectedCart.email}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Created:</span>
                  <p className="text-white">{new Date(selectedCart.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Expires:</span>
                  <p className={isExpired(selectedCart.expiresAt) ? "text-red-400" : "text-white"}>
                    {new Date(selectedCart.expiresAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className={isExpired(selectedCart.expiresAt) ? "text-red-400" : "text-green-400"}>
                    {isExpired(selectedCart.expiresAt) ? "Expired" : "Active"}
                  </p>
                </div>
              </div>

              {/* Cart Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Cart Items</h3>
                <div className="space-y-3">
                  {selectedCart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-white/5 p-3 rounded-lg"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.product.name}</p>
                        <p className="text-gray-400 text-sm">{item.product.productNumber}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-400 text-sm">Qty: {item.quantity}</span>
                          <span className="text-white font-semibold">
                            ₦{item.priceAtAdd.toLocaleString()} × {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="text-xl font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-green-400">
                  ₦{selectedCart.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}