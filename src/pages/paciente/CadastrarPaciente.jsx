import { useState } from "react";
import { cadastrarPaciente } from "../../services/pacienteService";
import { Link, useNavigate } from "react-router-dom";

const CadastrarPaciente = () => {
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    senha: "",
  });

  const [erros, setErros] = useState({}); // armazenar erros específicos
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  // FUNÇÕES DE VALIDAÇÃO
  const validarCampos = () => {
    const novosErros = {};

    if (!paciente.nome.trim()) {
      novosErros.nome = "O nome é obrigatório.";
    }

    if (!paciente.email.trim()) {
      novosErros.email = "O e-mail é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(paciente.email)) {
      novosErros.email = "Informe um e-mail válido.";
    }

    if (!paciente.cpf.trim()) {
      novosErros.cpf = "O CPF é obrigatório.";
    } else if (!/^\d{11}$/.test(paciente.cpf)) {
      novosErros.cpf = "O CPF deve ter exatamente 11 números.";
    }

    if (paciente.telefone && !/^\d{10,11}$/.test(paciente.telefone)) {
      novosErros.telefone = "Telefone deve ter 10 a 11 dígitos.";
    }

    if (paciente.dataNascimento) {
      const hoje = new Date();
      const nascimento = new Date(paciente.dataNascimento);
      if (nascimento > hoje) {
        novosErros.dataNascimento = "A data não pode ser no futuro.";
      }
    }

    if (!paciente.senha.trim()) {
      novosErros.senha = "A senha é obrigatória.";
    } else if (paciente.senha.length < 6) {
      novosErros.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e) => {
    setPaciente({ ...paciente, [e.target.name]: e.target.value });

    // remover erro automaticamente ao digitar
    if (erros[e.target.name]) {
      setErros({ ...erros, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      setMensagem("Existem erros no formulário. Verifique os campos destacados.");
      setTipoMensagem("danger");
      return;
    }

    try {
      await cadastrarPaciente(paciente);

      setMensagem("Paciente cadastrado com sucesso!");
      setTipoMensagem("success");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      setMensagem("Erro ao cadastrar paciente. Verifique os dados.");
      setTipoMensagem("danger");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Cadastre-se
        </h1>

        {mensagem && (
          <div
            className={`mb-3 text-center py-2 rounded-lg text-white ${
              tipoMensagem === "success" ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* NOME */}
          <div>
            <label className="block text-gray-700 font-medium">Nome *</label>
            <input
              type="text"
              name="nome"
              value={paciente.nome}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-1.5 border rounded-lg shadow-sm 
                ${erros.nome ? "border-red-500" : "border-gray-300"} 
                focus:ring-2 focus:ring-blue-500`}
            />
            {erros.nome && <p className="text-red-500 text-sm">{erros.nome}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-gray-700 font-medium">E-mail *</label>
            <input
              type="email"
              name="email"
              value={paciente.email}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-1.5 border rounded-lg shadow-sm 
                ${erros.email ? "border-red-500" : "border-gray-300"} 
                focus:ring-2 focus:ring-blue-500`}
            />
            {erros.email && <p className="text-red-500 text-sm">{erros.email}</p>}
          </div>

          {/* CPF */}
          <div>
            <label className="block text-gray-700 font-medium">CPF *</label>
            <input
              type="text"
              name="cpf"
              value={paciente.cpf}
              onChange={handleChange}
              maxLength={11}
              className={`w-full mt-1 px-3 py-1.5 border rounded-lg shadow-sm 
                ${erros.cpf ? "border-red-500" : "border-gray-300"} 
                focus:ring-2 focus:ring-blue-500`}
            />
            {erros.cpf && <p className="text-red-500 text-sm">{erros.cpf}</p>}
          </div>

          {/* TELEFONE */}
          <div>
            <label className="block text-gray-700 font-medium">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={paciente.telefone}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-1.5 border rounded-lg shadow-sm 
                ${erros.telefone ? "border-red-500" : "border-gray-300"} 
                focus:ring-2 focus:ring-blue-500`}
            />
            {erros.telefone && <p className="text-red-500 text-sm">{erros.telefone}</p>}
          </div>

          {/* DATA DE NASCIMENTO */}
          <div>
            <label className="block text-gray-700 font-medium">
              Data de Nascimento
            </label>
            <input
              type="date"
              name="dataNascimento"
              value={paciente.dataNascimento}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-1.5 border rounded-lg shadow-sm 
                ${erros.dataNascimento ? "border-red-500" : "border-gray-300"} 
                focus:ring-2 focus:ring-blue-500`}
            />
            {erros.dataNascimento && (
              <p className="text-red-500 text-sm">{erros.dataNascimento}</p>
            )}
          </div>

          {/* SENHA */}
          <div>
            <label className="block text-gray-700 font-medium">Senha *</label>
            <input
              type="password"
              name="senha"
              value={paciente.senha}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-1.5 border rounded-lg shadow-sm 
                ${erros.senha ? "border-red-500" : "border-gray-300"} 
                focus:ring-2 focus:ring-blue-500`}
            />
            {erros.senha && <p className="text-red-500 text-sm">{erros.senha}</p>}
            <p className="text-xs text-gray-500 mt-1">
              A senha será criptografada automaticamente.
            </p>
          </div>

          {/* BOTÕES */}
          <div className="mt-4 space-y-2">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-lg shadow disabled:opacity-40"
              disabled={
                !paciente.nome ||
                !paciente.email ||
                !paciente.cpf ||
                !paciente.senha ||
                Object.values(erros).some((e) => e)
              } // desativa se houver erros
            >
              Cadastrar
            </button>

            <Link
              to="/login"
              className="block text-center w-full py-2 bg-gray-200 hover:bg-gray-300 transition text-gray-800 font-medium rounded-lg shadow"
            >
              Já tem conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarPaciente;
