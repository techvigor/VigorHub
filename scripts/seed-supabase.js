
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parsing
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        acc[key.trim()] = value.trim();
    }
    return acc;
}, {});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- MOCK DATA (Inlined to avoid needing to compile typescript or use ts-node for the script) ---
// Copied from mockData.ts to ensure we have the exact data the user wants.

const currentUser = {
    id: 'u1',
    full_name: 'Admin Vigor',
    role: 'admin',
    avatar_url: 'https://picsum.photos/seed/admin/100/100',
    created_at: new Date().toISOString()
};

const mockFaturas = [
    {
        id: 'f1', // We will map this to new ID
        created_at: '2023-10-01',
        uc_codigo: '12345678',
        cliente_nome: 'João Silva Me',
        cliente_cpf_cnpj: '12.345.678/0001-90',
        tipo_ligacao: 'Bifásico',
        mes_referencia: 'Outubro/2023',
        data_vencimento: '2023-10-15',
        valor_fatura_distribuidora: 1250.50,
        valor_economia_gd: 250.00,
        status_boleto_vigor: 'pendente'
    },
    {
        id: 'f2', // We will map this to new ID
        created_at: '2023-10-02',
        uc_codigo: '87654321',
        cliente_nome: 'Maria Alimentos Ltda',
        cliente_cpf_cnpj: '98.765.432/0001-10',
        tipo_ligacao: 'Trifásico',
        mes_referencia: 'Outubro/2023',
        data_vencimento: '2023-10-18',
        valor_fatura_distribuidora: 3400.00,
        valor_economia_gd: 680.00,
        status_boleto_vigor: 'processada'
    }
];

const mockBoletosVigor = [
    {
        id: 'b1',
        fatura_id: 'f2', // Points to f2
        valor_total: 2720.00,
        valor_desconto: 680.00,
        data_emissao: '2023-10-05',
        data_vencimento: '2023-10-25',
        status: 'emitido',
        codigo_barras: '34191.23456 78901.234567 89012.345678 1 951000000272000',
        created_at: '2023-10-05'
    }
];

const mockPropostas = [
    {
        id: 'p1',
        vendedor_id: 'u1',
        cliente_nome: 'Condomínio Solar',
        status: 'proposta_feita',
        data_criacao: '2023-10-10',
        data_validade: '2023-10-20',
        valor_estimado: 45000.00
    },
    {
        id: 'p2',
        vendedor_id: 'u1',
        cliente_nome: 'Indústria Têxtil Ltda',
        status: 'contrato_enviado',
        data_criacao: '2023-10-05',
        data_validade: '2023-10-15',
        valor_estimado: 120000.00
    }
];

const mockTarefas = [
    {
        id: 't1',
        titulo: 'Revisar faturas de Outubro',
        descricao: 'Verificar se os valores de economia GD estão corretos para todos os clientes ativos.',
        responsavel_id: 'u1',
        status: 'em_andamento',
        prioridade: 'alta',
        vencimento: '2023-10-30',
        created_at: '2023-10-20'
    },
    {
        id: 't2',
        titulo: 'Ligar para novo lead',
        descricao: 'Lead vindo do Instagram interessado em redução de custos.',
        responsavel_id: 'u1',
        status: 'a_iniciar',
        prioridade: 'media',
        vencimento: '2023-10-28',
        created_at: '2023-10-22'
    }
];

async function seed() {
    console.log('Seeding Supabase...');

    // 1. Authentication & Profiles
    const felipe = {
        email: 'felipe.braz@vigorenergy.com.br',
        password: 'Vigor@123',
        full_name: 'Felipe Braz',
        role: 'adm', // IMPORTANT: 'adm' role
        avatar_url: 'https://ui-avatars.com/api/?name=Felipe+Braz&background=10b981&color=fff'
    };

    console.log(`Creating user: ${felipe.email}...`);

    // Try to sign up (if user doesn't exist)
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: felipe.email,
        password: felipe.password,
    });

    if (authError) {
        console.warn('Auth sign up warning (user might already exist):', authError.message);
    }

    // Whether new or existing, we try to upsert the profile. 
    // We need the ID. If signUp succeeded, we have it. If user exists, we might not get it from signUp in some configs, 
    // but usually we do if we can login. 
    // Ideally we would verify existence via admin API, but here we'll try to insert profile using the ID if we got it,
    // or we assume it's 'u1' for the mock data migration (WAIT. We are moving away from mock u1).
    // Let's use the ID from authData.user.id if available.

    let userId = authData.user?.id;

    if (!userId) {
        // Fallback: try to signIn to get the ID if signUp said "User already registered" but returned no user (rare but possible with rate limits etc)
        const { data: signInData } = await supabase.auth.signInWithPassword({
            email: felipe.email,
            password: felipe.password
        });
        userId = signInData.user?.id;
    }

    if (userId) {
        console.log(`User ID: ${userId}`);
        const { error: profileError } = await supabase.from('profiles').upsert([{
            id: userId,
            full_name: felipe.full_name,
            role: felipe.role,
            avatar_url: felipe.avatar_url,
            created_at: new Date().toISOString()
        }]);

        if (profileError) console.error('Error seeding profile:', profileError);
        else console.log('✅ Profile seeded for Felipe');
    } else {
        console.error('Could not obtain User ID for seeding profile. Is the Supabase project configured?');
    }


    // 2. Faturas
    const faturaIdMap = {};
    for (const fatura of mockFaturas) {
        const { id, ...data } = fatura; // remove 'f1', 'f2' mock IDs
        const { data: inserted, error } = await supabase.from('faturas').insert([data]).select('id').single();

        if (error) {
            console.error('Error inserting fatura:', error);
        } else {
            faturaIdMap[id] = inserted.id;
            console.log(`✅ Fatura ${id} inserted as ${inserted.id}`);
        }
    }

    // 3. Boletos
    for (const boleto of mockBoletosVigor) {
        const { id, fatura_id, ...data } = boleto;
        const realFaturaId = faturaIdMap[fatura_id];

        if (!realFaturaId) {
            console.warn(`Skipping boleto ${id} because fatura ${fatura_id} was not inserted.`);
            continue;
        }

        const { error } = await supabase.from('boletos_vigor').insert([{ ...data, fatura_id: realFaturaId }]);
        if (error) console.error('Error seeding boletos:', error);
        else console.log(`✅ Boleto ${id} seeded`);
    }

    // 4. Propostas
    const { error: propError } = await supabase.from('propostas').insert(mockPropostas.map(p => {
        const { id, ...rest } = p; return rest;
    }));
    if (propError) console.error('Error seeding propostas:', propError);
    else console.log('✅ Propostas seeded');

    // 5. Tarefas
    const { error: tarefaError } = await supabase.from('tarefas').insert(mockTarefas.map(t => {
        const { id, ...rest } = t; return rest;
    }));
    if (tarefaError) console.error('Error seeding tarefas:', tarefaError);
    else console.log('✅ Tarefas seeded');

    console.log('Done!');
}

seed();
