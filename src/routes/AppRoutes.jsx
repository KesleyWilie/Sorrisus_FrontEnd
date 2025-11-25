import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importa páginas existentes
import ListarPaciente from "../pages/paciente/ListarPaciente.jsx";
import CadastrarPaciente from "../pages/paciente/CadastrarPaciente.jsx";
// import EditarPaciente from "../pages/paciente/EditarPaciente";

// Páginas de Dentista
import PerfilDentista from "../pages/dentista/PerfilDentista.jsx";

import Dashboard from "../pages/dashboard/Dashboard.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route path="/" element={<Navigate to="/pacientes/cadastrar" />} />

        
        <Route path="/pacientes" element={<ListarPaciente />} />
        <Route path="/pacientes/cadastrar" element={<CadastrarPaciente />} />
       

       
        <Route path="/dashboard" element={<Dashboard />} />


        <Route path="/perfil" element={<PerfilDentista />} />

       
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}