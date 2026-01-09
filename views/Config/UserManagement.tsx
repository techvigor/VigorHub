import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { api } from '../../src/services/api';
import { Profile, UserRole } from '../../types';
import { Shield, Search, MoreVertical, UserCheck, AlertCircle, Loader2 } from 'lucide-react';

const UserManagement = () => {
    const { profile } = useAuth();
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
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

    if (profile?.role !== 'adm') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 rounded-2xl border border-red-100">
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
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold font-poppins">Usuários e Permissões</h2>
                    <p className="text-sm text-gray-500">Gerencie o acesso à plataforma.</p>
                </div>
                {/* Fallback for inviting users */}
                <div className="text-xs text-gray-400 max-w-xs text-right">
                    Para adicionar novos usuários, peça que eles se cadastrem com o email corporativo.
                </div>
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
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
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
                                                className="w-10 h-10 rounded-full border border-gray-200"
                                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')}
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.full_name}</p>
                                                <p className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            Ativo
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                            disabled={updating === user.id || user.id === profile?.id} // Prevent changing self role to lose access
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
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-primary p-2">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
