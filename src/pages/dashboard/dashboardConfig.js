import { Users, Calendar, UserCog, ClipboardList, FileText } from "lucide-react";

export const botoesConfig = [
  {
    label: 'Cadastrar paciente',
    roles: ['ROLE_RECEPCIONISTA', 'ROLE_DENTISTA'], 
    action: () => alert('Em breve: Cadastrar paciente'), 
   
  },
  {
    label: 'Gerenciar contas',
    roles: ['ROLE_ADMIN', 'ROLE_RECEPCIONISTA'],
    action: () => alert('Em breve: Gerenciar contas'),
  },
  {
    label: 'Visualizar agenda',
    roles: ['ROLE_DENTISTA', 'ROLE_RECEPCIONISTA'],
    action: () => alert('Em breve: Visualizar agenda'),
  },
  {
    label: 'Histórico de consultas',
    roles: ['ROLE_PACIENTE', 'ROLE_DENTISTA'],
    action: () => alert('Em breve: Histórico de consultas'),
  },
  {
    label: 'Gerar relatório',
    roles: ['ROLE_DENTISTA'], 
    action: () => alert('Em breve: Gerar relatório'),
  },
  {
    label: 'Anamnese e Odontograma',
    roles: ['ROLE_DENTISTA'],
    action: () => alert('Em breve: Anamnese e Odontograma'),
  },
  {
    label: 'Retornos pendentes',
    roles: ['ROLE_RECEPCIONISTA'],
    action: () => alert('Em breve: Retornos pendentes'),
  },
  {
    label: 'Visualizar perfil',
    roles: ['ROLE_DENTISTA', 'ROLE_PACIENTE', 'ROLE_RECEPCIONISTA', 'ROLE_ADMIN'], 
    action: (navigate) => alert('Em breve: Visualizar perfil'), 
  },
];