import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export function FormInput({
  label,
  error,
  helper,
  icon,
  required,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2.5">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`input-base ${icon ? 'pl-11' : ''} ${
            error ? 'border-error focus:ring-error/20' : ''
          } ${className}`}
        />
      </div>
      {error && <p className="text-error text-sm mt-2 font-semibold flex items-center gap-1"><span>✕</span>{error}</p>}
      {helper && !error && <p className="text-gray-600 text-sm mt-2 font-medium">{helper}</p>}
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  required?: boolean;
}

export function FormSelect({
  label,
  error,
  options,
  required,
  className = "",
  ...props
}: FormSelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2.5">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <select
        {...props}
        className={`input-base appearance-none cursor-pointer ${
          error ? 'border-error focus:ring-error/20' : ''
        } ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-error text-sm mt-2 font-semibold flex items-center gap-1"><span>✕</span>{error}</p>}
    </div>
  );
}

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function FormTextArea({
  label,
  error,
  required,
  className = "",
  ...props
}: FormTextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2.5">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <textarea
        {...props}
        className={`input-base resize-none ${
          error ? 'border-error focus:ring-error/20' : ''
        } ${className}`}
      />
      {error && <p className="text-error text-sm mt-2 font-semibold flex items-center gap-1"><span>✕</span>{error}</p>}
    </div>
  );
}

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormCheckbox({ label, error, className = "", ...props }: FormCheckboxProps) {
  return (
    <div className="w-full">
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          {...props}
          className={`w-5 h-5 accent-primary rounded border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer group-hover:border-primary transition-colors ${className}`}
        />
        <span className="text-secondary font-semibold group-hover:text-primary transition-colors">{label}</span>
      </label>
      {error && <p className="text-error text-sm mt-2 ml-8 font-semibold flex items-center gap-1"><span>✕</span>{error}</p>}
    </div>
  );
}

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2.5">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-error text-sm mt-2 font-semibold flex items-center gap-1"><span>✕</span>{error}</p>}
    </div>
  );
}
