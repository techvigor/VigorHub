
import { Profile, Fatura, BoletoVigor, Proposta, Tarefa } from './types';

export const currentUser: Profile = {
  id: 'u1',
  full_name: 'Admin Vigor',
  role: 'admin',
  avatar_url: 'https://picsum.photos/seed/admin/100/100',
  created_at: new Date().toISOString()
};

export const mockFaturas: Fatura[] = [
  {
    id: 'f1',
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
    id: 'f2',
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

export const mockBoletosVigor: BoletoVigor[] = [
  {
    id: 'b1',
    fatura_id: 'f2',
    valor_total: 2720.00,
    valor_desconto: 680.00,
    data_emissao: '2023-10-05',
    data_vencimento: '2023-10-25',
    status: 'emitido',
    codigo_barras: '34191.23456 78901.234567 89012.345678 1 951000000272000',
    created_at: '2023-10-05'
  }
];

export const mockPropostas: Proposta[] = [
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

export const mockTarefas: Tarefa[] = [
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
