const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: '⏳',
  },
  processing: {
    label: 'Processing',
    className: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: '⚙️',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-violet-50 text-violet-800 border-violet-200',
    icon: '🚚',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: '✅',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-50 text-red-800 border-red-200',
    icon: '❌',
  },
};

interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export default function OrderStatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: OrderStatusBadgeProps) {
  const key = status?.toLowerCase() || 'pending';
  const config = STATUS_CONFIG[key] || STATUS_CONFIG.pending;

  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${sizeClass} ${config.className}`}
    >
      {showIcon && <span aria-hidden>{config.icon}</span>}
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };
