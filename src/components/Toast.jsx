import React from "react";

export default function Toast({ type = "info", message, onClose }) {
  if (!message) return null;

  const base = "fixed right-6 top-6 z-50 px-4 py-3 rounded-md shadow-md flex items-start gap-3 max-w-sm";
  const variants = {
    success: "bg-green-50 border border-green-200 text-green-800",
    error: "bg-red-50 border border-red-200 text-red-800",
    info: "bg-blue-50 border border-blue-200 text-blue-800",
  };

  return (
    <div className={`${base} ${variants[type]}`}>
      <div className="flex-1 text-sm">{message}</div>
      <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Fechar</button>
    </div>
  );
}
