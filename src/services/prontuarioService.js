import api from "./api";

export const salvarProntuario = (dados, consultaId) => {
  const token = localStorage.getItem("accessToken");

  const url = consultaId
    ? `/prontuarios?consultaId=${consultaId}`
    : `/prontuarios`;

  return api.post(url, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  /*return api.post(`/prontuarios?consultaId=${consultaId}`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });*/
};

export const atualizarProntuario = (id, dados) => {
  const token = localStorage.getItem("accessToken");

  return api.put(`/prontuarios/${id}`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
