import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { listarConsultasPorPaciente, listarConsultasPorDentista } from "../../services/consultaService";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../components/Navbar";
import StatusBadge from "../../components/StatusBadge"; 
import { formatarData } from "../../utils/formatters";  
import { ArrowLeft, ClipboardList } from "lucide-react"; 


const HistoricoConsultas = () => {
  const navigate = useNavigate(); 
  const [consultas, setConsultas] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  // navegar para a tela de Anamnese
  const navegarParaAnamnese = (idConsulta) => {
    navigate(`/dentista/anamnese/${idConsulta}`);
  };

  useEffect(() => {
    const carregarConsultas = async () => {
      try {
        const tokenReal = localStorage.getItem("token"); 
        if (!tokenReal) return;

        const decoded = jwtDecode(tokenReal);
        const role = decoded.role || decoded.roles || decoded.authorities;
        setUserRole(role);

        const idParaBusca = decoded.userId || localStorage.getItem("userId"); 

        if (!idParaBusca) {
            setLoading(false);
            return;
        }

        let data = [];
        
        if (role === "ROLE_PACIENTE" || role === "PACIENTE") {
             const res = await listarConsultasPorPaciente(idParaBusca);
             data = res.data;
        } else if (role === "ROLE_DENTISTA" || role === "DENTISTA") {
             const res = await listarConsultasPorDentista(idParaBusca);
             data = res.data;
        }
        setConsultas(data);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarConsultas();
  }, []);

  // Verifica se o usuário tem permissão de Dentista para mostrar o botão de Anamnese
  const isDentista = userRole && (userRole.includes("DENTISTA") || userRole.includes("ROLE_DENTISTA"));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto p-6">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Histórico de Consultas</h2>
          
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                
                {userRole && userRole.includes("PACIENTE") ? (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dentista</th>
                ) : (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                )}

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observação</th>
                {/* ações de Dentista */}
                {isDentista && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Anamnese</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={isDentista ? "5" : "4"} className="text-center py-4">Carregando...</td></tr>
              ) : consultas.length === 0 ? (
                <tr>
                    <td colSpan={isDentista ? "5" : "4"} className="px-6 py-4 text-center text-gray-500">
                        Nenhuma consulta encontrada.
                    </td>
                </tr>
              ) : (
                consultas.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        
                        {formatarData(c.dataHora)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                         {userRole && userRole.includes("PACIENTE") ? c.nomeDentista : c.nomePaciente}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                        
                        <StatusBadge status={c.status} />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={c.observacao}>
                        {c.observacao || "-"}
                    </td>

                    {/* Coluna de ação para Anamnese (apenas para Dentistas) */}
                    {isDentista && (
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            <button
                                onClick={() => navegarParaAnamnese(c.id)}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium transition-colors shadow-sm"
                            >
                                <ClipboardList size={14} />
                                Anamnese
                            </button>
                        </td>
                    )}
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

export default HistoricoConsultas;