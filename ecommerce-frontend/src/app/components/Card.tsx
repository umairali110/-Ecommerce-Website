interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`card-base ${paddingStyles[padding]} ${
        hoverable ? 'transition-shadow hover:shadow-elevated' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
