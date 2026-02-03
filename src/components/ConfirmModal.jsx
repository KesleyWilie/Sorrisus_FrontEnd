import React from "react";
import { X, Check } from "lucide-react";

export default function ConfirmModal({ open, title, description, onCancel, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="flex items-start justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <button
            onClick={onCancel}
            aria-label="Fechar"
            className="p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? "Processando..." : (
              <>
                <Check size={16} />
                Confirmar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
