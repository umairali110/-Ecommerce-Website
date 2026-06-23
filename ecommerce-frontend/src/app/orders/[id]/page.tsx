'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOrderByIdAPI } from '@/services/orderService';
import { OrderStatusBadge, LoadingState, Card } from '@/app/components';

export default function OrderDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const data = await getOrderByIdAPI(id);
      setOrder(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!order) {
    return <LoadingState text="Loading order details…" />;
  }

  return (
    <div>
      <button
        onClick={() => window.history.back()}
        className="mb-6 text-sm font-medium text-primary-700 hover:underline"
      >
        ← Back to orders
      </button>

      <Card padding="lg" className="mb-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Order ID</p>
            <p className="text-2xl font-bold text-secondary-900">#{order.id}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Status</p>
            <div className="mt-1">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Total</p>
            <p className="text-2xl font-bold text-primary-700">Rs {order.totalAmount}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Date</p>
            <p className="font-medium text-secondary-700">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="mb-6 text-lg font-bold text-secondary-900">Order items</h2>
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-secondary-100 p-4 sm:flex-row sm:items-center"
            >
              <div>
                <h4 className="font-semibold text-secondary-900">{item.product.name}</h4>
                <p className="text-sm text-secondary-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary-500">Rs {item.price} each</p>
                <p className="font-bold text-primary-700">Rs {item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end border-t border-secondary-200 pt-6">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary-500">Subtotal</span>
              <span>Rs {order.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-500">Shipping</span>
              <span className="text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between border-t border-secondary-200 pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-primary-700">Rs {order.totalAmount}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
