import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';


import DashboardDentista from './DashboardDentista';
import DashboardPaciente from './DashboardPaciente';
import DashboardRecepcionista from './DashboardRecepcionista';

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
   
    const token = localStorage.getItem('token');

    if (!token) {
      
      console.warn("Sem token! Redirecionando...");
      navigate('/login'); 
      return;
    }

    try {
      
      const decoded = jwtDecode(token);
      
     
      console.log("Token decodificado:", decoded);

    
      setRole(decoded.role || decoded.roles); 

    } catch (error) {
      console.error("Erro ao ler token:", error);
      navigate('/login');
    }
  }, [navigate]);

 
  if (role === 'ROLE_DENTISTA') {
    return <DashboardDentista />;
  }
  
  if (role === 'ROLE_PACIENTE') {
    return <DashboardPaciente />;
  }

  if (role === 'ROLE_RECEPCIONISTA') {
    return <DashboardRecepcionista />;
  }

  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl">Carregando seu perfil... ({role})</div>
    </div>
  );
};

export default Dashboard;