'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/redux/hooks';
import { loginSuccess } from '@/redux/slices/authSlice';
import api from '@/services/api';
import { Button } from '@/app/components';

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: LoginErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      dispatch(loginSuccess({ token, user }));
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      router.push(user.role === 'admin' ? '/admin' : '/products');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please try again.';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') login();
  };

  return (
    <div className="-mx-4 min-h-[calc(100vh-8rem)] sm:-mx-6 lg:-mx-8">
      <div className="grid min-h-[calc(100vh-8rem)] lg:grid-cols-2">
        {/* Brand panel */}
        <div className="hidden flex-col justify-between bg-secondary-900 p-10 text-white lg:flex xl:p-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-300">
              Welcome back
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Sign in to your account
            </h2>
            <p className="mt-4 max-w-sm text-sm text-secondary-300">
              Access your cart, track orders, and checkout faster.
            </p>
          </div>
          <ul className="space-y-3 border-t border-white/10 pt-8 text-sm text-secondary-300">
            {['Free shipping on orders', 'Real-time order tracking', 'Secure payments'].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-primary-400">✓</span>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Form */}
        <div className="flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-secondary-900 sm:text-3xl">Sign in</h1>
              <p className="mt-2 text-sm text-secondary-500">
                New here?{' '}
                <Link href="/register" className="font-semibold text-primary-700 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

            {errors.general && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {errors.general}
              </div>
            )}

            <div className="space-y-5" onKeyDown={handleKeyPress}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-secondary-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  className={`input-base ${errors.email ? 'border-error focus:ring-error/20' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-error">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-secondary-700">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    className={`input-base pr-16 ${errors.password ? 'border-error focus:ring-error/20' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-secondary-500 hover:text-secondary-900"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-error">{errors.password}</p>
                )}
              </div>
            </div>

            <Button onClick={login} disabled={loading} variant="primary" size="lg" className="mt-8 w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
