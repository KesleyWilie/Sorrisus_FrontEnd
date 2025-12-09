import api from "./api";

export const salvarProntuario = (dados, consultaId) => {
  return api.post(`/prontuarios?consultaId=${consultaId}`, dados);
};

export const buscarProntuarioPorConsulta = (consultaId) => {
  return api.get(`/prontuarios/consulta/${consultaId}`);
};

export const atualizarProntuario = (id, dados) => {
  const token = localStorage.getItem("accessToken");

  return api.put(`/prontuarios/${id}`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
