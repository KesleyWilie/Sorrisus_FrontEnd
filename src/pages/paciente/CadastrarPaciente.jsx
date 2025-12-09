import { useState } from "react";
import { cadastrarPaciente } from "../../services/pacienteService";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  MailIcon,
  LockIcon,
  Phone,
  Calendar,
  FingerprintIcon,
} from "lucide-react";

/**
 * Componente de Input com Ícone Integrado usando lucide-react.
 * O componente de ícone (ex: <User />) é passado via prop 'icon' e renderizado.
 */
const InputIcon = ({ icon: Icon, placeholder, type, name, value, onChange, error, ...props }) => {
  const iconClasses = "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400";
  const inputClasses = `w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${
    error ? "border-red-500" : "border-gray-300"
  } ${type === "date" ? "appearance-none" : ""}`;

  return (
    <div className="relative">
      <div className={iconClasses}>
        {/* Renderiza o componente de ícone Lucide recebido via prop */}
        <Icon className="w-5 h-5" />
      </div>
      
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
        {...props}
      />
    </div>
  );
};

// Funções de Máscara e Validação de CPF
const maskCpf = (value) => {
  return value
    .replace(/\D/g, "") // Remove tudo que não for dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o terceiro e o quarto dígitos
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto entre o sexto e o sétimo dígitos
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // Coloca um hífen entre o nono e o décimo dígitos
    .slice(0, 14); // Limita ao tamanho de CPF (incluindo pontos e traço)
};

const maskTelefone = (value) => {
  return value
    .replace(/\D/g, "") // Remove tudo que não for dígito
    .replace(/^(\d{2})(\d)/g, "($1) $2") // Coloca parênteses em volta dos dois primeiros dígitos
    .replace(/(\d{5})(\d)/, "$1-$2") // Coloca hífen depois do quinto dígito (padrão celular 5+4)
    .slice(0, 15); // Limita ao tamanho de telefone (ex: (99) 99999-9999)
};

