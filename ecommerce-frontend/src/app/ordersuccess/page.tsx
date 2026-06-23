"use client";

import { useRouter } from "next/navigation";

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center max-w-md w-full">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-4xl">✓</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-3">🎉 Order Placed Successfully!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Thank you for your order. We're preparing your items for shipment.
        </p>

        {/* Details Box */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Order Confirmed</p>
          <p className="text-gray-700">We'll send you an email confirmation shortly with tracking information.</p>
        </div>

        {/* Next Steps */}
        <div className="mb-8 text-left bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-secondary mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Order confirmation will be sent to your email</li>
            <li>✓ We'll pack your items with care</li>
            <li>✓ You'll receive a tracking number</li>
            <li>✓ Expected delivery in 3-5 business days</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/orders")}
            className="w-full bg-primary hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-95"
          >
            View My Orders
          </button>
          <button
            onClick={() => router.push("/products")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-secondary font-semibold py-3 rounded-lg transition-all duration-200 active:scale-95"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}