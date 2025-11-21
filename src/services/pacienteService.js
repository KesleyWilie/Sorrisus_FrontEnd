import api from "./api";

// lista todos os pacientes
export const listarPacientes = () => api.get("/pacientes");

// cadastrar paciente
export const cadastrarPaciente = (dados) => api.post("/pacientes/cadastro", dados);

// atualizar paciente
export const atualizarPaciente = (id, dados) => api.put(`/pacientes/${id}`, dados);

// buscar por id
export const buscarPacientePorId = (id) => api.get(`/pacientes/${id}`);

// deletar
export const deletarPaciente = (id) => api.delete(`/pacientes/${id}`);
