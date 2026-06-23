'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getStatsAPI,
  getRevenueAPI,
  getTopProductsAPI,
  getAdminOrdersAPI,
} from '@/services/adminService';
import { getProducts } from '@/services/productService';
import api from '@/services/api';
import { AdminLayout, PageHeader, OrderStatusBadge, Card, Button, ConfirmModal, useToast, ToastContainer } from '@/app/components';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stock?: number;
  rating?: number;
}

export default function AdminPage() {
  const { toasts, add, remove } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>([]);
  const [topProducts, setTopProducts] = useState<any>([]);
  const [orders, setOrders] = useState<any>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductsTable, setShowProductsTable] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; productId?: number }>({
    isOpen: false,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, r, t, o, p] = await Promise.all([
        getStatsAPI(),
        getRevenueAPI(),
        getTopProductsAPI(),
        getAdminOrdersAPI(),
        getProducts(),
      ]);
      setStats(s);
      setRevenue(r);
      setTopProducts(t);
      setOrders(o);
      setProducts(p);
    } catch (err) {
      console.log(err);
      add('Failed to load data', 'error');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      setDeletingId(productId);
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      add('Product deleted successfully', 'success');
      setDeleteConfirm({ isOpen: false });
    } catch (err) {
      console.error(err);
      add('Failed to delete product', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const statCards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders || 0, color: 'text-primary-700' },
        { label: 'Total Revenue', value: `Rs ${stats.totalRevenue || 0}`, color: 'text-emerald-600' },
        { label: 'Total Products', value: stats.totalProducts || 0, color: 'text-accent' },
        { label: 'Active Users', value: stats.activeUsers || 0, color: 'text-amber-600' },
      ]
    : [];

  return (
    <AdminLayout>
      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => deleteConfirm.productId && handleDeleteProduct(deleteConfirm.productId)}
        onCancel={() => setDeleteConfirm({ isOpen: false })}
        danger
      />

      <PageHeader
        title="Dashboard"
        description="Monitor your store performance and key metrics"
      />

      {stats && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <Card key={s.label} padding="md">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary-400">{s.label}</p>
              <p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card padding="lg">
          <h2 className="mb-4 text-lg font-bold text-secondary-900">Revenue overview</h2>
          {revenue.length > 0 ? (
            <div className="max-h-72 space-y-3 overflow-y-auto custom-scrollbar">
              {revenue.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-secondary-50 px-4 py-3">
                  <span className="text-sm font-medium text-secondary-700">{item.month}</span>
                  <span className="font-bold text-primary-700">Rs {item.amount}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-secondary-500">No revenue data</p>
          )}
        </Card>

        <Card padding="lg">
          <h2 className="mb-4 text-lg font-bold text-secondary-900">Top products</h2>
          {topProducts.length > 0 ? (
            <div className="max-h-72 space-y-3 overflow-y-auto custom-scrollbar">
              {topProducts.map((product: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-secondary-50 px-4 py-3">
                  <div>
                    <p className="font-medium text-secondary-900">{product.name}</p>
                    <p className="text-xs text-secondary-500">Sales: {product.sales}</p>
                  </div>
                  <p className="font-bold text-emerald-600">Rs {product.revenue}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-secondary-500">No product data</p>
          )}
        </Card>
      </div>

      <Card padding="lg" className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-secondary-900">Recent orders</h2>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any, idx: number) => (
                  <tr key={idx}>
                    <td className="font-semibold text-secondary-900">#{order.id}</td>
                    <td>{order.user?.name || 'Unknown'}</td>
                    <td className="font-semibold text-primary-700">Rs {order.totalAmount}</td>
                    <td><OrderStatusBadge status={order.status} size="sm" /></td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-secondary-500">No orders found</p>
        )}
      </Card>

      {/* Products Management Section */}
      <Card padding="lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-lg font-bold text-secondary-900">📦 Product Management</h2>
            <p className="text-sm text-secondary-600">Manage all products in your store</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowProductsTable(!showProductsTable)}
              variant="secondary"
              size="sm"
            >
              {showProductsTable ? 'Hide' : 'Show'} Products
            </Button>
            <Link href="/products/create">
              <Button variant="primary" size="sm">
                ✨ Add Product
              </Button>
            </Link>
          </div>
        </div>

        {showProductsTable && (
          <div className="space-y-4">
            {products.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-200 bg-secondary-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Stock</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">Rating</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image || 'https://via.placeholder.com/40'}
                                alt={product.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-semibold text-secondary-900">{product.name}</p>
                                <p className="text-xs text-secondary-500 line-clamp-1">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-bold text-primary-700">Rs {product.price}</p>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-lg px-2 py-1 text-xs font-semibold ${
                              (product.stock || 0) > 10 ? 'bg-emerald-100 text-emerald-700' :
                              (product.stock || 0) > 0 ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {product.stock || 0}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-secondary-900">⭐ {product.rating || 4.5}</p>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/products/${product.id}`}>
                                <Button variant="secondary" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Button
                                onClick={() => setDeleteConfirm({ isOpen: true, productId: product.id })}
                                disabled={deletingId === product.id}
                                variant="danger"
                                size="sm"
                              >
                                🗑️ Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="space-y-3 md:hidden">
                  {products.map((product) => (
                    <div key={product.id} className="rounded-xl border border-secondary-200 bg-white p-4">
                      <div className="mb-3 flex gap-3">
                        <img
                          src={product.image || 'https://via.placeholder.com/60'}
                          alt={product.name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-secondary-900 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-primary-700 font-bold">Rs {product.price}</p>
                          <p className="text-xs text-secondary-500">Stock: {product.stock || 0}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/products/${product.id}`} className="flex-1">
                          <Button variant="secondary" size="sm" className="w-full">
                            View
                          </Button>
                        </Link>
                        <Button
                          onClick={() => setDeleteConfirm({ isOpen: true, productId: product.id })}
                          disabled={deletingId === product.id}
                          variant="danger"
                          size="sm"
                          className="flex-1"
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-secondary-200 border-dashed bg-secondary-50 px-6 py-12 text-center">
                <p className="mb-4 text-3xl">📦</p>
                <p className="text-secondary-900 font-semibold">No products found</p>
                <p className="mb-4 text-secondary-500">Start by creating your first product</p>
                <Link href="/products/create">
                  <Button variant="primary" size="md">
                    ✨ Create Product
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
