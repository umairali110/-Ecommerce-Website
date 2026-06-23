'use client';

import { useState } from 'react';
import api from '@/services/api';
import AdminRoute from '@/app/components/AdminRoute';

export default function CreateProductPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('stock', form.stock);
      data.append('categoryId', form.categoryId);

      if (file) {
        data.append('file', file);
      }

      await api.post('/products/create', data);

      alert('Product created successfully ✔');

      setForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
      });

      setFile(null);
    } catch (error) {
      console.log(error);
      alert('Error creating product ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRoute>
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-secondary-900">
            ✨ Create Product
          </h1>
          <p className="text-lg text-secondary-600">
            Add a new product to your store
          </p>
        </div>

        {/* Form Card */}
        <div className="space-y-6 rounded-2xl border border-secondary-200 bg-white shadow-elevated p-8">
          
          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-secondary-700">
              Product Name <span className="text-error">*</span>
            </label>
            <input
              name="name"
              placeholder="e.g., Premium Wireless Headphones"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-secondary-900 placeholder-secondary-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-secondary-700">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Describe your product features and benefits..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-secondary-900 placeholder-secondary-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 resize-none"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-secondary-700">
                Price (Rs) <span className="text-error">*</span>
              </label>
              <input
                name="price"
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-secondary-900 placeholder-secondary-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-secondary-700">
                Stock Quantity <span className="text-error">*</span>
              </label>
              <input
                name="stock"
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-secondary-900 placeholder-secondary-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          {/* Category ID */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-secondary-700">
              Category ID <span className="text-error">*</span>
            </label>
            <input
              name="categoryId"
              type="number"
              placeholder="Enter category ID"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-secondary-900 placeholder-secondary-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-secondary-700">
              Product Image <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-secondary-200 bg-secondary-50 px-4 py-8 transition-all hover:border-primary-400 hover:bg-primary-50"
              >
                <div className="text-center">
                  <span className="mb-2 inline-block text-3xl">📸</span>
                  <p className="font-semibold text-secondary-700">
                    {file ? file.name : 'Click to upload image'}
                  </p>
                  <p className="text-sm text-secondary-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-primary-700 to-primary-600 px-6 py-3 font-semibold text-white shadow-soft transition-all hover:shadow-lg hover:from-primary-600 hover:to-primary-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block animate-spin">⟳</span>
                Creating Product...
              </span>
            ) : (
              '✨ Create Product'
            )}
          </button>
        </div>
      </div>
    </div>
    </AdminRoute>
  );
}