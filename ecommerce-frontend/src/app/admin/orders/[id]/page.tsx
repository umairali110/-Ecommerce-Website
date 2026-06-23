'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import { AdminLayout, OrderStatusBadge, LoadingState, Card } from '@/app/components';

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await api.get(`/admin/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.log('Failed to load order', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingState text="Loading order details…" />
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="py-16 text-center">
          <p className="mb-2 text-5xl">❌</p>
          <h2 className="text-xl font-bold text-secondary-900">Order not found</h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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
            <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Customer</p>
            <p className="font-medium text-secondary-700">{order.user?.name || 'N/A'}</p>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="mb-4 text-lg font-bold text-secondary-900">Order items</h2>
        <div className="space-y-3">
          {order.items?.map((item: any) => (
            <div
              key={item.id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-secondary-100 p-4 sm:flex-row sm:items-center"
            >
              <div>
                <h4 className="font-semibold text-secondary-900">{item.product?.name || 'Unknown'}</h4>
                <p className="text-sm text-secondary-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary-500">Rs {item.price} each</p>
                <p className="font-bold text-primary-700">Rs {item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end border-t border-secondary-200 pt-4">
          <p className="text-lg font-bold text-secondary-900">
            Total: <span className="text-primary-700">Rs {order.totalAmount}</span>
          </p>
        </div>
      </Card>
    </AdminLayout>
  );
}
