'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeCartItemAPI, updateCartItemAPI } from '@/services/cartService';
import { setCart } from '@/redux/slices/cartSlice';
import Button from './Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const items = useAppSelector((state) => state.cart.items);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const total = items.reduce(
    (sum: number, item: { product: { price: number }; quantity: number }) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  const handleRemoveItem = async (id: number) => {
    try {
      setUpdatingId(id);
      await removeCartItemAPI(id);
      dispatch(setCart(items.filter((item: { id: number }) => item.id !== id)));
    } catch (err) {
      console.error('Error removing item:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateQuantity = async (item: { id: number; quantity: number }, newQty: number) => {
    if (newQty < 1) return;
    try {
      setUpdatingId(item.id);
      await updateCartItemAPI(item.id, newQty);
      dispatch(
        setCart(
          items.map((i: { id: number; quantity: number }) =>
            i.id === item.id ? { ...i, quantity: newQty } : i
          )
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-secondary-900/40 backdrop-blur-sm" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-elevated transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-secondary-200 px-5 py-4 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div>
            <h2 className="text-lg font-bold text-secondary-900">🛒 Your Cart</h2>
            <p className="text-sm text-secondary-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-secondary-500 hover:bg-secondary-100 transition-all"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="mb-4 text-5xl">🛒</span>
              <p className="mb-2 text-lg font-semibold text-secondary-900">Your cart is empty</p>
              <p className="mb-6 text-secondary-600">Start shopping to add items</p>
              <Button
                onClick={() => {
                  onClose();
                  router.push('/products');
                }}
                variant="primary"
                size="md"
              >
                Browse products
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item: { id: number; quantity: number; product: { name: string; price: number; image: string } }) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-secondary-100 bg-white p-3 hover:shadow-sm transition-all hover:border-primary-200"
                >
                  <img
                    src={item.product.image || 'https://via.placeholder.com/80'}
                    alt={item.product.name}
                    className="h-16 w-16 flex-shrink-0 rounded-lg object-cover border border-secondary-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-secondary-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm font-bold text-primary-700">Rs {item.product.price}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-lg border border-secondary-200 bg-secondary-50">
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          disabled={updatingId === item.id}
                          className="px-2 py-1 text-sm font-semibold disabled:opacity-40 hover:bg-white transition-colors"
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          disabled={updatingId === item.id}
                          className="px-2 py-1 text-sm font-semibold disabled:opacity-40 hover:bg-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updatingId === item.id}
                        className="text-xs font-medium text-error hover:underline disabled:opacity-40 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-secondary-200 bg-gradient-to-t from-white to-secondary-50 p-5 space-y-4">
            {/* Cart Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-secondary-600">
                <span>Subtotal</span>
                <span className="font-semibold text-secondary-900">Rs {total}</span>
              </div>
              <div className="flex justify-between text-secondary-600">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">✓ Free</span>
              </div>
              <div className="flex justify-between border-t border-secondary-100 pt-2 text-base font-bold text-secondary-900">
                <span>Total</span>
                <span className="text-primary-700">Rs {total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => {
                  onClose();
                  router.push('/checkout');
                }}
                variant="primary"
                size="md"
                className="w-full"
              >
                🛍️ Checkout
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  router.push('/cart');
                }}
                variant="outline"
                size="md"
                className="w-full"
              >
                View full cart →
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
