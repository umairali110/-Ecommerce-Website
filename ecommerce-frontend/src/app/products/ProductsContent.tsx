'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts } from '@/services/productService';
import { addToCartAPI } from '@/services/cartService';
import { PageHeader, ProductCard, ProductGridSkeleton, EmptyState, useToast, ToastContainer } from '../components';
import { useAppSelector } from '@/redux/hooks';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
}

export default function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toasts, add, remove } = useToast();
  const token = useAppSelector((state) => state.auth.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchTerm(q);
  }, [searchParams]);

const fetchProducts = async () => {
  try {
    setLoading(true);

    const data = await getProducts();
    setProducts(data);

  } catch (err) {
    add('Failed to load products', 'error');
  } finally {
    setLoading(false);
  }
};

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!authToken) {
      add('Please sign in to add items to cart', 'error');
      router.push('/login');
      return;
    }
    try {
      setAddingId(productId);
      await addToCartAPI(productId, 1);
      add('✓ Added to cart', 'success');
    } catch (err) {
      console.error(err);
      add('✗ Failed to add to cart', 'error');
    } finally {
      setAddingId(null);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <PageHeader title="Products" description="Loading our collection…" />
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={remove} />
      <PageHeader
        title="All Products"
        description={`Browse ${products.length} items in our collection`}
        badge={
          <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-800">
            {filteredProducts.length}
          </span>
        }
      />

      <div className="mb-8 max-w-md">
        <input
          type="search"
          placeholder="Search products…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-base w-full"
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => router.push(`/products/${product.id}`)}
              onAddToCart={handleAddToCart}
              adding={addingId === product.id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title={searchTerm ? 'No products found' : 'No products available'}
          description={
            searchTerm
              ? `No results for "${searchTerm}". Try a different search.`
              : 'Check back soon for new items.'
          }
          action={
            searchTerm
              ? { label: 'Clear search', onClick: () => setSearchTerm('') }
              : { label: 'Back to home', onClick: () => router.push('/') }
          }
        />
      )}
    </div>
  );
}
