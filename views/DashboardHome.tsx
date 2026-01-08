
import React from 'react';
import {
  Users,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  Calendar,
  Zap,
  Clock,
  ExternalLink,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../src/services/api';

const DashboardHome: React.FC = () => {
  const [propostas, setPropostas] = React.useState<any[]>([]);
  const [tarefas, setTarefas] = React.useState<any[]>([]);
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [propostasData, tarefasData, userData] = await Promise.all([
          api.propostas.list(),
          api.tarefas.list(),
          api.auth.getUser()
        ]);
        setPropostas(propostasData);
        setTarefas(tarefasData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando dashboard...</div>;

  // Logic 1: Count propostas where status IN ('proposta_feita', 'contrato_enviado')
  const openProposalsCount = propostas.filter(p =>
    ['proposta_feita', 'contrato_enviado'].includes(p.status)
  ).length;

  // Logic 2: Count tasks not concluded or canceled
  const activeTasks = tarefas.filter(t => !['concluido', 'cancelado'].includes(t.status));
  const activeTasksCount = activeTasks.length;

  // Logic 3: Tasks due within 7 days
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const urgentTasksCount = activeTasks.filter(t => {
    const dueDate = new Date(t.vencimento);
    return dueDate <= nextWeek;
  }).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-poppins font-bold text-gray-900">
          Bem-vindo, {user?.full_name?.split(' ')[0] || 'Gestor'} 👋
        </h1>
        <p className="text-gray-500">Confira o que está acontecendo nas operações da Vigor hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - CRM Resumo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-success flex items-center gap-1">
              <TrendingUp size={14} /> +12%
            </span>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Negociações Ativas</h3>
            <p className="text-4xl font-montserrat font-bold text-gray-900 mt-1">{openProposalsCount}</p>
            <p className="text-sm text-gray-400 mt-2">Propostas enviadas ou em análise.</p>
          </div>
          <Link
            to="/crm"
            className="mt-4 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 font-semibold py-2 rounded-xl group-hover:bg-secondary group-hover:text-white transition-all"
          >
            Ir para negociações <ArrowRight size={18} />
          </Link>
        </div>

        {/* Card 2 - Tarefas Resumo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <CheckSquare size={24} />
            </div>
            {urgentTasksCount > 0 && (
              <span className="px-2 py-1 bg-error/10 text-error text-[10px] font-bold rounded-full animate-pulse">
                {urgentTasksCount} URGENTE(S)
              </span>
            )}
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Minhas Tarefas</h3>
            <p className="text-4xl font-montserrat font-bold text-gray-900 mt-1">{activeTasksCount}</p>
            <p className="text-sm text-gray-400 mt-2">Tarefas pendentes sob sua responsabilidade.</p>
          </div>
          <Link
            to="/tarefas"
            className="mt-4 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 font-semibold py-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all"
          >
            Ir para tarefas <ArrowRight size={18} />
          </Link>
        </div>

        {/* Card 3 - Financeiro Resumo */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-info/10 rounded-xl text-info">
              <Zap size={24} />
            </div>
            <span className="text-xs font-bold text-gray-400">Out/23</span>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium">Economia Gerada</h3>
            <p className="text-4xl font-montserrat font-bold text-gray-900 mt-1">R$ 4.250</p>
            <p className="text-sm text-gray-400 mt-2">Total de descontos aplicados este mês.</p>
          </div>
          <Link
            to="/financeiro"
            className="mt-4 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 font-semibold py-2 rounded-xl group-hover:bg-info group-hover:text-white transition-all"
          >
            Dashboard Financeiro <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-poppins font-bold text-gray-900">Atividades Recentes</h2>
            <button className="text-sm text-primary font-semibold hover:underline">Ver todas</button>
          </div>
          <div className="space-y-6">
            {[
              { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', text: 'Boleto gerado para João Silva Me', time: '2 horas atrás' },
              { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'Nova fatura importada: UC 123456', time: '5 horas atrás' },
              { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', text: 'Tarefa "Ligar lead" está próxima do vencimento', time: '1 dia atrás' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className={`shrink-0 w-10 h-10 ${activity.bg} ${activity.color} rounded-full flex items-center justify-center`}>
                  <activity.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-poppins font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group/btn">
              <Zap className="text-primary mb-2" />
              <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-primary transition-colors">Calcular Boleto</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-secondary/50 hover:bg-secondary/5 transition-all text-center group/btn">
              <Users className="text-secondary mb-2" />
              <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-secondary transition-colors">Nova Proposta</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-info/50 hover:bg-info/5 transition-all text-center group/btn">
              <Calendar className="text-info mb-2" />
              <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-info transition-colors">Agendar Tarefa</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-100 transition-all text-center group/btn">
              <ExternalLink className="text-gray-500 mb-2" />
              <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-gray-900 transition-colors">Exportar Relatório</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
