"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";
import { AdminLayout, PageHeader, Button, ConfirmModal, useToast, ToastContainer, Card } from "@/app/components";

interface Category {
  id: number;
  name: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function CategoriesPage() {
  const { toasts, add, remove } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; categoryId?: number }>({
    isOpen: false,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // LOAD DATA
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      add("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ADD / UPDATE
  const handleSubmit = async () => {
    if (!name.trim()) {
      add("Please enter a category name", "error");
      return;
    }

    try {
      setSubmitting(true);

      if (editId) {
        await updateCategory(editId, { name });
        add("✓ Category updated successfully", "success");
      } else {
        await createCategory({ name, status: "active" });
        add("✓ Category created successfully", "success");
      }

      setName("");
      setEditId(null);
      await loadCategories();
    } catch (err) {
      console.error(err);
      add(editId ? "Failed to update category" : "Failed to create category", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // EDIT
  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setEditId(cat.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE
  const handleDelete = async (categoryId: number) => {
    try {
      setDeletingId(categoryId);
      await deleteCategory(categoryId);
      setCategories(categories.filter(c => c.id !== categoryId));
      add("✓ Category deleted successfully", "success");
      setDeleteConfirm({ isOpen: false });
    } catch (err) {
      console.error(err);
      add("Failed to delete category", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setName("");
    setEditId(null);
  };

  const isEditMode = editId !== null;

  return (
    <AdminLayout>
      <ToastContainer toasts={toasts} onRemove={remove} />
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => deleteConfirm.categoryId && handleDelete(deleteConfirm.categoryId)}
        onCancel={() => setDeleteConfirm({ isOpen: false })}
        danger
      />

      <PageHeader
        title="📁 Category Management"
        description="Create, edit, and manage your product categories"
      />

      {/* Form Section */}
      <Card padding="lg" className="mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-secondary-900">
            {isEditMode ? "✏️ Edit Category" : "➕ Add New Category"}
          </h2>
          <p className="text-sm text-secondary-600 mt-1">
            {isEditMode ? "Update category information" : "Create a new product category"}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Category Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-secondary-900 placeholder-secondary-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="e.g., Electronics, Fashion, Home & Garden"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={submitting || !name.trim()}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              {submitting ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "💾 Update Category"
              ) : (
                "➕ Add Category"
              )}
            </Button>

            {isEditMode && (
              <Button
                onClick={handleCancel}
                disabled={submitting}
                variant="outline"
                size="lg"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Categories List Section */}
      <Card padding="lg">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-secondary-900">
            📋 All Categories ({categories.length})
          </h2>
          <p className="text-sm text-secondary-600 mt-1">
            Manage your existing categories
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <span className="inline-block animate-spin text-3xl mb-2">⟳</span>
              <p className="text-secondary-600">Loading categories...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-secondary-200 bg-secondary-50 px-6 py-12 text-center">
            <p className="mb-2 text-3xl">📁</p>
            <p className="font-semibold text-secondary-900">No categories yet</p>
            <p className="text-sm text-secondary-600">Create your first category to get started</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-secondary-200 bg-secondary-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Category Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-secondary-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-secondary-100 transition-colors hover:bg-secondary-50"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-primary-100 text-sm font-semibold text-primary-700">
                          {cat.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-secondary-900">{cat.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          cat.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {cat.status === "active" ? "✓ Active" : "✕ Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-600">
                        {cat.createdAt
                          ? new Date(cat.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleEdit(cat)}
                            disabled={submitting || deletingId === cat.id}
                            variant="secondary"
                            size="sm"
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirm({ isOpen: true, categoryId: cat.id })}
                            disabled={deletingId === cat.id || submitting}
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
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-xl border border-secondary-200 bg-white p-4 transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-primary-100 text-xs font-semibold text-primary-700">
                          {cat.id}
                        </span>
                        <h3 className="font-semibold text-secondary-900">{cat.name}</h3>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                        cat.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {cat.status === "active" ? "✓ Active" : "✕ Inactive"}
                      </span>
                    </div>
                  </div>
                  {cat.createdAt && (
                    <p className="mb-3 text-xs text-secondary-500">
                      Created {new Date(cat.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(cat)}
                      disabled={submitting || deletingId === cat.id}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirm({ isOpen: true, categoryId: cat.id })}
                      disabled={deletingId === cat.id || submitting}
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
        )}
      </Card>
    </AdminLayout>
  );
}