import React, { useState, useEffect } from "react";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const add = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = `toast-${toastId++}`;
    const toast: ToastMessage = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      remove(id);
    }, 3000);

    return id;
  };

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, add, remove };
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-xl shadow-xl text-white flex items-center justify-between gap-4 animate-slide-up pointer-events-auto backdrop-blur-lg border-2 font-semibold transition-all ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400/50"
              : toast.type === "error"
              ? "bg-gradient-to-r from-red-500 to-rose-600 border-red-400/50"
              : toast.type === "warning"
              ? "bg-gradient-to-r from-yellow-500 to-orange-600 border-yellow-400/50"
              : "bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-400/50"
          }`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0 leading-none">
              {toast.type === "success"
                ? "✓"
                : toast.type === "error"
                ? "✕"
                : toast.type === "warning"
                ? "⚠"
                : "ℹ"}
            </span>
            <span className="text-sm truncate">{toast.message}</span>
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-lg opacity-70 hover:opacity-100 active:scale-90 transition-all flex-shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
