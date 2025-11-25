# Sorrisus (Front-end)

Este repositório contém a interface front-end do sistema Sorrisus — um sistema odontológico simples para gerenciamento de pacientes, dentistas, recepcionistas e agendamentos.

## Funcionalidades implementadas
- Autenticação (login) com token JWT. O token e dados do usuário são salvos no localStorage.
- Dashboard (visão geral): cartões com métricas e módulos.
- Cadastro de paciente (formulário com validação e máscaras).
- Perfil unificado (`/perfil`) — mostra e permite editar o perfil do usuário com base na role (Paciente, Dentista, Recepcionista).
  - Ao editar, CPF e Telefone são mascarados e enviados ao backend sem caracteres (apenas dígitos).
  - A visualização do perfil exibe data formatada (DD/MM/YYYY).
- Navbar com navegação e acesso ao perfil conforme role; logout com confirmação.

## Estrutura de páginas
- `/login` — tela de login
- `/dashboard` — dashboard (privado)
- `/pacientes` — lista de pacientes (privado)
- `/pacientes/cadastrar` — formulário de cadastro de paciente (público)
- `/perfil` — perfil unificado (privado)

## Tecnologias e bibliotecas
- React (via Vite) — SPA
- Vite — bundler, dev server
- Tailwind CSS — estilização
- Axios — chamadas HTTP
- lucide-react — ícones
- jwt-decode — (removido em alguns pontos) - usamos `authService` para recuperar id/role do localStorage

## Requisitos
- Node.js (recomendado): >= 20.19.0 (Vite recomenda 20.19+ ou 22.12+)
- npm (ou yarn)
- Backend executando em `http://localhost:8080/api` (recomendado para desenvolvimento local)

> Observação: Se o Vite mostrar aviso relacionado à versão do Node, atualize sua versão do Node.

## Como rodar localmente
1. Clone o repositório e navegue até o frontend:

```bash
cd c:/seu/caminho/Sorrisus_FrontEnd
```

2. Instale dependências

```bash
npm install
```

3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Isso iniciará o Vite dev server com HMR (Hot Module Replacement) em `http://localhost:5173/`.


## Integração com o backend
O projeto faz chamadas HTTP ao backend em `http://localhost:8080/api`. Certifique-se de rodar o backend para que as chamadas de `listarPacientes`, `listarDentistas`, `buscarPacientePorId`, etc. respondam corretamente.

Tokens e login
- Ao efetuar login, a resposta do backend (`LoginResponse`) contém o `accessToken` e `userId` — o projeto armazena `token`, `user`, `role`, e `userId` no `localStorage` para uso em chamadas autenticadas e roteamento.

## Formatação e Validação
- CPF: marcação automática para `xxx.xxx.xxx-xx` no formulário e na visualização. Enviado ao backend como apenas dígitos (ex: 44444444444).
- Telefone: formatação automática `(xx) xxxx-xxxx` ou `(xx) xxxxx-xxxx` dependendo do comprimento. Enviado sem máscara.
- Data de nascimento: a visualização exibe `DD/MM/YYYY`, enquanto o input é tipo `date`.

## Observações sobre Perfil Unificado
- Foi criada uma rota unificada `/perfil` que decide qual serviço usar para buscar e atualizar os dados com base na role do usuário (role guard):
  - ROLE_PACIENTE: usa `pacienteService`
  - ROLE_DENTISTA: usa `dentistaService`
  - ROLE_RECEPCIONISTA: usa `recepcionistaService`
- As páginas de perfil antigas (`PerfilDentista.jsx`, `PerfilRecepcionista.jsx`, `PerfilPaciente.jsx`) permanecem no projeto para referência, mas as rotas de acesso direto foram removidas em favor do `/perfil` unificado.

## Endpoints principais (cada `service` faz chamadas para `api`):
- GET /pacientes
- GET /pacientes/{id}
- POST /pacientes/cadastro
- PUT /pacientes/{id}
- GET /dentistas
- GET /dentistas/{id}
- PUT /dentistas/{id}
- (sem documentação completa aqui — ver backend para detalhes)

## Contribuidores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/estertrvs" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/141650957?v=4" width="100px;" alt="Foto de Ester"/><br>
        <sub>
          <b>Ester Trevisan</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/analiciafsoares" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/144076062?v=4" width="100px;" alt="Foto de Ana"/><br>
        <sub>
          <b>Ana Licia Soares</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Joaopaulomedeirosdesouza" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/148402008?v=4" width="100px;" alt="Foto de João Paulo"/><br>
        <sub>
          <b>João Paulo Medeiros</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/KesleyWilie" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/144160126?v=4" width="100px;" alt="Foto de Kesley"/><br>
        <sub>
          <b>Kesley Wilie</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/GeorgeAdOliveira" title="GitHub">
        <img src="https://avatars.githubusercontent.com/u/143577407?v=4" width="100px;" alt="Foto de George"/><br>
        <sub>
          <b>George Oliveira</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

---

**Instituto Federal da Paraíba** — Disciplina de **Projeto II**.
