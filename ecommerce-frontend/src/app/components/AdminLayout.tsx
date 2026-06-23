'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminRoute from './AdminRoute';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { href: '/admin/revenue', label: 'Revenue', icon: '💰' },
  { href: '/admin/top-products', label: 'Top Products', icon: '🏆' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <AdminRoute>
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <aside className="lg:w-56 lg:flex-shrink-0">
        <div className="card-base sticky top-24 p-3">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-secondary-400">
            Admin Panel
          </p>
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                >
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-secondary-100 pt-3">
            <Link
              href="/products"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary-500 hover:text-primary-700"
            >
              ← Back to store
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
    </AdminRoute>
  );
}
