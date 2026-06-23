"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const [orderId, setOrderId] = useState("");
  const [method, setMethod] = useState("cod");
  const router = useRouter();

  const pay = async () => {
    if (!orderId) {
      alert("Please enter an Order ID ⚠️");
      return;
    }

    try {
      const res = await api.post("/payment", {
        orderId: Number(orderId),
        method,
      });

      alert("Payment created ✔");

      router.push(`/orders/${orderId}`);
    } catch (err) {
      console.log(err);
      alert("Payment failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-2">💳 Payment</h1>
            <p className="text-gray-600">Enter your order details to proceed with payment</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Order ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
              <input
                type="text"
                placeholder="Enter your order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="cod">💵 Cash on Delivery</option>
                <option value="stripe">💳 Stripe</option>
                <option value="paypal">🅿️ PayPal</option>
              </select>
            </div>

            {/* Method Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-700 uppercase tracking-wide font-semibold mb-1">Selected Method</p>
              <p className="text-gray-700">
                {method === 'cod' && 'Pay when you receive your order at your doorstep'}
                {method === 'stripe' && 'Pay securely using your credit or debit card'}
                {method === 'paypal' && 'Pay using your PayPal account'}
              </p>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={pay}
            className="w-full mt-8 bg-primary hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
          >
            Pay Now →
          </button>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              🔒 Your payment is secure. We never store your full card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}