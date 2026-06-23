'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import CartDrawer from './CartDrawer';
import Button from './Button';

export default function Navabar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { href: '/products', label: 'Products' },
    { href: '/orders', label: 'Orders' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-secondary-200 bg-white shadow-nav">
        <div className="site-container">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex flex-shrink-0 items-center gap-2 text-xl font-bold text-primary-800"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700 text-sm text-white">
                ES
              </span>
              <span className="hidden sm:inline">E-Shop</span>
            </Link>

            {/* Search — desktop */}
            <form onSubmit={handleSearch} className="hidden flex-1 max-w-xl md:flex">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-base w-full py-2.5 pl-4 pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-secondary-400 hover:text-primary-700"
                  aria-label="Search"
                >
                  🔍
                </button>
              </div>
            </form>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary-50 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin')
                      ? 'bg-primary-50 text-primary-800'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative rounded-xl p-2 text-secondary-600 transition-colors hover:bg-secondary-50 hover:text-primary-700"
                aria-label="Open cart"
              >
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="max-w-[120px] truncate text-sm font-medium text-secondary-700">
                    {user?.name}
                  </span>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block">
                  <Button variant="primary" size="sm">
                    Sign in
                  </Button>
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-xl p-2 text-secondary-600 hover:bg-secondary-50 lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="border-t border-secondary-100 py-4 lg:hidden animate-slide-down">
              <form onSubmit={handleSearch} className="mb-4">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-base w-full"
                />
              </form>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                      isActive(link.href) ? 'bg-primary-50 text-primary-800' : 'text-secondary-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-secondary-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {isAuthenticated ? (
                  <>
                    <p className="px-3 py-2 text-sm text-secondary-500">Hi, {user?.name}</p>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-error"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl bg-primary-700 px-3 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Sign in
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
