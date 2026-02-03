import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/auth/Login.jsx";
import ListarPaciente from "../pages/paciente/ListarPaciente.jsx";
import EditarPaciente from "../pages/paciente/EditarPaciente.jsx";
import Agendamento from "../pages/agendamento/Agendamento.jsx";
import CadastrarPaciente from "../pages/paciente/CadastrarPaciente.jsx";
import GerenciarPerfil from "../pages/perfil/GerenciarPerfil.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import AnamneseOdontograma from "../pages/dentista/AnamneseOdontograma.jsx";
import HistoricoConsultas from "../pages/consulta/HistoricoConsultas.jsx";
import VisualizarPortfolio from "../pages/portfolio/VisualizarPortfolio.jsx";
import NovoAgendamento from "../pages/agendamento/NovoAgendamento.jsx"; import EditarAgendamento from "../pages/agendamento/EditarAgendamento.jsx";

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
            path="/servicos"
            element={
              <PrivateRoute>
                <VisualizarPortfolio />
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
          <Route
            path="/pacientes/editar/:id"
            element={
              <PrivateRoute>
                <EditarPaciente />
              </PrivateRoute>
            }
          />
          <Route
            path="/historico-consultas"
            element={
              <PrivateRoute>
                <HistoricoConsultas />
              </PrivateRoute>
            }
          />
          <Route
            path="/dentista/anamnese/:consultaId"
            element={
              <PrivateRoute>
                <AnamneseOdontograma />
              </PrivateRoute>
            }
          />

          {/* Agendamentos */}
          <Route
            path="/agendamentos"
            element={
              <PrivateRoute>
                <Agendamento />
              </PrivateRoute>
            }
          />
          <Route
            path="/agendamentos/novo"
            element={
              <PrivateRoute>
                <NovoAgendamento />
              </PrivateRoute>
            }
          />
          <Route
            path="/agendamentos/editar/:id"
            element={
              <PrivateRoute>
                <EditarAgendamento />
              </PrivateRoute>
            }
          />

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
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
