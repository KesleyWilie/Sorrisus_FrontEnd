import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { botoesConfig } from './DashboardConfig';
import LogoutModal from '../../components/LogoutModal'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); 
  const [userName, setUserName] = useState("");   
  const [showLogoutModal, setShowLogoutModal] = useState(false);

 
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const roleDoToken = decoded.role || decoded.roles || decoded.authorities;
        
        console.log("Perfil validado:", roleDoToken);
        if (!roleDoToken) console.warn("Token sem role definida!");

        setUserRole(roleDoToken);
        setUserName(decoded.sub || ""); 
      
      } catch (error) {
        console.error("Erro token:", error);
        localStorage.removeItem('token'); 
        navigate('/'); 
      }
    } else {
      console.warn("Sem token.");
      navigate('/'); 
    }
  }, [navigate]);

 
  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  
  const buttonBaseClass = "bg-[#3a7ca5] hover:bg-[#2d6a88] text-white text-lg font-medium py-4 px-6 rounded-md shadow-sm transition-colors duration-200";
  const headerLinkClass = "text-gray-500 hover:text-gray-700 cursor-not-allowed";

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative">
      
      
      <header className="flex justify-between items-center p-8 border-b border-gray-100">
        <nav className="space-x-8 text-lg">
          <span className={headerLinkClass}>Início</span>
          <span className={headerLinkClass}>Meio</span>
          <span className={headerLinkClass}>Fim</span>
        </nav>
        <div className="flex items-center gap-4">
          {userName && <span className="text-gray-600 text-sm">Olá, {userName}</span>}
          <button onClick={() => setShowLogoutModal(true)} className="bg-[#3a7ca5] hover:bg-[#2d6a88] text-white font-bold py-2 px-6 rounded">
            Logout
          </button>
        </div>
      </header>

      
      <main className="flex-grow flex flex-col items-center pt-16 pb-10 px-4">
        <h1 className="text-5xl font-bold text-[#2c3e50] mb-16 drop-shadow-md">
          Menu
        </h1>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl w-full text-center">
          {botoesConfig.map((botao, index) => {
            if (userRole && botao.roles.includes(userRole)) {
              return (
                <button 
                  key={index} 
                  onClick={() => botao.action(navigate)} 
                  className={buttonBaseClass}
                >
                  {botao.label}
                </button>
              );
            }
            return null;
          })}
        </div>
      </main>

      
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogoutConfirm} 
      />

    </div>
  );
};

export default Dashboard;