'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import { Button } from '@/app/components';

function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get('email')!;
  const name = params.get('name')!;
  const password = params.get('password')!;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verify = async () => {
    if (!otp.trim()) {
      setError('Please enter the verification code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/verify-otp', { email, otp, name, password });
      alert('Account created successfully ✔');
      router.push('/login');
    } catch {
      setError('Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card-base p-8 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-2xl">
            ✉️
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">Verify your email</h1>
          <p className="mt-2 text-sm text-secondary-500">
            We sent a code to <span className="font-medium text-secondary-700">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-secondary-700">
            Verification code
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && verify()}
            className="input-base text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>

        <Button onClick={verify} disabled={loading} variant="primary" size="lg" className="w-full">
          {loading ? 'Verifying…' : 'Verify & create account'}
        </Button>

        <p className="mt-6 text-center text-sm text-secondary-500">
          Already verified?{' '}
          <Link href="/login" className="font-semibold text-primary-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOtp() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="text-center text-secondary-500">Loading verification…</div>
        }
      >
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
