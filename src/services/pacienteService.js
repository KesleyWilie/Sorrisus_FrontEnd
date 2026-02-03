import api from "./api";

// lista todos os pacientes
export const listarPacientes = () => api.get("/pacientes");

// cadastrar paciente
export const cadastrarPaciente = (dados) => api.post("/pacientes/cadastro", dados);

// atualizar paciente
export const atualizarPaciente = (id, dados) => {
    const token = localStorage.getItem("accessToken");
    return api.put(`/pacientes/${id}`, dados, { 
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// buscar por id
export const buscarPacientePorId = (id) => {
    const token = localStorage.getItem("accessToken"); 
    return api.get(`/pacientes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// deletar
export const deletarPaciente = (id) => api.delete(`/pacientes/${id}`);
