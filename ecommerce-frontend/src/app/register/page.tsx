'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components';
import api from '@/services/api';

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const validateForm = () => {
    const newErrors: RegisterErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.password))
      newErrors.password = 'Password must contain at least one uppercase letter';
    else if (!/[0-9]/.test(formData.password))
      newErrors.password = 'Password must contain at least one number';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) newErrors.general = 'You must agree to the Terms of Service';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      router.push(
        `/verify-otp?email=${formData.email}&name=${formData.name}&password=${formData.password}`
      );
    } catch {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof RegisterErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') register();
  };

  const passwordStrength = (() => {
    if (!formData.password) return { level: 0, label: '', color: '' };
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (formData.password.length >= 12) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    if (strength <= 2) return { level: 1, label: 'Weak', color: 'text-error' };
    if (strength <= 3) return { level: 2, label: 'Fair', color: 'text-warning' };
    return { level: 3, label: 'Strong', color: 'text-success' };
  })();

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:-mx-6 lg:-mx-8">
      <div className="w-full max-w-md">
        <div className="card-base p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-700 text-lg font-bold text-white">
              ES
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 sm:text-3xl">Create account</h1>
            <p className="mt-2 text-sm text-secondary-500">Join us and start shopping today</p>
          </div>

          {errors.general && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errors.general}
            </div>
          )}

          <div className="space-y-4" onKeyDown={handleKeyPress}>
            {(['name', 'email'] as const).map((field) => (
              <div key={field}>
                <label className="mb-1.5 block text-sm font-medium text-secondary-700">
                  {field === 'name' ? 'Full name' : 'Email address'}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  placeholder={field === 'name' ? 'John Doe' : 'you@example.com'}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className={`input-base ${errors[field] ? 'border-error' : ''}`}
                />
                {errors[field] && <p className="mt-1 text-xs text-error">{errors[field]}</p>}
              </div>
            ))}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`input-base pr-14 ${errors.password ? 'border-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary-500"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i <= passwordStrength.level ? 'bg-primary-600' : 'bg-secondary-200'
                      }`}
                    />
                  ))}
                </div>
              )}
              {errors.password && <p className="mt-1 text-xs text-error">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-secondary-700">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`input-base pr-14 ${errors.confirmPassword ? 'border-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary-500"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-error">{errors.confirmPassword}</p>
              )}
            </div>

            <label className="flex cursor-pointer items-start gap-2 text-sm text-secondary-600">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (e.target.checked && errors.general) setErrors({ ...errors, general: undefined });
                }}
                className="mt-0.5 accent-primary-700"
              />
              <span>
                I agree to the{' '}
                <a href="#" className="font-medium text-primary-700 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-primary-700 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <Button onClick={register} disabled={loading} variant="primary" size="lg" className="mt-8 w-full">
            {loading ? 'Creating account…' : 'Create account'}
          </Button>

          <p className="mt-6 text-center text-sm text-secondary-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
