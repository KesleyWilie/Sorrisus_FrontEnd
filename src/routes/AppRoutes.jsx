import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importa páginas
import ListarPaciente from "../pages/paciente/ListarPaciente.jsx";
import CadastrarPaciente from "../pages/paciente/CadastrarPaciente.jsx";
// import EditarPaciente from "../pages/paciente/EditarPaciente";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rota raiz */}
        <Route path="/" element={<Navigate to="/pacientes/cadastrar" />} />

        {/* Rotas de Paciente */}
        <Route path="/pacientes" element={<ListarPaciente />} />
        <Route path="/pacientes/cadastrar" element={<CadastrarPaciente />} />
        {/* <Route path="/paciente/editar/:id" element={<EditarPaciente />} /> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
