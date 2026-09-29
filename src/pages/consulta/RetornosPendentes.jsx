import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { listarRetornosPendentes } from "../../services/consultaService";
import { formatarData } from "../../utils/formatters";

const estilosPrioridade = {
  ALTA: "bg-red-50 text-red-700 border-red-200",
  MEDIA: "bg-amber-50 text-amber-700 border-amber-200",
  "MÉDIA": "bg-amber-50 text-amber-700 border-amber-200",
  BAIXA: "bg-green-50 text-green-700 border-green-200",
};

const RetornosPendentes = () => {
  const navigate = useNavigate();
  const [retornos, setRetornos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const carregarRetornos = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await listarRetornosPendentes();
      setRetornos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Erro ao carregar retornos pendentes:", err);
      setRetornos([]);
      setError(
        err?.response?.data?.message ||
          "Não foi possível carregar os retornos pendentes. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarRetornos();
  }, [carregarRetornos]);

  const classePrioridade = (prioridade) => {
    const chave = String(prioridade || "").toUpperCase();
    return estilosPrioridade[chave] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Retornos Pendentes</h1>
              <p className="text-sm text-gray-500">
                Pacientes com retorno pendente para acompanhamento
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="self-start sm:self-auto flex items-center gap-2 bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>

        {error ? (
          <div className="bg-white rounded-lg shadow border border-red-200 p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Erro ao carregar retornos
            </h2>
            <p className="text-sm text-gray-600 mb-5">{error}</p>
            <button
              type="button"
              onClick={carregarRetornos}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
            >
              <RefreshCw size={18} />
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última consulta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tempo decorrido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dentista
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      <div className="inline-flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        Carregando retornos pendentes...
                      </div>
                    </td>
                  </tr>
                ) : retornos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      Nenhum retorno pendente encontrado.
                    </td>
                  </tr>
                ) : (
                  retornos.map((retorno) => (
                    <tr
                      key={`${retorno.pacienteId}-${retorno.dataUltimaConsulta}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {retorno.pacienteNome || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-col gap-1 min-w-56">
                          <span className="inline-flex items-center gap-2">
                            <Mail size={15} className="text-gray-400 flex-shrink-0" />
                            {retorno.pacienteEmail || "-"}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Phone size={15} className="text-gray-400 flex-shrink-0" />
                            {retorno.pacienteTelefone || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatarData(retorno.dataUltimaConsulta)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {retorno.diasDesdeUltimaConsulta != null
                          ? `${retorno.diasDesdeUltimaConsulta} dias`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {retorno.dentistaNome || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${classePrioridade(
                            retorno.prioridade
                          )}`}
                        >
                          {retorno.prioridade || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default RetornosPendentes;
