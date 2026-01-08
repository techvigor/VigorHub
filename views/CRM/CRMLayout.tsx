
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Layout, 
  Plus, 
  Search, 
  MoreVertical,
  Calendar,
  DollarSign
} from 'lucide-react';
import { mockPropostas } from '../../mockData';

const CRMLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const NavLink = ({ to, label, icon: Icon }: { to: string, label: string, icon: any }) => {
    const active = currentPath === `/crm${to}` || (to === '' && currentPath === '/crm');
    return (
      <Link 
        to={`/crm${to}`}
        className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
          active ? 'border-secondary text-secondary' : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        <Icon size={16} />
        {label}
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex gap-4">
          <NavLink to="" label="Lista de Propostas" icon={Users} />
          <NavLink to="/kanban" label="Visualizar Kanban" icon={Layout} />
        </div>
        <button className="mb-2 flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary/90 shadow-sm">
          <Plus size={16} /> Nova Proposta
        </button>
      </div>

      <Routes>
        <Route index element={<PropostasList />} />
        <Route path="kanban" element={<KanbanBoard />} />
      </Routes>
    </div>
  );
};

const PropostasList = () => {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente ou vendedor..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-secondary/50"
          />
        </div>
        <select className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-4 py-2 focus:outline-none">
          <option>Todos os Status</option>
          <option>Proposta Feita</option>
          <option>Em Análise</option>
          <option>Aprovado</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Valor Estimado</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Criado em</th>
              <th className="px-6 py-4">Validade</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockPropostas.map(proposta => (
              <tr key={proposta.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-semibold text-gray-900">{proposta.cliente_nome}</td>
                <td className="px-6 py-4 text-sm text-gray-600">R$ {proposta.valor_estimado?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-secondary/10 text-secondary`}>
                    {proposta.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{new Date(proposta.data_criacao).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{new Date(proposta.data_validade).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const columns = [
    { id: 'proposta_feita', label: 'Proposta Feita' },
    { id: 'contrato_enviado', label: 'Contrato Enviado' },
    { id: 'contrato_analise', label: 'Em Análise' },
    { id: 'contrato_aprovado', label: 'Aprovado' },
  ];

  return (
    <div className="animate-fade-in flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-280px)]">
      {columns.map(col => (
        <div key={col.id} className="shrink-0 w-80 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-poppins font-bold text-gray-700 flex items-center gap-2">
              {col.label}
              <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                {mockPropostas.filter(p => p.status === col.id).length}
              </span>
            </h3>
          </div>
          <div className="flex-1 bg-gray-100/50 rounded-2xl p-4 space-y-4 border border-gray-100 overflow-y-auto">
            {mockPropostas.filter(p => p.status === col.id).map(proposta => (
              <div key={proposta.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-secondary transition-all cursor-move">
                <h4 className="font-bold text-gray-900 mb-2">{proposta.cliente_nome}</h4>
                <div className="space-y-2">
                   <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <DollarSign size={14} className="text-success" />
                    R$ {proposta.valor_estimado?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={14} className="text-gray-400" />
                    Criado: {new Date(proposta.data_criacao).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {mockPropostas.filter(p => p.status === col.id).length === 0 && (
              <div className="h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                Nenhum card aqui
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CRMLayout;
