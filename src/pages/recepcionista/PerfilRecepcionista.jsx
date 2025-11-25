import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { buscarRecepcionistaPorId, atualizarRecepcionista } from "../../services/recepcionistaService";

const PerfilRecepcionista = () => {
  const token = localStorage.getItem("accessToken");
  const decoded = token ? jwtDecode(token) : {};

  const [recepcionista, setRecepcionista] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formRecepcionista, setFormRecepcionista] = useState({
    nome: "",
    email: "",
    turno: "",
  });

  // Buscar perfil do dentista
  useEffect(() => {
    if (decoded.id) {   
      buscarRecepcionistaPorId(decoded.id) 
        .then((response) => {
          setRecepcionista(response.data);
          setFormRecepcionista({
            nome: response.data.nome,
            email: response.data.email,
            turno: response.data.turno,
          });
        })
        .catch((error) => console.error("Erro ao carregar perfil:", error));
    }
  }, [decoded.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormRecepcionista((prev) => ({ ...prev, [name]: value }));
  };

  const salvarAlteracoes = () => {
    atualizarRecepcionista(decoded.id, formRecepcionista) 
      .then((response) => {
        setRecepcionista(response.data);
        setEditando(false);
        alert("Perfil atualizado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar perfil:", error);
        alert("Erro ao atualizar perfil. Verifique os dados.");
      });
  };

  if (!recepcionista) {
    return <div className="p-10">Carregando perfil...</div>;
  }

  return (
    <div className="p-10 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700">👤 Perfil do Recepcionista</h1>

      <div className="mt-6 p-6 bg-white rounded-xl shadow-md w-full max-w-lg">
        {editando ? (
          <div className="space-y-3">
            <input
              type="text"
              name="nome"
              value={formRecepcionista.nome}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Nome"
            />
            <input
              type="email"
              name="email"
              value={formRecepcionista.email}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Email"
            />
            <input
              type="text"
              name="turno"
              value={formRecepcionista.turno}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Turno"
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
            <p><strong>Nome:</strong> {recepcionista.nome}</p>
            <p><strong>Email:</strong> {recepcionista.email}</p>
            <p><strong>Turno:</strong> {recepcionista.turno}</p>
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

export default PerfilRecepcionista;
