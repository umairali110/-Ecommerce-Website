"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyOrdersAPI } from "@/services/orderService";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrdersAPI();
      setOrders(data);
    } catch (err) {
      console.log(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <h1 className="text-4xl font-bold text-secondary mb-8">📦 My Orders</h1>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary border-r-primary mb-6"></div>
          <p className="text-lg text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 sm:mb-12 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-black text-secondary mb-3">📦 My Orders</h1>
        <p className="text-lg text-gray-600">Track and view the status of all your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 sm:p-16 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-8">
            <span className="text-6xl">📦</span>
          </div>
          <h3 className="text-3xl font-bold text-secondary mb-3">No orders yet</h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">You haven't placed any orders yet. Start shopping now and find amazing products!</p>
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-gradient-to-r from-primary to-teal-500 hover:from-teal-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            🛍️ Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-primary/20 group"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 pb-6 border-b-2 border-gray-100">
                {/* Order ID */}
                <div className="group-hover:translate-x-1 transition-transform">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order ID</p>
                  <p className="text-xl sm:text-2xl font-black text-secondary">#{order.id}</p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                  <p className={`inline-block px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                   order.status === 'pending'
                     ? 'bg-yellow-100/80 text-yellow-800 border border-yellow-300'
                     : order.status === 'processing'
                     ? 'bg-blue-100/80 text-blue-800 border border-blue-300'
                     : order.status === 'shipped'
                     ? 'bg-purple-100/80 text-purple-800 border border-purple-300'
                     : order.status === 'delivered'
                     ? 'bg-green-100/80 text-green-800 border border-green-300'
                     : 'bg-red-100/80 text-red-800 border border-red-300'
                  }`}>
                   {order.status === 'pending' && '⏳'}
                   {order.status === 'processing' && '⚙️'}
                   {order.status === 'shipped' && '🚚'}
                   {order.status === 'delivered' && '✅'}
                   {order.status === 'cancelled' && '❌'}
                   <span className="ml-2">{order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}</span>
                  </p>
                </div>

                {/* Total */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Amount</p>
                  <p className="text-xl sm:text-2xl font-black text-primary">Rs {order.totalAmount}</p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Date</p>
                  <p className="text-sm sm:text-base text-secondary font-semibold">
                   {new Date(order.createdAt).toLocaleDateString('en-US', {
                     year: 'numeric',
                     month: 'short',
                     day: 'numeric'
                   })}
                  </p>
                </div>
              </div>

              {/* View Details Button */}
              <div className="flex justify-end">
                <Link href={`/orders/${order.id}`}>
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-teal-500 hover:from-teal-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
                   <span>View Details</span>
                   <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}