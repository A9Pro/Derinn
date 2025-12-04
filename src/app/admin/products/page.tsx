"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, Package, Eye, EyeOff, Search } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string | null;
  productNumber: string;
  price: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  category: {
    name: string;
  };
  createdAt: string;
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          isActive: !product.isActive,
        }),
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory
      ? product.category.name === filterCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-2">Manage your product inventory</p>
        </div>
        <Link
          href="/admin/upload"
          className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or product number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 pt-4 border-t border-white/10">
          <div className="text-sm">
            <span className="text-gray-400">Total: </span>
            <span className="text-white font-semibold">{products.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Showing: </span>
            <span className="text-white font-semibold">{filteredProducts.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Active: </span>
            <span className="text-green-400 font-semibold">
              {products.filter((p) => p.isActive).length}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm || filterCategory ? "No products found" : "No products yet"}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterCategory
              ? "Try adjusting your filters"
              : "Get started by adding your first product"}
          </p>
          {!searchTerm && !filterCategory && (
            <Link
              href="/admin/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:from-white/10 hover:to-white/15 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Product Image */}
                <div className="w-full md:w-32 h-32 flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {product.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 mb-2">
                        {product.productNumber} • {product.category.name}
                      </p>

                      {product.description && (
                        <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                          {product.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Price: </span>
                          <span className="text-white font-semibold">
                            ₦{product.price.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Stock: </span>
                          <span
                            className={`font-semibold ${
                              product.stock > 10
                                ? "text-green-400"
                                : product.stock > 0
                                ? "text-yellow-400"
                                : "text-red-400"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(product)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title={product.isActive ? "Deactivate" : "Activate"}
                      >
                        {product.isActive ? (
                          <Eye size={18} className="text-green-400" />
                        ) : (
                          <EyeOff size={18} className="text-gray-400" />
                        )}
                      </button>
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit2 size={18} className="text-blue-400" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}