'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { AdminLayout, PageHeader, Card } from '@/app/components';

export default function Analytics() {
  const [revenue, setRevenue] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [orderStats, setOrderStats] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const res1 = await api.get('/admin/analytics/revenue');
    const res2 = await api.get('/admin/analytics/top-products');
    const res3 = await api.get('/admin/analytics/orders');
    setRevenue(res1.data);
    setTopProducts(res2.data);
    setOrderStats(res3.data);
  };

  return (
    <AdminLayout>
      <PageHeader title="Analytics" description="Monitor key metrics and business insights" />

      <Card padding="lg" className="mb-6">
        <h2 className="mb-4 text-lg font-bold text-secondary-900">Revenue overview</h2>
        {revenue ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: 'Total Revenue', value: `Rs ${revenue.total || 0}`, color: 'text-emerald-600' },
              { label: 'This Month', value: `Rs ${revenue.thisMonth || 0}`, color: 'text-blue-600' },
              { label: 'Average Order', value: `Rs ${revenue.avgOrder || 0}`, color: 'text-violet-600' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-secondary-50 p-4">
                <p className="text-sm text-secondary-500">{item.label}</p>
                <p className={`mt-1 text-2xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-secondary-500">Loading revenue data…</p>
        )}
      </Card>

      {orderStats && (
        <Card padding="lg" className="mb-6">
          <h2 className="mb-4 text-lg font-bold text-secondary-900">Order statistics</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Pending', value: orderStats.pending || 0, color: 'text-amber-600' },
              { label: 'Processing', value: orderStats.processing || 0, color: 'text-blue-600' },
              { label: 'Shipped', value: orderStats.shipped || 0, color: 'text-violet-600' },
              { label: 'Delivered', value: orderStats.delivered || 0, color: 'text-emerald-600' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-secondary-50 p-4 text-center">
                <p className="text-sm text-secondary-500">{item.label}</p>
                <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card padding="lg">
        <h2 className="mb-4 text-lg font-bold text-secondary-900">Top products</h2>
        {topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product: any, idx: number) => (
                  <tr key={idx}>
                    <td className="font-medium text-secondary-900">{product.name}</td>
                    <td>
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        {product.sales}
                      </span>
                    </td>
                    <td className="font-bold text-primary-700">Rs {product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-secondary-500">No product data</p>
        )}
      </Card>
    </AdminLayout>
  );
}
