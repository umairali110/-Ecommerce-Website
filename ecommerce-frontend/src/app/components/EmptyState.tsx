import React from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon = "📦",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`card-base p-8 text-center sm:p-12 ${className}`}>
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-8">
        <span className="text-6xl">{icon}</span>
      </div>
      <h3 className="text-3xl sm:text-4xl font-black text-secondary mb-3">
        {title}
      </h3>
      {description && (
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary" size="lg">
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-8 sm:p-16 text-center border-2 border-red-200 ${className}`}>
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-8">
        <span className="text-6xl">❌</span>
      </div>
      <h3 className="text-3xl sm:text-4xl font-black text-secondary mb-3">
        {title}
      </h3>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="lg">
          🔄 Try Again
        </Button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingState({
  text = "Loading...",
  size = "md",
  className = "",
}: LoadingStateProps) {
  const sizeClass = {
    sm: "h-8 w-8 border-2",
    md: "h-12 w-12 border-3",
    lg: "h-16 w-16 border-4",
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className={`${sizeClass} rounded-full border-gray-200 border-t-primary border-r-primary animate-spin mb-4`} />
      <p className="text-lg text-gray-600 text-center font-semibold">{text}</p>
    </div>
  );
}
