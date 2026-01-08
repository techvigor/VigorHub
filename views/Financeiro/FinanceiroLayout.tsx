
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Receipt,
  Plus,
  Filter,
  Download,
  ChevronDown,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  // Fixed: Added missing imports Calendar and PieChart
  Calendar,
  PieChart
} from 'lucide-react';
import { api } from '../../src/services/api';

const FinanceiroLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const NavLink = ({ to, label, icon: Icon }: { to: string, label: string, icon: any }) => {
    const active = currentPath === `/financeiro${to}` || (to === '' && currentPath === '/financeiro');
    return (
      <Link
        to={`/financeiro${to}`}
        className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${active ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
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
          <NavLink to="" label="Dashboard" icon={BarChart3} />
          <NavLink to="/faturas" label="Faturas Concessionária" icon={FileText} />
          <NavLink to="/boletos" label="Boletos Vigor" icon={Receipt} />
        </div>
      </div>

      <Routes>
        <Route index element={<FinanceiroDashboard />} />
        <Route path="faturas" element={<FaturasList />} />
        <Route path="boletos" element={<BoletosList />} />
      </Routes>
    </div>
  );
};

const FinanceiroDashboard = () => {
  const [faturas, setFaturas] = useState<any[]>([]);
  const [boletos, setBoletos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    Promise.all([api.faturas.list(), api.boletos.list()])
      .then(([f, b]) => {
        setFaturas(f);
        setBoletos(b);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando resumo...</div>;
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-poppins font-bold">Resumo Financeiro</h2>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium">
          <Calendar className="text-gray-400" size={16} />
          Outubro / 2023
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Faturas</p>
          <p className="text-2xl font-montserrat font-bold mt-1 text-gray-900">{faturas.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Boletos Pendentes</p>
          <p className="text-2xl font-montserrat font-bold mt-1 text-warning">
            {boletos.filter(b => b.status !== 'pago').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Emitido</p>
          <p className="text-2xl font-montserrat font-bold mt-1 text-primary">R$ {boletos.reduce((acc, b) => acc + (Number(b.valor_total) || 0), 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Economia Total</p>
          <p className="text-2xl font-montserrat font-bold mt-1 text-success">R$ 930,00</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
        <PieChart size={48} className="mb-4 opacity-20" />
        <p className="font-medium text-lg">Gráficos de Desempenho em breve</p>
        <p className="text-sm">Visualize a distribuição de receitas e economia por cliente.</p>
      </div>
    </div>
  );
};

const FaturasList = () => {
  const [faturas, setFaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    api.faturas.list().then(setFaturas).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando faturas...</div>;
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-poppins font-bold">Faturas da Concessionária</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50">
            <Filter size={16} /> Filtros
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">
            <Plus size={16} /> Importar XML/PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Cliente / UC</th>
              <th className="px-6 py-4">Ref / Vencimento</th>
              <th className="px-6 py-4">Valor Distrib.</th>
              <th className="px-6 py-4">Economia GD</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {faturas.map(fatura => (
              <tr key={fatura.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{fatura.cliente_nome}</p>
                  <p className="text-xs text-gray-400">UC: {fatura.uc_codigo}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{fatura.mes_referencia}</p>
                  <p className="text-xs text-gray-400">Vence: {fatura.data_vencimento ? new Date(fatura.data_vencimento).toLocaleDateString('pt-BR') : '-'}</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium">R$ {Number(fatura.valor_fatura_distribuidora || 0).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm font-semibold text-success">R$ {Number(fatura.valor_economia_gd || 0).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${fatura.status_boleto_vigor === 'processada' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                    {fatura.status_boleto_vigor}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-colors" title="Calcular Boleto">
                      <Receipt size={18} />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-1.5 hover:bg-error/10 rounded-lg text-error transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BoletosList = () => {
  const [boletos, setBoletos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    api.boletos.list().then(setBoletos).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando boletos...</div>;
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-poppins font-bold">Boletos Vigor</h2>
        <button className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50">
          <Download size={16} /> Exportar Lista
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Boleto / Ref</th>
              <th className="px-6 py-4">Vencimento</th>
              <th className="px-6 py-4">Valor Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {boletos.map(boleto => (
              <tr key={boleto.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">BOLETO #{String(boleto.id).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">Emissão: {boleto.data_emissao ? new Date(boleto.data_emissao).toLocaleDateString('pt-BR') : '-'}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {boleto.data_vencimento ? new Date(boleto.data_vencimento).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">R$ {Number(boleto.valor_total || 0).toFixed(2)}</p>
                  <p className="text-[10px] text-success">Desconto: R$ {Number(boleto.valor_desconto || 0).toFixed(2)}</p>
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit ${boleto.status === 'pago' ? 'bg-success/10 text-success' :
                    boleto.status === 'emitido' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'
                    }`}>
                    {boleto.status === 'pago' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    <span className="text-[10px] font-bold uppercase">{boleto.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-primary text-xs font-bold hover:underline">Ver PDF Fatura</button>
                    <button className="p-2 bg-primary/5 text-primary rounded hover:bg-primary/10 transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceiroLayout;
