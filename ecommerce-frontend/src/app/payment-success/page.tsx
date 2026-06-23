"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-8 animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-success/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-8 sm:p-16 text-center max-w-md w-full relative z-10 border border-green-100/50">
        {/* Success Icon with Animation */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6 animate-scale-in shadow-lg">
            <span className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>✓</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl sm:text-5xl font-black text-secondary mb-4 leading-tight">
          🎉 Payment Successful!
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Your order has been placed successfully. We'll send you a confirmation email shortly.
        </p>

        {/* Order ID Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 mb-8 shadow-md hover:shadow-lg transition-shadow">
          <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mb-2">Order ID</p>
          <p className="text-3xl font-black text-success">{orderId || "N/A"}</p>
        </div>

        {/* Next Steps Card */}
        <div className="mb-8 text-left bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
          <h3 className="font-bold text-secondary mb-4 text-lg">✨ What's Next?</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success text-white text-xs font-bold">✓</span>
              <span>Your order has been confirmed</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success text-white text-xs font-bold">✓</span>
              <span>Check your email for confirmation</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success text-white text-xs font-bold">✓</span>
              <span>Track your order anytime</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success text-white text-xs font-bold">✓</span>
              <span>Expected delivery: 3-5 business days</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <a
            href="/orders"
            className="block w-full bg-gradient-to-r from-primary to-teal-500 hover:from-teal-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            📦 View My Orders
          </a>
          <a
            href="/products"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-secondary font-bold py-4 rounded-xl transition-all duration-200 active:scale-95 border-2 border-gray-200 hover:border-gray-300"
          >
            🛍️ Continue Shopping
          </a>
        </div>

        {/* Support */}
        <p className="text-sm text-gray-600">
          Need help?{' '}
          <a href="#" className="text-primary hover:text-teal-600 font-bold transition-colors underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="inline-block mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary border-r-primary"></div>
          </div>
          <p className="text-lg font-semibold text-gray-600">Processing your payment...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}