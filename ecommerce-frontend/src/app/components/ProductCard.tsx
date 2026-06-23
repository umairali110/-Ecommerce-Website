'use client';

import Link from 'next/link';
import Button from './Button';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (e: React.MouseEvent, productId: number) => void;
  onClick?: () => void;
  adding?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onClick,
  adding = false,
}: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary-100">
        <img
          src={product.image || 'https://via.placeholder.com/400x300'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-2 py-1 text-xs font-semibold text-secondary-700 shadow-soft backdrop-blur-sm">
          ⭐ {product.rating || 4.5}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-secondary-900 transition-colors group-hover:text-primary-700 sm:text-base">
          {product.name}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-xs text-secondary-500 sm:text-sm">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-3 border-t border-secondary-100 pt-4">
          <div>
            <p className="text-lg font-bold text-primary-700 sm:text-xl">Rs {product.price}</p>
            <p className="text-xs font-medium text-emerald-600">Free shipping</p>
          </div>
          {onAddToCart && (
            <span onClick={(e) => e.stopPropagation()}>
              <Button
                onClick={() =>
                  onAddToCart({ stopPropagation: () => {} } as React.MouseEvent, product.id)
                }
                disabled={adding}
                size="sm"
                variant="primary"
                className="transition-all duration-200"
              >
                {adding ? (
                  <>
                    <span className="inline-block animate-spin mr-1">⟳</span>
                    Adding…
                  </>
                ) : (
                  '🛒 Add to cart'
                )}
              </Button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductCardLink({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <ProductCard product={product} />
    </Link>
  );
}
