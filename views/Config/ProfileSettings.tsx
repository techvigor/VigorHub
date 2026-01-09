import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { api } from '../../src/services/api';
import { supabase } from '../../src/lib/supabase';
import { User, Mail, Shield, Save, Loader2, Link as LinkIcon, Upload } from 'lucide-react';

const ProfileSettings = () => {
    const { profile, user } = useAuth();
    const [fullName, setFullName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setJobTitle(profile.job_title || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setMessage(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Selecione uma imagem para fazer upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${profile?.id}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);
            setMessage({ type: 'success', text: 'Imagem carregada! Clique em Salvar para confirmar.' });
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            setMessage({ type: 'error', text: error.message || 'Erro ao fazer upload da imagem.' });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (!profile) return;
            await api.auth.updateProfile(profile.id, {
                full_name: fullName,
                job_title: jobTitle,
                avatar_url: avatarUrl
            });
            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
            // Ideally we'd refresh the auth context here, but let's assume page refresh for now or simple UI update
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
            <h2 className="text-xl font-bold font-poppins mb-6">Suas Informações</h2>

            {message && (
                <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-start gap-6">
                    <img
                        src={avatarUrl || 'https://via.placeholder.com/100'}
                        alt="Avatar"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-100"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100')}
                    />
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                            <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm border border-gray-200 transition-colors">
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                <span>{uploading ? 'Enviando...' : 'Carregar nova foto'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-gray-400 mt-2">JPG, GIF ou PNG. Tam. máx. 5MB.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Função</label>
                        <div className="relative">
                            <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder="Ex: Diretor Comercial"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Função (Role)</label>
                                <div className="text-sm font-medium text-gray-700 capitalize flex items-center gap-2">
                                    <Shield size={14} className="text-primary" />
                                    {profile?.role || '...'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Email</label>
                                <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Mail size={14} className="text-primary" />
                                    {user?.email || '...'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-70 shadow-lg shadow-primary/20"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
