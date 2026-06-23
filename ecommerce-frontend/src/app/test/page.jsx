"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";

export default function TestPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="card max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Redux Auth Test</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => dispatch(logout())}
          className="btn-secondary btn-lg"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Current User State:</p>
        <pre className="text-xs overflow-auto">{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}