import api from "./api";

// listar recepcionistas
export const listarRecepcionistas = () => api.get("/recepcionistas");

// buscar recepcionista por id
export const buscarRecepcionistaPorId = (id) => {
    const token = localStorage.getItem("accessToken"); // token armazenado no login
    return api.get(`/recepcionistas/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// criar recepcionista
export const cadastrarRecepcionista = (dados) => api.post("/recepcionistas", dados);

// atualizar recepcionista
export const atualizarRecepcionista = (id, dados) => {
  const token = localStorage.getItem("accessToken");
  return api.put(`/recepcionistas/${id}`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

};

// deletar recepcionista
export const deletarRecepcionista = (id) => api.delete(`/recepcionistas/${id}`);
