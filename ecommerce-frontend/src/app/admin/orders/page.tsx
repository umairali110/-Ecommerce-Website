'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { AdminLayout, PageHeader, OrderStatusBadge, EmptyState, Button, Card } from '@/app/components';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadOrders();
  }, [status]);

  const loadOrders = async () => {
    try {
      const res = await api.get(`/admin/orders?status=${status}`);
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Orders" description="Manage customer orders and update statuses" />

      <Card padding="md" className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-sm font-medium text-secondary-700">Filter by status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-base max-w-xs"
          >
            <option value="">All orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </Card>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} padding="md" hoverable>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Order ID</p>
                  <p className="text-lg font-bold text-secondary-900">#{order.id}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Status</p>
                  <div className="mt-1">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Total</p>
                  <p className="text-lg font-bold text-primary-700">Rs {order.totalAmount}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Customer</p>
                  <p className="font-medium text-secondary-700">{order.user?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end border-t border-secondary-100 pt-4">
                <Link href={`/admin/orders/${order.id}`}>
                  <Button variant="primary" size="sm">
                    View & edit →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📦"
          title="No orders found"
          description="No orders match the selected filter."
        />
      )}
    </AdminLayout>
  );
}
