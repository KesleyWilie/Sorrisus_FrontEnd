import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";

// Páginas
import Login from "../pages/auth/Login.jsx";
import ListarPaciente from "../pages/paciente/ListarPaciente.jsx";
import CadastrarPaciente from "../pages/paciente/CadastrarPaciente.jsx";

// Páginas de Perfis
import GerenciarPerfil from "../pages/perfil/GerenciarPerfil.jsx";

import Dashboard from "../pages/dashboard/Dashboard.jsx";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/pacientes/cadastrar" element={<CadastrarPaciente />} />

          {/* Rotas Privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/pacientes"
            element={
              <PrivateRoute>
                <ListarPaciente />
              </PrivateRoute>
            }
          />

          {/* Perfil unificado */}
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <GerenciarPerfil />
              </PrivateRoute>
            }
          />

          {/* Redirecionamentos */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}