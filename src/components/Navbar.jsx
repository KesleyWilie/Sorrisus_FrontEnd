import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Home, Users, Calendar, Power } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <img src="/sorrisus.png" alt="Sorrisus" className="w-10 h-10 rounded-lg object-contain" />
              <span className="text-xl font-bold text-gray-800">Sorrisus</span>
            </Link>

            {/* Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                to="/pacientes"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Pacientes</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Agendamentos</span>
              </Link>
            </div>

            {/* User Info e Logout */}
            <div className="flex items-center gap-4">
              <div
                role="button"
                tabIndex={0}
                title="Ver perfil"
                onClick={() => {
                  if (!user?.role) return;
                  navigate("/perfil");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    if (!user?.role) return;
                    const role = user.role;
                    navigate("/perfil");
                  }
                }}
                className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg cursor-pointer"
              >
                <User className="w-5 h-5 text-gray-600" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.email || "Usuário"}
                  </span>
                  {user?.role && (
                    <span className="text-xs text-gray-500">
                      {user.role.replace('ROLE_', '')}
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={confirmLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:shadow-md group"
              >
                <Power className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de Confirmação de Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <LogOut className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center">Sair do Sistema</h3>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <p className="text-gray-600 text-center mb-6">
                Tem certeza que deseja sair do sistema Sorrisus?
              </p>

              {/* Botões */}
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;