'use client';

import Link from 'next/link';

export default function PaymentCancel() {
  return (
    <div className="mx-auto max-w-md">
      <div className="card-base p-8 text-center sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
          ✕
        </div>
        <h1 className="mb-2 text-2xl font-bold text-secondary-900 sm:text-3xl">Payment cancelled</h1>
        <p className="mb-6 text-secondary-500">
          Your payment was not completed. No charges have been made.
        </p>

        <div className="mb-6 rounded-xl bg-red-50 p-4 text-left text-sm text-secondary-600">
          <p className="mb-2 font-semibold text-secondary-900">Common reasons:</p>
          <ul className="space-y-1">
            <li>• You cancelled the payment</li>
            <li>• Session expired</li>
            <li>• Insufficient funds</li>
            <li>• Bank declined the transaction</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Link
            href="/checkout"
            className="block w-full rounded-xl bg-primary-700 py-3 text-center text-sm font-semibold text-white hover:bg-primary-600"
          >
            Try payment again
          </Link>
          <Link
            href="/cart"
            className="block w-full rounded-xl border border-secondary-200 py-3 text-center text-sm font-semibold text-secondary-700 hover:bg-secondary-50"
          >
            Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
