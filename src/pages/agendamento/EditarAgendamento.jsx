import { useParams } from "react-router-dom";
import AgendamentoForm from "./AgendamentoForm";

export default function EditarAgendamento() {
  const { id } = useParams();
  return <AgendamentoForm agendamentoId={id} />;
}
