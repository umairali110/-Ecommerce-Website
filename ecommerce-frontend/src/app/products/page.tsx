'use client';

import { Suspense } from 'react';
import ProductsContent from './ProductsContent';
import { PageHeader, ProductGridSkeleton } from '../components';

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <PageHeader title="Products" description="Loading our collection…" />
          <ProductGridSkeleton count={8} />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
