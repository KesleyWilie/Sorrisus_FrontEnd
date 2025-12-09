import { useEffect, useState, useMemo, useCallback } from 'react';
import { Stethoscope, FileText, Pill, Heart, AlertTriangle, MessageSquare, ClipboardList, Upload } from 'lucide-react';
import React from 'react';
import { useParams } from "react-router-dom";
import { buscarConsultaPorId } from '../../services/consultaService';
import { salvarProntuario } from '../../services/prontuarioService';
import { buscarPacientePorId } from '../../services/pacienteService';

// --- HELPER COMPONENTS ---

/**
 * Componente de Input com Ícone Integrado
 */
const InputIcon = ({ icon: Icon, placeholder, type, name, value, onChange, error, label, ...props }) => {
    const iconClasses = "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400";
    const inputClasses = `w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${
        error ? "border-red-500" : "border-gray-300"
    }`;

    return (
        <div className="relative">
            <div className={iconClasses}>
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

/**
 * Componente de Questão Sim/Não
 */
const RadioQuestion = ({ name, question, value, onChange, Icon, notesPlaceholder }) => (
    <div className="flex flex-col space-y-2 border-b border-gray-200 py-3">
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <label className="text-gray-700 font-medium flex-grow">
                {question}
            </label>
            <div className="flex space-x-4 flex-shrink-0">
                <label className="flex items-center text-sm text-gray-600">
                    <input
                        type="radio"
                        name={`${name}.resposta`}
                        value="Sim"
                        checked={value.resposta === "Sim"}
                        onChange={onChange}
                        className="mr-1 text-blue-600 focus:ring-blue-500"
                    />
                    Sim
                </label>
                <label className="flex items-center text-sm text-gray-600">
                    <input
                        type="radio"
                        name={`${name}.resposta`}
                        value="Não"
                        checked={value.resposta === "Não"}
                        onChange={onChange}
                        className="mr-1 text-blue-600 focus:ring-blue-500"
                    />
                    Não
                </label>
            </div>
        </div>
        {value.resposta === "Sim" && (
            <textarea
                name={`${name}.notas`}
                value={value.notas}
                onChange={onChange}
                placeholder={notesPlaceholder || "Detalhe a informação aqui (Qual? Qual(is)?...)"}
                rows="2"
                className="w-full p-2 mt-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
        )}
    </div>
);


// --- ODONTOGRAMA LOGIC & COMPONENT ---

// Definição das numerações dos dentes permanentes
const permanentTeeth = [
    ...[8, 7, 6, 5, 4, 3, 2, 1].map(n => ({ id: `1${n}`, quadrant: 'SUP DIR' })),
    ...[1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ id: `2${n}`, quadrant: 'SUP ESQ' })),
    ...[8, 7, 6, 5, 4, 3, 2, 1].map(n => ({ id: `4${n}`, quadrant: 'INF DIR' })),
    ...[1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ id: `3${n}`, quadrant: 'INF ESQ' })),
];

// Mapeamento de cores para as condições
const conditionColors = {
    healthy: 'fill-white stroke-gray-400',
    decayed: 'fill-red-500 stroke-red-700', // Vermelho para cárie
    missing: 'fill-gray-500 stroke-gray-700', // Cinza para dente ausente
    treated: 'fill-green-500 stroke-green-700', // Verde para dente tratado/restaurado
};

/**
 * Representa um único dente no Odontograma.
 * Simplificado para mudar o estado (cor) ao ser clicado.
 */
const Tooth = React.memo(({ id, condition, onConditionChange }) => {
    // Estado possível: 'healthy', 'decayed', 'missing', 'treated'
    const colors = conditionColors[condition] || conditionColors.healthy;
    const isMissing = condition === 'missing';

    const handleClick = () => {
        const states = ['healthy', 'decayed', 'treated', 'missing'];
        const currentIndex = states.indexOf(condition);
        const nextIndex = (currentIndex + 1) % states.length;
        onConditionChange(id, states[nextIndex]);
    };

    return (
        <div 
            className={`flex flex-col items-center cursor-pointer transition-transform duration-150 hover:scale-105 mx-1 ${isMissing ? 'opacity-50' : ''}`}
            onClick={handleClick}
            title={`Dente ${id} - Clique para mudar o status: ${condition}`}
        >
            {/* Quadrado representando o dente (Simplificado) */}
            <svg width="30" height="30" viewBox="0 0 30 30" className="flex-shrink-0">
                <rect x="5" y="5" width="20" height="20" rx="4" className={`${colors} stroke-2`} />
                {isMissing && (
                    <>
                        <line x1="5" y1="5" x2="25" y2="25" className="stroke-white stroke-2" />
                        <line x1="25" y1="5" x2="5" y2="25" className="stroke-white stroke-2" />
                    </>
                )}
            </svg>
            {/* Numeração do dente */}
            <span className="text-sm font-semibold text-gray-700 mt-1">{id}</span>
        </div>
    );
});

