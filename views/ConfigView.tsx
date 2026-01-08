
import React from 'react';
import { 
  User, 
  Shield, 
  Database, 
  Link as LinkIcon, 
  Bell, 
  Smartphone,
  CreditCard,
  ChevronRight
} from 'lucide-react';

const ConfigView: React.FC = () => {
  const sections = [
    { title: 'Conta & Perfil', desc: 'Gerencie suas informações pessoais e segurança.', icon: User, color: 'text-blue-500' },
    { title: 'Usuários e Permissões', desc: 'Gerencie quem tem acesso à plataforma.', icon: Shield, color: 'text-purple-500' },
    { title: 'APIs e Webhooks', desc: 'Configure integrações com sistemas externos.', icon: LinkIcon, color: 'text-green-500' },
    { title: 'Planos e Descontos', desc: 'Configurações globais de cálculo financeiro.', icon: CreditCard, color: 'text-secondary' },
    { title: 'Notificações', desc: 'Personalize como você recebe alertas.', icon: Bell, color: 'text-orange-500' },
    { title: 'Banco de Dados', desc: 'Visualizar logs e integridade de dados.', icon: Database, color: 'text-red-500' },
  ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-poppins font-bold">Configurações</h1>
        <p className="text-gray-500">Ajuste as preferências da plataforma VigorHub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((item, i) => (
          <button 
            key={i} 
            className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all text-left group"
          >
            <div className={`w-12 h-12 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-tight mt-1">{item.desc}</p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-primary" size={20} />
          </button>
        ))}
      </div>

      <div className="bg-primary/5 rounded-3xl p-8 flex items-center justify-between border border-primary/10">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
            <Smartphone size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">App VigorHub Mobile</h3>
            <p className="text-gray-600 text-sm max-w-md">Em breve, gerencie faturas e leads diretamente do seu smartphone com notificações em tempo real.</p>
          </div>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg">
          Notificar Lançamento
        </button>
      </div>
    </div>
  );
};

export default ConfigView;
