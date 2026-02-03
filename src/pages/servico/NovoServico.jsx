import ServicoForm from "./ServicoForm";
import Navbar from "../../components/Navbar";

export default function NovoServico() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Novo Serviço</h2>
          <p className="text-sm text-gray-500">Cadastre um novo procedimento</p>
        </div>
        <ServicoForm />
      </div>
    </div>
  );
}
