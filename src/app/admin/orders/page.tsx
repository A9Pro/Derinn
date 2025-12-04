"use client";

import { useState, useEffect } from "react";
import { Package, Search, Eye, Calendar, DollarSign } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  cartCode: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingCity: string;
  shippingState: string;
  status: string;
  total: number;
  paymentMethod: string | null;
  paymentStatus: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      productNumber: string;
    };
  }>;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status }),
      });

      if (response.ok) {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          const updated = await response.json();
          setSelectedOrder(updated);
        }
        alert("Order status updated!");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? order.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400",
      processing: "bg-blue-500/20 text-blue-400",
      shipped: "bg-purple-500/20 text-purple-400",
      delivered: "bg-green-500/20 text-green-400",
      cancelled: "bg-red-500/20 text-red-400",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500/20 text-gray-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Orders</h1>
        <p className="text-gray-400 mt-2">Manage customer orders and shipments</p>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order number, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 pt-4 border-t border-white/10">
          <div className="text-sm">
            <span className="text-gray-400">Total Orders: </span>
            <span className="text-white font-semibold">{orders.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Total Revenue: </span>
            <span className="text-green-400 font-semibold">
              ₦{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
          <p className="text-gray-400">
            {searchTerm || filterStatus ? "Try adjusting your filters" : "Orders will appear here when customers make purchases"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:from-white/10 hover:to-white/15 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {order.orderNumber}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                    <div>
                      <span className="text-gray-400">Customer: </span>
                      {order.customerName}
                    </div>
                    <div>
                      <span className="text-gray-400">Email: </span>
                      {order.customerEmail}
                    </div>
                    <div>
                      <span className="text-gray-400">Location: </span>
                      {order.shippingCity}, {order.shippingState}
                    </div>
                    <div>
                      <span className="text-gray-400">Items: </span>
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-2 text-green-400 font-semibold">
                      <DollarSign size={16} />
                      ₦{order.total.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  <Eye size={18} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0e0e0e] border border-white/20 rounded-xl p-6 w-full max-w-3xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Order Number:</span>
                  <p className="text-white font-semibold">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <div className="mt-1">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                {selectedOrder.cartCode && (
                  <div>
                    <span className="text-gray-400">Cart Code:</span>
                    <p className="text-white font-semibold">{selectedOrder.cartCode}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Order Date:</span>
                  <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="text-white">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{selectedOrder.customerEmail}</p>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <p className="text-white">{selectedOrder.customerPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
                <p className="text-white text-sm">
                  {selectedOrder.shippingCity}, {selectedOrder.shippingState}
                </p>
              </div>

              {/* Order Items */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{item.product.name}</p>
                        <p className="text-gray-400 text-sm">{item.product.productNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">₦{item.price.toLocaleString()} × {item.quantity}</p>
                        <p className="text-green-400 font-semibold">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="text-xl font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-green-400">
                  ₦{selectedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}