
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  DollarSign,
  Users,
  CheckSquare,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  FileText,
  PieChart,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import ProtectedRoute from './src/components/ProtectedRoute';
import LoginView from './views/LoginView';
import { currentUser } from './mockData';
import DashboardHome from './views/DashboardHome';
import FinanceiroLayout from './views/Financeiro/FinanceiroLayout';
import CRMLayout from './views/CRM/CRMLayout';
import TarefasView from './views/Tarefas/TarefasView';
import ConfigView from './views/ConfigView';

const SidebarItem = ({
  to,
  icon: Icon,
  label,
  collapsed,
  active
}: {
  to: string,
  icon: any,
  label: string,
  collapsed: boolean,
  active: boolean
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
        ? 'bg-primary text-white shadow-md'
        : 'text-gray-500 hover:bg-primary/10 hover:text-primary'
        }`}
    >
      <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-primary'} />
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

// Fixed: Added optional children to the props type to resolve the 'missing children' error in some TypeScript environments
const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user, profile } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile
  const location = useLocation();

  const isPathActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 lg:relative ${collapsed ? 'w-20' : 'w-64'
          } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 flex items-center justify-between overflow-hidden">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-primary font-poppins font-bold text-xl tracking-tight">VigorHub</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">V</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} active={isPathActive('/')} />
          <SidebarItem to="/crm" icon={Users} label="CRM / Vendas" collapsed={collapsed} active={isPathActive('/crm')} />
          <SidebarItem to="/tarefas" icon={CheckSquare} label="Tarefas" collapsed={collapsed} active={isPathActive('/tarefas')} />
          <SidebarItem to="/financeiro" icon={DollarSign} label="Financeiro" collapsed={collapsed} active={isPathActive('/financeiro')} />

          <div className="pt-2 mt-2 border-t border-gray-100">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {!collapsed ? 'Configurações' : 'Config'}
            </div>
            <SidebarItem to="/config/profile" icon={Users} label="Conta & Perfil" collapsed={collapsed} active={isPathActive('/config/profile')} />
            <SidebarItem to="/config/users" icon={Settings} label="Usuários e Permissões" collapsed={collapsed} active={isPathActive('/config/users')} />
            <SidebarItem to="/config/notifications" icon={Bell} label="Notificações" collapsed={collapsed} active={isPathActive('/config/notifications')} />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded hover:bg-gray-50 text-gray-500"
          >
            {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span className="text-sm font-medium">Recolher Menu</span></div>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden h-screen w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 lg:px-8 flex items-center justify-between shrink-0 gap-4">
          <button
            className="lg:hidden text-gray-500 hover:text-primary"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-100 flex-1 max-w-md">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="bg-transparent border-none outline-none ml-2 text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">2</span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 leading-none">{profile?.full_name || user?.email}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{profile?.job_title || profile?.role || 'Usuário'}</p>
              </div>
              <img
                src={profile?.avatar_url || 'https://via.placeholder.com/40'}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 object-cover"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')}
              />
            </div>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-8 animate-fade-in scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

// Imports fixed to include Auth components
// import { AuthProvider } from './src/contexts/AuthContext';
// import ProtectedRoute from './src/components/ProtectedRoute';
// import LoginView from './views/LoginView';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/financeiro/*" element={<FinanceiroLayout />} />
                    <Route path="/crm/*" element={<CRMLayout />} />
                    <Route path="/tarefas" element={<TarefasView />} />
                    <Route path="/config/*" element={<ConfigView />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
