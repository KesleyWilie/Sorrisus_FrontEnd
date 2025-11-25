import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardDentista = () => {
  const navigate = useNavigate();

  const irParaPerfil = () => {
    navigate('/perfil');
  };

  return (
    <div className="p-10 bg-blue-100 h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800">🦷 Painel do Dentista</h1>

        {/* Botão Visualizar Perfil */}
        <button 
          onClick={irParaPerfil}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Visualizar Perfil
        </button>
      </div>

      <p className="mt-4">Bem-vindo, Doutor(a). Aqui você verá sua agenda.</p>
    </div>
  );
};

export default DashboardDentista;
