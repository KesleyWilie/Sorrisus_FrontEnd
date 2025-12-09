import { useEffect, useState } from "react";
import { listarPacientes, deletarPaciente } from "../../services/pacienteService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar"; // Adicionado para consistência visual
import { ArrowLeft, Plus } from "lucide-react"; // Adicionado para consistência visual

const Paciente = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true); // Adicionado estado de loading
  const navigate = useNavigate();

  const carregarPacientes = async () => {
    setLoading(true);
    try {
      const response = await listarPacientes();
      setPacientes(response.data);
    } catch (error) {
      console.error("Erro ao listar pacientes:", error);
      // Opcional: Adicionar tratamento de erro na interface, se necessário
    } finally {
      setLoading(false);
    }
  };

  const excluir = async (id) => {
    if (window.confirm("Deseja realmente excluir este paciente?")) {
      try {
        await deletarPaciente(id);
        carregarPacientes();
      } catch (error) {
        console.error("Erro ao excluir paciente:", error);
        alert("Erro ao excluir paciente. Verifique se há consultas vinculadas."); // Feedback de erro
      }
    }
  };

  const editar = (id) => {
    navigate(`/pacientes/editar/${id}`);
  };

  const criarAnamnese = (id) => {
    navigate(`/dentista/anamnese/${id}`);
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto p-6">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Lista de Pacientes</h2>
          
          <div className="flex space-x-3">
             <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
            >
                <ArrowLeft size={18} />
                Voltar
            </button>
            <button
              onClick={() => navigate("/pacientes/cadastrar")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md font-medium"
            >
              <Plus size={18} />
              Cadastrar Paciente
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4 text-gray-500">Carregando...</td></tr>
              ) : pacientes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              ) : (
                pacientes.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.cpf}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.telefone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => editar(p.id)}
                            className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium transition-colors shadow-sm"
                          >
                            Editar
                          </button>
                          
                          <button
                            onClick={() => excluir(p.id)}
                            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors shadow-sm"
                          >
                            Excluir
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

export default Paciente;