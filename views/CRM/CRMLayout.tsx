
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
import { api } from '../../src/services/api';

const CRMLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const NavLink = ({ to, label, icon: Icon }: { to: string, label: string, icon: any }) => {
    const active = currentPath === `/crm${to}` || (to === '' && currentPath === '/crm');
    return (
      <Link
        to={`/crm${to}`}
        className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${active ? 'border-secondary text-secondary' : 'border-transparent text-gray-500 hover:text-gray-700'
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
  const [propostas, setPropostas] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  React.useEffect(() => {
    api.propostas.list().then(setPropostas).finally(() => setLoading(false));
  }, []);

  const filteredPropostas = propostas.filter(p => {
    const matchesSearch = p.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div>Carregando propostas...</div>;
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="proposta_feita">Proposta Feita</option>
          <option value="negoc_avancada">Negociação Avançada</option>
          <option value="fechado">Fechado</option>
        </select>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
          <Plus size={20} /> Nova Proposta
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Valor Estimado</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Data Criação</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Validade</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPropostas.map(proposta => (
                <tr key={proposta.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{proposta.cliente_nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">R$ {Number(proposta.valor_estimado || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${proposta.status === 'fechado' ? 'bg-success/10 text-success' :
                        proposta.status === 'perdido' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                      }`}>
                      {proposta.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(proposta.data_criacao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(proposta.data_validade).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-primary p-2">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const [propostas, setPropostas] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.propostas.list().then(setPropostas).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando kanban...</div>;
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
                {propostas.filter(p => p.status === col.id).length}
              </span>
            </h3>
          </div>
          <div className="flex-1 bg-gray-100/50 rounded-2xl p-4 space-y-4 border border-gray-100 overflow-y-auto">
            {propostas.filter(p => p.status === col.id).map(proposta => (
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
            {propostas.filter(p => p.status === col.id).length === 0 && (
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
