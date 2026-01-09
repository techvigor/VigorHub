
import { supabase } from '../lib/supabase';
import { Fatura, BoletoVigor, Proposta, Tarefa, Profile } from '../../types';

export const api = {
    faturas: {
        list: async () => {
            const { data, error } = await supabase.from('faturas').select('*');
            if (error) throw error;
            return (data || []) as Fatura[];
        }
    },
    boletos: {
        list: async () => {
            const { data, error } = await supabase.from('boletos_vigor').select('*');
            if (error) throw error;
            return (data || []) as BoletoVigor[];
        }
    },
    propostas: {
        list: async () => {
            const { data, error } = await supabase.from('propostas').select('*');
            if (error) throw error;
            return (data || []) as Proposta[];
        }
    },
    tarefas: {
        list: async () => {
            const { data, error } = await supabase.from('tarefas').select('*');
            if (error) throw error;
            return (data || []) as Tarefa[];
        }
    },
    auth: {
        getUser: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (error) return null;
            return data as Profile;
        },
        updateProfile: async (id: string, updates: Partial<Profile>) => {
            const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
            if (error) throw error;
            return data as Profile;
        },
        listProfiles: async () => {
            const { data, error } = await supabase.from('profiles').select('*').order('full_name');
            if (error) throw error;
            return (data || []) as Profile[];
        }
    }
};
