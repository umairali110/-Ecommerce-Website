import React from "react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
  closeButton?: boolean;
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  size = "md",
  closeButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }[size];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`${sizeClass} bg-white rounded-2xl shadow-2xl pointer-events-auto animate-scale-in max-h-[90vh] overflow-y-auto border border-gray-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || closeButton) && (
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-100">
              {title && <h2 className="text-2xl font-black text-secondary">{title}</h2>}
              {closeButton && (
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-secondary transition-all duration-200 text-2xl font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel} size="sm">
      <div className="space-y-6">
        <p className="text-lg text-gray-600 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-secondary font-bold hover:bg-gray-100 transition-all duration-200 text-base"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-xl text-white font-bold transition-all duration-200 text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 ${
              danger
                ? "bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-red-700"
                : "bg-gradient-to-r from-primary to-teal-500 hover:from-teal-600 hover:to-teal-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
