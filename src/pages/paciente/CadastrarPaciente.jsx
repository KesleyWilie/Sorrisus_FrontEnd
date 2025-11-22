import { useState } from "react";
import { cadastrarPaciente } from "../../services/pacienteService";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
  Alert,
} from "@mui/material";

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

  // ---------------- VALIDAÇÕES ------------------
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

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    setPaciente({ ...paciente, [e.target.name]: e.target.value });

    if (erros[e.target.name]) {
      setErros({ ...erros, [e.target.name]: null });
    }
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      setMensagem("Existem erros no formulário. Verifique os campos destacados.");
      setTipoMensagem("error");
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
      setTipoMensagem("error");
    }
  };

  // ---------------- JSX ----------------
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 2,
          borderRadius: 3,
          boxShadow: 3,
        }}>
        <CardContent sx={{ p: 1 }}>
          <Typography variant="h6" align="center" fontWeight="bold" mb={2}>
            Cadastre-se
          </Typography>

          {mensagem && (
            <Alert severity={tipoMensagem} sx={{ mb: 2 }}>
              {mensagem}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={1.5}>
              {/* NOME */}
              <TextField
                label="Nome *"
                name="nome"
                fullWidth
                value={paciente.nome}
                onChange={handleChange}
                error={!!erros.nome}
                helperText={erros.nome}
              />

              {/* EMAIL */}
              <TextField
                label="E-mail *"
                name="email"
                type="email"
                fullWidth
                value={paciente.email}
                onChange={handleChange}
                error={!!erros.email}
                helperText={erros.email}
              />

              {/* CPF */}
              <TextField
                label="CPF *"
                name="cpf"
                fullWidth
                inputProps={{ maxLength: 11 }}
                value={paciente.cpf}
                onChange={handleChange}
                error={!!erros.cpf}
                helperText={erros.cpf}
              />

              {/* TELEFONE */}
              <TextField
                label="Telefone"
                name="telefone"
                fullWidth
                value={paciente.telefone}
                onChange={handleChange}
                error={!!erros.telefone}
                helperText={erros.telefone}
              />

              {/* DATA DE NASCIMENTO */}
              <TextField
                label="Data de Nascimento"
                name="dataNascimento"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={paciente.dataNascimento}
                onChange={handleChange}
                error={!!erros.dataNascimento}
                helperText={erros.dataNascimento}
              />

              {/* SENHA */}
              <TextField
                label="Senha *"
                name="senha"
                type="password"
                fullWidth
                value={paciente.senha}
                onChange={handleChange}
                error={!!erros.senha}
                helperText={erros.senha || "A senha será criptografada automaticamente."}
              />

              {/* BOTÃO CADASTRAR */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={
                  !paciente.nome ||
                  !paciente.email ||
                  !paciente.cpf ||
                  !paciente.senha ||
                  Object.values(erros).some((e) => e)
                }
              >
                Cadastrar
              </Button>

              {/* LINK LOGIN */}
              <Button
                component={Link}
                href="/login"
                variant="text"
                fullWidth
                sx={{ mt: 1 }}
              >
                Já tem conta? Faça login
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CadastrarPaciente;
