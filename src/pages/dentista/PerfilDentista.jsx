import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { buscarDentistaPorId, atualizarDentista } from "../../services/dentistaService";

const PerfilDentista = () => {
  const token = localStorage.getItem("accessToken");
  const decoded = token ? jwtDecode(token) : {};

  const [dentista, setDentista] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formDentista, setFormDentista] = useState({
    nome: "",
    email: "",
    cro: "",
    especialidade: "",
  });

  // Buscar perfil do dentista
  useEffect(() => {
    if (!decoded.id) {   // tirar o   !
      buscarDentistaPorId(3) // colocar decoded.id no lugar do 3
        .then((response) => {
          setDentista(response.data);
          setFormDentista({
            nome: response.data.nome,
            email: response.data.email,
            cro: response.data.cro,
            especialidade: response.data.especialidade,
          });
        })
        .catch((error) => console.error("Erro ao carregar perfil:", error));
    }
  }, [decoded.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDentista((prev) => ({ ...prev, [name]: value }));
  };

  const salvarAlteracoes = () => {
    atualizarDentista(3, formDentista)
      .then((response) => {
        setDentista(response.data);
        setEditando(false);
        alert("Perfil atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar perfil:", error);
        alert("Erro ao atualizar perfil. Verifique os dados.");
      });
  };

  if (!dentista) {
    return <div className="p-10">Carregando perfil...</div>;
  }

  return (
    <div className="p-10 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700">👤 Perfil do Dentista</h1>

      <div className="mt-6 p-6 bg-white rounded-xl shadow-md w-full max-w-lg">
        {editando ? (
          <div className="space-y-3">
            <input
              type="text"
              name="nome"
              value={formDentista.nome}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Nome"
            />
            <input
              type="email"
              name="email"
              value={formDentista.email}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Email"
            />
            <input
              type="text"
              name="cro"
              value={formDentista.cro}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="CRO"
            />
            <input
              type="text"
              name="especialidade"
              value={formDentista.especialidade}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Especialidade"
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
            <p><strong>Nome:</strong> {dentista.nome}</p>
            <p><strong>Email:</strong> {dentista.email}</p>
            <p><strong>CRO:</strong> {dentista.cro}</p>
            <p><strong>Especialidade:</strong> {dentista.especialidade}</p>
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

export default PerfilDentista;
