import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { listarPacientes } from "../../services/pacienteService";
import { listarDentistas } from "../../services/dentistaService";
import { Users, Calendar, UserCog, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const [pacientesCount, setPacientesCount] = useState(null);
  const [dentistasCount, setDentistasCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCounts = async () => {
      try {
        const [pRes, dRes] = await Promise.all([listarPacientes(), listarDentistas()]);
        
        if (!mounted) return;
        
        const getCount = (res) => {
          if (!res || typeof res !== 'object') return 0;
          const body = res.data;
          if (Array.isArray(body)) return body.length;
          if (body?.content && Array.isArray(body.content)) return body.content.length;
          if (Array.isArray(body?.data)) return body.data.length;
          if (typeof body?.totalElements === 'number') return body.totalElements;
          if (typeof body?.total === 'number') return body.total;
          if (typeof body?.length === 'number') return body.length;
          return 0;
        };

        setPacientesCount(getCount(pRes));
        setDentistasCount(getCount(dRes));
      } catch (err) {
        console.error('Erro ao buscar contagens:', err);
        if (!mounted) return;
        setError('Erro ao carregar dados');
      }
    };

    fetchCounts();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pacientes</p>
                <p className="text-2xl font-bold text-gray-800">{pacientesCount ?? "-"}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Consultas Hoje</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dentistas</p>
                <p className="text-2xl font-bold text-gray-800">{dentistasCount ?? "-"}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCog className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Taxa Ocupação</p>
                <p className="text-2xl font-bold text-gray-800">87%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;