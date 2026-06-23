import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
}: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-full gap-1.5 transition-all border";

  const variantStyles = {
    primary: "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:border-primary/50",
    secondary: "bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20 hover:border-secondary/50",
    success: "bg-success/10 text-success border-success/30 hover:bg-success/20 hover:border-success/50",
    warning: "bg-warning/10 text-warning border-warning/30 hover:bg-warning/20 hover:border-warning/50",
    error: "bg-error/10 text-error border-error/30 hover:bg-error/20 hover:border-error/50",
    info: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 hover:border-blue-400",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {icon && <span className="text-lg leading-none">{icon}</span>}
      {children}
    </span>
  );
}

interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  variant?: "primary" | "secondary" | "success";
}

export function Tag({ children, onRemove, variant = "primary" }: TagProps) {
  const variantStyles = {
    primary: "bg-primary/10 text-primary border border-primary/30",
    secondary: "bg-secondary/10 text-secondary border border-secondary/30",
    success: "bg-success/10 text-success border border-success/30",
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${variantStyles[variant]}`}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 opacity-70 hover:opacity-100 transition-opacity text-lg"
        >
          ✕
        </button>
      )}
    </div>
  );
}

interface PriceTagProps {
  original: number;
  current: number;
  currency?: string;
}

export function PriceTag({ original, current, currency = "Rs" }: PriceTagProps) {
  const discount = Math.round(((original - current) / original) * 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-3xl font-bold text-primary">
        {currency} {current}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-lg text-gray-500 line-through">
          {currency} {original}
        </span>
        {discount > 0 && (
          <Badge variant="error" size="sm">
            -{discount}%
          </Badge>
        )}
      </div>
    </div>
  );
}

interface RatingProps {
  rating: number;
  reviews?: number;
  size?: "sm" | "md" | "lg";
}

export function Rating({ rating, reviews, size = "md" }: RatingProps) {
  const stars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const sizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  }[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`flex gap-0.5 ${sizeClass}`}>
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < stars ? "⭐" : i === stars && hasHalfStar ? "⭐" : "☆"}
          </span>
        ))}
      </div>
      <span className="text-sm font-medium text-gray-600">
        {rating.toFixed(1)}
        {reviews && ` (${reviews} reviews)`}
      </span>
    </div>
  );
}
