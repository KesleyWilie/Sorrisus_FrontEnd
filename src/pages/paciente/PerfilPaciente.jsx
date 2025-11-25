import React, { useEffect, useState } from "react";
import { buscarPacientePorId, atualizarPaciente } from "../../services/pacienteService";
import { getUserId, getRole } from "../../services/authService";

const PerfilPaciente = () => {
  const userId = getUserId() || localStorage.getItem("userId");
  const role = getRole() || localStorage.getItem("role");

  const [paciente, setPaciente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formPaciente, setFormPaciente] = useState({
    nome: "",
    email: "",
    turno: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
  });

  useEffect(() => {
    if (!userId || role !== "ROLE_PACIENTE") return;
    if (userId) {
      buscarPacientePorId(userId)
        .then((response) => {
          setPaciente(response.data);
          setFormPaciente({
            nome: response.data.nome,
            email: response.data.email,
            cpf: response.data.cpf,
            telefone: response.data.telefone,
            dataNascimento: response.data.dataNascimento,
          });
        })
        .catch((error) => console.error("Erro ao carregar perfil:", error));
    }
  }, [userId, role]);

  if (!userId) return <div className="p-10">Usuário não identificado.</div>;
  if (role !== "ROLE_PACIENTE") return <div className="p-10 text-red-600">Acesso negado. Apenas Pacientes podem acessar esse perfil.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormPaciente((prev) => ({ ...prev, [name]: value }));
  };

  const salvarAlteracoes = () => {
    atualizarPaciente(userId, formPaciente)
      .then((response) => {
        console.log("Resposta do backend:", response);
        setPaciente(response.data);
        setEditando(false);
        alert("Perfil atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro detalhado do backend:", error.response?.data);
        alert("Erro ao atualizar perfil. Verifique os dados.");
      });
  };

  if (!paciente) {
    return <div className="p-10">Carregando perfil...</div>;
  }

  return (
    <div className="p-10 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700">👤 Perfil do Paciente</h1>

      <div className="mt-6 p-6 bg-white rounded-xl shadow-md w-full max-w-lg">
        {editando ? (
          <div className="space-y-3">
            <input
              type="text"
              name="nome"
              value={formPaciente.nome}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Nome"
            />
            <input
              type="email"
              name="email"
              value={formPaciente.email}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Email"
            />
            <input
              type="text"
              name="cpf"
              value={formPaciente.cpf}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="CPF"
            />
            <input
              type="text"
              name="telefone"
              value={formPaciente.telefone}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Telefone"
            />
            <input
              type="date"
              name="dataNascimento"
              value={formPaciente.dataNascimento}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Data de Nascimento"
            />
            <div className="flex gap-2">
              <button
                onClick={salvarAlteracoes}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
              <button
                onClick={() => setEditando(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p><strong>Nome:</strong> {paciente.nome}</p>
            <p><strong>Email:</strong> {paciente.email}</p>
            <p><strong>CPF:</strong> {paciente.cpf}</p>
            <p><strong>Telefone:</strong> {paciente.telefone}</p>
            <p><strong>Data de Nascimento:</strong> {paciente.dataNascimento}</p>
            <button
              onClick={() => setEditando(true)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Editar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilPaciente;
