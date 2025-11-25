import React, { useEffect, useState } from "react";
import { getUserId, getRole } from "../../services/authService";
import {
  buscarPacientePorId,
  atualizarPaciente,
} from "../../services/pacienteService";
import {
  buscarDentistaPorId,
  atualizarDentista,
} from "../../services/dentistaService";
import {
  buscarRecepcionistaPorId,
  atualizarRecepcionista,
} from "../../services/recepcionistaService";

const GerenciarPerfil = () => {
  const userId = getUserId() || localStorage.getItem("userId");
  const role = getRole() || localStorage.getItem("role");

  const [data, setData] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const fetchByRole = async () => {
      try {
        if (role === "ROLE_PACIENTE") {
          const res = await buscarPacientePorId(userId);
          setData(res.data);
          setForm({
            nome: res.data.nome || "",
            email: res.data.email || "",
            cpf: res.data.cpf || "",
            telefone: res.data.telefone || "",
            dataNascimento: res.data.dataNascimento || "",
          });
        } else if (role === "ROLE_DENTISTA") {
          const res = await buscarDentistaPorId(userId);
          setData(res.data);
          setForm({
            nome: res.data.nome || "",
            email: res.data.email || "",
            cro: res.data.cro || "",
            especialidade: res.data.especialidade || "",
          });
        } else if (role === "ROLE_RECEPCIONISTA") {
          const res = await buscarRecepcionistaPorId(userId);
          setData(res.data);
          setForm({
            nome: res.data.nome || "",
            email: res.data.email || "",
            turno: res.data.turno || "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchByRole();
  }, [userId, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (role === "ROLE_PACIENTE") {
        const res = await atualizarPaciente(userId, form);
        setData(res.data);
      } else if (role === "ROLE_DENTISTA") {
        const res = await atualizarDentista(userId, form);
        setData(res.data);
      } else if (role === "ROLE_RECEPCIONISTA") {
        const res = await atualizarRecepcionista(userId, form);
        setData(res.data);
      }
      setEditando(false);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error.response?.data || error);
      alert("Erro ao atualizar perfil. Verifique os dados.");
    }
  };

  if (!userId) return <div className="p-10">Usuário não identificado.</div>;
  if (!["ROLE_PACIENTE", "ROLE_DENTISTA", "ROLE_RECEPCIONISTA"].includes(role)) return <div className="p-10 text-red-600">Acesso negado. Role desconhecida.</div>;

  if (loading) return <div className="p-10">Carregando perfil...</div>;
  if (!data) return <div className="p-10">Nenhum perfil encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-6"> Gerenciar Perfil</h1>
      <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-lg">
        {editando ? (
          <div className="space-y-3">
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="w-full border px-2 py-1 rounded"/>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border px-2 py-1 rounded"/>
            {role === "ROLE_PACIENTE" && (
              <>
                <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF" className="w-full border px-2 py-1 rounded"/>
                <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" className="w-full border px-2 py-1 rounded"/>
                <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} placeholder="Data Nasc." className="w-full border px-2 py-1 rounded"/>
              </>
            )}
            {role === "ROLE_DENTISTA" && (
              <>
                <input name="cro" value={form.cro} onChange={handleChange} placeholder="CRO" className="w-full border px-2 py-1 rounded"/>
                <input name="especialidade" value={form.especialidade} onChange={handleChange} placeholder="Especialidade" className="w-full border px-2 py-1 rounded"/>
              </>
            )}
            {role === "ROLE_RECEPCIONISTA" && (
              <input name="turno" value={form.turno} onChange={handleChange} placeholder="Turno" className="w-full border px-2 py-1 rounded"/>
            )}
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
              <button onClick={() => setEditando(false)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancelar</button>
            </div>
          </div>
        ) : (
          <div>
            <p><strong>Nome:</strong> {data.nome}</p>
            <p><strong>Email:</strong> {data.email}</p>
            {role === "ROLE_PACIENTE" && (
              <>
                <p><strong>CPF:</strong> {data.cpf}</p>
                <p><strong>Telefone:</strong> {data.telefone}</p>
                <p><strong>Data de Nascimento:</strong> {data.dataNascimento}</p>
              </>
            )}
            {role === "ROLE_DENTISTA" && (
              <>
                <p><strong>CRO:</strong> {data.cro}</p>
                <p><strong>Especialidade:</strong> {data.especialidade}</p>
              </>
            )}
            {role === "ROLE_RECEPCIONISTA" && (
              <p><strong>Turno:</strong> {data.turno}</p>
            )}
            <button onClick={() => setEditando(true)} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Editar Perfil</button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default GerenciarPerfil;
