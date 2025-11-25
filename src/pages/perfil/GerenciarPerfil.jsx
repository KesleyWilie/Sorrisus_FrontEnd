import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const navigate = useNavigate();

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
            cpf: formatCpf(res.data.cpf || ""),
            telefone: formatPhone(res.data.telefone || ""),
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
    if (name === "cpf") {
      const digits = (value || "").replace(/\D/g, "");
      setForm((prev) => ({ ...prev, cpf: formatCpf(digits) }));
      return;
    }
    if (name === "telefone") {
      const digits = (value || "").replace(/\D/g, "");
      setForm((prev) => ({ ...prev, telefone: formatPhone(digits) }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (value) => {
    if (!value) return "";
    if (Object.prototype.toString.call(value) === "[object Date]") {
      const d = value;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
    if (typeof value === "string") {
      const datePart = value.split("T")[0];
      const parts = datePart.split("-");
      if (parts.length >= 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return value;
    }
    return "";
  };

  const unformatDigits = (value) => {
    return value ? String(value).replace(/\D/g, "") : "";
  };

  const formatCpf = (value) => {
    if (!value) return "";
    const digits = String(value).replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return digits.replace(/(\d{3})(\d+)/, "$1.$2");
    if (digits.length <= 9) return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (value) => {
    if (!value) return "";
    const digits = String(value).replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    if (rest.length <= 4) return `(${ddd}) ${rest}`;
    if (digits.length === 11) {
      const first = rest.slice(0, 5);
      const last = rest.slice(5);
      return `(${ddd}) ${first}-${last}`;
    }
    const first = rest.slice(0, rest.length - 4);
    const last = rest.slice(-4);
    return `(${ddd}) ${first}-${last}`;
  };

  const handleSave = async () => {
    try {
      if (role === "ROLE_PACIENTE") {
        const payload = { ...form, cpf: unformatDigits(form.cpf), telefone: unformatDigits(form.telefone) };
        const res = await atualizarPaciente(userId, payload);
        setData(res.data);
      } else if (role === "ROLE_DENTISTA") {
        const res = await atualizarDentista(userId, form);
        setData(res.data);
      } else if (role === "ROLE_RECEPCIONISTA") {
        const res = await atualizarRecepcionista(userId, form);
        setData(res.data);
      }
      setMensagem("Perfil atualizado com sucesso!");
      setTipoMensagem("success");
      setTimeout(() => setEditando(false), 2000);
      setTimeout(() => setMensagem(""), 2000);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error.response?.data || error);
      setMensagem(error.response?.data?.message || "Erro ao atualizar perfil. Verifique os dados.");
      setTipoMensagem("danger");
      setTimeout(() => setMensagem(""), 4000);
    }
  };

  if (!userId) return <div className="p-10">Usuário não identificado.</div>;
  if (!["ROLE_PACIENTE", "ROLE_DENTISTA", "ROLE_RECEPCIONISTA"].includes(role)) return <div className="p-10 text-red-600">Acesso negado. Role desconhecida.</div>;

  if (loading) return <div className="p-10">Carregando perfil...</div>;
  if (!data) return <div className="p-10">Nenhum perfil encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between bg-blue-600 text-white rounded-md p-3 mb-6 shadow-sm">
          <h1 className="text-lg font-semibold">Gerenciar Perfil</h1>
          <div style={{ width: 72 }} />
        </div>

        <div className="p-8 bg-white rounded-xl shadow-md w-full">
        {mensagem && (
          <div className={`mb-6 text-center py-2 rounded-lg text-white ${tipoMensagem === "success" ? "bg-green-600" : "bg-red-500"}`}>
            {mensagem}
          </div>
        )}
        {editando ? (
          <div className="space-y-4">
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="w-full border px-3 py-2 rounded"/>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border px-3 py-2 rounded"/>
            {role === "ROLE_PACIENTE" && (
              <>
                <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="CPF" className="w-full border px-3 py-2 rounded"/>
                <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" className="w-full border px-3 py-2 rounded"/>
                <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} placeholder="Data Nasc." className="w-full border px-3 py-2 rounded"/>
              </>
            )}
            {role === "ROLE_DENTISTA" && (
              <>
                <input name="cro" value={form.cro} onChange={handleChange} placeholder="CRO" className="w-full border px-3 py-2 rounded"/>
                <input name="especialidade" value={form.especialidade} onChange={handleChange} placeholder="Especialidade" className="w-full border px-3 py-2 rounded"/>
              </>
            )}
            {role === "ROLE_RECEPCIONISTA" && (
              <input name="turno" value={form.turno} onChange={handleChange} placeholder="Turno" className="w-full border px-3 py-2 rounded"/>
            )}
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
              <button onClick={() => setEditando(false)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="mb-2"><strong>Nome:</strong> {data.nome}</p>
            <p className="mb-2"><strong>Email:</strong> {data.email}</p>
            {role === "ROLE_PACIENTE" && (
              <>
                  <p><strong>CPF:</strong> {formatCpf(data.cpf)}</p>
                  <p><strong>Telefone:</strong> {formatPhone(data.telefone)}</p>
                <p><strong>Data de Nascimento:</strong> {formatDate(data.dataNascimento)}</p>
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
            <div className="mt-4 flex justify-center gap-2">
              <button onClick={() => setEditando(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Editar Perfil</button>
              <button onClick={() => navigate('/dashboard')} className="bg-gray-200 px-4 py-2 rounded">Voltar</button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default GerenciarPerfil;
