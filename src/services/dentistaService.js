import api from "./api";

// listar todos os dentistas
export const listarDentistas = () => api.get("/dentistas");

// cadastrar dentista
export const cadastrarDentista = (dados) => api.post("/dentistas/cadastro", dados);

// atualizar dentista
export const atualizarDentista = (id, dados) => {
  const token = localStorage.getItem("accessToken");
  return api.put(`/dentistas/${id}`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// deletar dentista
export const deletarDentista = (id) => api.delete(`/dentistas/${id}`);

// buscar dentista por ID
export const buscarDentistaPorId = (id) => {
  const token = localStorage.getItem("accessToken"); // token armazenado no login
  return api.get(`/dentistas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};