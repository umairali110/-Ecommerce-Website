import React from "react";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function SkeletonLoader({ className = "h-12 w-full", count = 1 }: SkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${className} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-shimmer`}
        />
      ))}
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
      <SkeletonLoader className="h-56 w-full rounded-none" />
      <div className="p-6 space-y-4">
        <SkeletonLoader className="h-6 w-3/4" />
        <SkeletonLoader className="h-4 w-full" />
        <SkeletonLoader className="h-4 w-2/3" />
        <div className="flex gap-2 pt-4">
          <SkeletonLoader className="h-10 w-1/3" />
          <SkeletonLoader className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
