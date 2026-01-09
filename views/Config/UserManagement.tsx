import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../../src/contexts/AuthContext';
import { api } from '../../src/services/api';
import { supabase } from '../../src/lib/supabase';
import { Profile, UserRole } from '../../types';
import { Shield, Search, MoreVertical, Loader2, Plus, X, User, Mail, Lock, Briefcase, Trash2, Ban, KeyRound, CheckCircle } from 'lucide-react';

const UserManagement = () => {
    const { profile } = useAuth();
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Actions Dropdown State
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Create User Modal State
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'vendedor' as UserRole,
        jobTitle: ''
    });

    useEffect(() => {
        loadUsers();

        // Close menu when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadUsers = async () => {
        try {
            const data = await api.auth.listProfiles();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        setUpdating(userId);
        try {
            await api.auth.updateProfile(userId, { role: newRole });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Erro ao atualizar permissão.');
        } finally {
            setUpdating(null);
        }
    };

    const handleAction = async (action: 'toggle_status' | 'delete_user' | 'reset_password', userId: string, userName?: string) => {
        setOpenMenuId(null); // Close menu

        if (action === 'delete_user' && !window.confirm(`Tem certeza que deseja EXCLUIR o usuário ${userName}? Essa ação é irreversível.`)) {
            return;
        }

        try {
            // Updated to handle 200 OK with success: false
            const { data, error } = await supabase.functions.invoke('manage-users', {
                body: { action, userId }
            });

            if (error) throw error;
            if (data && data.success === false) {
                throw new Error(data.error || 'Erro desconhecido no servidor');
            }

            if (action === 'delete_user') {
                setUsers(prev => prev.filter(u => u.id !== userId));
                alert('Usuário excluído com sucesso.');
            } else if (action === 'toggle_status') {
                setUsers(prev => prev.map(u => {
                    if (u.id === userId) {
                        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
                    }
                    return u;
                }));
            } else if (action === 'reset_password') {
                alert(`Email de redefinição de senha enviado para o usuário.`);
            }

        } catch (error: any) {
            console.error('Error performing action:', error);
            alert('Erro ao executar ação: ' + (error.message || 'Erro desconhecido'));
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { error } = await supabase.functions.invoke('create-user', {
                body: newUser
            });

            if (error) throw error;

            setShowModal(false);
            setNewUser({ fullName: '', email: '', password: '', role: 'vendedor', jobTitle: '' });
            alert('Usuário criado com sucesso! Ele já pode fazer login.');
            loadUsers(); // Refresh list
        } catch (error: any) {
            console.error('Error creating user:', error);
            alert('Erro ao criar usuário: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setCreating(false);
        }
    };

    if (profile?.role !== 'adm') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 rounded-2xl border border-red-100 animate-fade-in">
                <Shield size={48} className="text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-red-900 mb-2">Acesso Restrito</h2>
                <p className="text-red-700">Apenas administradores podem gerenciar usuários.</p>
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold font-poppins">Usuários e Permissões</h2>
                    <p className="text-sm text-gray-500">Gerencie o acesso à plataforma.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    Adicionar Usuário
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                <Search size={20} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por nome ou função..."
                    className="flex-1 outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Carregando usuários...</div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Função (Role)</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.avatar_url || 'https://via.placeholder.com/40'}
                                                alt="Avatar"
                                                className={`w-10 h-10 rounded-full border border-gray-200 object-cover ${user.status === 'inactive' ? 'grayscale opacity-50' : ''}`}
                                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')}
                                            />
                                            <div>
                                                <p className={`font-semibold ${user.status === 'inactive' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{user.full_name}</p>
                                                <p className="text-xs text-gray-500">{user.job_title || 'Sem cargo'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.status === 'inactive' ? (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                Inativo
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                Ativo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                            disabled={updating === user.id || user.id === profile?.id || user.status === 'inactive'}
                                            className={`px-3 py-1.5 rounded-lg text-sm border-none bg-opacity-10 font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${user.role === 'adm' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'gerente' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <option value="adm">ADM</option>
                                            <option value="gerente">Gerente</option>
                                            <option value="vendedor">Vendedor</option>
                                        </select>
                                        {updating === user.id && <Loader2 size={12} className="inline ml-2 animate-spin text-gray-400" />}
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === user.id ? null : user.id);
                                            }}
                                            className="text-gray-400 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openMenuId === user.id && (
                                            <div
                                                ref={menuRef}
                                                className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in overflow-hidden"
                                            >
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleAction('toggle_status', user.id)}
                                                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${user.status === 'inactive' ? 'text-green-600' : 'text-orange-600'}`}
                                                    >
                                                        {user.status === 'inactive' ? <CheckCircle size={16} /> : <Ban size={16} />}
                                                        {user.status === 'inactive' ? 'Ativar Usuário' : 'Inativar Usuário'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('reset_password', user.id)}
                                                        className="w-full text-left px-4 py-3 text-sm text-blue-600 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <KeyRound size={16} />
                                                        Redefinir Senha
                                                    </button>
                                                    <hr className="border-gray-50" />
                                                    <button
                                                        onClick={() => handleAction('delete_user', user.id, user.full_name)}
                                                        className="w-full text-left px-4 py-3 text-sm text-red-600 flex items-center gap-2 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                        Excluir Usuário
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create User Modal */}
            {showModal && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">Novo Usuário</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Ex: Ana Silva"
                                        value={newUser.fullName}
                                        onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email Corporativo</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        required
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="nome@vigorenergy.com.br"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Cargo / Função</label>
                                <div className="relative">
                                    <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Ex: Gerente Comercial"
                                        value={newUser.jobTitle}
                                        onChange={e => setNewUser({ ...newUser, jobTitle: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Senha Inicial</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Mínimo 6 caracteres"
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Permissão</label>
                                <select
                                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                                >
                                    <option value="vendedor">Vendedor</option>
                                    <option value="gerente">Gerente</option>
                                    <option value="adm">Administrador</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                    Criar Usuário
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default UserManagement;
