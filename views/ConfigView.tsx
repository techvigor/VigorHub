import React from 'react';
import { Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';
import {
  User,
  Shield,
  Database,
  Link as LinkIcon,
  Bell,
  Smartphone,
  CreditCard,
  ChevronRight,
  Settings
} from 'lucide-react';
import ProfileSettings from './Config/ProfileSettings';
import UserManagement from './Config/UserManagement';

const ConfigView: React.FC = () => {
  return (
    <div className="flex h-full gap-8 animate-fade-in text-left">
      {/* Sidebar */}
      <div className="w-64 shrink-0 space-y-2">
        <h2 className="text-xl font-bold font-poppins mb-6 px-4">Configurações</h2>
        <ConfigLink to="/config/profile" icon={User} label="Conta & Perfil" />
        <ConfigLink to="/config/users" icon={Shield} label="Usuários e Permissões" />
        <div className="h-px bg-gray-100 my-2 mx-4"></div>
        <ConfigLink to="/config/apis" icon={LinkIcon} label="APIs e Webhooks" />
        <ConfigLink to="/config/plans" icon={CreditCard} label="Planos e Descontos" />
        <ConfigLink to="/config/notifications" icon={Bell} label="Notificações" />
      </div>

      {/* Content Area */}
      <div className="flex-1 max-w-4xl">
        <Routes>
          <Route index element={<ConfigOverview />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
};

const ConfigLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/config' && location.pathname === '/config');

  // Quick fix for overview highlighting if specific path
  const activeClass = isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50';

  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeClass}`}>
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </Link>
  );
}

const ConfigOverview = () => {
  const sections = [
    { title: 'Conta & Perfil', desc: 'Gerencie suas informações pessoais e segurança.', icon: User, color: 'text-blue-500', to: '/config/profile' },
    { title: 'Usuários e Permissões', desc: 'Gerencie quem tem acesso à plataforma.', icon: Shield, color: 'text-purple-500', to: '/config/users' },
    { title: 'APIs e Webhooks', desc: 'Configure integrações com sistemas externos.', icon: LinkIcon, color: 'text-green-500', to: '/config/apis' },
    { title: 'Planos e Descontos', desc: 'Configurações globais de cálculo financeiro.', icon: CreditCard, color: 'text-secondary', to: '/config/plans' },
    { title: 'Notificações', desc: 'Personalize como você recebe alertas.', icon: Bell, color: 'text-orange-500', to: '/config/notifications' },
    { title: 'Banco de Dados', desc: 'Visualizar logs e integridade de dados.', icon: Database, color: 'text-red-500', to: '/config/db' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((item, i) => (
          <Link
            key={i}
            to={item.to}
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
          </Link>
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
}

export default ConfigView;
