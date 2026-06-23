'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addToCartAPI } from '@/services/cartService';
import Button from '@/app/components/Button';
import { Badge, Rating, LoadingState } from '@/app/components';
import Card from '@/app/components/Card';
import { getProductById } from '@/services/productService';
import { useAppSelector } from '@/redux/hooks';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
  reviews?: number;
  stock?: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
  try {
    setLoading(true);
    const data = await getProductById(productId);
    setProduct(data);
  } catch (err) {
    console.error('Error loading product:', err);
  } finally {
    setLoading(false);
  }
};

  const handleAddToCart = async () => {
    if (!product) return;
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!authToken) {
      alert('Please sign in to add items to cart');
      router.push('/login');
      return;
    }
    try {
      setAdding(true);
      await addToCartAPI(product.id, quantity);
      alert(`✓ Added ${quantity} item(s) to cart`);
      setQuantity(1);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= (product?.stock || 100)) setQuantity(newQty);
  };

  if (loading) return <LoadingState text="Loading product…" />;

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-5xl">❌</p>
        <h2 className="mb-4 text-xl font-bold text-secondary-900">Product not found</h2>
        <Button onClick={() => router.push('/products')} variant="primary">
          ← Back to products
        </Button>
      </div>
    );
  }

  const productImages = [product.image, product.image, product.image];
  const originalPrice = Math.floor(product.price * 1.2);
  const discount = Math.round((1 - product.price / originalPrice) * 100);

  return (
    <div>
      <nav className="mb-6 flex items-center gap-2 text-sm text-secondary-500">
        <button onClick={() => router.push('/products')} className="hover:text-primary-700">
          Products
        </button>
        <span>/</span>
        <span className="truncate font-medium text-secondary-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-secondary-200 bg-secondary-50">
            <img
              src={productImages[activeImageIndex] || 'https://via.placeholder.com/600x600'}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {product.stock != null && product.stock < 10 && (
              <Badge variant="error" size="sm" className="absolute right-4 top-4">
                Only {product.stock} left
              </Badge>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  activeImageIndex === idx ? 'border-primary-700' : 'border-secondary-200 opacity-70'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="mb-3 text-2xl font-bold text-secondary-900 sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Rating rating={product.rating || 4.5} reviews={product.reviews || 128} />
            <Badge variant="success" size="sm">
              In stock
            </Badge>
          </div>

          <div className="mb-8 border-b border-secondary-200 pb-8">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-primary-700 sm:text-4xl">
                Rs {product.price}
              </span>
              <span className="text-lg text-secondary-400 line-through">Rs {originalPrice}</span>
              {discount > 0 && (
                <Badge variant="error" size="sm">
                  -{discount}%
                </Badge>
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-emerald-600">Free shipping nationwide</p>
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-secondary-500">
              Description
            </h2>
            <p className="leading-relaxed text-secondary-700">{product.description}</p>
          </div>

          <Card padding="md" className="mb-8 bg-secondary-50">
            <h3 className="mb-3 font-semibold text-secondary-900">Highlights</h3>
            <ul className="space-y-2 text-sm text-secondary-600">
              {[
                'Premium quality materials',
                'Fast & secure delivery',
                '30-day money-back guarantee',
                '24/7 customer support',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-primary-700">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <div className="space-y-4 border-t border-secondary-200 pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-secondary-700">Quantity</span>
              <div className="flex items-center rounded-xl border border-secondary-200">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-2 text-lg hover:bg-secondary-50"
                >
                  −
                </button>
                <span className="min-w-[2.5rem] text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-2 text-lg hover:bg-secondary-50"
                >
                  +
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={handleAddToCart} disabled={adding} variant="primary" size="lg" className="w-full">
                {adding ? 'Adding…' : 'Add to cart'}
              </Button>
              <Button onClick={() => router.push('/cart')} variant="outline" size="lg" className="w-full">
                View cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
