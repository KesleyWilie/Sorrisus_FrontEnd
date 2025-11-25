import React from 'react';
import { LogOut } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        
        
        <div className="bg-[#3a7ca5] p-6 flex flex-col items-center justify-center text-white">
         
          <div className="bg-[#2d6a88] p-3 rounded-full mb-3 shadow-inner">
            <LogOut size={32} />
          </div>
          <h2 className="text-2xl font-bold">Sair do Sistema</h2>
        </div>

        {/* Corpo */}
        <div className="p-6 text-center">
          <p className="text-gray-600 text-lg mb-8">
            Tem certeza que deseja sair do sistema Sorrisus?
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 bg-[#3a7ca5] hover:bg-[#2d6a88] text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;