/**
 * Odontograma completo (Apenas Dentes Permanentes)
 */
const Odontogram = ({ odontogramState, onConditionChange }) => {
    // Filtra e ordena os dentes para renderização (Maxilar Superior/Inferior, Direita/Esquerda)
    const renderTeeth = useCallback((quadrants, isTop) => (
        <div className={`flex justify-center w-full ${isTop ? 'flex-col' : 'flex-col-reverse'}`}>
            <div className="flex justify-center">
                {permanentTeeth
                    .filter(t => t.quadrant === quadrants[0])
                    .reverse() // Inverte para começar do 8
                    .map(t => (
                        <Tooth key={t.id} id={t.id} condition={odontogramState[t.id]} onConditionChange={onConditionChange} />
                    ))}
                {permanentTeeth
                    .filter(t => t.quadrant === quadrants[1])
                    .map(t => (
                        <Tooth key={t.id} id={t.id} condition={odontogramState[t.id]} onConditionChange={onConditionChange} />
                    ))}
            </div>
        </div>
    ), [odontogramState, onConditionChange]);

    return (
        <div className="w-full">
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2 mt-4 px-2">
                <span>MAXILAR SUPERIOR</span>
            </div>
            {/* Quadrante Superior (10s e 20s) */}
            {renderTeeth(['SUP DIR', 'SUP ESQ'], true)}

            {/* Linha Central */}
            <div className="h-0.5 bg-gray-300 my-2 w-full"></div>

            {/* Quadrante Inferior (40s e 30s) */}
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2 mt-4 px-2">
                <span>MAXILAR INFERIOR</span>
            </div>
            {renderTeeth(['INF DIR', 'INF ESQ'], false)}

            {/* Legenda */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Legenda Odontograma</h4>
                <div className="flex flex-wrap gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border border-gray-400 rounded-sm"></div> Saudável</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-sm"></div> Cárie / Patologia</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-sm"></div> Restaurado / Tratado</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center"><div className="h-0.5 w-3 bg-white rotate-45"></div><div className="h-0.5 w-3 bg-white -rotate-45 absolute"></div></div> Ausente</div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

    const AnamneseOdontograma = () => {
    // 1. MUDANÇA: Pegamos o consultaId da URL, não o idPaciente
    const { consultaId } = useParams();

    // 2. MUDANÇA: Estado inicial preparado para receber dados da consulta
    const [anamnese, setAnamnese] = useState({
        pacienteId: "", 
        pacienteNome: "Carregando...",
        indicador: "",
        alergia: { resposta: "Não", notas: "" },
        antibiotico: { resposta: "Não", notas: "" },
        anestesico: { resposta: "Não", notas: "" },
        sensibilidade: { resposta: "Não", notas: "" },
        pressao: { resposta: "Não", notas: "" },
        medicamento: { resposta: "Não", notas: "" },
        problemaSaude: { resposta: "Não", notas: "" },
        observacoes: "",
        planoTratamento: "",
    });

    const initialOdontogramState = useMemo(() => {
        return permanentTeeth.reduce((acc, tooth) => {
            acc[tooth.id] = 'healthy';
            return acc;
        }, {});
    }, []);

    const [odontogramState, setOdontogramState] = useState(initialOdontogramState);

    useEffect(() => {
        if (!consultaId) return;

        async function carregarDadosCompletos() {
            try {
                const resConsulta = await buscarConsultaPorId(consultaId);
                
                const consulta = Array.isArray(resConsulta.data) ? resConsulta.data[0] : resConsulta.data;

                console.log("Consulta carregada:", consulta);

                let nomePaciente = "Paciente não identificado";

                if (consulta.pacienteId) {
                    try {
                        const resPaciente = await buscarPacientePorId(consulta.pacienteId);
                        nomePaciente = resPaciente.data.nome;
                    } catch (err) {
                        console.error("Erro ao buscar detalhes do paciente:", err);
                    }
                }

                setAnamnese((prev) => ({
                    ...prev,
                    pacienteId: consulta.pacienteId,
                    pacienteNome: nomePaciente,
                    
                    observacoes: consulta.observacao || prev.observacoes,
                    
                    planoTratamento: consulta.prontuario?.planoTratamento || prev.planoTratamento,
                }));

                if (consulta.prontuario && consulta.prontuario.odontogramaJson) {
                     try {
                        setOdontogramState(JSON.parse(consulta.prontuario.odontogramaJson));
                     } catch (e) {
                        console.error("Erro ao ler odontograma salvo", e);
                     }
                }

            } catch (error) {
                console.error("Erro geral ao carregar dados:", error);
                alert("Erro ao carregar os dados do atendimento.");
            }
        }

        carregarDadosCompletos();
    }, [consultaId]);

    const handleAnamneseChange = (e) => {
        const { name, value } = e.target;
        const parts = name.split('.');

        if (parts.length === 2) {
            setAnamnese(prev => ({
                ...prev,
                [parts[0]]: {
                    ...prev[parts[0]],
                    [parts[1]]: value,
                },
            }));
        } else {
            // Campo simples
            setAnamnese(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleOdontogramChange = useCallback((toothId, newCondition) => {
        setOdontogramState(prev => ({
            ...prev,
            [toothId]: newCondition,
        }));
    }, []);

    // 5. MUDANÇA: handleSubmit enviando o consultaId correto
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!consultaId) {
            alert("Erro: ID da consulta não encontrado.");
            return;
        }

        try {
            const payload = {
                alergiaResposta: anamnese.alergia.resposta,
                alergiaNotas: anamnese.alergia.notas,
                antibioticoResposta: anamnese.antibiotico.resposta,
                antibioticoNotas: anamnese.antibiotico.notas,
                anestesicoResposta: anamnese.anestesico.resposta,
                anestesicoNotas: anamnese.anestesico.notas,
                sensibilidadeResposta: anamnese.sensibilidade.resposta,
                sensibilidadeNotas: anamnese.sensibilidade.notas,
                pressaoResposta: anamnese.pressao.resposta,
                pressaoNotas: anamnese.pressao.notas,
                medicamentoResposta: anamnese.medicamento.resposta,
                medicamentoNotas: anamnese.medicamento.notas,
                problemaSaudeResposta: anamnese.problemaSaude.resposta,
                problemaSaudeNotas: anamnese.problemaSaude.notas,
                observacoes: anamnese.observacoes,
                planoTratamento: anamnese.planoTratamento,
                odontogramaJson: JSON.stringify(odontogramState),
            };

            await salvarProntuario(payload, consultaId);

            alert("Anamnese registrada com sucesso!");

        } catch (error) {
            console.error(error);
            alert("Erro ao salvar o prontuário.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 font-sans">
            <div className="w-full max-w-5xl bg-white shadow-2xl rounded-xl p-6 sm:p-10">
                <header className="text-center mb-8 pb-4 border-b-2 border-blue-500">
                    <ClipboardList className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                    <h1 className="text-3xl font-extrabold text-gray-800">Ficha de Anamnese e Exame Clínico</h1>
                    <p className="text-gray-600 mt-2">Prontuário do Paciente: <span className="font-semibold">{anamnese.pacienteNome}</span></p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* 1. INFORMAÇÕES BÁSICAS DO ATENDIMENTO */}
                    <section className="p-6 border border-gray-200 rounded-xl shadow-sm bg-blue-50/50 space-y-4">
                        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                            <FileText className="w-6 h-6" /> Dados do Atendimento
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                                {/* Aqui o InputIcon não precisa de ícone, ajustado para manter o estilo */}
                                <InputIcon 
                                    icon={() => null} // Ícone vazio, remove o espaço
                                    type="text" 
                                    name="pacienteNome" 
                                    value={anamnese.pacienteNome} 
                                    disabled 
                                    placeholder="Busque pelo paciente..." 
                                    className="!pl-3 !pr-3 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Indicado por</label>
                                <InputIcon 
                                    icon={() => null} // Ícone vazio, remove o espaço
                                    type="text" 
                                    name="indicador" 
                                    value={anamnese.indicador} 
                                    onChange={handleAnamneseChange} 
                                    placeholder="Nome ou convênio" 
                                    className="!pl-3 !pr-3"
                                />
                            </div>
                        </div>
                    </section>


                    {/* 2. ANAMNESE (HISTÓRICO MÉDICO) */}
                    <section className="p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4">
                            <Stethoscope className="w-6 h-6 text-red-500" /> Histórico Médico e Alergias
                        </h2>
                        
                        <RadioQuestion 
                            name="alergia" 
                            question="Tem alergia a algum medicamento?" 
                            value={anamnese.alergia} 
                            onChange={handleAnamneseChange} 
                            Icon={AlertTriangle}
                            notesPlaceholder="Qual/Quais? (Ex: Penicilina, Látex)"
                        />
                        <RadioQuestion 
                            name="antibiotico" 
                            question="Tem alergia a Antibiótico?" 
                            value={anamnese.antibiotico} 
                            onChange={handleAnamneseChange} 
                            Icon={Pill}
                        />
                        <RadioQuestion 
                            name="anestesico" 
                            question="Tem alergia a Anestésico? Qual(is)?" 
                            value={anamnese.anestesico} 
                            onChange={handleAnamneseChange} 
                            Icon={Pill}
                        />
                        <RadioQuestion 
                            name="sensibilidade" 
                            question="Sensibilidade a algum medicamento?" 
                            value={anamnese.sensibilidade} 
                            onChange={handleAnamneseChange} 
                            Icon={Pill}
                        />
                        <RadioQuestion 
                            name="pressao" 
                            question="Sua pressão sanguínea é alta?" 
                            value={anamnese.pressao} 
                            onChange={handleAnamneseChange} 
                            Icon={Heart}
                        />
                        <RadioQuestion 
                            name="medicamento" 
                            question="Está tomando algum medicamento?" 
                            value={anamnese.medicamento} 
                            onChange={handleAnamneseChange} 
                            Icon={Pill}
                            notesPlaceholder="Qual/Quais?"
                        />
                        <RadioQuestion 
                            name="problemaSaude" 
                            question="Tem algum problema de saúde? Qual?" 
                            value={anamnese.problemaSaude} 
                            onChange={handleAnamneseChange} 
                            Icon={Heart}
                        />
                    </section>
                    
                    {/* 3. ODONTOGRAMA */}
                    <section className="p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tooth text-blue-500"><path d="M22 4s-2 10-6 16c-1.5 1-3 1-4 0-4-6-6-16-6-16-1.5 5.5-2.5 9.5-1 11.5 1.5 2 7 2.5 7 2.5 0 0 5.5-.5 7-2.5 1.5-2 0.5-6 1-11.5z"/></svg> 
                            Odontograma (Dentição Permanente)
                        </h2>
                        
                        {/* Componente Odontograma */}
                        <Odontogram 
                            odontogramState={odontogramState}
                            onConditionChange={handleOdontogramChange} 
                        />
                    </section>

                    {/* 4. OBSERVAÇÕES E PLANO DE TRATAMENTO */}
                    <section className="p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4">
                            <MessageSquare className="w-6 h-6 text-orange-500" /> Observações e Plano de Tratamento
                        </h2>
                        
                        <div>
                            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">Observações Gerais</label>
                            <textarea
                                id="observacoes"
                                name="observacoes"
                                value={anamnese.observacoes}
                                onChange={handleAnamneseChange}
                                placeholder="Anotações relevantes sobre a saúde geral do paciente, queixas principais, etc."
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="planoTratamento" className="block text-sm font-medium text-gray-700 mb-1">Plano de Tratamento</label>
                            <textarea
                                id="planoTratamento"
                                name="planoTratamento"
                                value={anamnese.planoTratamento}
                                onChange={handleAnamneseChange}
                                placeholder="Descreva o plano de tratamento detalhado, incluindo procedimentos, etapas e custos."
                                rows="6"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </section>


                    {/* BOTÃO SALVAR */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-3 bg-green-600 hover:bg-green-700 transition duration-200 text-white font-semibold rounded-lg shadow-lg shadow-green-500/30"
                        >
                            Salvar Anamnese
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AnamneseOdontograma;