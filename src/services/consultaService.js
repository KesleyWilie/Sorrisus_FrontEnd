import api from "./api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};


export const listarHistoricoPaciente = (idPaciente) => {
    return api.get(`/consultas/paciente/${idPaciente}`, getAuthHeaders());
};


export const listarHistoricoDentista = (idDentista) => {
    return api.get(`/consultas/dentista/${idDentista}`, getAuthHeaders());
};


export const cancelarConsulta = (id) => {
    return api.delete(`/consultas/${id}`, getAuthHeaders());
};