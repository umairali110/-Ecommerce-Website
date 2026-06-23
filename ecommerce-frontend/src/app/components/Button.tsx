interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary:
      'bg-primary-700 text-white shadow-soft hover:bg-primary-600 active:scale-[0.98]',
    secondary:
      'bg-secondary-900 text-white shadow-soft hover:bg-secondary-800 active:scale-[0.98]',
    outline:
      'border border-primary-700 text-primary-700 bg-white hover:bg-primary-50 active:scale-[0.98]',
    ghost:
      'text-secondary-700 hover:bg-secondary-100 active:scale-[0.98]',
    danger:
      'bg-error text-white shadow-soft hover:bg-red-700 active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
