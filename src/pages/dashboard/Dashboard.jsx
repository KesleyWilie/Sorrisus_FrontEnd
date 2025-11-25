import Navbar from "../../components/Navbar";
import { Users, Calendar, UserCog, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Visão geral do sistema Sorrisus</p>
        </div>

        {/* Cards Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pacientes</p>
                <p className="text-2xl font-bold text-gray-800">248</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Consultas Hoje</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

  useEffect(() => {
   
    const token = localStorage.getItem('accessToken');
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dentistas</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCog className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Taxa Ocupação</p>
                <p className="text-2xl font-bold text-gray-800">87%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <Users className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Pacientes</h3>
            <p className="text-blue-100 text-sm">Gerenciar cadastro de pacientes</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <UserCog className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dentistas</h3>
            <p className="text-green-100 text-sm">Gerenciar equipe odontológica</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <Calendar className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Agendamentos</h3>
            <p className="text-purple-100 text-sm">Gerenciar consultas e horários</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;