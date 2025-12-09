import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  listarAgendamentosPorDentista, 
  deletarAgendamento, 
  confirmarAgendamento 
} from "../../services/agendamentoService";
import Navbar from "../../components/Navbar";
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Edit2, 
  Trash2,
  Clock,
  User
} from "lucide-react";

const Agendamento = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("Usuário não identificado no localStorage.");
        alert("Erro de autenticação. Faça login novamente.");
        navigate("/login");
        return;
      }

      const response = await listarAgendamentosPorDentista(userId);
      setAgendamentos(response.data);

    } catch (error) {
      console.error("Erro ao listar agendamentos do dentista:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
      try {
        await deletarAgendamento(id);
        carregarAgendamentos();
      } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
        alert("Não foi possível excluir o agendamento.");
      }
    }
  };

  const handleConfirmar = async (id) => {
    try {
      await confirmarAgendamento(id);
      carregarAgendamentos(); 
    } catch (error) {
      console.error("Erro ao confirmar:", error);
      alert("Erro ao confirmar agendamento. Verifique se não há conflitos.");
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto p-6">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600 w-8 h-8" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Meus Agendamentos</h2>
              <p className="text-sm text-gray-500">Gerencie sua agenda de consultas</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
             <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
            >
                <ArrowLeft size={18} />
                Voltar
            </button>
            <button
              onClick={() => navigate("/agendamentos/novo")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md font-medium"
            >
              <Plus size={18} />
              Novo Agendamento
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data / Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço / Obs</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Carregando sua agenda...</td></tr>
              ) : agendamentos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 flex flex-col items-center justify-center">
                    <Calendar className="w-10 h-10 text-gray-300 mb-2" />
                    <span className="text-lg font-medium text-gray-600">Sua agenda está vazia</span>
                    <span className="text-sm">Nenhum agendamento encontrado para o seu perfil.</span>
                  </td>
                </tr>
              ) : (
                agendamentos.map((ag) => (
                  <tr key={ag.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2 font-medium">
                            <Clock size={16} className="text-blue-500"/>
                            {formatarData(ag.dataHora)}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                <User size={14}/>
                            </div>
                            {ag.paciente?.nome || "Paciente não identificado"}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {ag.observacao || "Sem observações"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            ag.confirmado 
                            ? "bg-green-100 text-green-800 border border-green-200" 
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}>
                            {ag.confirmado ? (
                                <><CheckCircle size={14} /> Confirmado</>
                            ) : (
                                <><Clock size={14} /> Pendente</>
                            )}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex justify-center items-center space-x-2">
                          
                          {!ag.confirmado && (
                              <button
                                onClick={() => handleConfirmar(ag.id)}
                                title="Confirmar Agendamento"
                                className="p-2 rounded-lg text-green-600 hover:bg-green-50 border border-transparent hover:border-green-200 transition-all"
                              >
                                <CheckCircle size={18} />
                              </button>
                          )}

                          <button
                            onClick={() => navigate(`/agendamentos/editar/${ag.id}`)}
                            title="Editar"
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleExcluir(ag.id)}
                            title="Excluir"
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Agendamento;