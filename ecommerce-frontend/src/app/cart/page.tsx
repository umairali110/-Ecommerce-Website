'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  getCartAPI,
  removeCartItemAPI,
  updateCartItemAPI,
} from '@/services/cartService';
import { setCart, clearCart } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/navigation';
import {
  Button,
  PageHeader,
  EmptyState,
  LoadingState,
  Badge,
  ConfirmModal,
  useToast,
  ToastContainer,
  Card,
} from '../components';

export default function CartPageWrapper() {
  return (
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  );
}

function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toasts, add, remove } = useToast();
  const items = useAppSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCartAPI();
      dispatch(setCart(data.items || []));
    } catch (err) {
      console.error('Cart load error', err);
      add('Failed to load cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (item: { id: number; quantity: number }) => {
    try {
      setUpdatingId(item.id);
      await updateCartItemAPI(item.id, item.quantity + 1);
      loadCart();
    } catch (err) {
      console.error(err);
      add('Failed to update quantity', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const decreaseQty = async (item: { id: number; quantity: number }) => {
    if (item.quantity <= 1) return;
    try {
      setUpdatingId(item.id);
      await updateCartItemAPI(item.id, item.quantity - 1);
      loadCart();
    } catch (err) {
      console.error(err);
      add('Failed to update quantity', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (id: number) => {
    try {
      setUpdatingId(id);
      await removeCartItemAPI(id);
      loadCart();
      add('Item removed from cart', 'success');
    } catch (err) {
      console.error(err);
      add('Failed to remove item', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    setShowClearModal(false);
    dispatch(clearCart());
    add('Cart cleared', 'success');
  };

  const total = items.reduce(
    (sum: number, item: { product: { price: number }; quantity: number }) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  const itemCount = items.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0
  );

  if (loading) {
    return (
      <div>
        <PageHeader title="Shopping Cart" description="Review your items" />
        <LoadingState text="Loading your cart…" />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmModal
        isOpen={showClearModal}
        title="Clear Cart"
        message="Remove all items from your cart? This cannot be undone."
        confirmText="Clear Cart"
        cancelText="Cancel"
        onConfirm={handleClearCart}
        onCancel={() => setShowClearModal(false)}
        danger
      />

      <PageHeader
        title="Shopping Cart"
        description={`${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`}
      />

      {items.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Start shopping to add items to your cart"
          action={{ label: 'Continue shopping', onClick: () => router.push('/products') }}
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item: { id: number; quantity: number; product: { name: string; price: number; image: string } }) => (
              <Card key={item.id} padding="md" className="!p-4 sm:!p-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img
                    src={item.product.image || 'https://via.placeholder.com/150'}
                    alt={item.product.name}
                    className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-24"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-secondary-900">{item.product.name}</h3>
                        <p className="text-sm text-primary-700">Rs {item.product.price} each</p>
                      </div>
                      <Button
                        onClick={() => removeItem(item.id)}
                        disabled={updatingId === item.id}
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-xl border border-secondary-200">
                        <button
                          onClick={() => decreaseQty(item)}
                          disabled={updatingId === item.id || item.quantity <= 1}
                          className="px-3 py-1.5 disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => increaseQty(item)}
                          disabled={updatingId === item.id}
                          className="px-3 py-1.5 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-lg font-bold text-primary-700">
                        Rs {Number(item.product.price) * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <Card padding="lg" className="sticky top-24">
              <h3 className="mb-6 text-lg font-bold text-secondary-900">Order summary</h3>
              <div className="space-y-3 border-b border-secondary-200 pb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="font-semibold">Rs {total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <Badge variant="success" size="sm">
                    Free
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tax</span>
                  <span className="font-semibold">Rs 0</span>
                </div>
              </div>
              <div className="my-6 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-700">Rs {total}</span>
              </div>
              <div className="space-y-2">
                <Button onClick={() => router.push('/checkout')} variant="primary" size="lg" className="w-full">
                  Checkout
                </Button>
                <Button onClick={() => router.push('/products')} variant="outline" size="lg" className="w-full">
                  Continue shopping
                </Button>
                <Button
                  onClick={() => setShowClearModal(true)}
                  variant="ghost"
                  size="lg"
                  className="w-full text-error hover:bg-red-50"
                >
                  Clear cart
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
