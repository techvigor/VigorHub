
import React, { useState } from 'react';
import {
  CheckSquare,
  List,
  Layout as KanbanIcon,
  Table as TableIcon,
  Plus,
  Clock,
  AlertCircle,
  MoreVertical,
  Flag
} from 'lucide-react';
import { api } from '../../src/services/api';

const TarefasView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'table'>('list');
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    api.tarefas.list().then(setTarefas).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando tarefas...</div>;

  const priorityColor = (p: string) => {
    switch (p) {
      case 'alta': return 'text-error';
      case 'media': return 'text-warning';
      case 'baixa': return 'text-success';
      default: return 'text-gray-400';
    }
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case 'a_iniciar': return 'bg-gray-100 text-gray-500';
      case 'em_andamento': return 'bg-info/10 text-info';
      case 'aguardando': return 'bg-warning/10 text-warning';
      case 'concluido': return 'bg-success/10 text-success';
      case 'cancelado': return 'bg-error/10 text-error';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-poppins font-bold">Tarefas</h1>
          <p className="text-gray-500 text-sm">Gerencie suas atividades diárias e acompanhe o progresso.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-gray-100 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <KanbanIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-gray-100 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <TableIcon size={18} />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 shadow-sm">
            <Plus size={16} /> Nova Tarefa
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="space-y-4">
          {tarefas.map(tarefa => (
            <div key={tarefa.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-all group">
              <div className="mt-1">
                <div className={`w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors ${tarefa.status === 'concluido' ? 'bg-primary border-primary' : ''}`}>
                  {tarefa.status === 'concluido' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-bold text-gray-900 ${tarefa.status === 'concluido' ? 'line-through text-gray-400' : ''}`}>
                      {tarefa.titulo}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-2xl">{tarefa.descricao}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-4 text-[11px] font-bold uppercase tracking-wider">
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${statusBadge(tarefa.status)}`}>
                    {tarefa.status.replace('_', ' ')}
                  </div>
                  <div className={`flex items-center gap-1 ${priorityColor(tarefa.prioridade)}`}>
                    <Flag size={12} fill="currentColor" />
                    {tarefa.prioridade}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 font-medium">
                    <Clock size={12} />
                    {new Date(tarefa.vencimento).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode !== 'list' && (
        <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-poppins font-bold text-gray-400">Modo de visualização "{viewMode}" em desenvolvimento</h3>
          <p className="text-sm text-gray-400 mt-1">Por favor, utilize o modo Lista por enquanto.</p>
        </div>
      )}
    </div>
  );
};

export default TarefasView;
