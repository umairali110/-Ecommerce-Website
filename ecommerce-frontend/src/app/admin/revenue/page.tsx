'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { AdminLayout, PageHeader, Card, LoadingState } from '@/app/components';

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/analytics/revenue')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const metrics = data
    ? [
        { label: 'Total Revenue', value: `Rs ${data.total ?? 0}`, highlight: true },
        { label: 'This Month', value: `Rs ${data.thisMonth ?? 0}` },
        { label: 'Average Order', value: `Rs ${data.avgOrder ?? 0}` },
      ]
    : [];

  return (
    <AdminLayout>
      <PageHeader title="Revenue" description="Detailed revenue performance metrics" />

      {loading ? (
        <LoadingState text="Loading revenue data…" />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {metrics.map((m) => (
              <Card key={m.label} padding="md">
                <p className="text-sm text-secondary-500">{m.label}</p>
                <p className={`mt-1 text-2xl font-bold ${m.highlight ? 'text-emerald-600' : 'text-secondary-900'}`}>
                  {m.value}
                </p>
              </Card>
            ))}
          </div>

          <Card padding="lg">
            <h2 className="mb-4 text-lg font-bold text-secondary-900">Raw data</h2>
            <pre className="custom-scrollbar max-h-96 overflow-auto rounded-xl bg-secondary-50 p-4 text-xs text-secondary-700">
              {JSON.stringify(data, null, 2)}
            </pre>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}
