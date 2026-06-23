interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2.5">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-3 border-2 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 font-medium ${
          error
            ? 'border-error focus:ring-error/30 bg-error/5'
            : 'border-gray-300 focus:ring-primary/30 focus:border-primary hover:border-gray-400'
        } ${className}`}
      />
      {error && (
        <p className="text-error text-sm mt-2 font-semibold flex items-center gap-1">
          <span>✕</span>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-2 font-medium">{helperText}</p>
      )}
    </div>
  );
}