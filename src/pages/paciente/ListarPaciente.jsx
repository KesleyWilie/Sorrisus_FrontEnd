import { useEffect, useState } from "react";
import { listarPacientes, deletarPaciente } from "../../services/pacienteService";
import { useNavigate } from "react-router-dom";

const Paciente = () => {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  const carregarPacientes = async () => {
    try {
      const response = await listarPacientes();
      setPacientes(response.data);
    } catch (error) {
      console.error("Erro ao listar pacientes:", error);
    }
  };

  const excluir = async (id) => {
    if (window.confirm("Deseja realmente excluir este paciente?")) {
      try {
        await deletarPaciente(id);
        carregarPacientes();
      } catch (error) {
        console.error("Erro ao excluir paciente:", error);
      }
    }
  };

  const editar = (id) => {
    navigate(`/pacientes/editar/${id}`);
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Lista de Pacientes</h2>
        <button
          onClick={() => navigate("/pacientes/cadastrar")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
        >
          Cadastrar Novo Paciente
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pacientes.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.cpf}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.telefone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => editar(p.id)}
                    className="mr-2 px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => navigate(`/dentista/anamnese/${p.id}`)}
                    className="mr-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Criar Anamnese
                  </button>

                  <button
                    onClick={() => excluir(p.id)}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {pacientes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Nenhum paciente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Paciente;
