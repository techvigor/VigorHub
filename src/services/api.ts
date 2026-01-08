
import { supabase } from '../lib/supabase';
import { Fatura, BoletoVigor, Proposta, Tarefa, Profile } from '../../types';

export const api = {
    faturas: {
        list: async () => {
            const { data, error } = await supabase.from('faturas').select('*');
            if (error) throw error;
            return data as Fatura[];
        }
    },
    boletos: {
        list: async () => {
            const { data, error } = await supabase.from('boletos_vigor').select('*');
            if (error) throw error;
            return data as BoletoVigor[];
        }
    },
    propostas: {
        list: async () => {
            const { data, error } = await supabase.from('propostas').select('*');
            if (error) throw error;
            return data as Proposta[];
        }
    },
    tarefas: {
        list: async () => {
            const { data, error } = await supabase.from('tarefas').select('*');
            if (error) throw error;
            return data as Tarefa[];
        }
    },
    auth: {
        getUser: async () => {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', 'u1').single();
            if (error) return null;
            return data as Profile;
        }
    }
};