const validateCpf = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, ""); // Remove formatação

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false; // Retorna falso se não tiver 11 dígitos ou for uma sequência repetida
  }

  let sum = 0;
  let remainder;

  // Validação do primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;

  // Validação do segundo dígito verificador
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

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

  const [erros, setErros] = useState({}); 
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

    // Validação de CPF aprimorada
    const cpfUnmasked = paciente.cpf.replace(/[^\d]/g, "");
    if (!cpfUnmasked) {
      novosErros.cpf = "O CPF é obrigatório.";
    } else if (!validateCpf(cpfUnmasked)) {
      novosErros.cpf = "Informe um CPF válido.";
    }

    // Validação de Telefone pelo número de dígitos não mascarados
    const telefoneUnmasked = paciente.telefone.replace(/[^\d]/g, "");
    if (paciente.telefone && (telefoneUnmasked.length < 10 || telefoneUnmasked.length > 11)) {
      novosErros.telefone = "Telefone deve ter 10 ou 11 dígitos (DDD incluso).";
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
    let { name, value } = e.target;
    
    // Aplica as máscaras
    if (name === "cpf") {
      value = maskCpf(value);
    } else if (name === "telefone") {
      value = maskTelefone(value);
    }

    setPaciente({ ...paciente, [name]: value });

    // remover erro automaticamente ao digitar
    if (erros[name]) {
      setErros({ ...erros, [name]: null });
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
      // Cria uma cópia do paciente para enviar, removendo a formatação de CPF e Telefone
      const pacienteParaEnvio = {
        ...paciente,
        cpf: paciente.cpf.replace(/[^\d]/g, ""),
        telefone: paciente.telefone ? paciente.telefone.replace(/[^\d]/g, "") : "",
      };

      // A função 'cadastrarPaciente' usa o mock service.
      await cadastrarPaciente(pacienteParaEnvio);

      setMensagem("Paciente cadastrado com sucesso!");
      setTipoMensagem("success");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);

      const mensagemBackend =
        error.response?.data?.message ||
        "Erro ao cadastrar paciente. Tente novamente.";

      setMensagem(mensagemBackend);
      setTipoMensagem("danger");

      //setErros({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <img src="/teeth.png" alt="Sorrisus" className="w-10 h-10 object-contain" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center">Sorrisus</h1>
            <p className="text-blue-100 text-center mt-2">Sistema Odontológico</p>
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Cadastre-se</h1>

          {mensagem && (
          <div
            className={`mb-3 text-center py-2 rounded-lg text-white ${
              tipoMensagem === "success" ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {mensagem}
          </div>
        )} 

        <form onSubmit={handleSubmit} className="space-y-4"> 
          
          {/* NOME */}
          <div>
            {/* Label visível */}
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome *</label> 
            <InputIcon
              id="nome"
              icon={User}
              type="text"
              name="nome"
              placeholder="Digite seu nome completo"
              value={paciente.nome}
              onChange={handleChange}
              error={erros.nome}
            />
            {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
          </div>

          {/* EMAIL */}
          <div>
            {/* Label visível */}
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label> 
            <InputIcon
              id="email"
              icon={MailIcon}
              type="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={paciente.email}
              onChange={handleChange}
              error={erros.email}
            />
            {erros.email && <p className="text-red-500 text-sm mt-1">{erros.email}</p>}
          </div>

          {/* CPF */}
          <div>
            {/* Label visível */}
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
            <InputIcon
              id="cpf"
              icon={FingerprintIcon}
              type="text"
              name="cpf"
              placeholder="999.999.999-99"
              value={paciente.cpf}
              onChange={handleChange}
              error={erros.cpf}
              maxLength={14} // MaxLength para a máscara
            />
            {erros.cpf && <p className="text-red-500 text-sm mt-1">{erros.cpf}</p>}
          </div>

          {/* TELEFONE */}
          <div>
            {/* Label visível */}
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
            <InputIcon
              id="telefone"
              icon={Phone}
              type="text"
              name="telefone"
              placeholder="(99) 99999-9999"
              value={paciente.telefone}
              onChange={handleChange}
              error={erros.telefone}
              maxLength={15} // MaxLength para a máscara
            />
            {erros.telefone && <p className="text-red-500 text-sm mt-1">{erros.telefone}</p>}
          </div>

          {/* DATA DE NASCIMENTO */}
          <div>
            {/* Label visível */}
            <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento
            </label>
            <InputIcon
              id="dataNascimento"
              icon={Calendar}
              type="date"
              name="dataNascimento"
              placeholder=""
              value={paciente.dataNascimento}
              onChange={handleChange}
              error={erros.dataNascimento}
            />
            {erros.dataNascimento && (
              <p className="text-red-500 text-sm mt-1">{erros.dataNascimento}</p>
            )}
          </div>

          {/* SENHA */}
          <div>
            {/* Label visível */}
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
            <InputIcon
              id="senha"
              icon={LockIcon}
              type="password"
              name="senha"
              placeholder="Digite sua senha"
              value={paciente.senha}
              onChange={handleChange}
              error={erros.senha}
            />
            {erros.senha && <p className="text-red-500 text-sm mt-1">{erros.senha}</p>}
            <p className="text-xs text-gray-500 mt-2 text-center">
              A senha será criptografada automaticamente.
            </p>
          </div>

          {/* BOTÃO CADASTRAR */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold rounded-lg disabled:opacity-40"
              // Desativa se houver erros ou campos obrigatórios vazios
              disabled={
                !paciente.nome ||
                !paciente.email ||
                !paciente.cpf ||
                !paciente.telefone ||
                !paciente.senha ||
                Object.values(erros).some((e) => e)
              } 
            >
              Cadastrar
            </button>
          </div>
        </form>

          {/* Link para Login, estilizado conforme o molde */}
          <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition duration-200"
            >
              Faça login
            </Link>
          </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">© 2025 Sorrisus. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default CadastrarPaciente;